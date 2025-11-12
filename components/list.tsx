import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiDraggable,
} from "@remixicon/react";
import React, {
  ChangeEvent,
  Children,
  cloneElement,
  createContext,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react";
import { Searchbox } from "./searchbox";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";
import { Checkbox } from "./checkbox";
import { Togglebox } from "./togglebox";
import styled, { css, CSSProp } from "styled-components";
import { Button, SubMenuButtonProps } from "./button";
import ContextMenu, { ContextMenuActionsProps } from "./context-menu";

export interface ListProps {
  searchable?: boolean;
  onSearchRequested?: (search: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  containerStyle?: CSSProp;
  isLoading?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  onDragged?: (props: {
    id: string;
    oldGroupId: string;
    newGroupId: string;
    oldPosition: number;
    newPosition: number;
  }) => void;
}

export interface ListGroupActionsProps {
  caption: string;
  icon?: RemixiconComponentType;
  onClick?: (e?: string) => void;
  style?: CSSProp;
  dividerStyle?: CSSProp;
  dropdownStyle?: CSSProp;
  subMenu?: (props: SubMenuButtonProps) => ReactNode;
  disabled?: boolean;
  showSubMenuOn?: "caret" | "self";
}

export interface ListGroupProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  draggable?: boolean;
  containerStyle?: CSSProp;
  contentStyle?: CSSProp;
  selectable?: boolean;
  rightSideContent?: ((prop: string) => ReactNode) | ReactNode;
  actions?: ListGroupActionsProps[];
  openerStyle?: "chevron" | "togglebox" | "none";
}

export interface ListGroupContentProps {
  id: string;
  title: string;
  subtitle?: string;
  actions?: ListGroupActionsProps[];
  rightSideContent?: ((prop: string) => ReactNode) | ReactNode;
  items: ListItemProps[];
}

export type ListActionItemProps = ContextMenuActionsProps;

export interface LeftSideContentMenuProps {
  badge?: (badge: ReactNode, withStyle?: { withStyle?: CSSProp }) => ReactNode;
  render?: (children?: ReactNode) => ReactNode;
}

export interface ListItemProps {
  id: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  leftIcon?: RemixiconComponentType | null;
  draggable?: boolean;
  groupId?: string;
  selectable?: boolean;
  onSelected?: (selected: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  rightSideContent?: ((prop: string) => ReactNode) | ReactNode;
  containerStyle?: CSSProp;
  rowStyle?: CSSProp;
  actions?: (id?: string) => ContextMenuActionsProps[];
  children?: ReactNode;
  openable?: boolean;
  selectedOptions?: {
    value?: string;
    checked?: boolean;
  };
  leftSideContent?: ReactNode;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
}

interface ListItemInternal
  extends Omit<ListItemProps, "leftSideContent" | "onClick"> {
  leftSideContent?: (props?: LeftSideContentMenuProps) => ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
}

const DnDContext = createContext<{
  dragItem: {
    id: string;
    item: ListItemProps;
    oldGroupId: string;
    oldPosition: number;
  } | null;
  setDragItem: (props: {
    id: string;
    oldGroupId: string;
    oldPosition: number;
    item: {
      id: string;
      title: string;
      subtitle: string;
      imageUrl?: string;
      leftIcon?: RemixiconComponentType;
    };
  }) => void;
  onDragged?: ListProps["onDragged"];
}>({
  dragItem: null,
  setDragItem: () => {},
});

function List({
  searchable,
  onSearchRequested,
  children,
  containerStyle,
  onDragged,
  draggable,
  selectable,
  isLoading,
}: ListProps) {
  const [dragItem, setDragItem] = useState(null);
  const [value, setValue] = useState("");

  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <DnDContext.Provider value={{ dragItem, setDragItem, onDragged }}>
      <ListContainer role="list" $containerStyle={containerStyle}>
        {searchable && (
          <Searchbox
            name="search"
            onChange={(e) => {
              onSearchRequested(e);
              setValue(e.target.value);
            }}
            value={value}
          />
        )}

        {isLoading && (
          <OverlayLoading>
            <LoadingSpinner iconSize={24} />
          </OverlayLoading>
        )}

        {childArray.map((child, index) => {
          const componentChild = child as ReactElement<ListItemProps>;
          const modifiedChild = cloneElement(componentChild, {
            draggable: draggable,
            selectable: selectable,
          });

          return <Fragment key={`list-${index}`}>{modifiedChild}</Fragment>;
        })}
      </ListContainer>
    </DnDContext.Provider>
  );
}

const ListContainer = styled.div<{ $containerStyle?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  ${(props) => props.$containerStyle}
`;

const OverlayLoading = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 30;
`;

function ListGroup({
  id,
  title,
  children,
  containerStyle,
  draggable,
  selectable,
  subtitle,
  rightSideContent,
  openerStyle = "chevron",
  actions,
}: ListGroupProps) {
  const childArray = Children.toArray(children).filter(isValidElement);
  const [isOpen, setIsOpen] = useState(true);
  const { dragItem, setDragItem, onDragged } = useContext(DnDContext);

  return (
    <ListGroupContainer $containerStyle={containerStyle}>
      <HeaderButton
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "start",
          }}
        >
          <HeaderText>{title}</HeaderText>
          {subtitle && <HeaderSubtext>{subtitle}</HeaderSubtext>}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "4px",
            alignItems: "center",
            width: "100%",
            justifyContent: "end",
            paddingRight: "0.5rem",
          }}
        >
          {actions &&
            actions.map((prop, index) => (
              <ActionButton key={index} {...prop} id={id} />
            ))}
          {rightSideContent && (
            <Fragment>
              {rightSideContent && typeof rightSideContent === "function"
                ? rightSideContent(`${id}`)
                : (rightSideContent as ReactNode)}
            </Fragment>
          )}
          {openerStyle === "chevron" ? (
            <RiArrowDownSLine
              style={{
                transition: "transform 200ms",
                transform: isOpen ? "rotate(0deg)" : "rotate(-180deg)",
              }}
              size={18}
            />
          ) : openerStyle === "togglebox" ? (
            <Togglebox
              checked={isOpen}
              onChange={() => setIsOpen((prev) => !prev)}
            />
          ) : null}
        </div>
      </HeaderButton>

      {isOpen && <Divider aria-label="divider" />}

      <AnimatePresence initial={false}>
        {childArray.map((child, index) => {
          const componentChild = child as ReactElement<
            ListItemProps & {
              index: number;
              onDropItem?: (position: number) => void;
              groupLength?: number;
            }
          >;

          const modifiedChild = cloneElement(componentChild, {
            draggable: draggable,
            selectable: selectable,
            groupId: id,
            index: index,
            groupLength: childArray.length,
            onDropItem: (newPosition: number) => {
              if (dragItem && draggable) {
                const { id: draggedId, oldGroupId, oldPosition } = dragItem;

                onDragged?.({
                  id: draggedId,
                  oldGroupId,
                  newGroupId: id,
                  oldPosition,
                  newPosition: newPosition,
                });

                setDragItem(null);
              }
            },
          });

          return (
            <ListGroupContent
              key={`list-group-content-${index}`}
              initial="open"
              animate={isOpen ? "open" : "collapsed"}
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {modifiedChild}
            </ListGroupContent>
          );
        })}

        {childArray.length === 0 && (
          <EmptyContent
            key="drop-here"
            initial="open"
            animate={isOpen ? "open" : "collapsed"}
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragItem && draggable) {
                const { id: draggedId, oldGroupId, oldPosition } = dragItem;

                onDragged?.({
                  id: draggedId,
                  oldGroupId,
                  newGroupId: id,
                  oldPosition,
                  newPosition: 0,
                });

                setDragItem(null);
              }
            }}
          >
            Empty Content
          </EmptyContent>
        )}
      </AnimatePresence>
    </ListGroupContainer>
  );
}

