import styled, { css, CSSProp, keyframes } from "styled-components";
import { TrackbarThemeConfig, useTheme } from "../theme";
import { applyClassName } from "../constants/classname";

export interface TrackbarProps {
  variant?: TrackbarVariant;
  indeterminate?: boolean;
  labeling?: TrackbarLabelling;
  directionTo?: TrackbarDirectionTo;
  styles?: TrackbarStyles;
  value?: number;
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

export const TrackbarLabelling = {
  None: "none",
  Right: "right",
  Left: "left",
} as const;

export type TrackbarLabelling =
  (typeof TrackbarLabelling)[keyof typeof TrackbarLabelling];

export const TrackbarDirectionTo = {
  Right: "right",
  Left: "left",
} as const;

export type TrackbarDirectionTo =
  (typeof TrackbarDirectionTo)[keyof typeof TrackbarDirectionTo];

function Trackbar({
  value = 0,
  indeterminate = false,
  labeling = TrackbarLabelling.None,
  directionTo = TrackbarDirectionTo.Right,
  variant = TrackbarVariant.Neutral,
  styles,
  className,
  id,
}: TrackbarProps) {
  const { currentTheme } = useTheme();
  const trackbarTheme = currentTheme?.trackbar;

  const clampedValue = Math.min(100, Math.max(0, value));
  const showLabel = labeling !== "none" && !indeterminate;

  return (
    <Wrapper
      id={id}
      className={applyClassName("trackbar", className)}
      role="trackbar"
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="trackbar"
      $labeling={labeling}
      $style={styles?.containerStyle}
    >
      <Track
        aria-label="trackbar-track"
        $theme={trackbarTheme}
        $variant={variant}
      >
        <Fill
          aria-label="trackbar-fill"
          $value={clampedValue}
          $theme={trackbarTheme}
          $variant={variant}
          $indeterminate={indeterminate}
          $directionTo={directionTo}
          $style={styles?.valueBarStyle}
        />
      </Track>

      {showLabel && (
        <Label
          aria-label="trackbar-label"
          $theme={trackbarTheme}
          $variant={variant}
          $style={styles?.labelStyle}
        >
          {clampedValue}%
        </Label>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  $labeling: TrackbarProps["labeling"];
  $style?: TrackbarStyles["containerStyle"];
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  flex-direction: ${({ $labeling }) =>
    $labeling === "left" ? "row-reverse" : "row"};

  ${({ $style }) => $style}
`;

const Track = styled.div<{
  $theme?: TrackbarThemeConfig;
  $variant?: TrackbarVariant;
}>`
  position: relative;
  flex: 1;
  height: 6px;
  background-color: ${({ $theme, $variant }) => $theme?.[$variant]?.trackColor};
  overflow: hidden;
`;

const Fill = styled.div<{
  $value: number;
  $theme?: TrackbarThemeConfig;
  $variant?: TrackbarVariant;
  $indeterminate: boolean;
  $directionTo: TrackbarDirectionTo;
  $style?: CSSProp;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 100%;
  background-color: ${({ $theme, $variant }) => $theme?.[$variant]?.barColor};

  transition: width 0.1s linear;

  ${({ $indeterminate, $directionTo, $value }) => {
    if ($indeterminate) {
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
          width: ${$value}%;
        `;
      } else {
        return css`
          left: 0;
          right: auto;
          width: ${$value}%;
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
  min-width: 2.8ch;
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
