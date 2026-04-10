import styled, { CSSProp } from "styled-components";
import { useTheme } from "./../theme/provider";

export interface SeparatorProps {
  title?: string;
  textFloat?: "left" | "right";
  depth?: string;
  styles?: SeparatorStylesProps;
}

export interface SeparatorStylesProps {
  containerStyle?: CSSProp;
  titleStyle?: CSSProp;
  lineStyle?: CSSProp;
}

function Separator({
  title,
  styles,
  textFloat = "left",
  depth = "20px",
}: SeparatorProps) {
  const { currentTheme } = useTheme();
  const separatorTheme = currentTheme.separator;

  return (
    <SeparatorContainer
      $style={styles?.containerStyle}
      $color={separatorTheme.containerColor}
    >
      <Line $style={styles?.lineStyle} $color={separatorTheme.lineColor} />
      <Title
        $style={styles?.titleStyle}
        $textFloat={textFloat}
        $depth={depth}
        $color={separatorTheme.titleColor}
        $backgroundColor={separatorTheme.backgroundTitleColor}
      >
        {title}
      </Title>
    </SeparatorContainer>
  );
}

const SeparatorContainer = styled.div<{ $style?: CSSProp; $color?: string }>`
  position: relative;
  width: 100%;
  display: flex;
  color: ${({ $color }) => $color};
  ${({ $style }) => $style}
`;

const Line = styled.span<{ $style?: CSSProp; $color?: string }>`
  position: absolute;
  width: 100%;
  height: 2px;
  border-radius: 0.125rem;
  background-color: ${({ $color }) => $color};
  box-shadow:
    inset 0 2px 2px #ffffff,
    inset 0 -1px 1px #7a7a7a;

  ${({ $style }) => $style}
`;

const Title = styled.span<{
  $textFloat: "left" | "right";
  $depth: string;
  $style?: CSSProp;
  $color?: string;
  $backgroundColor?: string;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 0 0.5rem;
  font-weight: 500;
  color: ${({ $color }) => $color};

  ${({ $textFloat, $depth }) =>
    $textFloat === "left" ? `left: ${$depth};` : `right: ${$depth};`}

  ${({ $style }) => $style}
`;

export { Separator };
