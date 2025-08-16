import { Children, isValidElement, ReactNode } from "react";
import styled, { CSSProp } from "styled-components";

export interface KeynoteProps<T extends Record<string, unknown>> {
  data?: T;
  keys?: (keyof T)[];
  keyLabels?: string[];
  children?: ReactNode;
  style?: CSSProp;
  renderer?: Partial<Record<keyof T, (value: T[keyof T]) => ReactNode>>;
}

export interface KeynotePointProps {
  label: string;
  children: ReactNode;
}

function Keynote<T extends Record<string, unknown>>({
  data,
  keys,
  keyLabels,
  children,
  renderer,
  style,
}: KeynoteProps<T>) {
  const shouldRenderFromData =
    data && keys && keyLabels && keys.length === keyLabels.length;

  return (
    <KeynoteWrapper $style={style}>
      {shouldRenderFromData
        ? keys?.map((key, index) => {
            const value = data[key];
            const renderFn = renderer?.[key];
            return (
              <KeynotePoint key={String(key)} label={keyLabels[index]}>
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

function KeynotePoint({ label, children }: KeynotePointProps) {
  return (
    <KeynotePointWrapper>
      <Label>{label}</Label>
      <Value>{children}</Value>
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

const KeynotePointWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 4px 0;
  position: relative;
`;

const Label = styled.span`
  color: #374151;
  font-weight: 600;
`;

const Value = styled.span`
  color: #111827;
`;

Keynote.Point = KeynotePoint;
export { Keynote };
