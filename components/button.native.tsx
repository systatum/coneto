import { CSSProp } from "styled-components";
import styled from "styled-components/native";

const Pressable = styled.Pressable<{ $style?: CSSProp }>`
  flex: 1;
  background-color: white;
  justify-content: center;
  align-items: center;
  user-select: none;

  ${({ $style }) => $style}
`;

const Paragraph = styled.Text<{ $style?: CSSProp }>`
  font-size: 16px;
  color: black;

  ${({ $style }) => $style}
`;

export function Button({
  styles,
}: {
  styles?: {
    containerStyle?: CSSProp;
    self?: CSSProp;
  };
}) {
  return (
    <Pressable $style={styles?.containerStyle}>
      <Paragraph $style={styles?.self}>Hello world</Paragraph>
    </Pressable>
  );
}
