import styled, { CSSProp, keyframes } from "styled-components";
import { useTheme } from "./../theme/provider";
import { LoadingSpinnerThemeConfig } from "theme";

export interface LoadingSpinnerProps {
  iconSize?: number;
  textSize?: number;
  label?: string;
  gap?: number;
  styles?: LoadingSpinnerStylesProps;
}
export interface LoadingSpinnerStylesProps {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  iconStyle?: CSSProp;
}

function LoadingSpinner({
  iconSize = 16,
  textSize = 16,
  label,
  gap = 2,
  styles,
}: LoadingSpinnerProps) {
  const { currentTheme } = useTheme();
  const loadingSpinnerTheme = currentTheme.loadingSpinner;

  return (
    <SpinnerWrapper
      aria-label="loading-spinner"
      $style={styles?.containerStyle}
      $gap={gap}
    >
      <SpinnerIcon
        aria-label="circle"
        $size={iconSize}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        $style={styles?.iconStyle}
        $theme={loadingSpinnerTheme}
      >
        <circle
          opacity="0.25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          opacity="0.75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </SpinnerIcon>
      {label && (
        <SpinnerLabel
          $style={styles?.labelStyle}
          $textSize={textSize}
          $color={loadingSpinnerTheme.textColor}
        >
          {label}
        </SpinnerLabel>
      )}
    </SpinnerWrapper>
  );
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerWrapper = styled.div<{ $gap: number; $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ $gap }) => $gap}px;
  ${({ $style }) => $style}
`;

const SpinnerIcon = styled.svg<{
  $size: number;
  $style?: CSSProp;
  $theme?: LoadingSpinnerThemeConfig;
}>`
  height: ${({ $size }) => $size}px;
  width: ${({ $size }) => $size}px;
  animation: ${spin} 1s linear infinite;

  color: ${({ $theme }) => $theme.spinnerColor};

  ${({ $style }) => $style}
`;

const SpinnerLabel = styled.span<{
  $textSize: number;
  $style?: CSSProp;
  $color?: string;
}>`
  font-size: ${({ $textSize }) => $textSize}px;
  color: ${({ $color }) => $color};

  ${({ $style }) => $style}
`;

export { LoadingSpinner };
