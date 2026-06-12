import styled, { css, CSSProp, keyframes } from "styled-components";
import { ProgressbarThemeConfig, useTheme } from "./../theme";

export interface ProgressbarProps {
  variant?: ProgressbarVariant;
  indeterminate?: boolean;
  labeling?: ProgressbarLabelling;
  directionTo?: ProgressbarDirectionTo;
  styles?: ProgressbarStyles;
  value?: number;
}

export interface ProgressbarStyles {
  containerStyle?: CSSProp;
  valueBarStyle?: CSSProp;
  labelStyle?: CSSProp;
}

export const ProgressbarVariant = {
  Neutral: "neutral",
  Primary: "primary",
  Success: "success",
  Danger: "danger",
  Warning: "warning",
} as const;

export type ProgressbarVariant =
  (typeof ProgressbarVariant)[keyof typeof ProgressbarVariant];

export const ProgressbarLabelling = {
  None: "none",
  Right: "right",
  Left: "left",
} as const;

export type ProgressbarLabelling =
  (typeof ProgressbarLabelling)[keyof typeof ProgressbarLabelling];

export const ProgressbarDirectionTo = {
  Right: "right",
  Left: "left",
} as const;

export type ProgressbarDirectionTo =
  (typeof ProgressbarDirectionTo)[keyof typeof ProgressbarDirectionTo];

function Progressbar({
  value = 0,
  indeterminate = false,
  labeling = "none",
  directionTo = ProgressbarDirectionTo.Right,
  variant = ProgressbarVariant.Neutral,
  styles,
}: ProgressbarProps) {
  const { currentTheme } = useTheme();
  const progressBarTheme = currentTheme?.progressbar;

  const clampedValue = Math.min(100, Math.max(0, value));
  const showLabel = labeling !== "none" && !indeterminate;

  return (
    <Wrapper
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="progressbar"
      $labeling={labeling}
      $style={styles?.containerStyle}
    >
      <Track
        aria-label="progressbar-track"
        $theme={progressBarTheme}
        $variant={variant}
      >
        <Fill
          aria-label="progressbar-fill"
          $value={clampedValue}
          $theme={progressBarTheme}
          $variant={variant}
          $indeterminate={indeterminate}
          $directionTo={directionTo}
          $style={styles?.valueBarStyle}
        />
      </Track>

      {showLabel && (
        <Label
          aria-label="progressbar-label"
          $theme={progressBarTheme}
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
  $labeling: ProgressbarProps["labeling"];
  $style?: ProgressbarStyles["containerStyle"];
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
  $theme?: ProgressbarThemeConfig;
  $variant?: ProgressbarVariant;
}>`
  position: relative;
  flex: 1;
  height: 6px;
  background-color: ${({ $theme, $variant }) => $theme?.[$variant]?.trackColor};
  overflow: hidden;
`;

const Fill = styled.div<{
  $value: number;
  $theme?: ProgressbarThemeConfig;
  $variant?: ProgressbarVariant;
  $indeterminate: boolean;
  $directionTo: ProgressbarDirectionTo;
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
      if ($directionTo === ProgressbarDirectionTo.Left) {
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
      if ($directionTo === ProgressbarDirectionTo.Left) {
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
  $theme?: ProgressbarThemeConfig;
  $variant?: ProgressbarVariant;
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

export { Progressbar };
