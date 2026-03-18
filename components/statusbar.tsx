import styled, { css, CSSProp } from "styled-components";
import { Figure, FigureProps } from "./figure";
import { ReactNode } from "react";
import { Button, ButtonProps } from "./button";
import { FalsyOr } from "@/lib/falsy";

export interface StatusbarProps {
  styles?: StatusbarStylesProps;
  content?: StatusbarContentProps;
  paddingTop?: string;
  activeBackgroundColor?: string;
  hoverBackgroundColor?: string;
  transparent?: boolean;
  size?: number;
}

export interface StatusbarContentProps {
  left?: StatusbarItemProps[];
  right?: StatusbarItemProps[];
}

export interface StatusbarStylesProps {
  self?: CSSProp;
  itemStyle?: CSSProp;
  leftWrapperStyle?: CSSProp;
  rightWrapperStyle?: CSSProp;
}

function Statusbar({
  styles,
  content,
  paddingTop,
  activeBackgroundColor,
  hoverBackgroundColor,
  transparent,
  size = 10,
}: StatusbarProps) {
  return (
    <StatusbarWrapper
      aria-label="statusbar-wrapper"
      $transparent={transparent}
      $style={css`
        ${paddingTop &&
        css`
          margin-top: ${paddingTop};
        `}

        ${styles?.self}
      `}
    >
      {renderSection(
        content?.left,
        styles?.leftWrapperStyle,
        styles?.itemStyle,
        activeBackgroundColor,
        hoverBackgroundColor,
        size,
        transparent
      )}
      {renderSection(
        content?.right,
        styles?.rightWrapperStyle,
        styles?.itemStyle,
        activeBackgroundColor,
        hoverBackgroundColor,
        size,
        transparent
      )}
    </StatusbarWrapper>
  );
}

const renderSection = (
  items?: StatusbarItemProps[],
  style?: CSSProp,
  itemStyle?: CSSProp,
  activeBackgroundColor?: string,
  hoverBackgroundColor?: string,
  size?: number,
  transparent?: boolean
) => {
  if (!items) return null;

  return (
    <ActionWrapper aria-label="statusbar-content-wrapper" $style={style}>
      {items.filter(isValidStatusbarItem).map((component, index) => (
        <StatusbarItem
          key={index}
          {...component}
          styles={{
            self: css`
              ${itemStyle}
              ${component?.styles?.self}
            `,
          }}
          size={size}
          transparent={transparent}
          activeBackgroundColor={activeBackgroundColor}
          hoverBackgroundColor={hoverBackgroundColor}
        />
      ))}
    </ActionWrapper>
  );
};

const isValidStatusbarItem = (
  component?: StatusbarItemInternalProps
): component is StatusbarItemInternalProps => Boolean(component);

type StatusbarItemProps = FalsyOr<StatusbarItemInternalProps>;

interface StatusbarItemInternalProps {
  text?: string;
  icon?: FigureProps;
  render?: ReactNode;
  button?: ButtonProps;
  styles?: StatusbarItemStylesProps;
  width?: string;
}

interface StatusbarItemStylesProps {
  self?: CSSProp;
}

function StatusbarItem({
  button,
  icon,
  text,
  render,
  styles,
  activeBackgroundColor,
  hoverBackgroundColor,
  size,
  width,
  transparent,
}: StatusbarItemInternalProps & {
  activeBackgroundColor?: string;
  hoverBackgroundColor?: string;
  size?: number;
  transparent?: boolean;
}) {
  if (button) {
    return (
      <Button
        {...button}
        aria-label="statusbar-button"
        icon={{
          ...button?.icon,
          size: button?.icon?.size ? button?.icon?.size : size,
        }}
        variant={
          button?.variant
            ? button?.variant
            : transparent
              ? "transparent"
              : "default"
        }
        tipMenuSize={button?.tipMenuSize ?? "sm"}
        activeBackgroundColor={
          button?.activeBackgroundColor
            ? button?.activeBackgroundColor
            : activeBackgroundColor
        }
        hoverBackgroundColor={
          button?.hoverBackgroundColor
            ? button?.hoverBackgroundColor
            : button?.activeBackgroundColor
              ? button?.activeBackgroundColor
              : hoverBackgroundColor
                ? hoverBackgroundColor
                : activeBackgroundColor
        }
        styles={{
          ...button?.styles,
          containerStyle: css`
            height: 100%;
          `,
          self: css`
            width: fit-content;
            min-height: 21px;
            padding-left: 10px;
            padding-right: 10px;
            height: 100%;
            border-radius: 0px;
            font-size: ${`${size}px`};
            ${width &&
            css`
              width: ${width};
            `};

            ${button?.styles?.self ? button?.styles?.self : styles?.self};
          `,
          toggleStyle: css`
            width: fit-content;
            min-height: 21px;
            padding-left: 10px;
            padding-right: 10px;
            height: 100%;
            border-radius: 0px;
            font-size: ${`${size}px`};
            ${button?.styles?.self ? button?.styles?.self : styles?.self}
          `,
        }}
      >
        {button?.children}
      </Button>
    );
  }

  return (
    <TextWrapper
      aria-label="statusbar-text-wrapper"
      $size={size}
      $width={width}
      $style={styles?.self}
    >
      {icon && (
        <Figure
          {...icon}
          aria-label={"statusbar-icon"}
          size={size}
          styles={{
            self: css`
              height: 100%;
              justify-content: center;
              align-items: center;
              display: flex;
              transition: background-color 0.2s ease;

              ${icon?.styles?.self ? icon?.styles?.self : styles?.self}
            `,
          }}
        />
      )}
      {render ? render : <Label aria-label="statusbar-label">{text}</Label>}
    </TextWrapper>
  );
}

const StatusbarWrapper = styled.div<{
  $style?: CSSProp;
  $transparent?: boolean;
}>`
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  border-top: 1px solid #ececec;
  overflow: hidden;
  z-index: 9991998;

  ${({ $transparent }) =>
    $transparent &&
    css`
      border-width: 0px;
    `};

  ${({ $style }) => $style};
`;

const Label = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
`;

const ActionWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  overflow: hidden;

  ${({ $style }) => $style}
`;

const TextWrapper = styled.div<{
  $style?: CSSProp;
  $width?: string;
  $size?: number;
}>`
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 4px;
  padding-left: 4px;
  padding-right: 4px;
  ${({ $size }) =>
    $size &&
    css`
      font-size: ${`${$size}px`};
    `};

  ${({ $width }) =>
    $width &&
    css`
      width: ${$width};
    `};

  ${({ $style }) => $style}
`;

export interface StatusbarSpacerProps {
  mobileWidth?: string;
  desktopWidth?: string;
}

function StatusbarSpacer({ desktopWidth, mobileWidth }: StatusbarSpacerProps) {
  return (
    <StyledStatusbarSpacer
      $desktopWidth={desktopWidth}
      $mobileWidth={mobileWidth}
    />
  );
}

const StyledStatusbarSpacer = styled.div<{
  $mobileWidth?: string;
  $desktopWidth?: string;
}>`
  display: flex;
  background-color: transparent;
  height: ${({ $mobileWidth }) => ($mobileWidth ? `${$mobileWidth}` : "21px")};

  @media (min-width: 768px) {
    display: flex;
    height: ${({ $desktopWidth }) =>
      $desktopWidth ? `${$desktopWidth}` : "21px"};
  }
`;

Statusbar.Spacer = StatusbarSpacer;

export { Statusbar };
