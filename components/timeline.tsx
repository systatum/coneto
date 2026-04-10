import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";
import { SteplineItemState } from "./../constants/step-component-util";
import styled, { css, CSSProp } from "styled-components";
import { useTheme } from "../theme/provider";
import { TimelineThemeConfig } from "../theme";

export interface TimelineProps {
  children?: ReactNode;
  isClickable?: boolean;
}

function Timeline({ children, isClickable = false }: TimelineProps) {
  const { currentTheme } = useTheme();
  const timelineTheme = currentTheme.timeline;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <TimelineWrapper>
      {childArray.map((child, index) => {
        if (
          !isValidElement<
            SteplineItemState &
              Partial<{
                isClickable?: boolean;
              }>
          >(child)
        )
          return null;

        const isLast = index === childArray.length - 1;
        const variant = child.props.variant || "todo";
        const onClick = child.props.onClick;
        const line = child.props.line ?? "solid";

        return (
          <TimelineContent
            key={index}
            $isClickable={isClickable}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => {
              if (onClick) {
                onClick();
              }
            }}
          >
            <IndicatorWrapper>
              <CircleWrapper>
                <OuterCircle
                  $theme={timelineTheme}
                  aria-label="outer-circle-timeline"
                  $variant={variant}
                  $isHovered={hoveredIndex === index}
                />
                <InnerCircle
                  $theme={timelineTheme}
                  $variant={variant}
                  aria-label="inner-circle-timeline"
                />
              </CircleWrapper>
              <Divider
                $line={line}
                $theme={timelineTheme}
                $variant={variant}
                aria-label="timeline-connector"
                $isLast={isLast}
              />
            </IndicatorWrapper>

            <ContentWrapper $isLast={isLast}>
              {cloneElement(child, {
                id: index,
                isClickable: isClickable,
              })}
            </ContentWrapper>
          </TimelineContent>
        );
      })}
    </TimelineWrapper>
  );
}

const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
`;

const TimelineContent = styled.div<{ $isClickable: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  position: relative;
  ${({ $isClickable }) => $isClickable && "cursor: pointer;"}
`;

const IndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1.25rem;
  position: relative;
`;

const CircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const OuterCircle = styled.div<{
  $isHovered: boolean;
  $theme: TimelineThemeConfig;
  $variant: SteplineItemState["variant"];
}>`
  min-width: 0.5rem;
  min-height: 0.5rem;
  max-width: 0.5rem;
  max-height: 0.5rem;
  border-radius: 9999px;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 20;
  transform: translate(-50%, -50%);

  transition:
    transform 0.2s ease,
    background-color 0.2s ease;

  background-color: ${({ $variant, $theme }) => $theme.outerCircle[$variant]};

  ${({ $isHovered, $theme, $variant }) =>
    $isHovered &&
    css`
      transform: translate(-50%, -50%) scale(1.5);
      background-color: ${$theme.outerCircle?.[$variant]};
    `}
`;

const InnerCircle = styled.div<{
  $variant: SteplineItemState["variant"];
  $theme: TimelineThemeConfig;
}>`
  min-width: 0.5rem;
  min-height: 0.5rem;
  max-width: 0.5rem;
  max-height: 0.5rem;
  border-radius: 9999px;
  top: 50%;
  left: 50%;
  z-index: 20;
  transform: translate(-50%, -50%);

  position: absolute;
  background-color: ${({ $variant, $theme }) => $theme.innerCircle?.[$variant]};
`;

const Divider = styled.div<{
  $isLast: boolean;
  $line: "solid" | "dash" | "dot";
  $theme: TimelineThemeConfig;
  $variant: SteplineItemState["variant"];
}>`
  width: 1px;
  height: 100%;
  position: absolute;
  background-color: ${({ $variant, $theme }) =>
    $variant === "error"
      ? $theme.line.error
      : $variant === "completed" || $variant === "current"
        ? $theme.line.completed
        : $theme.line.default};

  ${({ $line, $variant, $theme }) =>
    ($line === "dash" || $line === "dot") &&
    css`
      border-left: 1px ${$line === "dash" ? "dashed" : "dotted"}
        ${$variant === "error"
          ? $theme.line.error
          : $variant === "completed" || $variant === "current"
            ? $theme.line.completed
            : $theme.line.default};
      background-color: transparent;
    `}

  ${({ $isLast }) =>
    $isLast &&
    css`
      height: calc(100% - 1.2rem);
    `}
`;

const ContentWrapper = styled.div<{ $isLast: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  transform: translateY(-0.5rem);
  margin-bottom: 7px;

  ${(props) =>
    props.$isLast &&
    css`
      margin-bottom: 0;
    `}
`;

export type TimelineItemProps = SteplineItemState &
  Partial<{
    sidenote?: ReactNode;
    isClickable?: boolean;
    styles?: TimelineItemStylesProps;
  }>;

export type TimelineItemStylesProps = SteplineItemState["styles"] & {
  textWrapperStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
  sidenoteStyle?: CSSProp;
};

function TimelineItem({
  subtitle,
  title,
  sidenote,
  styles,
  id,
  variant,
}: TimelineItemProps) {
  const { currentTheme } = useTheme();
  const timelineTheme = currentTheme.timeline;

  return (
    <TimelineContainer
      aria-label={`timeline-item-${id}`}
      id={String(id)}
      $theme={timelineTheme}
      $style={styles?.self}
      $variant={variant}
    >
      {(title || subtitle) && (
        <TextWrapper $style={styles?.textWrapperStyle}>
          {title && <Title $style={styles?.titleStyle}>{title}</Title>}
          {subtitle && (
            <Subtitle $style={styles?.subtitleStyle}>{subtitle}</Subtitle>
          )}
        </TextWrapper>
      )}
      {sidenote && (
        <SidenoteContainer $style={styles?.sidenoteStyle}>
          {sidenote}
        </SidenoteContainer>
      )}
    </TimelineContainer>
  );
}

const TimelineContainer = styled.div<{
  $variant: SteplineItemState["variant"];
  $theme: TimelineThemeConfig;
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  justify-content: space-between;
  align-items: flex-start;

  ${({ $variant, $theme }) =>
    $theme.text?.[$variant] &&
    css`
      ${$theme.text?.[$variant]}
    `}

  ${({ $style }) => $style}
`;

const TextWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ $style }) => $style}
`;

const Subtitle = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;

  ${({ $style }) => $style}
`;

const SidenoteContainer = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  min-width: 100px;

  ${({ $style }) => $style}
`;

const Title = styled.span<{ $style?: CSSProp }>`
  font-weight: 500;

  ${({ $style }) => $style}
`;

Timeline.Item = TimelineItem;

export { Timeline };
