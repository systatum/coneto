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
  forwardRef,
  Fragment,
  isValidElement,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  Ref,
  useContext,
  useMemo,
  useState,
} from "react";
import { Searchbox, SearchboxStylesProps } from "./searchbox";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingSpinner } from "./loading-spinner";
import { Checkbox } from "./checkbox";
import { Togglebox } from "./togglebox";
import styled, { css, CSSProp } from "styled-components";
import ContextMenu, { ContextMenuActionsProps } from "./context-menu";
import { ActionButton, ActionButtonProps } from "./action-button";

export interface ListProps extends ListMaxItemsProp {
  searchable?: boolean;
  onSearchRequested?: (search: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  isLoading?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  searchValue?: string;
  styles?: ListStylesProps;
  onDragged?: (props: {
    id: string;
    oldGroupId: string;
    newGroupId: string;
    oldPosition: number;
    newPosition: number;
  }) => void;
  openerBehavior?: "any" | "onlyOne";
  onOpen?: (props?: ListOnOpenProps) => void;
  alwaysShowDragIcon?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onSearchKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  labels?: ListLabelsProps;
}

interface ListLabelsProps {
  moreItemsText?: ReactNode;
  lessItemsText?: ReactNode;
}

export interface ListOnOpenProps {
  id?: string;
  isOpen?: boolean;
}

export type ListItemActionProps = ContextMenuActionsProps;

interface ListAlwaysShowDragIconProp {
  alwaysShowDragIcon?: boolean;
}

interface ListMaxItemsProp {
  maxItems?: number;
  maxItemsWithIcon?: boolean;
}

interface ListStylesProps {
  maxItemsStyle?: CSSProp;
  searchboxStyles?: SearchboxStylesProps;
  containerStyle?: CSSProp;
}

export interface LeftSideContentMenuProps {
  badge?: (badge: ReactNode, withStyle?: { withStyle?: CSSProp }) => ReactNode;
  render?: (children?: ReactNode) => ReactNode;
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
      title: ReactNode | string;
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

type OpenedContextType = {
  openedGroupIds: Set<string>;
  openedItemIds: Set<string>;
  setIsOpen: (id: string, level?: "group" | "item") => void;
  isOpen: (id: string, level?: "group" | "item") => boolean;
};

const OpenedContext = createContext<OpenedContextType>({
  openedGroupIds: new Set(),
  openedItemIds: new Set(),
  setIsOpen: () => {},
  isOpen: () => false,
});

function List({
  searchable,
  onSearchRequested,
  searchValue,
  inputRef,
  children,
  styles,
  onDragged,
  draggable,
  selectable,
  isLoading,
  openerBehavior = "any",
  onOpen,
  alwaysShowDragIcon = true,
  onSearchKeyDown,
  maxItems,
  labels,
  maxItemsWithIcon,
}: ListProps) {
  const childArray = Children.toArray(children).filter(isValidElement);

  const hasGroup = childArray.some((child) => {
    if (!isValidElement(child)) return false;

    return (child as ReactElement).type === List.Group;
  });

  const initialOpenedIds = useMemo(() => {
    const initialIds = new Set<string>();

    childArray.forEach((child) => {
      if (isValidElement(child)) {
        const childElement = child as ReactElement<ListGroupProps>;
        if (childElement.props && "id" in childElement.props) {
          if (childElement.props.initialState !== "closed") {
            initialIds.add(childElement.props.id);
          }
        }
      }
    });

    return initialIds;
  }, []);

  const [openedGroupIds, setOpenedGroupIds] =
    useState<Set<string>>(initialOpenedIds);
  const [openedItemIds, setOpenedItemIds] = useState<Set<string>>(new Set());
  const [openTipRowId, setOpenTipRowId] = useState<string | null>("");

  const [dragItem, setDragItem] = useState(null);
  const [searchValueLocal, setSearchValueLocal] = useState("");
  const [expanded, setExpanded] = useState(hasGroup ? true : false);

  const isControlled = searchValue !== undefined;
  const value = isControlled ? searchValue : searchValueLocal;

  const setValue = (e: ChangeEvent<HTMLInputElement>) => {
    const finalValue = e.target.value;
    if (!isControlled) {
      setSearchValueLocal(finalValue);
    }
    if (onSearchRequested) {
      onSearchRequested(e);
    }
  };

  const setIsOpen = (id: string, level: "group" | "item" = "item") => {
    if (level === "group") {
      setOpenedGroupIds((prev) => {
        const next = new Set(prev);
        if (onOpen) {
          onOpen({
            id: id,
            isOpen: !next.has(id),
          });
        }

        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      });
    } else {
      setOpenedItemIds((prev) => {
        const next = new Set(prev);
        if (onOpen) {
          onOpen({
            id: id,
            isOpen: !next.has(id),
          });
        }

        if (openerBehavior === "onlyOne") {
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.clear();
            next.add(id);
          }
        } else {
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
        }
        return next;
      });
    }
  };

