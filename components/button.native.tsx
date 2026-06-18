import { CSSProp } from "styled-components";
import styled from "styled-components/native";
import { GestureResponderEvent } from "react-native";
import { ReactNode } from "react";

const StyledPressable = styled.Pressable<{ $style?: CSSProp }>`
  background-color: #4dec4d;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;

  ${({ $style }) => $style}
`;

const Paragraph = styled.Text<{ $style?: CSSProp }>`
  font-size: 16px;
  color: black;

  ${({ $style }) => $style}
`;

export function Button({
  children,
  onPress,
  styles,
}: {
  children?: ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  styles?: {
    containerStyle?: CSSProp;
    self?: CSSProp;
  };
}) {
  return (
    <StyledPressable onPress={onPress} $style={styles?.containerStyle}>
      <Paragraph $style={styles?.self}>{children}</Paragraph>
    </StyledPressable>
  );
}
