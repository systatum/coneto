import styled, { CSSProp } from "styled-components";

export interface SeparatorProps {
  title?: string;
  style?: CSSProp;
  textFloat?: "left" | "right";
  depth?: string;
}

function Separator({
  title,
  style,
  textFloat = "left",
  depth = "20px",
}: SeparatorProps) {
  return (
    <SeparatorContainer $style={style}>
      <Line />
      <Title textFloat={textFloat} depth={depth}>
        {title}
      </Title>
    </SeparatorContainer>
  );
}

const SeparatorContainer = styled.div<{ $style?: CSSProp }>`
  position: relative;
  width: 100%;
  display: flex;
  color: #6b7280;
  ${({ $style }) => $style}
`;

const Line = styled.span`
  position: absolute;
  width: 100%;
  height: 2px;
  border-radius: 0.125rem;
  background-color: #111827;
  box-shadow:
    inset 0 2px 2px #ffffff,
    inset 0 -1px 1px #7a7a7a;
`;

const Title = styled.span<{
  textFloat: "left" | "right";
  depth: string;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0 0.5rem;
  font-weight: 500;

  ${({ textFloat, depth }) =>
    textFloat === "left" ? `left: ${depth};` : `right: ${depth};`}
`;

export { Separator };
