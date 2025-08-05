import styled, { CSSProp, keyframes } from "styled-components";

interface LoadingSpinnerProps {
  iconSize?: number;
  textSize?: number;
  label?: string;
  gap?: number;
  style?: CSSProp;
}

function LoadingSpinner({
  iconSize = 16,
  textSize = 16,
  label,
  gap = 2,
  style,
}: LoadingSpinnerProps) {
  return (
    <SpinnerWrapper $style={style} $gap={gap}>
      <SpinnerIcon
        aria-label="circle"
        $size={iconSize}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
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
      {label && <SpinnerLabel $text_size={textSize}>{label}</SpinnerLabel>}
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

const SpinnerIcon = styled.svg<{ $size: number }>`
  height: ${({ $size }) => $size}px;
  width: ${({ $size }) => $size}px;
  animation: ${spin} 1s linear infinite;
  color: #3b82f6;
`;

const SpinnerLabel = styled.span<{ $text_size: number }>`
  font-size: ${({ $text_size }) => $text_size}px;
`;

export { LoadingSpinner };
