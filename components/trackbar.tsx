import styled, { css, CSSProp, keyframes } from "styled-components";
import { TrackbarThemeConfig, useTheme } from "../theme";
import { applyClassName } from "../constants/classname";
import { useCallback, useRef, useState } from "react";

export interface TrackbarProps {
  variant?: TrackbarVariant;
  indeterminate?: boolean;
  valueLabelPosition?: TrackbarValueLabelPosition;
  directionTo?: TrackbarDirectionTo;
  styles?: TrackbarStyles;
  editable?: boolean;
  maxValue?: number;
  value?: number;
  fillColor?: string;
  containerColor?: string;
  onChange?: (value?: number) => void;
  className?: string;
  id?: string;
}

export interface TrackbarStyles {
  containerStyle?: CSSProp;
  valueBarStyle?: CSSProp;
  labelStyle?: CSSProp;
}

export const TrackbarVariant = {
  Neutral: "neutral",
  Primary: "primary",
  Success: "success",
  Danger: "danger",
  Warning: "warning",
} as const;

export type TrackbarVariant =
  (typeof TrackbarVariant)[keyof typeof TrackbarVariant];

export const TrackbarValueLabelPosition = {
  None: "none",
  Right: "right",
  Left: "left",
} as const;

export type TrackbarValueLabelPosition =
  (typeof TrackbarValueLabelPosition)[keyof typeof TrackbarValueLabelPosition];

export const TrackbarDirectionTo = {
  Right: "right",
  Left: "left",
} as const;

export type TrackbarDirectionTo =
  (typeof TrackbarDirectionTo)[keyof typeof TrackbarDirectionTo];

function Trackbar({
  value = 0,
  maxValue = 100,
  indeterminate = false,
  valueLabelPosition = TrackbarValueLabelPosition.None,
  directionTo = TrackbarDirectionTo.Right,
  variant = TrackbarVariant.Neutral,
  styles,
  editable,
  fillColor,
  containerColor,
  onChange,
  className,
  id,
}: TrackbarProps) {
  const { currentTheme } = useTheme();
  const trackbarTheme = currentTheme?.trackbar;

  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const normalizedMaxValue = Math.max(1, maxValue);
  const clampedValue = Math.min(normalizedMaxValue, Math.max(0, value));
  const showLabel = valueLabelPosition !== "none" && !indeterminate;

  // convert a pointer's clientX into between 0 and clampedMaxValue
  // accounting for which direction the bar fills toward.
  const getValueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return clampedValue;

      const rect = track.getBoundingClientRect();
      let percent = (clientX - rect.left) / rect.width;

      if (directionTo === TrackbarDirectionTo.Left) {
        percent = 1 - percent;
      }

      percent = Math.min(1, Math.max(0, percent));

      return Math.round(percent * normalizedMaxValue);
    },
    [directionTo, normalizedMaxValue, clampedValue]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDraggingRef.current) return;
      if (onChange) {
        onChange(getValueFromClientX(event.clientX));
      }
    },
    [getValueFromClientX, onChange]
  );

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove]);

  const handlePointerDown = useCallback(() => {
    if (!editable) return;

    isDraggingRef.current = true;

    setIsDragging(true);

    // listen on window (not the thumb) so dragging still works
    // even if the pointer moves outside the thumb's bounds.
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }, [setIsDragging]);

  const labelPercentage =
    normalizedMaxValue > 0 ? Math.floor((value / normalizedMaxValue) * 100) : 0;

  return (
    <Wrapper
      id={id}
      className={applyClassName("trackbar", className)}
      role="trackbar"
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={normalizedMaxValue}
      aria-label="trackbar"
      $valueLabelPosition={valueLabelPosition}
      $style={styles?.containerStyle}
    >
      <TrackContainer ref={trackRef}>
        <Track
          aria-label="trackbar-track"
          $theme={trackbarTheme}
          $variant={variant}
          $trackColor={containerColor}
        >
          <Fill
            aria-label="trackbar-fill"
            $value={clampedValue}
            $maxValue={normalizedMaxValue}
            $theme={trackbarTheme}
            $variant={variant}
            $editable={editable}
            $fillColor={fillColor}
            $indeterminate={indeterminate}
            $isDragging={isDragging}
            $directionTo={directionTo}
            $style={styles?.valueBarStyle}
          />
        </Track>

        {editable && (
          <Thumb
            aria-label="trackbar-thumb"
            $value={clampedValue}
            $maxValue={normalizedMaxValue}
            $theme={trackbarTheme}
            $variant={variant}
            $fillColor={fillColor}
            $containerColor={containerColor}
            $directionTo={directionTo}
            $isDragging={isDragging}
            onPointerDown={handlePointerDown}
          />
        )}
      </TrackContainer>

      {showLabel && (
        <Label
          aria-label="trackbar-label"
          $theme={trackbarTheme}
          $variant={variant}
          $style={styles?.labelStyle}
        >
          {labelPercentage}%
        </Label>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  $valueLabelPosition: TrackbarProps["valueLabelPosition"];
  $style?: TrackbarStyles["containerStyle"];
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  flex-direction: ${({ $valueLabelPosition }) =>
    $valueLabelPosition === "left" ? "row-reverse" : "row"};

  ${({ $style }) => $style}
`;

const Track = styled.div<{
  $theme?: TrackbarThemeConfig;
  $variant?: TrackbarVariant;
  $trackColor?: string;
}>`
  position: relative;
  flex: 1;
  height: 6px;
  background-color: ${({ $theme, $variant, $trackColor }) =>
    $trackColor ?? $theme?.[$variant]?.trackColor};
  overflow: hidden;
`;

const TrackContainer = styled.div`
  position: relative;
  flex: 1;
`;

const Thumb = styled.div<{
  $value: number;
  $maxValue: number;
  $theme?: TrackbarThemeConfig;
  $variant?: TrackbarVariant;
  $fillColor: string;
  $containerColor: string;
  $directionTo: TrackbarDirectionTo;
  $isDragging: boolean;
}>`
  touch-action: none;
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ $theme, $variant, $fillColor }) =>
    $fillColor ?? $theme?.[$variant]?.barColor};
  box-shadow: ${({ $containerColor, $theme, $variant }) =>
    `0 0 0 2px ${$containerColor ?? $theme?.[$variant]?.trackColor},0 1px 3px rgba(0, 0, 0, 0.3)`};

  cursor: grab;
  touch-action: none;
  transform: translate(-50%, -50%);
  transition: ${({ $isDragging }) =>
    $isDragging ? "none" : "left 0.1s linear, right 0.1s linear"};

  &:active {
    cursor: grabbing;
  }

  ${({ $directionTo, $value, $maxValue }) => {
    const widthPercent = $maxValue > 0 ? ($value / $maxValue) * 100 : 0;

    return $directionTo === TrackbarDirectionTo.Left
      ? css`
          right: ${widthPercent}%;
          left: auto;
        `
      : css`
          left: ${widthPercent}%;
          right: auto;
        `;
  }}
