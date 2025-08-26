import {
  RemixiconComponentType,
  RiArrowRightSLine,
  RiMoreLine,
} from "@remixicon/react";
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

export interface CrumbProps {
  children?: ReactNode;
  maxShown?: number;
  style?: CSSProp;
  iconSeparator?: RemixiconComponentType;
  fontSize?: number;
  textColor?: string;
  hoverColor?: string;
  lastTextColor?: string;
  arrowColor?: string;
}

export interface CrumbItemProps {
  path?: string;
  children?: ReactNode;
  isLast?: boolean;
  style?: CSSProp;
  onClick?: () => void;
  fontSize?: number;
  textColor?: string;
  hoverColor?: string;
  lastTextColor?: string;
}

function Crumb({
  iconSeparator: Icon = RiArrowRightSLine,
  maxShown = 3,
  children,
  style,
  fontSize = 16,
  hoverColor,
  textColor,
  lastTextColor,
  arrowColor,
}: CrumbProps) {
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
                  aria-label="ellipsis"
                  onClick={() => setExpanded(true)}
                  $hoverColor={hoverColor}
                  $textColor={textColor}
                />

                {!isLast && (
                  <CrumbArrowIcon
                    as={Icon}
                    $arrowColor={arrowColor}
                    size={iconSize}
                  />
                )}
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
                  style,
                  fontSize,
                  hoverColor,
                  textColor,
                  lastTextColor,
                })}
                {!isLast && (
                  <CrumbArrowIcon
                    as={Icon}
                    $arrowColor={arrowColor}
                    size={iconSize}
                  />
                )}
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
}>`
  ${({ $textColor, $hoverColor }) => css`
    color: ${$textColor ? $textColor : "#6b7280"};
    cursor: pointer;
    &:hover {
      color: ${$hoverColor ? $hoverColor : "#61a9f9"};
    }
  `}
`;

const CrumbArrowIcon = styled.div<{
  as: RemixiconComponentType;
  $arrowColor?: string;
}>`
  ${({ $arrowColor }) => css`
    margin-left: "0.5rem";
    margin-right: "0.5rem";
    color: ${$arrowColor ? $arrowColor : "#9ca3af"};
  `}
`;

function CrumbItem({
  path,
  children,
  isLast = false,
  style,
  onClick,
  fontSize = 16,
  hoverColor,
  textColor,
  lastTextColor,
}: CrumbItemProps) {
  return path ? (
    <CrumbItemLink
      $fontSize={fontSize}
      $hoverColor={hoverColor}
      $textColor={textColor}
      href={path}
      $style={style}
      $isLast={isLast}
      $lastTextColor={lastTextColor}
    >
      {children}
    </CrumbItemLink>
  ) : (
    <CrumbItemSpan
      $fontSize={fontSize}
      $hoverColor={hoverColor}
      $textColor={textColor}
      $style={style}
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
  $lastTextColor?: string;
}>`
  ${({ $textColor, $hoverColor, $fontSize }) => css`
    color: ${$textColor ? $textColor : "#4b5563"};
    margin-bottom: 2px;

    ${$fontSize &&
    css`
      font-size: ${`${$fontSize}px`};
    `}

    &:hover {
      color: ${$hoverColor ? $hoverColor : "#61a9f9"};
    }
  `}

  ${({ $isLast, $lastTextColor }) =>
    $isLast &&
    css`
      color: ${$lastTextColor ? $lastTextColor : "#000"};
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
  $lastTextColor?: string;
}>`
  ${({ $textColor, $hoverColor, $fontSize }) => css`
    color: ${$textColor ? $textColor : "#4b5563"};
    margin-bottom: 2px;

    ${$fontSize &&
    css`
      font-size: ${`${$fontSize}px`};
    `}

    &:hover {
      color: ${$hoverColor ? $hoverColor : "#61a9f9"};
    }
  `}

  ${({ $isLast, $lastTextColor }) =>
    $isLast &&
    css`
      color: ${$lastTextColor ? $lastTextColor : "#000"};
      font-weight: 500;
    `}

  ${({ $style }) => $style}
`;

Crumb.Item = CrumbItem;

export { Crumb };
