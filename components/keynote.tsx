import { Children, isValidElement, ReactNode } from "react";

interface KeynoteProps<T extends Record<string, unknown>> {
  data?: T;
  keys?: (keyof T)[];
  keyLabels?: string[];
  children?: ReactNode;
  renderer?: Partial<Record<keyof T, (value: T[keyof T]) => ReactNode>>;
}

interface KeynotePointProps {
  label: string;
  children: ReactNode;
}

function Keynote<T extends Record<string, unknown>>({
  data,
  keys,
  keyLabels,
  children,
  renderer,
}: KeynoteProps<T>) {
  const shouldRenderFromData =
    data && keys && keyLabels && keys.length === keyLabels.length;

  return (
    <div className="flex flex-col">
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
    </div>
  );
}

function KeynotePoint({ label, children }: KeynotePointProps) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-gray-700 font-semibold">{label}</span>
      <span className="text-gray-900">{children}</span>
    </div>
  );
}

Keynote.Point = KeynotePoint;
export { Keynote };
