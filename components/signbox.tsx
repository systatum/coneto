import { RiEraserLine } from "@remixicon/react";
import React, { useRef, useEffect, ChangeEvent } from "react";
import styled, { css, CSSProp } from "styled-components";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";

export interface BaseSignboxProps {
  name?: string;
  value?: string;
  clearable?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  height?: string;
  width?: string;
  styles?: SignboxStylesProps;
  helper?: string;
}

export interface SignboxStylesProps {
  self?: CSSProp;
}

function BaseSignbox({
  name = "signature",
  onChange,
  clearable,
  value,
  showError,
  styles,
  height,
  width,
}: BaseSignboxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      const scale = window.devicePixelRatio || 1;

      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      ctx.scale(scale, scale);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (!value) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawValue = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;

      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      ctx.scale(scale, scale);

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);

        const ratio = Math.min(
          rect.width / img.width,
          rect.height / img.height
        );
        const x = (rect.width - img.width * ratio) / 2;
        const y = (rect.height - img.height * ratio) / 2;
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          x,
          y,
          img.width * ratio,
          img.height * ratio
        );
      };
      img.src = value;
    };

    drawValue();
  }, []);

  const getCoordinates = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if (e instanceof TouchEvent) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    isDrawing.current = true;
    lastPoint.current = getCoordinates(e);
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing.current) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    const last = lastPoint.current;
    if (last) {
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPoint.current = { x, y };

    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL("image/png");
      if (onChange) {
        onChange({
          target: { name: name ?? "signature", value: dataURL },
        } as ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const clearCanvas = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (onChange) {
      onChange({
        target: { name: name ?? "signature", value: "" },
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <SignatureWrapper
      aria-label="signbox-canvas"
      $error={showError}
      $canvasStyle={styles?.self}
      $height={height}
      $width={width}
    >
      <SignatureCanvas
        ref={canvasRef}
        onMouseDown={(e) => startDrawing(e.nativeEvent)}
        onMouseMove={(e) => draw(e.nativeEvent)}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={(e) => startDrawing(e.nativeEvent)}
        onTouchMove={(e) => draw(e.nativeEvent)}
        onTouchEnd={stopDrawing}
      />
      {clearable && (
        <SignatureClearable
          aria-label="signbox-clearable"
          onClick={(e) => clearCanvas(e)}
          size={18}
        />
      )}
    </SignatureWrapper>
  );
}

export interface SignboxProps
  extends Omit<
      BaseSignboxProps,
      "styles" | "inputId" | "children" | "height" | "width"
    >,
    Omit<FieldLaneProps, "styles" | "inputId" | "type" | "children"> {
  styles?: SignboxStylesProps & FieldLaneStylesProps;
}

function Signbox({
  dropdowns,
  label,
  showError,
  styles,
  errorMessage,
  actions,
  helper,
  disabled,
  errorIconPosition,
  name,
  clearable,
  onChange,
  value,
}: SignboxProps) {
  const inputId = `Signbox-${name}`;

  return (
    <FieldLane
      inputId={inputId}
      dropdowns={dropdowns}
      showError={showError}
      errorMessage={errorMessage}
      label={label}
      actions={actions}
      helper={helper}
      errorIconPosition={errorIconPosition}
      disabled={disabled}
      styles={{
        containerStyle: styles?.containerStyle,
        labelStyle: styles?.labelStyle,
      }}
    >
      <BaseSignbox
        value={value}
        onChange={onChange}
        clearable={clearable}
        showError={showError}
        styles={{
          self: css`
            ${dropdowns &&
            css`
              border-top-left-radius: 0px;
              border-bottom-left-radius: 0px;
            `}
            ${styles?.self}
          `,
        }}
      />
    </FieldLane>
  );
}

const penSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="black"><path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path></svg>`;
const base64SVG = btoa(penSVG);
const cursorDataUrl = `url("data:image/svg+xml;base64,${base64SVG}") 2 16, auto`;

const SignatureWrapper = styled.div<{
  $width?: string;
  $height?: string;
  $canvasStyle?: CSSProp;
  $error?: boolean;
}>`
  position: relative;
  width: ${({ $width }) => $width ?? "100%"};
  height: ${({ $height }) => $height ?? "200px"};
  border: 1px solid ${({ $error }) => ($error ? "#f87171" : "#d1d5db")};
  border-radius: 2px;
  cursor: ${cursorDataUrl};

  ${({ $canvasStyle }) => $canvasStyle};
`;

const SignatureCanvas = styled.canvas`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SignatureClearable = styled(RiEraserLine)`
  position: absolute;
  font-size: 12px;
  top: 5px;
  right: 5px;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;

  &:hover {
    background-color: #e5e5e5;
  }
  &:active {
    background-color: #cfcfcf;
  }
  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px #00000033;
    transition: box-shadow 0.2s ease;
  }
`;

export { Signbox };
