import type React from "react";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useReducer,
  useMemo,
} from "react";
import styled, { css, type CSSProp } from "styled-components";
import { Combobox } from "./combobox";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { useTheme } from "./../theme/provider";

type ResolvedSource =
  | { type: "pdf"; src: string }
  | { type: "image"; src: string }
  | { type: "encoded"; src: string }
  | { type: "file"; src: File };

export type DocumentSource = (builder: {
  pdf: (url: string) => { type: "pdf"; src: string };
  image: (url: string) => { type: "image"; src: string };
  file: (file: File) => { type: "file"; src: File };
  encodedString: (
    str: string,
    type?: "png" | null
  ) => { type: "encoded"; src: string };
}) => ResolvedSource;

export interface DocumentViewerProps {
  source?: DocumentSource;
  onRegionSelected?: (region: BoundingBoxState) => void;
  boundingBoxes?: BoundingBoxesProps[];
  initialZoom?: 75 | 100 | 110 | 120 | 130 | 140 | 150;
  libPdfJsWorkerSrc?: string;
  styles?: DocumentViewerStylesProps;
  selectable?: boolean;
  labels?: DocumentViewerLabelProps;
  title?: string;
}

export interface DocumentViewerLabelProps {
  zoomPlaceholder?: string;
  totalPages?: (props: { currentPage?: number; totalPages?: number }) => string;
}

