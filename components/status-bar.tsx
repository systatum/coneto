import styled, { css, CSSProp } from "styled-components";
import { Figure, FigureProps } from "./figure";
import { ReactNode } from "react";
import { Button, ButtonProps } from "./button";
import { FalsyOr } from "@/lib/falsy";

export interface StatusBarProps {
  styles?: StatusBarStylesProps;
  content?: StatusBarContentProps;
}

export interface StatusBarContentProps {
  left?: StatusBarItemProps[];
  right?: StatusBarItemProps[];
}

export interface StatusBarStylesProps {
  self?: CSSProp;
  itemStyle?: CSSProp;
  leftWrapperStyle?: CSSProp;
  rightWrapperStyle?: CSSProp;
}

export function StatusBar({ styles, content }: StatusBarProps) {
  const renderSection = (items?: StatusBarItemProps[], style?: CSSProp) => {
    if (!items) return null;

    return (
      <ActionWrapper $style={style}>
        {items.filter(isValidStatusBarItem).map((component, index) => (
          <StatusBarItem key={index} {...component} />
        ))}
      </ActionWrapper>
    );
  };

  return (
    <StatusBarWrapper $style={styles?.self}>
      {renderSection(content?.left, styles?.leftWrapperStyle)}
      {renderSection(content?.right, styles?.rightWrapperStyle)}
    </StatusBarWrapper>
  );
}

const isValidStatusBarItem = (
  component?: StatusBarItemInternalProps
): component is StatusBarItemInternalProps => Boolean(component);

type StatusBarItemProps = FalsyOr<StatusBarItemInternalProps>;

interface StatusBarItemInternalProps {
  text?: string;
  icon?: FigureProps;
  render?: ReactNode;
  button?: ButtonProps;
  styles?: StatusBarItemStylesProps;
}

interface StatusBarItemStylesProps {
  self?: CSSProp;
}

function StatusBarItem({
  button,
  icon,
  text,
  render,
  styles,
}: StatusBarItemInternalProps) {
  if (render || text) {
    return (
      <TextWrapper $style={styles?.self}>{render ? render : text}</TextWrapper>
    );
  } else if (button) {
    return (
      <Button
        {...button}
        styles={{
          ...button?.styles,
          self: css`
            ${button?.styles?.self ? button?.styles?.self : styles?.self}
          `,
        }}
      >
        {button?.children}
      </Button>
    );
  }

  return (
    <Figure
      {...icon}
      styles={{
        self: css`
          ${icon?.styles?.self ? icon?.styles?.self : styles?.self}
        `,
      }}
    />
  );
}

const StatusBarWrapper = styled.div<{
  $style?: CSSProp;
}>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  font-size: 14px;
  flex-direction: row;
  justify-content: space-between;

  ${({ $style }) => $style}
`;

const ActionWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: row;

  ${({ $style }) => $style}
`;

const TextWrapper = styled.div<{
  $style?: CSSProp;
}>`
  ${({ $style }) => $style}
`;
