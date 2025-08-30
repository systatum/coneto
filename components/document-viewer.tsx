import { useEffect, useRef, useState } from "react";
import styled, { CSSProp } from "styled-components";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";

interface DocumentViewerProps {
  style?: CSSProp;
  containerStyle?: CSSProp;
  selectionStyle?: CSSProp;
  source?: string;
  onRegionSelected?: (region: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }) => void;
  boundingBoxes?: BoundingBoxesProps[];
}

interface BoundingBoxesProps {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  contentOnHover?: React.ReactNode;
  boxStyle?: React.CSSProperties;
}

function DocumentViewer({
  style,
  source,
  onRegionSelected,
  containerStyle,
  selectionStyle,
}: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [start, setStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [canvasLocal, setCanvasLocal] = useState<{
    canvas: HTMLCanvasElement;
  } | null>(null);

  const pdfRef = useRef<{
    pdf: pdfjsLib.PDFDocumentProxy;
    canvases: HTMLCanvasElement[];
  } | null>(null);

  useEffect(() => {
    if (!source || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const renderPDF = async () => {
      const pdf = await pdfjsLib.getDocument(source).promise;
      const canvases: HTMLCanvasElement[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        await page.render({ canvas, canvasContext: context, viewport }).promise;

        const pageWrapper = document.createElement("div");
        if (i !== pdf.numPages) {
          pageWrapper.style.borderBottom = "1px solid #ccc";
        }
        pageWrapper.style.marginBottom = "10px";
        pageWrapper.appendChild(canvas);

        container.appendChild(pageWrapper);
        canvases.push(canvas);
      }

      pdfRef.current = { pdf, canvases };

      resizeCanvases();
    };

    renderPDF();
  }, [source]);

  const resizeCanvases = () => {
    if (!containerRef.current || !pdfRef.current) return;
    const container = containerRef.current;
    const { canvases, pdf } = pdfRef.current;

    canvases.forEach((canvas, index) => {
      pdf.getPage(index + 1).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        const scale = container.clientWidth / viewport.width;
        canvas.width = viewport.width * scale;
        canvas.height = viewport.height * scale;
        canvas.style.width = "100%";
        canvas.style.height = "auto";

        const context = canvas.getContext("2d");
        if (!context) return;

        page.render({
          canvas,
          canvasContext: context,
          viewport: page.getViewport({ scale }),
        });
      });
    });
  };

  useEffect(() => {
    const handleResize = () => resizeCanvases();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCanvasAtPoint = (x: number, y: number) => {
    if (!containerRef.current || !pdfRef.current) return null;
    for (const canvas of pdfRef.current.canvases) {
      const left = canvas.offsetLeft;
      const top = canvas.offsetTop;
      const right = left + canvas.clientWidth;
      const bottom = top + canvas.clientHeight;

      if (x >= left && x <= right && y >= top && y <= bottom) return canvas;
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const rect = container.getBoundingClientRect();
    const canvas = getCanvasAtPoint(
      e.clientX - rect.left + container.scrollLeft,
      e.clientY - rect.top + container.scrollTop
    );
    if (!canvas) return;

    const x = e.clientX - rect.left + container.scrollLeft - canvas.offsetLeft;
    const y = e.clientY - rect.top + container.scrollTop - canvas.offsetTop;

    setStart({ x, y });
    setCanvasLocal({ canvas });
    setSelection(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!start) return;
    const { x: startX, y: startY } = start;
    const { canvas } = canvasLocal;
    const container = containerRef.current!;
    const rect = container.getBoundingClientRect();

    const currentX =
      e.clientX - rect.left + container.scrollLeft - canvas.offsetLeft;
    const currentY =
      e.clientY - rect.top + container.scrollTop - canvas.offsetTop;

    setSelection({
      x: Math.min(startX, currentX) / canvas.clientWidth,
      y: Math.min(startY, currentY) / canvas.clientHeight,
      width: Math.abs(currentX - startX) / canvas.clientWidth,
      height: Math.abs(currentY - startY) / canvas.clientHeight,
    });
  };

  const handleMouseUp = () => {
    if (selection && onRegionSelected) {
      onRegionSelected(selection);
      setStart(null);
    }
  };

  return (
    <ContainerDocumentViewer
      $containerStyle={containerStyle}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {selection && (
        <SelectionBox
          style={{
            left:
              selection.x * canvasLocal.canvas.clientWidth +
              canvasLocal.canvas.offsetLeft,
            top:
              selection.y * canvasLocal.canvas.clientHeight +
              canvasLocal.canvas.offsetTop,
            width: selection.width * canvasLocal.canvas.clientWidth,
            height: selection.height * canvasLocal.canvas.clientHeight,
          }}
          $selectionStyle={selectionStyle}
        />
      )}
    </ContainerDocumentViewer>
  );
}

const ContainerDocumentViewer = styled.div<{ $containerStyle?: CSSProp }>`
  position: relative;
  width: 100%;
  height: 100vh;
  cursor: crosshair;
  user-select: none;
  overflow: auto;
  border: 1px solid;

  ${({ $containerStyle }) => $containerStyle};
`;

const SelectionBox = styled.div<{ $selectionStyle?: CSSProp }>`
  position: absolute;
  border: 2px dashed #4daaf5;
  background: rgba(77, 170, 245, 0.2);
  pointer-events: none;
  user-select: none;

  ${({ $selectionStyle }) => $selectionStyle};
`;

export { DocumentViewer };
