"use client";

import type React from "react";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
  Fragment,
} from "react";
import styled, { type CSSProp } from "styled-components";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";

interface DocumentViewerProps {
  style?: CSSProp;
  containerStyle?: CSSProp;
  selectionStyle?: CSSProp;
  source?: string;
  onRegionSelected?: (region: {
    page?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }) => void;
  boundingBoxes?: BoundingBoxesProps[];
  stateBoundingBox?: BoundingBoxesProps;
  initialZoom?: number;
  componentRendered?: ReactNode;
  showComponentRendered?: boolean;
}

export interface BoundingBoxesProps {
  page?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  contentOnHover?: React.ReactNode;
  boxStyle?: BoxStyleProps;
}

interface BoxStyleProps {
  borderColor?: string;
  backgroundColor?: string;
}

function DocumentViewer({
  style,
  source,
  onRegionSelected,
  containerStyle,
  selectionStyle,
  boundingBoxes,
  stateBoundingBox,
  componentRendered,
  showComponentRendered,
  initialZoom = 1.0,
}: DocumentViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialZoom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const selectionBoundingBoxes = boundingBoxes ? boundingBoxes : [];

  const [selection, setSelection] = useState<BoundingBoxesProps | null>(null);
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

  const preserveScrollPosition = useCallback(
    (newScale: number) => {
      if (!containerRef.current || !viewerRef.current) return;

      const container = containerRef.current;
      const viewer = viewerRef.current;

      const oldScrollTop = container.scrollTop;
      const oldScrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const centerX = oldScrollLeft + containerWidth / 2;
      const centerY = oldScrollTop + containerHeight / 2;

      const currentContentWidth = viewer.scrollWidth;
      const currentContentHeight = viewer.scrollHeight;

      const relativeX = centerX / currentContentWidth;
      const relativeY = centerY / currentContentHeight;

      setScale(newScale);

      requestAnimationFrame(() => {
        const newContentWidth = viewer.scrollWidth;
        const newContentHeight = viewer.scrollHeight;

        const newCenterX = relativeX * newContentWidth;
        const newCenterY = relativeY * newContentHeight;

        const newScrollLeft = newCenterX - containerWidth / 2;
        const newScrollTop = newCenterY - containerHeight / 2;

        container.scrollLeft = Math.max(
          0,
          Math.min(newScrollLeft, newContentWidth - containerWidth)
        );
        container.scrollTop = Math.max(
          0,
          Math.min(newScrollTop, newContentHeight - containerHeight)
        );
      });
    },
    [scale]
  );

  const resizeCanvases = useCallback(() => {
    if (!viewerRef.current || !pdfRef.current) return;
    const { canvases, pdf } = pdfRef.current;

    canvases.forEach((canvas, index) => {
      pdf.getPage(index + 1).then((page) => {
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.display = "block";
        canvas.style.maxWidth = "100%";
        canvas.style.height = "auto";

        const context = canvas.getContext("2d");
        if (!context) return;

        page.render({
          canvas,
          canvasContext: context,
          viewport,
        });
      });
    });
  }, [scale]);

  useEffect(() => {
    if (!source || !viewerRef.current) return;

    const container = viewerRef.current;
    container.innerHTML = "";
    setLoading(true);
    setError(null);

    const renderPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(source).promise;
        setTotalPages(pdf.numPages);
        const canvases: HTMLCanvasElement[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvas,
            canvasContext: context,
            viewport,
          }).promise;

          const pageWrapper = document.createElement("div");
          pageWrapper.style.display = "flex";
          pageWrapper.style.justifyContent = "center";
          pageWrapper.style.marginBottom = "20px";
          pageWrapper.style.background = "white";
          pageWrapper.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
          pageWrapper.style.width = "fit-content";
          pageWrapper.style.margin = "0 auto 20px auto";

          canvas.style.display = "block";
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";

          pageWrapper.appendChild(canvas);
          container.appendChild(pageWrapper);
          canvases.push(canvas);
        }

        pdfRef.current = { pdf, canvases };
        setLoading(false);
      } catch (err: any) {
        setError(`Error loading PDF: ${err.message}`);
        setLoading(false);
      }
    };

    renderPDF();
  }, [source]);

  useEffect(() => {
    if (pdfRef.current) {
      resizeCanvases();
    }
  }, [scale, resizeCanvases]);

  useEffect(() => {
    const handleResize = () => {
      resizeCanvases();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvases]);

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.1, 1.5);
    preserveScrollPosition(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.1, 0.75);
    preserveScrollPosition(newScale);
  };

  const handleZoomReset = () => {
    preserveScrollPosition(1.0);
  };

  const getCanvasAtPoint = (x: number, y: number) => {
    if (!viewerRef.current || !pdfRef.current) return null;
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
    if (!viewerRef.current) return;
    const container = viewerRef.current;

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
    const { canvas } = canvasLocal!;
    const container = viewerRef.current!;
    const rect = container.getBoundingClientRect();

    const currentX =
      e.clientX - rect.left + container.scrollLeft - canvas.offsetLeft;
    const currentY =
      e.clientY - rect.top + container.scrollTop - canvas.offsetTop;

    const box: BoundingBoxesProps = {
      page: pdfRef.current.canvases.indexOf(canvas) + 1,
      x: Math.min(startX, currentX) / canvas.clientWidth,
      y: Math.min(startY, currentY) / canvas.clientHeight,
      width: Math.abs(currentX - startX) / canvas.clientWidth,
      height: Math.abs(currentY - startY) / canvas.clientHeight,
    };

    setSelection(box);
  };

  const handleMouseUp = () => {
    if (selection && onRegionSelected) {
      onRegionSelected(selection);
    }
    setSelection(null);
    setStart(null);
  };

  return (
    <PDFViewerContainer>
      <Toolbar>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>Total: {totalPages} pages</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <ToolbarButton onClick={handleZoomOut}>−</ToolbarButton>
          <span style={{ minWidth: "60px", textAlign: "center" }}>
            {Math.round(scale * 100)}%
          </span>
          <ToolbarButton onClick={handleZoomIn}>+</ToolbarButton>
          <ToolbarButton onClick={handleZoomReset}>Reset</ToolbarButton>
        </div>

        <StatusText>
          {loading && "Loading..."}
          {error && <span className="error">{error}</span>}
        </StatusText>
      </Toolbar>

      <ContainerDocumentViewer
        $containerStyle={containerStyle}
        ref={containerRef}
      >
        <Viewer
          ref={viewerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
        {selectionBoundingBoxes &&
          selectionBoundingBoxes.map((data, index) => {
            const canvas = pdfRef.current?.canvases[data.page! - 1];
            if (!canvas) return null;

            const boxLeft = data.x * canvas.clientWidth + canvas.offsetLeft;
            const boxTop = data.y * canvas.clientHeight + canvas.offsetTop;
            const boxWidth = data.width * canvas.clientWidth;
            const boxHeight = data.height * canvas.clientHeight;

            const container = viewerRef.current;
            const containerWidth = container?.clientWidth ?? 0;
            const containerHeight = container?.clientHeight ?? 0;

            const contentWidth = contentRef.current?.offsetWidth ?? 150;
            const contentHeight = contentRef.current?.offsetHeight ?? 30;

            let contentLeft = boxLeft;
            let contentTop = boxTop;

            if (boxLeft + boxWidth + contentWidth + 8 < containerWidth) {
              contentLeft = boxLeft + boxWidth + 8;
              contentTop = boxTop;
            } else if (boxLeft - contentWidth - 8 > 0) {
              contentLeft = boxLeft - contentWidth - 8;
              contentTop = boxTop;
            } else if (
              boxTop + boxHeight + contentHeight + 8 <
              containerHeight
            ) {
              contentLeft = boxLeft;
              contentTop = boxTop + boxHeight + 8;
            } else {
              contentLeft = boxLeft;
              contentTop = boxTop - contentHeight - 8;
            }

            return (
              <Fragment key={index}>
                <SelectionBox
                  style={{
                    left: data.x * canvas.clientWidth + canvas.offsetLeft,
                    top: data.y * canvas.clientHeight + canvas.offsetTop,
                    width: data.width * canvas.clientWidth,
                    height: data.height * canvas.clientHeight,
                    borderColor: data.boxStyle?.borderColor,
                    backgroundColor: data.boxStyle?.backgroundColor,
                  }}
                  $selectionStyle={selectionStyle}
                />
                {showComponentRendered && !data.contentOnHover && (
                  <ContentViewer
                    ref={contentRef}
                    style={{
                      left: contentLeft,
                      top: contentTop,
                      background: "white",
                      border: "1px solid gray",
                    }}
                  >
                    {componentRendered}
                  </ContentViewer>
                )}
                {data.contentOnHover && (
                  <ContentViewer
                    ref={contentRef}
                    style={{
                      left: contentLeft,
                      top: contentTop,
                      borderColor: data.boxStyle?.borderColor,
                      backgroundColor: data.boxStyle?.backgroundColor,
                    }}
                  >
                    {data.contentOnHover}
                  </ContentViewer>
                )}
              </Fragment>
            );
          })}
        {canvasLocal && selection && (
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
    </PDFViewerContainer>
  );
}

const PDFViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  font-family: system-ui, sans-serif;
  background: #525659;
`;

const Toolbar = styled.div`
  background: #323639;
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const ToolbarButton = styled.button<{ disabled?: boolean }>`
  background: transparent;
  border: 1px solid #555;
  color: white;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 3px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StatusText = styled.div`
  margin-left: auto;
  font-size: 14px;
  opacity: 0.8;

  .error {
    color: #ff6b6b;
  }
`;

const ContainerDocumentViewer = styled.div<{ $containerStyle?: CSSProp }>`
  position: relative;
  width: 100%;
  flex: 1;
  overflow: auto;
  background: #525659;

  ${({ $containerStyle }) => $containerStyle};
`;

const Viewer = styled.div`
  min-height: 100%;
  cursor: crosshair;
  user-select: none;
  padding: 20px;
`;

const SelectionBox = styled.div<{ $selectionStyle?: CSSProp }>`
  position: absolute;
  border: 2px dashed #4daaf5;
  background: rgba(77, 170, 245, 0.2);
  pointer-events: none;
  user-select: none;

  ${({ $selectionStyle }) => $selectionStyle};
`;

const ContentViewer = styled.div`
  position: absolute;
  border: 2px solid #4daaf5;
  background: rgba(77, 170, 245, 0.2);
`;

export { DocumentViewer };
