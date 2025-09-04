"use client";

import type React from "react";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  Fragment,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled, { css, type CSSProp } from "styled-components";
import * as pdfjsLib from "pdfjs-dist";
import { Combobox } from "./combobox";
import { OptionsProps } from "./selectbox";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs";

interface DocumentViewerProps {
  containerStyle?: CSSProp;
  selectionStyle?: CSSProp;
  source?: string;
  title?: string;
  onRegionSelected?: (region: {
    page?: number;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }) => void;
  boundingBoxes?: BoundingBoxesProps[];
  initialZoom?: number;
  totalPagesText?: (data: {
    currentPage?: number;
    totalPages?: number;
  }) => string;
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

export interface BoundingBoxState {
  page?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  absoluteX?: number;
  absoluteY?: number;
}

export interface DocumentViewerRef {
  clearSelection: () => void;
  redraw: () => void;
}

interface BoxStyleProps {
  borderColor?: string;
  backgroundColor?: string;
}

const SCALE_OPTIONS = [
  { text: "75%", value: 75 },
  { text: "100%", value: 100 },
  { text: "110%", value: 110 },
  { text: "120%", value: 120 },
  { text: "130%", value: 130 },
  { text: "140%", value: 140 },
  { text: "150%", value: 150 },
];

const DocumentViewer = forwardRef<DocumentViewerRef, DocumentViewerProps>(
  (
    {
      source,
      onRegionSelected,
      containerStyle,
      selectionStyle,
      boundingBoxes,
      initialZoom = 1.0,
      totalPagesText,
      title = "Document",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<HTMLDivElement>(null);

    const [scale, setScale] = useState(initialZoom);
    const scaleInitialState = initialZoom * 100;
    const [scaleValue, setScaleValue] = useState<OptionsProps>({
      text: `${String(scaleInitialState)}%`,
      value: scaleInitialState,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);

    const selectionBoundingBoxes = boundingBoxes ? boundingBoxes : [];
    const [selection, setSelection] = useState<BoundingBoxState | null>(null);
    const [selectionShow, setSelectionShow] = useState<BoundingBoxState | null>(
      null
    );
    const [start, setStart] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const [canvasLocal, setCanvasLocal] = useState<HTMLCanvasElement | null>(
      null
    );

    useImperativeHandle(
      ref,
      () => ({
        clearSelection: () => {
          setSelectionShow(null);
        },
        redraw: () => {},
      }),
      []
    );

    const pdfRef = useRef<{
      pdf: pdfjsLib.PDFDocumentProxy;
      canvases: HTMLCanvasElement[];
    } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      const container = containerRef.current;
      if (!container || !pdfRef.current) return;

      const handleScroll = () => {
        const canvases = pdfRef.current!.canvases;
        const containerRect = container.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;
        const containerCenter = (containerTop + containerBottom) / 2;

        let closestPage = 1;
        let closestDistance = Infinity;

        canvases.forEach((canvas, i) => {
          const canvasRect = canvas.getBoundingClientRect();
          const canvasCenter = (canvasRect.top + canvasRect.bottom) / 2;

          const distance = Math.abs(canvasCenter - containerCenter);

          if (distance < closestDistance) {
            closestPage = i + 1;
            closestDistance = distance;
          }
        });

        setCurrentPage(closestPage);
      };

      container.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => container.removeEventListener("scroll", handleScroll);
    }, [pdfRef.current]);

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

    const handleScale = (e: OptionsProps) => {
      setScaleValue({
        text: e.text,
        value: e.value,
      });
      const scalePosition = Number(e.value) / 100;
      preserveScrollPosition(scalePosition);
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

      const x =
        e.clientX - rect.left + container.scrollLeft - canvas.offsetLeft;
      const y = e.clientY - rect.top + container.scrollTop - canvas.offsetTop;

      setStart({ x, y });
      setCanvasLocal(canvas);
      setSelection(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!start) return;
      const { x: startX, y: startY } = start;
      const canvas = canvasLocal!;
      const container = viewerRef.current!;
      const rect = container.getBoundingClientRect();

      const currentX =
        e.clientX - rect.left + container.scrollLeft - canvas.offsetLeft;
      const currentY =
        e.clientY - rect.top + container.scrollTop - canvas.offsetTop;

      const dataX = Math.min(startX, currentX) / canvas.clientWidth;
      const dataY = Math.min(startY, currentY) / canvas.clientHeight;
      const dataWidth = Math.abs(currentX - startX) / canvas.clientWidth;
      const dataHeight = Math.abs(currentY - startY) / canvas.clientHeight;
      const page = pdfRef.current.canvases.indexOf(canvas) + 1;

      const box: BoundingBoxState = {
        page: page,
        x: dataX,
        y: dataY,
        width: dataWidth,
        height: dataHeight,
        absoluteX: e.clientX + 8,
        absoluteY: e.clientY + 8,
      };

      setSelection(box);
    };

    const handleMouseUp = () => {
      if (selection && onRegionSelected) {
        const rect = canvasLocal.getBoundingClientRect();

        const boxLeft = selection.x * canvasLocal.clientWidth + rect.left;
        const boxTop = selection.y * canvasLocal.clientHeight + rect.top;
        const boxWidth = selection.width * canvasLocal.clientWidth;
        const boxHeight = selection.height * canvasLocal.clientHeight;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const popupWidth = 300;
        const popupHeight = 120;

        let popupX = boxLeft;
        let popupY = boxTop + boxHeight + 8;

        if (popupY + popupHeight > viewportHeight) {
          popupY = boxTop - popupHeight - 8;
        }

        if (popupX + popupWidth > viewportWidth) {
          popupX = boxLeft + boxWidth - popupWidth;
          if (popupX < 0) popupX = 8;
        }

        const finalSelection: BoundingBoxState = {
          ...selection,
          absoluteX: popupX,
          absoluteY: popupY,
        };

        onRegionSelected(finalSelection);
        setSelectionShow(finalSelection);
      }
      setSelection(null);
      setStart(null);
    };

    return (
      <PDFViewerContainer>
        <ToolbarWrapper>
          <Title>{title}</Title>
          <ComboboxWrapper>
            <Combobox
              inputValue={scaleValue}
              setInputValue={handleScale}
              placeholder="zoom your pdf"
              containerStyle={css`
                width: 100px;
                color: black;
              `}
              options={SCALE_OPTIONS}
            />
          </ComboboxWrapper>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignContent: "end",
              justifyContent: "end",
            }}
          >
            {totalPagesText ? (
              totalPagesText({
                currentPage: currentPage,
                totalPages: totalPages,
              })
            ) : (
              <p>
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {(loading || error) && (
            <StatusText>
              {loading && "Loading..."}
              {error && <span className="error">{error}</span>}
            </StatusText>
          )}
        </ToolbarWrapper>

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
                      left: boxLeft,
                      top: boxTop,
                      width: boxWidth,
                      height: boxHeight,
                      borderColor: data.boxStyle?.borderColor,
                      backgroundColor: data.boxStyle?.backgroundColor,
                    }}
                    $selectionStyle={selectionStyle}
                  />
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
          {selectionShow && (
            <SelectionBox
              style={{
                left:
                  selectionShow.x * canvasLocal.clientWidth +
                  canvasLocal.offsetLeft,
                top:
                  selectionShow.y * canvasLocal.clientHeight +
                  canvasLocal.offsetTop,
                width: selectionShow.width * canvasLocal.clientWidth,
                height: selectionShow.height * canvasLocal.clientHeight,
              }}
              $selectionStyle={selectionStyle}
            />
          )}
          {canvasLocal && selection && (
            <SelectionBox
              style={{
                left:
                  selection.x * canvasLocal.clientWidth +
                  canvasLocal.offsetLeft,
                top:
                  selection.y * canvasLocal.clientHeight +
                  canvasLocal.offsetTop,
                width: selection.width * canvasLocal.clientWidth,
                height: selection.height * canvasLocal.clientHeight,
              }}
              $selectionStyle={selectionStyle}
            />
          )}
        </ContainerDocumentViewer>
      </PDFViewerContainer>
    );
  }
);

const PDFViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  font-family: system-ui, sans-serif;
  background: #525659;
`;

const ToolbarWrapper = styled.div`
  background: #323639;
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div`
  flex: 0 1 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ComboboxWrapper = styled.div`
  display: flex;
  width: 100%;
  align-content: center;
  gap: 4px;
  position: absolute;
  left: 40vw;
  z-index: 9999;
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
