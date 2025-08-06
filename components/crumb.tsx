import { cn } from "./../lib/utils";
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

interface CrumbProps {
  children?: ReactNode;
  maxShown?: number;
  style?: CSSProp;
  iconSeparator?: RemixiconComponentType;
}

interface CrumbItemProps {
  path?: string;
  children?: ReactNode;
  isLast?: boolean;
  style?: CSSProp;
  onClick?: () => void;
}

function Crumb({
  iconSeparator: Icon = RiArrowRightSLine,
  maxShown = 3,
  children,
  style,
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
    const last = allItems[itemCount - 1];
    const current = allItems[itemCount - 2];

    shownItems = [first, "ellipsis", current, last];
  }

  return (
    <CrumbNav aria-label="crumb">
      <AnimatePresence initial={false} mode="popLayout">
        {shownItems.map((data, index) => {
          const isEllipsis = data === "ellipsis";
          const isLast = index === shownItems.length - 1;

          if (isEllipsis) {
            return (
              <CrumbEllipsisLi
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <CrumbEllipsisIcon
                  size={20}
                  aria-label="ellipsis"
                  onClick={() => setExpanded(true)}
                />

                {!isLast && (
                  <Icon
                    size={20}
                    style={{
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                      color: "#9ca3af",
                    }}
                  />
                )}
              </CrumbEllipsisLi>
            );
          }

          if (isValidElement<CrumbItemProps>(data)) {
            return (
              <CrumbItemLi
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
                })}
                {!isLast && (
                  <Icon
                    size={20}
                    style={{
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                      color: "#9ca3af",
                    }}
                  />
                )}
              </CrumbItemLi>
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
`;

const CrumbItemLi = styled(motion.li)`
  display: flex;
  align-items: center;
  min-height: 24px;
  max-height: 24px;
`;

const CrumbEllipsisLi = styled(motion.li)`
  display: flex;
  align-items: center;
`;

const CrumbEllipsisIcon = styled(RiMoreLine)`
  color: #6b7280;
  cursor: pointer;
  &:hover {
    color: #61a9f9;
  }
`;

const CrumbSeparatorIcon = styled(RiArrowRightSLine)``;

function CrumbItem({
  path,
  children,
  isLast = false,
  style,
  onClick,
}: CrumbItemProps) {
  return path ? (
    <CrumbItemLink href={path} $style={style} $isLast={isLast}>
      {children}
    </CrumbItemLink>
  ) : (
    <CrumbItemSpan $style={style} onClick={onClick} $isLast={isLast}>
      {children}
    </CrumbItemSpan>
  );
}

const CrumbItemLink = styled.a<{
  $isLast?: boolean;
  $style?: CSSProp;
}>`
  color: #4b5563;
  margin-bottom: 2px;
  &:hover {
    color: #61a9f9;
  }

  ${({ $isLast }) =>
    $isLast &&
    css`
      color: #000;
      font-weight: 500;
    `}

  ${({ $style }) => $style}
`;

const CrumbItemSpan = styled.span<{
  $isLast?: boolean;
  $style?: CSSProp;
}>`
  color: #4b5563;
  cursor: pointer;

  &:hover {
    color: #61a9f9;
  }

  ${({ $isLast }) =>
    $isLast &&
    css`
      color: #000;
      font-weight: 500;
    `}

  ${({ $style }) => $style}
`;

Crumb.Item = CrumbItem;

export { Crumb };