export interface DocumentViewerStylesProps {
  containerStyle?: CSSProp;
  zoomStyle?: CSSProp;
  selectionStyle?: CSSProp;
  boxStyle?: CSSProp;
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
  /**
   * Call this when onRegionSelected is opening a popup,
   * so that the popup can be positioned more accurately.
   */
  repositionPopUp: (data: HTMLDivElement) => void;
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
      styles,
      boundingBoxes = [],
      initialZoom = 100,
      labels,
      libPdfJsWorkerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs",
      selectable,
      title,
    },
    ref
  ) => {
    const { currentTheme } = useTheme();
    const documentViewerTheme = currentTheme.documentViewer;

    const {
      totalPages: renderTotalPages,
      zoomPlaceholder = "zoom your pdf...",
    } = labels ?? {};

    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<HTMLDivElement>(null);

    const [scale, setScale] = useState(initialZoom / 100);
    const [scaleValue, setScaleValue] = useState<number>(initialZoom);

    const [hoveredContentIndex, sethoveredContentIndex] = useState<
      number | null
    >(null);

    const resolveSource = (source?: DocumentSource) => {
      if (!source) return null;

      return source({
        pdf: (url) => ({ type: "pdf", src: url }),
        image: (url) => ({ type: "image", src: url }),
        file: (file) => ({ type: "file", src: file }),
        encodedString: (str, type = null) => {
          if (type) {
            str = `data:image/${type};base64,${str}`;
          }
          return { type: "encoded", src: str };
        },
      });
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const [selection, setSelection] = useState<BoundingBoxState | null>(null);

    const [start, setStart] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const [canvasLocal, setCanvasLocal] = useState<HTMLCanvasElement | null>(
      null
    );
    const [size, setSize] = useState<{
      width?: number;
      height?: number;
    } | null>(null);

    const resolvedSource = useMemo(() => resolveSource(source), [source]);

    const prevResolvedSource = useRef<ResolvedSource | null>(null);

    // A standard "document" width — same ballpark as a PDF page at 1x scale
    const DOCUMENT_BASE_WIDTH = 595;

    // For render for the first time to read pdf.
    useEffect(() => {
      if (!resolvedSource || !viewerRef.current) return;

      if (prevResolvedSource.current === resolvedSource) return;

      prevResolvedSource.current = resolvedSource;
      setLoading(true);
      setError(null);

      let cancelled = false;

      if (resolvedSource.type === "pdf") {
        import("pdfjs-dist").then((module) => {
          /**
           * We set pdfjsLib.GlobalWorkerOptions.workerSrc to load the PDF.js worker from a CDN, since the built-in worker from the library cannot be used directly at the moment.
           * In Next.js, the import must be done inside useEffect, because using `import * as ...`
           * can cause issues with server-side rendering (SSR).
           */
          module.GlobalWorkerOptions.workerSrc = libPdfJsWorkerSrc;

          module
            .getDocument(resolvedSource.src)
            .promise.then((pdf: PDFDocumentProxy) => {
              if (cancelled) return;
              setTotalPages(pdf.numPages);
              const canvases: HTMLCanvasElement[] = [];

              const renderPages = async () => {
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
                  pageWrapper.style.width = "fit-content";
                  pageWrapper.style.margin = "0 auto 20px auto";

                  pageWrapper.appendChild(canvas);
                  viewerRef.current?.appendChild(pageWrapper);
                  canvases.push(canvas);
                }

                pdfRef.current = { pdf, canvases };
                setLoading(false);
              };

              renderPages();
            })
            .catch((err: any) => {
              if (cancelled) return;
              setError(`Error loading PDF: ${err.message}`);
              setLoading(false);
            });
        });

        return () => {
          cancelled = true;
        };
      } else if (
        resolvedSource.type === "image" ||
        resolvedSource.type === "encoded" ||
        resolvedSource.type === "file"
      ) {
        const img = new Image();

        if (resolvedSource.type === "file") {
          img.src = URL.createObjectURL(resolvedSource.src);
        } else {
          img.src = resolvedSource.src as string;
        }

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const displayWidth = DOCUMENT_BASE_WIDTH * scale;
          const displayHeight =
            (img.naturalHeight / img.naturalWidth) * displayWidth;
          canvas.style.display = "block";
          canvas.style.width = `${displayWidth}px`;
          canvas.style.height = `${displayHeight}px`;

          const pageWrapper = document.createElement("div");
          pageWrapper.style.display = "flex";
          pageWrapper.style.justifyContent = "center";
          pageWrapper.style.marginBottom = "20px";
          pageWrapper.appendChild(canvas);

          viewerRef.current?.appendChild(pageWrapper);

          pdfRef.current = {
            pdf: null as any,
            canvases: [canvas],
          };

          setTotalPages(1);
          setLoading(false);
        };

        img.onerror = (err) => {
          setError(`Error loading image: ${err}`);
          setLoading(false);
        };
      }
    }, [resolvedSource]);

    useEffect(() => {
      if (!viewerRef.current && selection) return;
      const resizeObserver = new ResizeObserver(() => {
        forceUpdate();
      });

      resizeObserver.observe(viewerRef.current);

      return () => resizeObserver.disconnect();
    }, [selection]);

    useImperativeHandle(
      ref,
      () => ({
        clearSelection: () => {
          setSelection(null);
        },
        repositionPopUp: (data: HTMLDivElement) => {
          if (!data) return;
          if (size === null) {
            const timeout = setTimeout(() => {
              if (!data) return;
              setSize({
                width: data.clientWidth,
                height: data.clientHeight,
              });
            }, 50);
            return timeout;
          }
        },
      }),
      []
    );

    const pdfRef = useRef<{
      pdf: PDFDocumentProxy;
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

    // For resize canvases when we changed scale
    const resizeCanvases = useCallback(() => {
      if (!viewerRef.current || !pdfRef.current) return;
      const { canvases, pdf } = pdfRef.current;

      // Image source: pdf is null, re-draw the image onto the existing canvas at the new scale
      if (!pdf) {
        const resolved = resolveSource(source);
        if (!resolved) return;

        canvases.forEach((canvas) => {
          const img = new Image();

          const draw = () => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const aspectRatio = canvas.height / canvas.width;
            const displayWidth = DOCUMENT_BASE_WIDTH * scale;
            const displayHeight = displayWidth * aspectRatio;
            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };

          if (resolved.type === "file") {
            img.src = URL.createObjectURL(
              (resolved as { type: "file"; src: File }).src
            );
          } else {
            img.src = (
              resolved as { type: "image" | "encoded"; src: string }
            ).src;
          }

          if (img.complete && img.naturalWidth > 0) {
            draw();
          } else {
            img.onload = draw;
          }
        });
        return;
      }

      // PDF source
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

    const handleScale = (scale: number) => {
      setScaleValue(scale);
      const scalePosition = Number(scale) / 100;
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
      if (!viewerRef.current || !selectable) return;
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
      if (!start || !selectable) return;
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

    const timeoutRef = useRef(null);

    const handleMouseEnter = useCallback((index: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      sethoveredContentIndex(index);
    }, []);

    const handleMouseLeave = useCallback(() => {
      timeoutRef.current = setTimeout(() => {
        sethoveredContentIndex(null);
      }, 150);
    }, []);

    const handleMouseUp = () => {
      if (!canvasLocal) return;
      if (selection && onRegionSelected) {
        const rect = canvasLocal.getBoundingClientRect();

        const boxLeft = selection.x * canvasLocal.clientWidth + rect.left;
        const boxTop = selection.y * canvasLocal.clientHeight + rect.top;
        const boxWidth = selection.width * canvasLocal.clientWidth;
        const boxHeight = selection.height * canvasLocal.clientHeight;

        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const popupWidth = size?.width !== undefined ? size.width : 300;
        const popupHeight = size?.height !== undefined ? size.height : 124;

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
        setSelection(finalSelection);
      } else {
        setSelection(null);
      }

      setStart(null);
    };

    return (
      <PDFViewerContainer
        $backgroundColor={documentViewerTheme.backgroundColor}
      >
        <ToolbarWrapper
          $backgroundColor={documentViewerTheme.toolbarBackgroundColor}
          $textColor={documentViewerTheme.textColor}
          aria-label="doc-viewer-toolbar-wrapper"
        >
          <Title
            $textColor={documentViewerTheme.textColor}
            aria-label="doc-viewer-toolbar-title"
          >
            {title}
          </Title>
          <Combobox
            strict
            id="doc-viewer-toolbar-combo"
            selectedOptions={scaleValue}
            onChange={handleScale}
            placeholder={zoomPlaceholder}
            styles={{
              containerStyle: css`
                width: 100px;
                color: black;
              `,
              selectboxStyle: css`
                width: 100px;
                background-color: white;
                ${styles?.zoomStyle}
              `,
            }}
            options={SCALE_OPTIONS}
          />
          {resolvedSource.type === "pdf" && (
            <div
              aria-label="doc-viewer-page"
              style={{
                width: "100%",
                display: "flex",
                alignContent: "end",
                justifyContent: "end",
              }}
            >
              {renderTotalPages ? (
                renderTotalPages({
                  currentPage: currentPage,
                  totalPages: totalPages,
                })
              ) : (
                <p>
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>
          )}

          {(loading || error) && (
            <StatusText
              $textColor={documentViewerTheme.textColor}
              $errorColor={documentViewerTheme.errorColor}
            >
              {loading && "Loading..."}
              {error && <span className="error">{error}</span>}
            </StatusText>
          )}
        </ToolbarWrapper>

        <ContainerDocumentViewer
          aria-label="doc-viewer-container"
          $containerStyle={styles?.containerStyle}
          ref={containerRef}
          onMouseUp={handleMouseUp}
        >
          <Viewer
            aria-label="view-content"
            ref={viewerRef}
            $selectable={selectable}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
          />
          {boundingBoxes &&
            boundingBoxes.map((box, index) => {
              const canvas = pdfRef.current?.canvases[box.page! - 1];
              if (!canvas) return null;

              const boxLeft = box.x * canvas.clientWidth + canvas.offsetLeft;
              const boxTop = box.y * canvas.clientHeight + canvas.offsetTop;
              const boxWidth = box.width * canvas.clientWidth;
              const boxHeight = box.height * canvas.clientHeight;

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
                <div
                  onMouseEnter={() => {
                    if (!selection) {
                      handleMouseEnter(index);
                    }
                  }}
                  onMouseLeave={() => handleMouseLeave()}
                  key={index}
                >
                  <SelectionBox
                    style={{
                      left: boxLeft,
                      top: boxTop,
                      width: boxWidth,
                      height: boxHeight,
                    }}
                    $selectionStyle={css`
                      ${styles?.boxStyle}

                      border-color: ${box.boxStyle?.borderColor};
                      background-color: ${box.boxStyle?.backgroundColor};

                      ${selection &&
                      css`
                        pointer-events: none;
                      `};
                    `}
                    aria-label="selection-box"
                  />
                  {box.contentOnHover &&
                    hoveredContentIndex === index &&
                    !selection && (
                      <ContentViewer
                        ref={contentRef}
                        $borderColor={documentViewerTheme.hoverBoxBorderColor}
                        $backgroundColor={
                          documentViewerTheme.hoverBoxBackgroundColor
                        }
                        $textColor={documentViewerTheme.hoverBoxTextColor}
                        style={{
                          left: contentLeft,
                          top: contentTop,
                          borderColor: box.boxStyle?.borderColor,
                          backgroundColor: box.boxStyle?.backgroundColor,
                        }}
                        aria-label="selection-content-hovered"
                      >
                        {box.contentOnHover}
                      </ContentViewer>
                    )}
                </div>
              );
            })}

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
              $selectionStyle={styles?.selectionStyle}
            />
          )}
        </ContainerDocumentViewer>
      </PDFViewerContainer>
    );
  }
);

