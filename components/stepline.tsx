import {
  INNER_CIRCLE_VARIANT_COLOR,
  OUTER_CIRCLE_VARIANT_COLOR,
  SteplineItemState,
  TEXT_VARIANT_COLOR,
} from "./../constants/step-component-util";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";
import styled, { css } from "styled-components";
import type { CSSProp } from "styled-components";
import { Tooltip } from "./tooltip";

export interface SteplineProps {
  children?: ReactNode;
  styles?: SteplineStylesProps;
  gap?: number;
  collapsed?: boolean;
}

export interface SteplineStylesProps {
  self?: CSSProp;
}

function Stepline({ children, styles, gap, collapsed }: SteplineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <SteplineWrapper $containerStyle={styles?.self} $gap={gap}>
      {childArray.map((child, index) => {
        if (
          !isValidElement<
            SteplineItemState &
              Partial<{
                hoveredIndex?: number | null;
              }>
          >(child)
        )
          return null;

        const variant = child.props.variant;
        const onClick = child.props.onClick;
        const line = child.props.line ?? "solid";

        const isSteplineItem = child.type === Stepline.Item;

        return (
          <StepGroup
            key={index}
            $clickable={Boolean(variant && onClick)}
            onClick={() => variant && onClick?.()}
            onMouseEnter={() => setHoveredIndex(index + 1)}
            onMouseLeave={() => setHoveredIndex(null)}
            $gap={gap}
          >
            {index > 0 && (
              <StepLine
                aria-label="stepline-connector"
                $variant={variant}
                $line={line}
              />
            )}
            <StepContent>
              {cloneElement(child, {
                id: index + 1,
                hoveredIndex,
                ...(isSteplineItem
                  ? {
                      collapsed,
                    }
                  : {}),
              })}
            </StepContent>
          </StepGroup>
        );
      })}
    </SteplineWrapper>
  );
}

const SteplineWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $gap?: number;
}>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding: 0.5rem;
  position: relative;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 6px;
  }

  ${({ $gap }) =>
    $gap &&
    css`
      gap: ${`${$gap}px`};
    `}
  ${({ $containerStyle }) => $containerStyle}
`;

const StepGroup = styled.div<{ $clickable?: boolean; $gap?: number }>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  position: relative;
  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
    `}

  ${({ $gap }) =>
    $gap &&
    css`
      gap: ${`${$gap}px`};
    `}
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const StepLine = styled.div<{
  $variant?: string;
  $line: "solid" | "dash" | "dot";
}>`
  align-self: center;
  flex: 1;
  min-width: 44px;
  border-bottom-width: 1px;
  border-bottom-style: ${({ $line }) =>
    $line === "dash" ? "dashed" : $line === "dot" ? "dotted" : "solid"};
  border-bottom-color: ${({ $variant }) =>
    $variant === "error"
      ? "#b60000"
      : $variant === "completed" || $variant === "current"
        ? "#00b62e"
        : "#9ca3af"};
`;

export type SteplineItemProps = SteplineItemState &
  Partial<{
    hoveredIndex?: number | null;
    styles?: SteplineItemStylesProps;
  }>;

export interface SteplineItemStylesProps {
  containerStyle?: CSSProp;
  outerCircleStyle?: CSSProp;
  innerCircleStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
}

function SteplineItem({
  subtitle,
  title,
  variant = "todo",
  styles,
  id,
  hoveredIndex,
  active,
  ...props
}: SteplineItemProps) {
  const { collapsed } = props as SteplineProps;

  function StepCicle() {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <OuterCircle
          aria-label="outer-circle"
          $active={active || hoveredIndex === id}
          $variant={variant}
          $style={styles?.outerCircleStyle}
        />
        <InnerCircle
          aria-label="inner-circle"
          $variant={variant}
          $style={styles?.innerCircleStyle}
        >
          {id}
        </InnerCircle>
      </div>
    );
  }

  function StepLabel() {
    return (
      <TextWrapper
        $variant={variant}
        $style={css`
          ${collapsed &&
          css`
            gap: 5px;
          `}
          ${styles?.textWrapperStyle}
        `}
      >
        {title && <Title $style={styles?.titleStyle}>{title}</Title>}
        {subtitle && (
          <Subtitle $style={styles?.subtitleStyle}>{subtitle}</Subtitle>
        )}
      </TextWrapper>
    );
  }

  return (
    <StepItemWrapper id={String(id)} $style={styles?.containerStyle}>
      {collapsed ? (
        <Tooltip
          styles={{
            arrowStyle: (placement) => css`
              ${placement?.startsWith("top") &&
              css`
                bottom: 1.5px;
              `}
              ${placement?.startsWith("bottom") &&
              css`
                top: 1.5px;
              `}
              ${placement?.endsWith("start") &&
              css`
                left: 12px;
              `}
              ${placement?.endsWith("end") &&
              css`
                right: 12px;
              `}

              background-color: ${INNER_CIRCLE_VARIANT_COLOR[variant]};
            `,
            drawerStyle: (placement) => css`
              ${placement?.startsWith("top") &&
              css`
                bottom: 3px;
              `}
              ${placement?.startsWith("bottom") &&
              css`
                top: 3px;
              `}

              background-color: ${OUTER_CIRCLE_VARIANT_COLOR[variant]};
            `,
          }}
          dialog={<StepLabel />}
        >
          <StepCicle />
        </Tooltip>
      ) : (
        <>
          <StepCicle />
          (title || subtitle) && (
          <StepLabel />)
        </>
      )}
    </StepItemWrapper>
  );
}

const StepItemWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  gap: 0.5rem;
  align-items: center;
  white-space: nowrap;
  ${({ $style }) => $style}
`;

const Title = styled.span<{ $style?: CSSProp }>`
  font-weight: 500;
  font-size: 0.875rem;
  ${({ $style }) => $style}
`;

const Subtitle = styled.span<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  ${({ $style }) => $style}
`;

const OuterCircle = styled.div<{
  $active?: boolean;
  $variant: string;
  $style?: CSSProp;
}>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  max-width: 30px;
  max-height: 30px;
  border-radius: 9999px;
  transition: transform 0.2s;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  ${({ $active }) =>
    $active &&
    css`
      transform: translate(-50%, -50%) scale(1.3);
    `}
  ${({ $variant }) => css`
    background-color: ${OUTER_CIRCLE_VARIANT_COLOR[$variant]};
  `};

  ${({ $style }) => $style}
`;

const InnerCircle = styled.div<{
  $variant: string;
  $style?: CSSProp;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  max-width: 30px;
  max-height: 30px;
  border-radius: 9999px;

  color: white;
  background-color: #4b5563;
  ${({ $variant }) => css`
    background-color: ${INNER_CIRCLE_VARIANT_COLOR[$variant]};
  `}

  ${({ $style }) => $style}
`;

const TextWrapper = styled.div<{ $variant: string; $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  ${({ $variant }) => TEXT_VARIANT_COLOR[$variant]}

  ${({ $style }) => $style}
`;

Stepline.Item = SteplineItem;
export { Stepline };
