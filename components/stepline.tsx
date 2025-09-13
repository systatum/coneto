import {
  INNER_ACTIVE_CIRCLE_VARIANT_COLOR,
  INNER_CIRCLE_VARIANT_COLOR,
  OUTER_CIRCLE_VARIANT_COLOR,
  SteplineItemState,
  TEXT_VARIANT_COLOR,
} from "./../constants/step-component-util";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactNode,
  useState,
} from "react";
import styled, { css } from "styled-components";
import type { CSSProp } from "styled-components";

export interface SteplineProps {
  children?: ReactNode;
  style?: CSSProp;
  reversable?: boolean;
}

export type SteplineItemProps = SteplineItemState &
  Partial<{
    hoveredIndex?: number | null;
    containerStyle?: CSSProp;
  }>;

function Stepline({ children, style, reversable }: SteplineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <SteplineWrapper $containerStyle={style}>
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
        return (
          <StepGroup
            key={index}
            $clickable={!!(reversable && variant)}
            onClick={() => reversable && variant && onClick?.()}
            onMouseEnter={() => setHoveredIndex(index + 1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <StepContent>
              {cloneElement(child, {
                id: index + 1,
                hoveredIndex,
              })}
            </StepContent>
            {index !== childArray.length - 1 && <StepLine $variant={variant} />}
          </StepGroup>
        );
      })}
    </SteplineWrapper>
  );
}

function SteplineItem({
  subtitle,
  title,
  variant = "todo",
  containerStyle,
  id,
  hoveredIndex,
  active,
}: SteplineItemProps) {
  return (
    <StepItemWrapper id={String(id)} $style={containerStyle}>
      <div style={{ position: "relative" }}>
        <OuterCircle
          aria-label="outer-circle"
          $active={active || hoveredIndex === id}
          $variant={variant}
        />
        <InnerCircle aria-label="inner-circle" $variant={variant}>
          {id}
        </InnerCircle>
      </div>
      {(title || subtitle) && (
        <TextWrapper $variant={variant}>
          {title && (
            <span style={{ fontWeight: 500, fontSize: "0.875rem" }}>
              {title}
            </span>
          )}
          {subtitle && (
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "12px",
              }}
            >
              {subtitle.map((data, index) => (
                <Fragment key={index}>{data}</Fragment>
              ))}
            </span>
          )}
        </TextWrapper>
      )}
    </StepItemWrapper>
  );
}

const SteplineWrapper = styled.div<{ $containerStyle?: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding: 0.5rem;
  position: relative;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 6px;
  }
  ${({ $containerStyle }) => $containerStyle}
`;

const StepGroup = styled.div<{ $clickable?: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  position: relative;

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
    `}
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const StepLine = styled.div<{ $variant?: string }>`
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  width: 100%;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    min-width: 44px;
    background-color: ${({ $variant }) =>
      $variant === "error"
        ? "#b60000"
        : $variant === "completed" || $variant === "current"
          ? "#00b62e"
          : "#9ca3af"};
  }
`;

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

const OuterCircle = styled.div<{ $active?: boolean; $variant: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  max-width: 30px;
  max-height: 30px;
  border-radius: 9999px;
  transform: translateY(-50%);
  top: 50%;
  transition: transform 0.2s;

  ${({ $active }) =>
    $active &&
    css`
      transform: scale(1.3) translateY(-40%);
    `}
  ${({ $variant }) => css`
    background-color: ${OUTER_CIRCLE_VARIANT_COLOR[$variant]};
  `}
`;

const InnerCircle = styled.div<{ $variant: string }>`
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
  transition: all 0.2s ease-in-out;

  ${({ $variant }) => css`
    background-color: ${INNER_CIRCLE_VARIANT_COLOR[$variant]};
    ${StepGroup}:active & {
      opacity: 90%;
      background-color: ${INNER_ACTIVE_CIRCLE_VARIANT_COLOR[$variant]};
      box-shadow:
        inset 0 0.5px 4px #959494,
        inset 0 -0.5px 0.5px ${INNER_ACTIVE_CIRCLE_VARIANT_COLOR[$variant]};
    }
  `}
`;

const TextWrapper = styled.div<{ $variant: string }>`
  display: flex;
  flex-direction: column;
  ${({ $variant }) => TEXT_VARIANT_COLOR[$variant]}
`;

Stepline.Item = SteplineItem;
export { Stepline };