`;

const Fill = styled.div<{
  $value: number;
  $maxValue: number;
  $editable: boolean;
  $theme?: TrackbarThemeConfig;
  $variant?: TrackbarVariant;
  $indeterminate: boolean;
  $directionTo: TrackbarDirectionTo;
  $style?: CSSProp;
  $fillColor?: string;
  $isDragging: boolean;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  background-color: ${({ $theme, $variant, $fillColor }) =>
    $fillColor ?? $theme?.[$variant]?.barColor};

  transition: ${({ $isDragging }) =>
    $isDragging ? "none" : "width 0.1s linear"};

  ${({ $indeterminate, $directionTo, $maxValue, $value, $editable }) => {
    const widthPercent = $maxValue > 0 ? ($value / $maxValue) * 100 : 0;
    if ($indeterminate && !$editable) {
      if ($directionTo === TrackbarDirectionTo.Left) {
        return css`
          right: 0;
          left: auto;
          animation: ${indeterminateSlideRTL} 2.1s
            cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        `;
      } else {
        return css`
          left: 0;
          right: auto;
          animation: ${indeterminateSlide} 2.1s
            cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        `;
      }
    } else {
      if ($directionTo === TrackbarDirectionTo.Left) {
        return css`
          right: 0;
          left: auto;
          width: ${widthPercent}%;
        `;
      } else {
        return css`
          left: 0;
          right: auto;
          width: ${widthPercent}%;
        `;
      }
    }
  }}

  ${({ $style }) => $style}
`;

const Label = styled.span<{
  $theme?: TrackbarThemeConfig;
  $variant?: TrackbarVariant;
  $style?: CSSProp;
}>`
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ $theme, $variant }) => $theme?.[$variant]?.textColor};
  line-height: 1;
  min-width: 2.8rem;
  text-align: center;

  ${({ $style }) => $style}
`;
const indeterminateSlide = keyframes`
  0%   { left: -35%; right: 100%; }
  60%  { left: 100%; right: -90%; }
  100% { left: 100%; right: -90%; }
`;

const indeterminateSlideRTL = keyframes`
  0%   { right: -35%; left: 100%; }
  60%  { right: 100%; left: -90%; }
  100% { right: 100%; left: -90%; }
`;

export { Trackbar };