  const isOpen = (id: string, level: "group" | "item" = "item") =>
    level === "group" ? openedGroupIds.has(id) : openedItemIds.has(id);

  return (
    <OpenedContext.Provider
      value={{
        openedGroupIds,
        openedItemIds,
        setIsOpen,
        isOpen,
      }}
    >
      <DnDContext.Provider value={{ dragItem, setDragItem, onDragged }}>
        <ListContainer
          aria-label="list-container"
          $containerStyle={styles?.containerStyle}
        >
          {searchable && (
            <Searchbox
              ref={inputRef}
              name="search"
              autoComplete="off"
              onChange={(e) => {
                setValue(e);
              }}
              onKeyDown={onSearchKeyDown}
              value={value}
              styles={styles?.searchboxStyles}
            />
          )}

          {isLoading && (
            <OverlayLoading>
              <LoadingSpinner iconSize={24} />
            </OverlayLoading>
          )}

          {childArray.map((child, index) => {
            const componentChild = child as ReactElement<
              ListItemProps &
                ListItemWithId &
                ListAlwaysShowDragIconProp &
                ListMaxItemsProp & { labels?: ListLabelsProps }
            >;

            if (child.type === React.Fragment) {
              return child;
            }

            const isHidden = maxItems && !expanded && index >= maxItems;

            const isGroup = componentChild.type === List.Group;
            const isList = componentChild.type === List.Item;

            const modifiedChild = cloneElement(componentChild, {
              ...(isList || isGroup
                ? {
                    draggable,
                    selectable,
                    openTipRowId,
                    setOpenTipRowId,
                    alwaysShowDragIcon,
                    ...(isGroup
                      ? {
                          maxItems,
                          labels,
                          ...(maxItems &&
                            styles?.maxItemsStyle && {
                              styles: {
                                maxItemsStyle: styles.maxItemsStyle,
                                ...componentChild.props.styles,
                              },
                            }),
                        }
                      : {}),
                  }
                : {}),
            });

            if (maxItems) {
              return (
                <AnimatePresence initial={false} key={index}>
                  {!isHidden && (
                    <motion.div
                      key={`list-${index}`}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {modifiedChild}
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            }

            return <Fragment key={`list-${index}`}>{modifiedChild}</Fragment>;
          })}

          {!hasGroup && maxItems && childArray.length > maxItems && (
            <ListShowMoreButton
              key={`list-show-more`}
              expanded={expanded}
              setExpanded={setExpanded}
              labels={labels}
              maxItemsStyle={styles?.maxItemsStyle}
              maxItemsWithIcon={maxItemsWithIcon}
              maxItems={maxItems}
              isOpen={undefined}
            />
          )}
        </ListContainer>
      </DnDContext.Provider>
    </OpenedContext.Provider>
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

export interface ListGroupActionsProps
  extends Omit<ActionButtonProps, "onClick"> {
  onClick?: (e?: string) => void;
}

export interface ListGroupProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  draggable?: boolean;
  rightSideContent?: ((prop: string) => ReactNode) | ReactNode;
  actions?: ListGroupActionsProps[];
  openerStyle?: "chevron" | "togglebox" | "none";
  emptySlate?: ReactNode;
  initialState?: "opened" | "closed";
  selectable?: boolean;
  styles?: ListGroupStylesProps;
}

interface ListGroupStylesProps {
  containerStyle?: CSSProp;
  rowStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
  contentStyle?: CSSProp;
  emptySlateStyle?: CSSProp;
  maxItemsStyle?: CSSProp;
  leftSideWrapperStyle?: CSSProp;
  rightSideWrapperStyle?: CSSProp;
}

export interface ListGroupContentProps {
  id: string;
  title: string;
  subtitle?: string;
  actions?: ListGroupActionsProps[];
  rightSideContent?: ((prop: string) => ReactNode) | ReactNode;
  initialState?: "opened" | "closed";
  items: ListItemProps[];
  styles?: ListGroupStylesProps;
}

function ListGroup({
  id,
  title,
  subtitle,
  children,
  draggable,
  selectable,
  rightSideContent,
  openerStyle = "chevron",
  actions,
  emptySlate,
  initialState = "opened",
  styles,
  ...props
}: ListGroupProps) {
  const {
    openTipRowId,
    setOpenTipRowId,
    alwaysShowDragIcon,
    labels,
    maxItems,
    maxItemsWithIcon,
  } = props as ListItemWithId &
    ListAlwaysShowDragIconProp &
    ListMaxItemsProp & { labels?: ListLabelsProps };

  const childArray = Children.toArray(children).filter(isValidElement);
  const { dragItem, setDragItem, onDragged } = useContext(DnDContext);
  const { isOpen, setIsOpen } = useContext(OpenedContext);
  const [expanded, setExpanded] = useState(false);

  const opened = isOpen(id, "group");

  const finalActions =
    actions &&
    actions?.map((action) => ({
      ...action,
      styles: {
        self: css`
          font-size: 11px;
          height: 24px;
          ${action.styles?.self}
        `,
      },
      onClick: () => action.onClick && action.onClick?.(id),
    }));

  return (
    <ListGroupContainer $containerStyle={styles?.containerStyle}>
      <HeaderButton
        $isOpen={opened}
        onClick={() => setIsOpen(id, "group")}
        aria-expanded={opened}
        $style={styles?.rowStyle}
      >
        <ListGroupLeftSideWrapper
          $style={styles?.leftSideWrapperStyle}
          aria-label="list-left-side-wrapper"
        >
          {title && (
            <TitleText
              aria-label="list-group-title"
              $style={styles?.titleStyle}
            >
              {title}
            </TitleText>
          )}
          {subtitle && (
            <SubtitleText
              aria-label="list-group-subtitle"
              $style={styles?.subtitleStyle}
            >
              {subtitle}
            </SubtitleText>
          )}
        </ListGroupLeftSideWrapper>

        <ListGroupRightSideWrapper
          $style={styles?.rightSideWrapperStyle}
          aria-label="list-right-side-wrapper"
        >
          {finalActions &&
            finalActions.map((prop, index) => {
              return <ActionButton key={index} {...prop} />;
            })}
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
                transform: opened ? "rotate(0deg)" : "rotate(-180deg)",
              }}
              size={18}
            />
          ) : openerStyle === "togglebox" ? (
            <Togglebox
              styles={{
                containerStyle: css`
                  width: fit-content;
                `,
              }}
              checked={opened}
              onChange={() => {
                setIsOpen(id, "group");
              }}
            />
          ) : null}
        </ListGroupRightSideWrapper>
      </HeaderButton>

      {opened && <Divider aria-label="divider" />}

      <AnimatePresence initial={false}>
        <ListGroupContent
          key={`list-group-content`}
          initial="open"
          animate={opened ? "open" : "collapsed"}
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          $contentStyle={styles?.contentStyle}
        >
          {childArray.map((child, index) => {
            const componentChild = child as ReactElement<
              ListItemProps &
                ListItemWithId &
                ListAlwaysShowDragIconProp & {
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
              openTipRowId,
              setOpenTipRowId,
              alwaysShowDragIcon,
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

            const isHidden = maxItems && !expanded && index >= maxItems;

            if (maxItems) {
              return (
                <AnimatePresence key={index}>
                  {!isHidden && (
                    <motion.div
                      aria-label="list-with-max-item"
                      key={`list-${index}`}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {modifiedChild}
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            }

            return <Fragment key={index}>{modifiedChild}</Fragment>;
          })}
        </ListGroupContent>

        {maxItems && childArray.length > maxItems && (
          <ListShowMoreButton
            expanded={expanded}
            isOpen={opened}
            setExpanded={setExpanded}
            key={`list-show-more-${opened}`}
            maxItemsStyle={styles?.maxItemsStyle}
            maxItemsWithIcon={maxItemsWithIcon}
            labels={labels}
            maxItems={maxItems}
          />
        )}

        {childArray.length === 0 && (
          <EmptyContent
            key="drop-here"
            aria-label="list-group-empty-slate"
            initial="open"
            animate={opened ? "open" : "collapsed"}
            $style={styles?.emptySlateStyle}
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
            {emptySlate ?? "Empty Content"}
          </EmptyContent>
        )}
      </AnimatePresence>
    </ListGroupContainer>
  );
}

function ListShowMoreButton({
  expanded,
  isOpen,
  setExpanded,
  labels,
  maxItemsStyle,
  maxItemsWithIcon,
}: {
  expanded: boolean;
  setExpanded: (prop: boolean) => void;
  isOpen?: boolean | undefined;
  labels?: ListLabelsProps;
  maxItemsStyle?: CSSProp;
} & ListMaxItemsProp) {
  return (
    <ShowMoreButton
      aria-label="list-show-more-button"
      $style={css`
        ${maxItemsStyle}
        ${isOpen !== undefined &&
        !isOpen &&
        css`
          display: none;
        `}
      `}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded
        ? (labels?.lessItemsText ?? "Show less")
        : (labels?.moreItemsText ?? "Show more")}

      {(maxItemsWithIcon ? maxItemsWithIcon : true) && (
        <RiArrowDownSLine
          aria-label="list-show-more-arrow"
          style={{
            width: 16,
            height: 16,
            marginLeft: 8,
            transition: "transform 0.3s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      )}
    </ShowMoreButton>
  );
}

const ListGroupLeftSideWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
`;

const ListGroupRightSideWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  padding-right: 0.5rem;

  ${({ $style }) => $style}
`;

const ShowMoreButton = styled.button<{ $style?: CSSProp }>`
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  border: 1px solid #cccccc;
  border-radius: 2px;
  text-align: center;
  color: #616161;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  ${({ $style }) => $style}
`;

const ListGroupContainer = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  ${({ $containerStyle }) => $containerStyle}
`;

const ListGroupContent = styled(motion.ul)<{
  $contentStyle?: CSSProp;
  $isOpen?: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  padding-top: ${({ $isOpen }) => ($isOpen ? "2px" : "0px")};
  gap: 4px;

  ${({ $contentStyle }) => $contentStyle}
`;

const HeaderButton = styled.div<{ $isOpen?: boolean; $style?: CSSProp }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0;
  padding-bottom: ${({ $isOpen }) => ($isOpen ? "0.5rem" : "0px")};
  cursor: pointer;

  ${({ $style }) => $style}
`;

const TitleText = styled.span<{ $style?: CSSProp }>`
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
  text-align: left;

  ${({ $style }) => $style}
`;

const SubtitleText = styled.span<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  color: #6b7280;

  ${({ $style }) => $style}
`;

const Divider = styled.div`
  border-bottom: 1px solid #d1d5db;
  width: 100%;
  height: fit-content;
`;

const EmptyContent = styled(motion.div)<{ $style?: CSSProp }>`
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

  ${({ $style }) => $style}
`;

export interface ListItemProps {
  id: string;
  title?: ReactNode;
  subtitle?: string;
  imageUrl?: string;
  leftIcon?: RemixiconComponentType | null;
  draggable?: boolean;
  groupId?: string;
  selectable?: boolean;
  onSelected?: (selected: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  rightSideContent?: ((prop: string) => ReactNode) | ReactNode;
  actions?: (id?: string) => ListItemActionProps[];
  children?: ReactNode;
  openable?: boolean;
  selectedOptions?: {
    value?: string;
    checked?: boolean;
  };
  leftSideContent?: ReactNode;
  styles?: ListItemStylesProps;
}

interface ListItemStylesProps {
  containerStyle?: CSSProp;
  rowStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
  leftSideStyle?: CSSProp;
  rightSideStyle?: CSSProp;
  maxItemsStyle?: CSSProp;
}

type DivProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title" | "onClick" | "draggable" | "id" | "style"
>;

interface ListItemInternal
  extends DivProps,
    Omit<ListItemProps, "leftSideContent" | "onClick"> {
  leftSideContent?: (props?: LeftSideContentMenuProps) => React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

interface ListItemWithId {
  openTipRowId?: string | null;
  setOpenTipRowId?: (prop: string | null) => void;
}

const ListItem = forwardRef<HTMLLIElement, ListItemInternal>(
  (
    {
      leftIcon: LeftIcon = null,
      imageUrl,
      subtitle,
      title,
      draggable,
      groupId,
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
      styles,
      ...props
    },
    ref
  ) => {
    const {
      openTipRowId,
      setOpenTipRowId,
      alwaysShowDragIcon,
      groupLength,
      index,
      onDropItem,
      ...domProps
    } = props as ListItemWithId &
      ListAlwaysShowDragIconProp & {
        index?: number;
        onDropItem?: (position: number) => void;
        groupLength?: number;
      };

    const { isOpen, setIsOpen } = useContext(OpenedContext);
    const { setDragItem, dragItem } = useContext(DnDContext);
    const [isOver, setIsOver] = useState(false);
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(
      null
    );
    const idFullname = groupId ? `${groupId}-${id}` : `${id}`;

    const isChildOpened = isOpen(idFullname, "item");

    return (
      <ListItemWrapper
        ref={ref}
        onMouseEnter={() => setIsHovered(idFullname)}
        onMouseLeave={() => setIsHovered(null)}
        aria-label="list-item-wrapper"
        $openable={openable && isChildOpened}
        $style={styles?.containerStyle}
      >
        <ListItemRow
          {...domProps}
          $isHovered={isHovered === idFullname || openTipRowId === idFullname}
          $style={styles?.rowStyle}
          draggable={draggable}
          onClick={() => {
            if (onClick) {
              onClick();
            }
            if (openable) {
              setIsOpen(idFullname, "item");
            }
          }}
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
          <ListItemLeft
            $style={styles?.leftSideStyle}
            aria-label="list-item-left-side"
          >
            {selectable && selectedOptions && (
              <Checkbox
                styles={{
                  iconStyle: css`
                    width: 8px;
                    height: 8px;
                  `,
                  self: css`
                    width: 14px;
                    height: 14px;
                  `,
                }}
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
              {title && (
                <Title role="option" $style={styles?.titleStyle}>
                  {title}
                </Title>
              )}
              {subtitle && (
                <Subtitle $style={styles?.subtitleStyle}>{subtitle}</Subtitle>
              )}
            </TextWrapper>
          </ListItemLeft>

          {(actions || rightSideContent || draggable) && (
            <ListItemRight
              $style={styles?.rightSideStyle}
              aria-label="list-item-left-side"
            >
              {actions &&
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
                      onOpen={(prop: boolean) => {
                        if (prop) {
                          setOpenTipRowId(idFullname);
                        } else {
                          setOpenTipRowId(null);
                        }
                      }}
                      open={openTipRowId === idFullname}
                      styles={{
                        containerStyle: css`
                          display: none;

                          ${(isHovered === idFullname
                            ? isHovered === idFullname
                            : openTipRowId === idFullname) &&
                          css`
                            display: inherit;
                          `}
                        `,
                        self: css`
                          ${!subtitle &&
                          css`
                            width: 24px;
                            height: 24px;
                            padding: 2px;
                          `}
                        `,
                      }}
                      iconSize={!subtitle && 12}
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
                <DraggableWrapper
                  $isHovered={isHovered === idFullname}
                  $alwaysShowDragIcon={alwaysShowDragIcon}
                  aria-label="draggable-request"
                >
                  <RiDraggable size={18} />
                </DraggableWrapper>
              )}
            </ListItemRight>
          )}

          {isOver && dropPosition && <DragLine $position={dropPosition} />}
        </ListItemRow>

        <AnimatePresence>
          {openable && children && (
            <ListGroupContent
              key={`list-item-children-${index}`}
              initial="collapsed"
              aria-label="list-item-children"
              animate={isChildOpened ? "open" : "collapsed"}
              exit="collapsed"
              $isOpen={isChildOpened}
              variants={{
                open: {
                  opacity: 1,
                  height: "auto",
                  transition: {
                    height: { duration: 0.3, ease: "easeInOut" },
                    opacity: { duration: 0.8 },
                  },
                },
                collapsed: {
                  opacity: 0,
                  height: 0,
                  transition: {
                    height: { duration: 0.25, ease: "easeInOut" },
                    opacity: { duration: 0.15 },
                  },
                },
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
);

const ListItemWrapper = styled.li<{
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
  width: 100%;

  ${({ $isHovered }) =>
    $isHovered &&
    css`
      background-color: #dbeafe;
    `}

  ${({ $style }) => $style}
`;

const DraggableWrapper = styled.div<{
  $alwaysShowDragIcon: boolean;
  $isHovered?: boolean;
}>`
  cursor: grab;
  border-radius: 2px;
  color: #4b5563;
  opacity: 0;

  ${({ $isHovered }) =>
    $isHovered &&
    css`
      opacity: 1;
    `}

  ${({ $alwaysShowDragIcon }) =>
    $alwaysShowDragIcon &&
    css`
      opacity: 1;
    `}
`;

const ListItemLeft = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  justify-content: start;
  width: 100%;

  ${({ $style }) => $style}
`;

const ListItemRight = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  justify-content: end;
  width: 30%;

  ${({ $style }) => $style}
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
  width: 100%;
  word-break: break-all;
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

const DragLine = styled.div<{ $position: "top" | "bottom" }>`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 2px;
  top: ${({ $position }) => ($position === "top" ? "0" : "auto")};
  bottom: ${({ $position }) => ($position === "bottom" ? "0" : "auto")};
`;

List.Group = ListGroup;
List.Item = ListItem;
export { List };
