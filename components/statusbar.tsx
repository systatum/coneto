import styled, { css, CSSProp } from "styled-components";
import { Figure, FigureProps } from "./figure";
import { ReactNode } from "react";
import { Button, ButtonProps } from "./button";
import { useTheme } from "./../theme/provider";
import { StatusbarThemeConfig } from "./../theme";

export interface StatusbarProps {
  styles?: StatusbarStylesProps;
  content?: StatusbarContentProps;
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
  activeBackgroundColor,
  hoverBackgroundColor,
  transparent,
  size = 11,
}: StatusbarProps) {
  const { currentTheme } = useTheme();
  const statusbarTheme = currentTheme.statusbar;

  return (
    <StatusbarWrapper
      $theme={statusbarTheme}
      aria-label="statusbar-wrapper"
      $transparent={transparent}
      $style={css`
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
      {items
        .filter((item) => !item?.hidden)
        .map((component, index) => (
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

export interface StatusbarItemProps {
  text?: string;
  icon?: FigureProps;
  render?: ReactNode;
  button?: ButtonProps;
  styles?: StatusbarItemStylesProps;
  width?: string;
  hidden?: boolean;
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
}: StatusbarItemProps & {
  activeBackgroundColor?: string;
  hoverBackgroundColor?: string;
  size?: number;
  transparent?: boolean;
}) {
  const { currentTheme } = useTheme();
  const statusbarTheme = currentTheme.statusbar;

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
          button?.activeBackgroundColor ??
          activeBackgroundColor ??
          statusbarTheme.item.activeBackgroundColor
        }
        hoverBackgroundColor={
          button?.hoverBackgroundColor ??
          button?.activeBackgroundColor ??
          hoverBackgroundColor ??
          activeBackgroundColor ??
          statusbarTheme.item.hoverBackgroundColor ??
          statusbarTheme.item.activeBackgroundColor
        }
        styles={{
          ...button?.styles,
          containerStyle: css`
            height: 100%;
          `,
          self: css`
            ${!transparent &&
            css`
              box-shadow: inset 0 0px 0.5px rgba(0, 0, 0, 0.06);
            `}

            width: fit-content;
            min-height: 24px;
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
            min-height: 24px;
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
  $theme?: StatusbarThemeConfig;
}>`
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  overflow: hidden;
  z-index: 9991999;
  border-top: 1px solid ${({ $theme }) => $theme.borderColor};

  ${({ $transparent, $theme }) =>
    $transparent
      ? css`
          border-width: 0px;
        `
      : css`
          background-color: ${$theme.backgroundColor};
          box-shadow: ${$theme.boxShadow};
        `};

  transition: background-color 0.2s ease-in-out;

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
  padding-left: 6px;
  padding-right: 6px;
  min-height: 24px;

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
