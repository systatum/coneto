import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";
import {
  INNER_ACTIVE_CIRCLE_VARIANT_COLOR,
  INNER_CIRCLE_VARIANT_COLOR,
  OUTER_CIRCLE_VARIANT_COLOR,
  SteplineItemState,
  TEXT_VARIANT_COLOR,
} from "./../constants/step-component-util";
import styled, { css, CSSProp } from "styled-components";

export interface TimelineProps {
  children?: ReactNode;
  isClickable?: boolean;
}

export type TimelineItemProps = SteplineItemState &
  Partial<{
    sidenote?: ReactNode[];
    isClickable?: boolean;
  }>;

function Timeline({ children, isClickable = false }: TimelineProps) {
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

        return (
          <TimelineContent
            key={index}
            $isClickable={isClickable}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={async () => {
              if (onClick) {
                await onClick();
              }
            }}
          >
            <IndicatorWrapper>
              <OuterCircle
                aria-label="outer-circle-timeline"
                $variant={variant}
                $isHovered={hoveredIndex === index}
              />
              <InnerCircle
                aria-label="inner-circle-timeline"
                $variant={variant}
                $isClickable={isClickable}
              />
              <Divider
                aria-label="divider-timeline"
                $variant={variant}
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

export const TimelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
`;

export const TimelineContent = styled.div<{ $isClickable: boolean }>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  position: relative;
  ${({ $isClickable }) => $isClickable && "cursor: pointer;"}
`;

export const IndicatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1.25rem;
  position: relative;
`;

export const OuterCircle = styled.div<{
  $variant: string;
  $isHovered: boolean;
}>`
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 9999px;
  position: absolute;
  left: 7px;

  transition:
    transform 0.2s ease,
    background-color 0.2s ease;

  ${({ $isHovered, $variant }) =>
    $isHovered &&
    css`
      transform: scale(3) translateY(0.6px);
      background-color: ${OUTER_CIRCLE_VARIANT_COLOR[$variant]};
    `}
`;

export const InnerCircle = styled.div<{
  $variant?: string;
  $isClickable?: boolean;
}>`
  min-width: 0.5rem;
  min-height: 0.5rem;
  max-width: 0.5rem;
  max-height: 0.5rem;
  border-radius: 9999px;
  left: 5.4px;
  position: absolute;
  background-color: ${({ $variant }) => INNER_CIRCLE_VARIANT_COLOR[$variant]};
  transition: all 0.2s ease-in-out;

  ${TimelineContent}:active & {
    ${({ $variant, $isClickable }) =>
      $isClickable &&
      css`
        background-color: ${INNER_ACTIVE_CIRCLE_VARIANT_COLOR[$variant]};
        opacity: 90%;
        box-shadow:
          inset 0 0.5px 4px #959494,
          inset 0 -0.5px 0.5px ${INNER_ACTIVE_CIRCLE_VARIANT_COLOR[$variant]};
      `};
  }
`;

export const Divider = styled.div<{
  $variant: string;
  $isLast: boolean;
}>`
  width: 1px;
  height: 100%;
  background-color: ${({ $variant }) => INNER_CIRCLE_VARIANT_COLOR[$variant]};
  ${({ $isLast }) =>
    $isLast &&
    css`
      height: calc(100% - 1.2rem);
    `}
`;

export const ContentWrapper = styled.div<{ $isLast: boolean }>`
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

function TimelineItem({
  subtitle,
  title,
  sidenote,
  containerStyle,
  id,
  variant,
}: TimelineItemProps) {
  return (
    <TimelineContainer
      aria-label={`timeline-item-${id}`}
      id={String(id)}
      $containerStyle={containerStyle}
      $variant={variant}
    >
      <TitleContainer>
        <TitleText>{title}</TitleText>
        {subtitle && (
          <SubtitleContainer>
            {subtitle.map((data, index) => (
              <span key={index}>{data}</span>
            ))}
          </SubtitleContainer>
        )}
      </TitleContainer>
      {sidenote && (
        <SidenoteContainer>
          {sidenote.map((data, index) => (
            <span key={index}>{data}</span>
          ))}
        </SidenoteContainer>
      )}
    </TimelineContainer>
  );
}

const TimelineContainer = styled.div<{
  $variant: keyof typeof TEXT_VARIANT_COLOR;
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  justify-content: space-between;
  align-items: flex-start;

  ${({ $variant }) =>
    TEXT_VARIANT_COLOR[$variant] &&
    css`
      ${TEXT_VARIANT_COLOR[$variant]}
    `}

  ${({ $containerStyle }) => $containerStyle}
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SubtitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
`;

const SidenoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100px;
`;

const TitleText = styled.span`
  font-weight: 500;
`;

Timeline.Item = TimelineItem;
export { Timeline };
