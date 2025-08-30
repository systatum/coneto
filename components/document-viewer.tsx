import { useRef, useState } from "react";
import styled, { CSSProp } from "styled-components";

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

  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setSelection(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!start || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setSelection({
      x: Math.min(start.x, currentX),
      y: Math.min(start.y, currentY),
      width: Math.abs(currentX - start.x),
      height: Math.abs(currentY - start.y),
    });
  };

  const handleMouseUp = () => {
    if (selection && onRegionSelected) {
      onRegionSelected(selection);
    }
    setStart(null);
  };

  return (
    <ContainerDocumentViewer
      $containerStyle={containerStyle}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <DocumentViewerStyled
        $isSelecting={selected}
        $style={style}
        src={source}
      />
      {selection && (
        <SelectionBox
          style={{
            left: selection.x,
            top: selection.y,
            width: selection.width,
            height: selection.height,
          }}
          $selectionStyle={selectionStyle}
        />
      )}
    </ContainerDocumentViewer>
  );
}

const ContainerDocumentViewer = styled.div<{
  $containerStyle?: CSSProp;
}>`
  position: relative;
  width: 100%;
  height: 100vh;
  cursor: crosshair;
  user-select: none;

  ${({ $containerStyle }) => $containerStyle};
`;

const DocumentViewerStyled = styled.embed<{
  $style?: CSSProp;
  $isSelecting?: boolean;
}>`
  width: 100%;
  height: 100%;
  border: none;
  cursor: ${({ $isSelecting }) => $isSelecting && "crosshair"};
  pointer-events: ${({ $isSelecting }) => ($isSelecting ? "none" : "auto")};

  ${({ $style }) => $style};
`;

const SelectionBox = styled.div<{ $selectionStyle?: CSSProp }>`
  position: absolute;
  border: 2px dashed #4daaf5;
  background: rgba(77, 170, 245, 0.2);
  pointer-events: none;
  user-select: none;

  ${({ $selectionStyle }) => $selectionStyle}
`;

export { DocumentViewer };
