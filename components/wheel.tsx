import { useState, useRef, useCallback, Fragment, useEffect } from "react";
import styled, { CSSProp } from "styled-components";
import { useTheme, WheelThemeConfig } from "./../theme";

export interface WheelValue {
  value: string;
  text: string;
}

export interface WheelPart {
  id: string;
  values: WheelValue[];
  width?: string;
}

export type WheelValues = Record<string, string>;

export interface WheelProps {
  parts?: WheelPart[];
  values?: WheelValues;
  onChange?: (values: WheelValues, changedId?: string) => void;
  styles?: WheelStyles;
}

export interface WheelStyles extends WheelColumnStyles {
  containerStyle?: CSSProp;
  fadeTopStyle?: CSSProp;
  fadeBottomStyle?: CSSProp;
  selectionOverlayStyle?: CSSProp;
  separatorStyle?: CSSProp;
}

function Wheel({ parts = [], values = {}, onChange, styles }: WheelProps) {
  const { currentTheme } = useTheme();
  const wheelTheme = currentTheme.wheel;

  const {
    containerStyle,
    fadeTopStyle,
    fadeBottomStyle,
    selectionOverlayStyle,
    separatorStyle,
    ...wheelColumnStyle
  } = styles ?? {};

  const handleChange = (partId: string, newValue: string) => {
    onChange({ ...values, [partId]: newValue }, partId);
  };

  return (
    <WheelWrapper
      aria-label="wheel-container"
      $theme={wheelTheme}
      $style={containerStyle}
    >
      <FadeTop $theme={wheelTheme} $style={fadeTopStyle} />
      <FadeBottom $theme={wheelTheme} $style={fadeBottomStyle} />
      <SelectionOverlay $theme={wheelTheme} $style={selectionOverlayStyle} />
      {parts?.map((part, i) => (
        <Fragment key={i}>
          <WheelColumn
            values={part?.values}
            selectedValue={values?.[part?.id]}
            onChange={(val) => handleChange(part?.id, val)}
            width={part?.width}
            styles={wheelColumnStyle}
            theme={wheelTheme}
          />
          {i < parts.length - 1 &&
            (part?.id === "hour" ||
              (part?.id === "minute" &&
                parts.some((p) => p.id === "second"))) && (
              <Separator
                aria-label="wheel-separator"
                $theme={wheelTheme}
                $style={separatorStyle}
                key={`sep-${i}`}
              >
                :
              </Separator>
            )}
        </Fragment>
      ))}
    </WheelWrapper>
  );
}

const WheelWrapper = styled.div<{
  $style?: CSSProp;
  $theme?: WheelThemeConfig;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  background: ${({ $theme }) => $theme.backgroundColor};

  border-radius: 14px;
  padding: 0 8px;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  width: 100%;

  ${({ $style }) => $style}
`;

const SelectionOverlay = styled.div<{
  $style?: CSSProp;

  $theme: WheelThemeConfig;
}>`
  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 44px;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-top: 0.5px solid ${({ $theme }) => $theme.overlayBorderColor};

    border-bottom: 0.5px solid ${({ $theme }) => $theme.overlayBorderColor};

    background: ${({ $theme }) => $theme.overlayBackgroundColor};
    border-radius: 4px;
  }
  ${({ $style }) => $style}
`;

const FadeTop = styled.div<{ $style?: CSSProp; $theme: WheelThemeConfig }>`
  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 96px;
  background: linear-gradient(
    to bottom,
    ${({ $theme }) => $theme.fadeColor} 10%,
    transparent 100%
  );
  z-index: 5;
  ${({ $style }) => $style}
`;

const FadeBottom = styled.div<{ $style?: CSSProp; $theme: WheelThemeConfig }>`
  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 96px;
  background: linear-gradient(
    to top,
    ${({ $theme }) => $theme.fadeColor} 10%,
    transparent 100%
  );
  z-index: 5;
  ${({ $style }) => $style}
`;

const ColumnWrapper = styled.div<{
  $width?: string;
  $style?: CSSProp;
}>`
  position: relative;
  width: ${({ $width }) => $width || "72px"};
  height: 220px;
  overflow: hidden;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }

  ${({ $style }) => $style}
`;

const ColumnList = styled.div<{
  $dragging?: boolean;
  $style?: CSSProp;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
  transition: ${({ $dragging }) =>
    $dragging
      ? "none"
      : "transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)"};

  ${({ $style }) => $style}
`;

const Item = styled.div<{
  $selected?: boolean;
  $style?: CSSProp;
  $theme: WheelThemeConfig;
}>`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.3px;
  color: ${({ $selected, $theme }) =>
    $selected ? $theme.textColor : $theme.inactiveTextColor};

  transform-origin: center center;
  transition: color 0.15s ease;
  will-change: transform, color;
  ${({ $style }) => $style}
`;

