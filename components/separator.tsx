import styled, { css, CSSProp } from "styled-components";
import { useTheme } from "./../theme/provider";
import { FigureProps } from "./figure";
import { Button } from "./button";
import { Tooltip } from "./tooltip";

export const SeparatorTextFloat = {
  Left: "left",
  Right: "right",
} as const;

export type SeparatorTextFloat =
  (typeof SeparatorTextFloat)[keyof typeof SeparatorTextFloat];

export interface SeparatorProps {
  title?: string;
  textFloat?: SeparatorTextFloat;
  depth?: string;
  styles?: SeparatorStyles;
  actions?: SeparatorAction[];
}

export interface SeparatorStyles {
  containerStyle?: CSSProp;
  titleStyle?: CSSProp;
  lineStyle?: CSSProp;
}

function Separator({
  title,
  styles,
  textFloat = "left",
  depth = "20px",
  actions,
}: SeparatorProps) {
  const { currentTheme } = useTheme();
  const separatorTheme = currentTheme.separator;

  return (
    <SeparatorContainer
      $style={styles?.containerStyle}
      $color={separatorTheme.containerColor}
    >
      <Line
        $style={styles?.lineStyle}
        $color={separatorTheme.lineColor}
        $lineShadow={separatorTheme.lineShadow}
      />
      <Title
        $style={styles?.titleStyle}
        $textFloat={textFloat}
        $depth={depth}
        $color={separatorTheme.titleColor}
        $backgroundColor={separatorTheme.backgroundTitleColor}
      >
        {title}
      </Title>

      {actions?.map((action, index) => (
        <SeparatorAction key={index} {...action} />
      ))}
    </SeparatorContainer>
  );
}

const SeparatorContainer = styled.div<{ $style?: CSSProp; $color?: string }>`
  position: relative;
  width: 100%;
  display: flex;
  color: ${({ $color }) => $color};
  ${({ $style }) => $style}
`;

const Line = styled.span<{
  $style?: CSSProp;
  $color?: string;
  $lineShadow?: string;
}>`
  position: absolute;
  width: 100%;
  height: 2px;
  border-radius: 0.125rem;
  background-color: ${({ $color }) => $color};
  box-shadow: ${({ $lineShadow }) => $lineShadow};

  ${({ $style }) => $style}
`;

const Title = styled.span<{
  $textFloat: "left" | "right";
  $depth: string;
  $style?: CSSProp;
  $color?: string;
  $backgroundColor?: string;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  padding: 0 0.5rem;
  font-weight: 500;
  color: ${({ $color }) => $color};

  ${({ $textFloat, $depth }) =>
    $textFloat === "left" ? `left: ${$depth};` : `right: ${$depth};`}

  ${({ $style }) => $style}
`;

export interface SeparatorAction {
  caption?: string;
  icon: FigureProps;
  alwaysShow?: boolean;
  onClick?: () => void;
  hidden?: boolean;
  styles?: SeparatorStyles;
}

export interface SeparatorStyles {
  self?: CSSProp;
}

function SeparatorAction({
  icon,
  alwaysShow,
  caption,
  hidden,
  onClick,
  styles,
}: SeparatorAction) {
  const { currentTheme } = useTheme();
  const separatorTheme = currentTheme?.separator;

  if (hidden) {
    return;
  }
  return (
    <Tooltip
      dialog={caption}
      styles={{
        containerStyle: css`
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 20px;
          ${!alwaysShow &&
          css`
            opacity: 0;
            pointer-events: none;
          `}

          ${SeparatorContainer}:hover & {
            opacity: 1;
            pointer-events: auto;
          }
        `,
      }}
    >
      <Button
        variant="outline-default"
        icon={icon}
        onClick={() => onClick?.()}
        styles={{
          containerStyle: css`
            border-radius: 9999px;
          `,
          self: css`
            border-radius: 9999px;
            height: 24px;
            width: 24px;
            padding: 2px;
            background-color: ${separatorTheme?.backgroundTitleColor};
            &:hover {
              color: inherit;
            }
            ${styles?.self}
          `,
        }}
      />
    </Tooltip>
  );
}

export { Separator };
