import { SteplineItemState } from "./../constants/step-component-util";
import { Children, cloneElement, isValidElement, ReactNode } from "react";
import styled, { css } from "styled-components";
import type { CSSProp } from "styled-components";
import { Tooltip } from "./tooltip";
import { useTheme } from "./../theme/provider";
import { SteplineThemeConfig } from "./../theme";

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
  const { currentTheme } = useTheme();
  const steplineTheme = currentTheme.stepline;

  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <SteplineWrapper
      aria-label="stepline-wrapper"
      $containerStyle={styles?.self}
      $gap={gap}
    >
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
            aria-label="stepline-group-wrapper"
            $clickable={Boolean(variant && onClick)}
            onClick={() => variant && onClick?.()}
            $gap={gap}
          >
            {index > 0 && (
              <StepLine
                aria-label="stepline-connector"
                $variant={variant}
                $line={line}
                $theme={steplineTheme}
              />
            )}
            <StepContent>
              {cloneElement(child, {
                id: index + 1,
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
  scrollbar-width: none;

  ${({ $gap }) =>
    $gap &&
    css`
      gap: ${`${$gap}px`};
    `}
  ${({ $containerStyle }) => $containerStyle}
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
  $theme: SteplineThemeConfig;
}>`
  align-self: center;
  flex: 1;
  min-width: 44px;
  border-bottom-width: 1px;
  border-bottom-style: ${({ $line }) =>
    $line === "dash" ? "dashed" : $line === "dot" ? "dotted" : "solid"};
  border-bottom-color: ${({ $variant, $theme }) =>
    $variant === "error"
      ? $theme?.line?.error || "#b60000"
      : $variant === "completed" || $variant === "current"
        ? $theme?.line?.completed || "#00b62e"
        : $theme?.line?.default || "#9ca3af"};
`;

export type SteplineItemProps = SteplineItemState &
  Partial<{
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
  active,
  ...props
}: SteplineItemProps) {
  const { currentTheme } = useTheme();
  const steplineTheme = currentTheme.stepline;

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
          $theme={steplineTheme}
          aria-label="outer-circle"
          $active={active}
          $variant={variant}
          $style={styles?.outerCircleStyle}
        />
        <InnerCircle
          $theme={steplineTheme}
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
      (title || subtitle) && (
        <TextWrapper
          $theme={steplineTheme}
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
      )
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
            `,
          }}
          dialog={<StepLabel />}
        >
          <StepCicle />
        </Tooltip>
      ) : (
        <>
          <StepCicle />
          <StepLabel />
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
  $theme: SteplineThemeConfig;
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
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  transition: transform 0.2s;

  ${({ $active }) =>
    $active &&
    css`
      transform: translate(-50%, -50%) scale(1.3);
    `};

  ${({ $variant, $theme }) => css`
    background-color: ${$theme?.outerCircle?.[$variant]};
  `};

  ${({ $style }) => $style}
`;

const InnerCircle = styled.div<{
  $variant: string;
  $style?: CSSProp;
  $theme: SteplineThemeConfig;
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
  z-index: 30;

  color: white;
  background-color: #4b5563;
  ${({ $variant, $theme }) => css`
    background-color: ${$theme?.innerCircle?.[$variant]};
  `}

  ${({ $style }) => $style}
`;

const TextWrapper = styled.div<{
  $variant: string;
  $style?: CSSProp;
  $theme: SteplineThemeConfig;
}>`
  display: flex;
  flex-direction: column;
  ${({ $variant, $theme }) => css`
    color: ${$theme?.text?.[$variant]};
  `}

  ${({ $style }) => $style}
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

  &:hover ${OuterCircle} {
    transform: translate(-50%, -50%) scale(1.3);
  }

  ${({ $gap }) =>
    $gap &&
    css`
      gap: ${`${$gap}px`};
    `}
`;

Stepline.Item = SteplineItem;
export { Stepline };
