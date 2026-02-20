import { Children, isValidElement, ReactNode } from "react";
import styled, { CSSProp } from "styled-components";

export interface KeynoteProps<T extends Record<string, unknown>> {
  data?: T;
  keys?: (keyof T)[];
  keyLabels?: string[];
  children?: ReactNode;
  styles?: KeynoteStyles;
  renderer?: Partial<Record<keyof T, (value: T[keyof T]) => ReactNode>>;
}

export interface KeynotePointProps {
  label: string;
  children: ReactNode;
  styles?: KeynotePointStyles;
}

export interface KeynoteStyles {
  self?: CSSProp;
  keynotePointStyles?: KeynotePointStyles;
}

export interface KeynotePointStyles {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  valueStyle?: CSSProp;
}

function Keynote<T extends Record<string, unknown>>({
  data,
  keys,
  keyLabels,
  children,
  renderer,
  styles,
}: KeynoteProps<T>) {
  const shouldRenderFromData =
    data && keys && keyLabels && keys.length === keyLabels.length;

  return (
    <KeynoteWrapper aria-label="keynote-wrapper" $style={styles?.self}>
      {shouldRenderFromData
        ? keys?.map((key, index) => {
            const value = data[key];
            const renderFn = renderer?.[key];
            return (
              <KeynotePoint
                styles={styles?.keynotePointStyles}
                key={String(key)}
                label={keyLabels[index]}
              >
                {renderFn ? renderFn(value) : String(value ?? "-")}
              </KeynotePoint>
            );
          })
        : Children.map(children, (child) =>
            isValidElement(child) ? child : null
          )}
    </KeynoteWrapper>
  );
}

function KeynotePoint({ label, children, styles }: KeynotePointProps) {
  return (
    <KeynotePointWrapper
      aria-label="keynote-point-wrapper"
      $style={styles?.containerStyle}
    >
      <Label aria-label="keynote-point-label" $style={styles?.labelStyle}>
        {label}
      </Label>
      <Value aria-label="keynote-point-value" $style={styles?.valueStyle}>
        {children}
      </Value>
    </KeynotePointWrapper>
  );
}

const KeynoteWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  position: relative;

  ${({ $style }) => $style}
`;

const KeynotePointWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 4px 0;
  position: relative;

  ${({ $style }) => $style}
`;

const Label = styled.span<{
  $style?: CSSProp;
}>`
  color: #374151;
  font-weight: 600;

  ${({ $style }) => $style}
`;

const Value = styled.span<{
  $style?: CSSProp;
}>`
  color: #111827;

  ${({ $style }) => $style}
`;

Keynote.Point = KeynotePoint;
export { Keynote };