const PDFViewerContainer = styled.div<{
  $backgroundColor?: string;
}>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  font-family: system-ui, sans-serif;

  background: ${({ $backgroundColor }) => $backgroundColor};
`;

const ToolbarWrapper = styled.div<{
  $backgroundColor?: string;
  $textColor?: string;
}>`
  background: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
  display: flex;
  align-items: center;
  gap: 12px;
  display: flex;
  padding: 20px 16px;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div<{
  $textColor?: string;
}>`
  color: ${({ $textColor }) => $textColor};
  display: block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusText = styled.div<{
  $textColor?: string;
  $errorColor?: string;
}>`
  margin-left: auto;
  font-size: 14px;
  opacity: 0.8;
  color: ${({ $textColor }) => $textColor};

  .error {
    color: ${({ $errorColor }) => $errorColor};
  }
`;

const ContainerDocumentViewer = styled.div<{
  $containerStyle?: CSSProp;
  $backgroundColor?: string;
}>`
  position: relative;
  width: 100%;
  flex: 1;
  overflow: auto;
  background: ${({ $backgroundColor }) => $backgroundColor};

  ${({ $containerStyle }) => $containerStyle};
`;

const Viewer = styled.div<{ $selectable?: boolean }>`
  min-height: 100%;
  min-width: max-content;
  user-select: none;
  padding: 20px;

  ${({ $selectable }) =>
    $selectable &&
    css`
      cursor: crosshair;
    `}
`;

const SelectionBox = styled.div<{ $selectionStyle?: CSSProp }>`
  position: absolute;
  border: 2px dashed #4daaf5;
  background: rgba(77, 170, 245, 0.2);
  user-select: none;

  ${({ $selectionStyle }) => $selectionStyle};
`;

const ContentViewer = styled.div<{
  $borderColor?: string;
  $backgroundColor?: string;
  $textColor?: string;
}>`
  position: absolute;
  border: 2px solid ${({ $borderColor }) => $borderColor};
  background: ${({ $backgroundColor }) => $backgroundColor};
  color: ${({ $textColor }) => $textColor};
`;

export { DocumentViewer };