const ListGroupContainer = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  ${({ $containerStyle }) => $containerStyle}
`;

const ListGroupContent = styled(motion.div)<{
  $contentStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: 2px;
  ${({ $contentStyle }) => $contentStyle}
`;

const HeaderButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0;
  cursor: pointer;
`;

const HeaderText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
  text-align: left;
`;

const HeaderSubtext = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const Divider = styled.div`
  border-bottom: 1px solid #d1d5db;
  width: 100%;
  height: fit-content;
`;

const EmptyContent = styled(motion.div)`
  height: 0.5rem;
  margin-top: 0.25rem;
  padding: 0.5rem 0;
  border: 1px dashed #d1d5db;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #9ca3af;
`;

function ListItem({
  leftIcon: LeftIcon = null,
  imageUrl,
  subtitle,
  title,
  containerStyle,
  rowStyle,
  draggable,
  index,
  onDropItem,
  groupId,
  groupLength,
  selectable,
  onSelected,
  selectedOptions,
  onClick,
  rightSideContent,
  id,
  actions,
  children,
  openable,
  leftSideContent,
  titleStyle,
  subtitleStyle,
}: ListItemInternal & {
  index?: number;
  onDropItem?: (position: number) => void;
  groupLength?: number;
}) {
  const { setDragItem, dragItem } = useContext(DnDContext);
  const [isOver, setIsOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(
    null
  );
  const idFullname = groupId ? `${groupId}-${id}` : `${id}`;

  return (
    <ListItemWrapper
      onMouseEnter={() => setIsHovered(idFullname)}
      onMouseLeave={() => setIsHovered(null)}
      aria-label="list-item-wrapper"
      $openable={openable && isOpen}
      $style={containerStyle}
    >
      <ListItemRow
        $isHovered={isHovered === idFullname}
        $style={rowStyle}
        onClick={() => {
          if (onClick) {
            onClick();
          }
          if (openable) {
            setIsOpen((prev) => !prev);
          }
        }}
        draggable={draggable}
        onDragStart={() =>
          setDragItem({
            id: id,
            oldGroupId: groupId!,
            oldPosition: index,
            item: {
              id: id,
              title,
              subtitle,
              ...(imageUrl ? { imageUrl } : { leftIcon: LeftIcon }),
            },
          })
        }
        onDragOver={(e) => {
          e.preventDefault();
          if (draggable) {
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;
            const half = rect.height / 2;

            if (offsetY < half) {
              setDropPosition("top");
            } else {
              setDropPosition("bottom");
            }

            setIsOver(true);
          }
        }}
        onDragLeave={() => {
          setIsOver(false);
          setDropPosition(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsOver(false);

          let position = 0;
          const isSameGroup = dragItem?.oldGroupId === groupId;

          if (dropPosition === "top") {
            position = index;
          } else {
            position = index + 1;
          }

          if (isSameGroup && dragItem?.oldPosition < position) {
            position -= 1;
          }

          const clampedPosition = Math.min(position, groupLength ?? 0);

          onDropItem?.(clampedPosition);
        }}
      >
        <ListItemLeft>
          {selectable && (
            <Checkbox
              name="checked"
              value={selectedOptions.value}
              checked={selectedOptions.checked}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={onSelected}
            />
          )}
          {leftSideContent &&
            typeof leftSideContent === "function" &&
            leftSideContent({
              badge: (children, style = { withStyle: css`` }) => (
                <CustomLeftSideContent
                  aria-label="left-side-content"
                  $style={style.withStyle}
                >
                  {children}
                </CustomLeftSideContent>
              ),
              render: (children) => children,
            })}
          {imageUrl ? (
            <ImageStyle src={imageUrl} alt="Image from coneto, Systatum." />
          ) : (
            LeftIcon && <LeftIcon size={22} color="#4b5563" />
          )}
          <TextWrapper>
            {title && <Title $style={titleStyle}>{title}</Title>}
            {subtitle && <Subtitle $style={subtitleStyle}>{subtitle}</Subtitle>}
          </TextWrapper>
        </ListItemLeft>

        <ListItemRight>
          {isHovered === idFullname &&
            actions &&
            (() => {
              const list = actions(idFullname);

              const actionsWithIcons = list.map((prop) => ({
                ...prop,
                icon: prop.icon ?? RiArrowRightSLine,
                onClick: (e?: React.MouseEvent) => {
                  prop.onClick?.(e);
                  if (list.length > 1) {
                    setIsHovered(null);
                  }
                },
              }));

              return (
                <ContextMenu
                  focusBackgroundColor="#c1d6f1"
                  hoverBackgroundColor="#c1d6f1"
                  activeBackgroundColor="#c1d6f1"
                  actions={actionsWithIcons}
                />
              );
            })()}
          {rightSideContent && typeof rightSideContent === "function"
            ? rightSideContent(idFullname)
            : (rightSideContent as ReactNode)}

          {draggable && (
            <div
              aria-label="draggable-request"
              style={{
                cursor: "grab",
                borderRadius: "2px",
                color: "#4b5563",
              }}
            >
              <RiDraggable size={18} />
            </div>
          )}
        </ListItemRight>

        {isOver && dropPosition && <DragLine position={dropPosition} />}
      </ListItemRow>

      <AnimatePresence>
        {openable && children && (
          <ListGroupContent
            key={`list-group-content-${index}`}
            initial="collapsed"
            animate={isOpen ? "open" : "collapsed"}
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto", display: "flex" },
              collapsed: { opacity: 0, height: 0, display: "none" },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </ListGroupContent>
        )}
      </AnimatePresence>
    </ListItemWrapper>
  );
}

const ListItemWrapper = styled.div<{
  $style?: CSSProp;
  $openable?: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 4px;
  transition: background-color 300ms;
  border-radius: 3px;

  ${({ $openable }) =>
    $openable &&
    css`
      background-color: #dbeafe;
    `}

  ${({ $style }) => $style}
`;

const ListItemRow = styled.div<{
  $style?: CSSProp;
  $isHovered?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  gap: 0.5rem;
  transition: background-color 300ms;
  border-radius: 3px;

  ${({ $isHovered }) =>
    $isHovered &&
    css`
      background-color: #dbeafe;
    `}

  ${({ $style }) => $style}
`;

const ListItemLeft = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`;

const ListItemRight = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
`;

const ImageStyle = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.25rem;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  user-select: none;
`;

const CustomLeftSideContent = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  padding-right: 10px;
  padding-left: 10px;
  font-size: 12px;

  ${({ $style }) => $style};
`;

const Title = styled.h3<{ $style?: CSSProp }>`
  font-weight: 500;
  font-size: 0.875rem;

  ${({ $style }) => $style}
`;

const Subtitle = styled.span<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  color: #4b5563;
  ${({ $style }) => $style}
`;

const DragLine = styled.div<{ position: "top" | "bottom" }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 2px;
  top: ${({ position }) => (position === "top" ? "0" : "auto")};
  bottom: ${({ position }) => (position === "bottom" ? "0" : "auto")};
`;

function ActionButton(
  prop: ListGroupActionsProps &
    Partial<{
      id?: string;
    }>
) {
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        if (prop.onClick) {
          prop.onClick(prop.id);
        }
      }}
      aria-label="list-action-button"
      subMenu={prop.subMenu}
      disabled={prop.disabled}
      showSubMenuOn={prop.showSubMenuOn}
      size="sm"
      tipMenuSize="sm"
      buttonStyle={css`
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        align-items: center;
        cursor: pointer;
        background-color: transparent;
        color: #565555;
        ${prop.subMenu && prop.showSubMenuOn === "caret"
          ? css`
              border-top: 1px solid #e5e7eb;
              border-left: 1px solid #e5e7eb;
              border-bottom: 1px solid #e5e7eb;
            `
          : css`
              border: 1px solid #e5e7eb;
            `}
        border-radius: 6px;
        position: relative;
        font-size: 11px;
        max-height: 24px;

        &:hover {
          background-color: #e2e0e0;
        }

        &:disabled {
          background-color: rgb(227 227 227);
          opacity: 0.5;
          cursor: not-allowed;
        }
        ${prop.style}
      `}
      toggleStyle={
        prop.subMenu &&
        css`
          display: flex;
          flex-direction: row;
          gap: 0.25rem;
          align-items: center;
          cursor: pointer;
          color: #565555;
          padding: 0.25rem 0.5rem;
          background-color: transparent;
          position: relative;
          border-top: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;

          &:hover {
            background-color: #e2e0e0;
          }

          &:disabled {
            background-color: rgb(227 227 227);
            opacity: 0.5;
            cursor: not-allowed;
          }
          ${prop.style}
        `
      }
      dividerStyle={css`
        border: 1px solid rgb(236 236 236);
        ${prop.subMenu && prop.dividerStyle ? prop.dividerStyle : null}
      `}
      dropdownStyle={css`
        position: absolute;
        margin-top: 2px;
        z-index: 9999;
        width: 170px;
        ${prop.subMenu && prop.dropdownStyle ? prop.dropdownStyle : null}
      `}
    >
      {prop.icon && <prop.icon size={14} />}

      {prop.caption}
    </Button>
  );
}

List.Group = ListGroup;
List.Item = ListItem;
export { List };