const Separator = styled.div<{
  $theme: WheelThemeConfig;
  $style?: CSSProp;
}>`
  color: ${({ $theme }) => $theme.separatorColor};

  font-size: 22px;
  font-weight: 300;
  padding: 0 2px 2px;
  z-index: 20;
  pointer-events: none;

  ${({ $style }) => $style}
`;

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3;

interface WheelColumnProps {
  values: WheelValue[];
  selectedValue: string;
  onChange: (value: string) => void;
  width?: string;
  styles?: WheelColumnStyles;
  theme?: WheelThemeConfig;
}

interface WheelColumnStyles {
  columnWrapperStyle?: CSSProp;
  columnListStyle?: CSSProp;
  itemStyle?: CSSProp;
}

function WheelColumn({
  values = [],
  selectedValue,
  onChange,
  width,
  styles,
  theme,
}: WheelColumnProps) {
  const selectedIndex = Math.max(
    0,
    values?.findIndex((v) => v.value === selectedValue)
  );

  const [offset, setOffset] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const startY = useRef<number | null>(null);
  const startOffset = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef<number>(0);
  const lastY = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const baseTranslate =
    -selectedIndex * ITEM_HEIGHT + Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT;
  const translate = baseTranslate + offset;

  const clampAndCommit = useCallback(
    (rawOffset: number) => {
      const rawIndex = selectedIndex - rawOffset / ITEM_HEIGHT;
      const clampedIndex = Math.round(
        Math.max(0, Math.min(values.length - 1, rawIndex))
      );
      setOffset(0);
      if (clampedIndex !== selectedIndex) {
        onChange(values[clampedIndex].value);
      }
    },
    [selectedIndex, values, onChange]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDragging(true);
      startY.current = e.clientY;
      startOffset.current = offset;
      lastY.current = e.clientY;
      lastTime.current = performance.now();
      velocityRef.current = 0;
      containerRef.current?.setPointerCapture(e.pointerId);
    },
    [offset]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (
      startY.current === null ||
      lastY.current === null ||
      lastTime.current === null
    )
      return;
    e.preventDefault();

    const y = e.clientY;
    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) velocityRef.current = ((y - lastY.current) / dt) * 16;
    lastY.current = y;
    lastTime.current = now;
    setOffset(startOffset.current + (y - startY.current));
  }, []);

  const onPointerUp = useCallback(
    (_e: React.PointerEvent<HTMLDivElement>) => {
      if (startY.current === null) return;
      _e.preventDefault();
      setDragging(false);
      startY.current = null;

      let vel = velocityRef.current;
      let current = offset;

      const momentum = () => {
        vel *= 0.88;
        current += vel;
        setOffset(current);
        if (Math.abs(vel) > 0.5) {
          rafRef.current = requestAnimationFrame(momentum);
        } else {
          clampAndCommit(current);
        }
      };

      if (Math.abs(vel) > 1) {
        rafRef.current = requestAnimationFrame(momentum);
      } else {
        clampAndCommit(offset);
      }
    },
    [offset, clampAndCommit]
  );

  const wheelAccumulator = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      wheelAccumulator.current += e.deltaY;

      const threshold = 40;
      if (Math.abs(wheelAccumulator.current) >= threshold) {
        const direction = wheelAccumulator.current > 0 ? 1 : -1;
        const next = Math.max(
          0,
          Math.min(values.length - 1, selectedIndex + direction)
        );
        onChange(values[next].value);
        wheelAccumulator.current = 0;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [selectedIndex, values]);

  const padCount = Math.floor(VISIBLE_ITEMS / 2);
  const paddedValues: (WheelValue | null)[] = [
    ...Array(padCount).fill(null),
    ...values,
    ...Array(padCount).fill(null),
  ];

  return (
    <ColumnWrapper
      ref={containerRef}
      tabIndex={-1}
      $width={width}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      $style={styles?.columnWrapperStyle}
      aria-label="wheel-column-container"
    >
      <ColumnList
        $style={styles?.columnListStyle}
        $dragging={dragging}
        style={{ transform: `translateY(${translate}px)` }}
        aria-label="wheel-column-list"
      >
        {paddedValues?.map((item, i) => {
          return (
            <Item
              $theme={theme}
              $style={styles?.itemStyle}
              key={i}
              $selected={item?.value === selectedValue}
              aria-selected={item?.value === selectedValue}
              aria-label="wheel-column-item"
            >
              {item?.text ?? ""}
            </Item>
          );
        })}
      </ColumnList>
    </ColumnWrapper>
  );
}

export { Wheel };
