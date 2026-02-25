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

export interface KeynoteStyles extends KeynotePointStyles {
  self?: CSSProp;
}

export interface KeynotePointStyles {
  rowStyle?: CSSProp;
  rowKeyStyle?: CSSProp;
  rowValueStyle?: CSSProp;
}

function Keynote<T extends Record<string, unknown>>({
  data,
  keys,
  keyLabels,
  children,
  renderer,
  styles,
}: KeynoteProps<T>) {
  const shouldRenderFromData = data && keys && keyLabels;

  return (
    <KeynoteWrapper aria-label="keynote-wrapper" $style={styles?.self}>
      {shouldRenderFromData
        ? keys?.map((key, index) => {
            const keyLabel = keyLabels[index] ?? String(key);
            const keyValue = data[key];
            const renderFn = renderer?.[key];

            return (
              <KeynotePoint
                styles={{
                  rowStyle: styles?.rowStyle,
                  rowKeyStyle: styles?.rowKeyStyle,
                  rowValueStyle: styles?.rowValueStyle,
                }}
                key={String(key)}
                label={keyLabel}
              >
                {renderFn ? renderFn(keyValue) : String(keyValue ?? "-")}
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
      $style={styles?.rowStyle}
    >
      <Key aria-label="keynote-point-key" $style={styles?.rowKeyStyle}>
        {label}
      </Key>
      <Value aria-label="keynote-point-value" $style={styles?.rowValueStyle}>
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
  width: 100%;

  ${({ $style }) => $style}
`;

const Key = styled.span<{
  $style?: CSSProp;
}>`
  color: #374151;
  font-weight: 600;
  width: 30%;
  font-size: 14px;

  ${({ $style }) => $style}
`;

const Value = styled.span<{
  $style?: CSSProp;
}>`
  width: 70%;
  font-size: 14px;
  color: #111827;
  text-align: end;
  color: #111827;

  ${({ $style }) => $style}
`;

Keynote.Point = KeynotePoint;
export { Keynote };
