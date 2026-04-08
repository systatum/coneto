import { RiArrowRightSLine, RiMoreLine } from "@remixicon/react";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled, { css, CSSProp } from "styled-components";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "./../theme/provider";
import { CrumbThemeConfiguration } from "./../theme";

export interface CrumbProps {
  children?: ReactNode;
  maxShown?: number;
  iconSeparator?: FigureProps["image"];
  fontSize?: number;
  textColor?: string;
  hoverColor?: string;
  lastTextColor?: string;
  arrowColor?: string;
  styles?: CrumbStylesProps;
}
export interface CrumbStylesProps {
  self?: CSSProp;
}

function Crumb({
  iconSeparator = RiArrowRightSLine,
  maxShown = 3,
  children,
  styles,
  fontSize = 16,
  hoverColor,
  textColor,
  lastTextColor,
  arrowColor,
}: CrumbProps) {
  const { currentTheme } = useTheme();
  const crumbTheme = currentTheme.crumb;

  const [expanded, setExpanded] = useState(false);

  const allItems = Children.toArray(children).filter(
    isValidElement
  ) as ReactElement<CrumbItemProps>[];

  const itemCount = allItems.length;

  const showEllipsis = !expanded && itemCount > maxShown;
  let shownItems: ReactNode[] = [];

  if (!showEllipsis) {
    shownItems = allItems;
  } else {
    const first = allItems[0];
    const lastItems = allItems.slice(itemCount - (maxShown - 1));
    const lastItem = allItems[itemCount - 1];

    if (maxShown === 1) {
      shownItems = ["ellipsis", lastItem];
    } else {
      shownItems = [first, "ellipsis", ...lastItems];
    }
  }

  function CrumbArrowIcon({ iconSize }: { iconSize?: number }) {
    return (
      <Figure
        color={arrowColor}
        size={iconSize}
        image={iconSeparator}
        styles={{
          self: css`
            margin-left: 0.5rem;
            margin-right: 0.5rem;
            width: ${iconSize ?? 16};
            height: ${iconSize ?? 16};
            color: ${arrowColor ?? crumbTheme?.arrowColor};
          `,
        }}
        aria-label="arrow-icon"
      />
    );
  }

  return (
    <CrumbNav aria-label="crumb">
      <AnimatePresence initial={false} mode="popLayout">
        {shownItems.map((data, index) => {
          const isEllipsis = data === "ellipsis";
          const isLast = index === shownItems.length - 1;

          const iconSize = fontSize * 1.25;

          if (isEllipsis) {
            return (
              <CrumbEllipsisListItem
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <CrumbEllipsisIcon
                  size={iconSize}
                  $theme={crumbTheme}
                  aria-label="ellipsis"
                  onClick={() => setExpanded(true)}
                  $hoverColor={hoverColor}
                  $textColor={textColor}
                />

                {!isLast && <CrumbArrowIcon iconSize={iconSize} />}
              </CrumbEllipsisListItem>
            );
          }

          if (isValidElement<CrumbItemProps>(data)) {
            return (
              <CrumbListEllipsisItem
                key={
                  (isValidElement(data) && data.key?.toString()) ||
                  `crumb-${index}`
                }
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {cloneElement(data, {
                  isLast,
                  styles,
                  fontSize,
                  hoverColor,
                  textColor,
                  lastTextColor,
                })}
                {!isLast && <CrumbArrowIcon iconSize={iconSize} />}
              </CrumbListEllipsisItem>
            );
          }

          return null;
        })}
      </AnimatePresence>
    </CrumbNav>
  );
}

const CrumbNav = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CrumbListEllipsisItem = styled(motion.li)`
  display: flex;
  align-items: center;
  min-height: 24px;
  max-height: 24px;
`;

const CrumbEllipsisListItem = styled(motion.li)`
  display: flex;
  align-items: center;
`;

const CrumbEllipsisIcon = styled(RiMoreLine)<{
  $textColor?: string;
  $hoverColor?: string;
  $theme: CrumbThemeConfiguration;
}>`
  ${({ $textColor, $hoverColor, $theme }) => css`
    color: ${$textColor || $theme.ellipsisColor || "#6b7280"};
    cursor: pointer;
    &:hover {
      color: ${$hoverColor || $theme.ellipsisHoverColor || "#60a5fa"};
    }
  `}
`;

export interface CrumbItemProps {
  path?: string;
  children?: ReactNode;
  isLast?: boolean;
  styles?: CrumbItemStylesProps;
  onClick?: () => void;
  fontSize?: number;
  textColor?: string;
  hoverColor?: string;
  lastTextColor?: string;
}

export interface CrumbItemStylesProps {
  self?: CSSProp;
}

function CrumbItem({
  path,
  children,
  isLast = false,
  styles,
  onClick,
  fontSize = 16,
  hoverColor,
  textColor,
  lastTextColor,
}: CrumbItemProps) {
  const { currentTheme } = useTheme();
  const crumbTheme = currentTheme.crumb;

  return path ? (
    <CrumbItemLink
      $theme={crumbTheme}
      aria-label="crumb-item-link"
      $fontSize={fontSize}
      $hoverColor={hoverColor}
      $textColor={textColor}
      href={path}
      $style={styles?.self}
      $isLast={isLast}
      $lastTextColor={lastTextColor}
    >
      {children}
    </CrumbItemLink>
  ) : (
    <CrumbItemSpan
      $theme={crumbTheme}
      aria-label="crumb-item-span"
      $fontSize={fontSize}
      $hoverColor={hoverColor}
      $textColor={textColor}
      $style={styles?.self}
      onClick={onClick}
      $isLast={isLast}
      $lastTextColor={lastTextColor}
    >
      {children}
    </CrumbItemSpan>
  );
}

const CrumbItemLink = styled.a<{
  $isLast?: boolean;
  $style?: CSSProp;
  $fontSize?: number;
  $textColor?: string;
  $hoverColor?: string;
  $theme: CrumbThemeConfiguration;
  $lastTextColor?: string;
}>`
  ${({ $textColor, $hoverColor, $fontSize, $theme }) => css`
    color: ${$textColor || $theme.textColor || "#4b5563"};
    margin-bottom: 2px;

    ${$fontSize &&
    css`
      font-size: ${`${$fontSize}px`};
    `}

    &:hover {
      color: ${$hoverColor || $theme.hoverColor || "#61a9f9"};
    }
  `}

  ${({ $isLast, $lastTextColor, $theme }) =>
    $isLast &&
    css`
      color: ${$lastTextColor || $theme.lastTextColor || "#000"};
      font-weight: 500;
    `}

  ${({ $style }) => $style}
`;

const CrumbItemSpan = styled.span<{
  $isLast?: boolean;
  $style?: CSSProp;
  $fontSize?: number;
  $textColor?: string;
  $hoverColor?: string;
  $theme: CrumbThemeConfiguration;
  $lastTextColor?: string;
}>`
  ${({ $textColor, $hoverColor, $fontSize, $theme }) => css`
    color: ${$textColor || $theme.textColor || "#4b5563"};
    margin-bottom: 2px;

    ${$fontSize &&
    css`
      font-size: ${`${$fontSize}px`};
    `}

    &:hover {
      color: ${$hoverColor || $theme.hoverColor || "#61a9f9"};
    }
  `}

  ${({ $isLast, $lastTextColor, $theme }) =>
    $isLast &&
    css`
      color: ${$lastTextColor || $theme.lastTextColor || "#000"};
      font-weight: 500;
    `}

  ${({ $style }) => $style}
`;

Crumb.Item = CrumbItem;

export { Crumb };
