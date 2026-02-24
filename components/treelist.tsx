import styled, { css, CSSProp } from "styled-components";
import React, {
  createContext,
  HTMLAttributes,
  ReactNode,
  useContext,
  useState,
} from "react";
import {
  RemixiconComponentType,
  RiArrowRightSLine,
  RiDraggable,
} from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";
import { TipMenuItemProps } from "./tip-menu";
import ContextMenu from "./context-menu";
import { LoadingSpinner } from "./loading-spinner";
import { SubMenuButtonProps } from "./button";
import { Tooltip } from "./tooltip";
import { Figure, FigureProps } from "./figure";

export interface TreeListProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "style" | "onChange" | "content"
  > {
  content: TreeListContentProps[];
  children?: ReactNode;
  emptySlate?: ReactNode;
  emptyItemSlate?: ReactNode | null;
  searchTerm?: string;
  actions?: TreeListActionsProps[];
  selectedItem?: string;
  onChange?: (id: string) => void;
  onOpenChange?: (props?: TreeListOnOpenChangeProps) => void;
  showHierarchyLine?: boolean;
  collapsible?: boolean;
  draggable?: boolean;
  alwaysShowDragIcon?: boolean;
  onDragged?: (props: TreeListOnDraggedProps) => void;
  styles?: TreeListStylesProps;
}

export interface TreeListStylesProps {
  containerStyle?: CSSProp;
  emptyItemSlateStyle?: CSSProp;
}

export interface TreeListOnDraggedProps {
  id: string;
  oldGroupId: string;
  newGroupId: string;
  oldPosition: number;
  newPosition: number;
}

export interface TreeListOnOpenChangeProps {
  id?: string;
  isOpen?: boolean;
  setIsLoading?: (isLoading: boolean, caption?: string) => void;
  lastFetch?: Date;
  setLastFetch?: (date: Date) => void;
}

type TreeListInitialState = "closed" | "opened";

export interface TreeListContentProps {
  id: string;
  caption?: string;
  items?: TreeListItemsProps[];
  initialState?: TreeListInitialState;
}

export interface TreeListItemsProps {
  id: string;
  caption?: string;
  canContainChildren?: boolean;
  onClick?: (props: TreeListItemsOnClickProps) => void;
  actions?: SubMenuTreeList[];
  items?: TreeListItemsProps[];
  icon?: RemixiconComponentType;
  iconOnActive?: RemixiconComponentType;
  iconColor?: string;
  initialState?: TreeListInitialState;
}

export interface TreeListItemsOnClickProps {
  item?: TreeListItemsProps;
  preventDefault?: () => void;
}

export interface TreeListActionsProps {
  id: string;
  caption?: string;
  onClick?: (props?: { setActive?: (prop: boolean) => void }) => void;
  icon?: FigureProps;
  style?: CSSProp;
  subMenu?: (props: SubMenuTreeListProps) => ReactNode;
}

type SubMenuTreeListProps = Omit<SubMenuButtonProps, "list">;

export interface SubMenuTreeList extends Omit<TipMenuItemProps, "onClick"> {
  onClick: (id?: string) => void;
}

const DnDContext = createContext<{
  dragItem: {
    id: string;
    item: TreeListItemsProps;
    oldGroupId: string;
    oldPosition: number;
  } | null;
  setDragItem: (props: {
    id: string;
    oldGroupId: string;
    oldPosition: number;
    item: {
      id: string;
      caption: ReactNode;
    };
  }) => void;
  onDragged?: TreeListProps["onDragged"];
}>({
  dragItem: null,
  setDragItem: () => {},
});

function TreeList({
  content,
  children,
  emptySlate,
  searchTerm = "",
  actions,
  onChange,
  selectedItem = "",
  onOpenChange,
  emptyItemSlate = "Empty Content",
  showHierarchyLine,
  collapsible,
  draggable,
  onDragged,
  alwaysShowDragIcon = true,
  styles,
  ...props
}: TreeListProps) {
  const [dragItem, setDragItem] = useState(null);

  const [isSelected, setIsSelected] = useState(selectedItem);
  const [isActive, setIsActive] = useState<string | null>("");
  const [openRowId, setOpenRowId] = useState<string | null>("");

  const initialOpenMap = Object.fromEntries(
    content.map((group) => {
      const valueInitialState = (group.initialState ?? "opened") === "opened";
      const initialState = valueInitialState && !!group.items?.length;
      return [group.id, initialState];
    })
  );

  for (const group of content) {
    if (group.items) {
      const valueInitialState = (group.initialState ?? "opened") === "opened";
      const initialState = valueInitialState && !!group.items?.length;

      Object.assign(
        initialOpenMap,
        collectAllItemIds(group.items, initialState)
      );
    }
  }

  const [isOpen, setIsOpen] = useState<Record<string, boolean>>(initialOpenMap);

  const selectedLevel = content
    .map((group) => {
      if (group.items) return findLevelById(group.items, isSelected, 0);
      return null;
    })
    .find((level) => level !== null);

  const [lastFetchGroup, setLastFetchGroup] = useState<Record<string, Date>>(
    Object.fromEntries(content.map((item) => [item.id, null]))
  );

  const [loadingByGroup, setLoadingByGroup] = useState<
    Record<string, { isLoading: boolean; caption: string }>
  >({});

  const handleOnChange = (id: string) => {
    if (onChange) {
      onChange(id);
    }

    setIsSelected(id);
  };

  const handleSelected = (id: string) => {
    if (onOpenChange) {
      onOpenChange({
        id: id,
        isOpen: !isOpen[id],
        lastFetch: lastFetchGroup[id],
        setLastFetch: (date) => {
          setLastFetchGroup((prev) => ({ ...prev, [id]: date }));
        },
        setIsLoading: (isLoading, caption) =>
          setLoadingByGroup((prev) => ({
            ...prev,
            [id]: { isLoading, caption },
          })),
      });
    }

    setIsOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedGroupId = findGroupOfItem(content, isSelected);

  return (
    <DnDContext.Provider value={{ dragItem, setDragItem, onDragged }}>
      <TreeListWrapper
        {...props}
        aria-label="tree-list-wrapper"
        $containerStyle={styles?.containerStyle}
      >
        {actions && (
          <ActionsWrapper>
            {actions.map((action, index) => {
              const isActiveAction = action.id === isActive;
              const isSelectedAction = action.id === isSelected;

              const handleActionClick = () => {
                action.onClick?.({
                  setActive: (prop: boolean) => {
                    if (prop) handleOnChange(action.id);
                  },
                });
                if (action.subMenu) {
                  setIsActive(action.id);
                }
              };

              const TreeAction = (
                <TreeListAction
                  key={index}
                  isActive={isActiveAction}
                  isSelected={isSelectedAction}
                  onClick={handleActionClick}
                  caption={action.caption}
                  icon={action.icon}
                  style={action.style}
                />
              );

              const tooltipBaseProps = {
                onVisibilityChange: async (open: boolean) => {
                  if (!open) await setIsActive(null);
                },
                showDialogOn: "click" as const,
                hideDialogOn: "click" as const,
                triggerStyle: css`
                  width: 100%;
                `,
              };

              if (action.subMenu) {
                return action.subMenu({
                  show: (
                    children,
                    { arrowStyle, drawerStyle, withArrow = true } = {}
                  ) => (
                    <Tooltip
                      key={index}
                      {...tooltipBaseProps}
                      dialog={children}
                      styles={{
                        arrowStyle: (placement) => {
                          return (
                            withArrow &&
                            css`
                              background-color: #e5e7eb;
                              border: 2px solid #e5e7eb;
                              ${placement === "bottom-start" ||
                              placement === "top-start"
                                ? css`
                                    left: 8%;
                                  `
                                : placement === "bottom-end" ||
                                    placement === "top-end"
                                  ? css`
                                      right: 8%;
                                    `
                                  : null}

                              ${arrowStyle}
                            `
                          );
                        },
                        drawerStyle: css`
                          width: fit-content;
                          background-color: white;
                          color: black;
                          border: 1px solid #e5e7eb;
                          ${drawerStyle}
                        `,
                      }}
                    >
                      {TreeAction}
                    </Tooltip>
                  ),

                  render: (children) => (
                    <Tooltip
                      key={index}
                      {...tooltipBaseProps}
                      dialog={children}
                      styles={{
                        arrowStyle: css`
                          display: none;
                        `,
                        drawerStyle: css`
                          width: fit-content;
                          background-color: white;
                          color: black;
                          border: 1px solid #e5e7eb;
                        `,
                      }}
                    >
                      {TreeAction}
                    </Tooltip>
                  ),
                });
              }

              return TreeAction;
            })}
          </ActionsWrapper>
        )}

        {content && actions && (
          <Divider role="separator" aria-label="divider" />
        )}

        {content.length > 0 ? (
          content.map((item, index) => (
            <GroupWrapper key={index}>
              {item.caption && (
                <GroupTitleWrapper
                  onClick={() => {
                    if (collapsible) {
                      handleSelected(item.id);
                    }
                  }}
                  $collapsible={collapsible}
                >
                  <GroupTitle>{item.caption}</GroupTitle>
                  {collapsible && (
                    <ArrowIcon
                      aria-label="arrow-icon"
                      aria-expanded={isOpen[item.id]}
                      size={20}
                    />
                  )}
                </GroupTitleWrapper>
              )}

              <AnimatePresence initial={false}>
                <ItemsWrapper
                  key={`items-wrapper-${index}`}
                  animate={
                    isOpen[item.id]
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  $collapsed={!isOpen[item.id]}
                >
                  {(() => {
                    const groupLoading = loadingByGroup[item.id];

                    return groupLoading?.isLoading ? (
                      <LoadingSpinner
                        style={css`
                          padding-left: 20px;
                          gap: 8px;
                        `}
                        label={groupLoading.caption}
                      />
                    ) : item.items?.length > 0 ? (
                      item.items.map((val, index) => {
                        return (
                          <TreeListItem
                            key={val.id}
                            item={{ ...val }}
                            canContainChildren={val.canContainChildren ?? true}
                            isSelected={isSelected}
                            onChange={handleOnChange}
                            isLoading={loadingByGroup}
                            searchTerm={searchTerm}
                            draggable={draggable}
                            showHierarchyLine={showHierarchyLine}
                            collapsible={collapsible}
                            isHavingContent={val.items?.length > 0}
                            setIsOpen={handleSelected}
                            isOpen={isOpen}
                            emptyItemSlate={emptyItemSlate}
                            emptyItemSlateStyle={styles?.emptyItemSlateStyle}
                            selectedLevel={selectedLevel}
                            groupId={item.id}
                            parentGroupId={item.id}
                            selectedGroupId={selectedGroupId}
                            groupLength={item.items?.length}
                            index={index}
                            openRowId={openRowId}
                            setOpenRowId={setOpenRowId}
                            alwaysShowDragIcon={alwaysShowDragIcon}
                          />
                        );
                      })
                    ) : (
                      emptyItemSlate !== null && (
                        <EmptyContent
                          key="drop-here"
                          aria-label="tree-list-empty-slate"
                          initial="open"
                          animate={isOpen ? "open" : "collapsed"}
                          $style={styles?.emptyItemSlateStyle}
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
                              const {
                                id: draggedId,
                                oldGroupId,
                                oldPosition,
                              } = dragItem;

                              onDragged?.({
                                id: draggedId,
                                oldGroupId,
                                newGroupId: item.id,
                                oldPosition,
                                newPosition: 0,
                              });

                              setDragItem(null);
                            }
                          }}
                        >
                          {emptyItemSlate}
                        </EmptyContent>
                      )
                    );
                  })()}
                </ItemsWrapper>
              </AnimatePresence>
            </GroupWrapper>
          ))
        ) : (
          <div>{emptySlate}</div>
        )}

        {children}
      </TreeListWrapper>
    </DnDContext.Provider>
  );
}

interface TreeListActionInternalProps {
  isSelected?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  style?: CSSProp;
  icon?: FigureProps;
  caption?: string;
}

function TreeListAction({
  isSelected,
  isActive,
  onClick,
  caption,
  icon,
  style,
}: TreeListActionInternalProps) {
  if (!onClick) onClick = () => {};

  return (
    <ActionItem
      $isActive={isActive}
      $isSelected={isSelected}
      role="button"
      tabIndex={0}
      aria-label="tree-list-action"
      onClick={() => onClick()}
      $style={style}
    >
      {icon && <Figure {...icon} />}
      <div>{caption}</div>
    </ActionItem>
  );
}

function collectAllItemIds(
  items: TreeListItemsProps[],
  initialState?: boolean,
  acc = {} as Record<string, boolean>
) {
  for (const item of items) {
    const hasChildren = Array.isArray(item.items) && item.items?.length > 0;

    const selfInitial =
      (item.initialState ?? "opened") === "opened" ? true : false;

    const validatorProp = initialState && hasChildren && selfInitial;

    acc[item.id] = validatorProp;

    if (hasChildren) collectAllItemIds(item.items, validatorProp, acc);
  }

  return acc;
}

function findLevelById(
  items: TreeListItemsProps[],
  id: string,
  level = 0
): number | null {
  for (const item of items) {
    if (item.id === id) return level;
    if (item.items) {
      const found = findLevelById(item.items, id, level + 1);
      if (found !== null) return found;
    }
  }
  return null;
}

function findGroupOfItem(content: TreeListContentProps[], selectedId: string) {
  for (const group of content) {
    if (!group.items) continue;
    if (containsId(group.items, selectedId)) {
      return group.id;
    }
  }
  return null;
}
function containsId(items: TreeListItemsProps[], id: string) {
  for (const item of items) {
    if (item.id === id) return true;
    if (item.items && containsId(item.items, id)) return true;
  }
  return false;
}

interface TreeListItemComponent<T extends TreeListItemsProps> {
  item: T;
  searchTerm?: string;
  onChange?: (item?: string) => void;
  isSelected?: string;
  showHierarchyLine?: boolean;
  style?: CSSProp;
  level?: number;
  collapsible?: boolean;
  isHavingContent?: boolean;
  isOpen?: Record<string, boolean>;
  isLoading?: Record<string, { isLoading: boolean; caption: string }>;
  setIsOpen?: (prop: string) => void;
  emptyItemSlate?: ReactNode;
  selectedLevel?: number;
  groupId?: string;
  parentGroupId?: string;
  selectedGroupId?: string;
  index?: number;
  draggable?: boolean;
  groupLength?: number;
  emptyItemSlateStyle?: CSSProp;
  alwaysShowDragIcon?: boolean;
  canContainChildren?: boolean;
}

interface TreeListOpenWithId {
  openRowId?: string | null;
  setOpenRowId?: (prop: string | null) => void;
}

function findItemById(
  items: TreeListItemsProps[] | undefined,
  id: string
): TreeListItemsProps | undefined {
  if (!items) return;

  for (const item of items) {
    if (item.id === id) return item;

    const found = findItemById(item.items, id);
    if (found) return found;
  }

  return undefined;
}

export type TreeListNode = TreeListContentProps & Partial<TreeListItemsProps>;

function findTreeListNode(
  nodes: TreeListNode[],
  id: string
): TreeListNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.items) {
      const found = findTreeListNode(node.items, id);
      if (found) return found;
    }
  }
  return null;
}

function hasChild(parent: TreeListNode, childId: string): boolean {
  if (!parent.items) return false;
  return parent.items.some(
    (item) => item.id === childId || hasChild(item, childId)
  );
}

function TreeListItem<T extends TreeListItemsProps>({
  item,
  isSelected,
  onChange,
  searchTerm = "",
  showHierarchyLine,
  style,
  level = 0,
  collapsible,
  isHavingContent,
  isLoading,
  isOpen,
  setIsOpen,
  emptyItemSlate,
  selectedLevel,
  groupId,
  selectedGroupId,
  draggable,
  index,
  groupLength,
  emptyItemSlateStyle,
  parentGroupId,
  alwaysShowDragIcon,
  openRowId,
  setOpenRowId,
  canContainChildren,
}: TreeListItemComponent<T> & TreeListOpenWithId) {
  const { dragItem, setDragItem, onDragged } = useContext(DnDContext);
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(
    null
  );
  const [dropIntent, setDropIntent] = useState<
    "reordering" | "containment" | null
  >(null);

  const [isOver, setIsOver] = useState(false);
  const [isHovered, setIsHovered] = useState<null | string>(null);

  const escapedTerm = escapeRegExp(searchTerm.trim());
  const regex = new RegExp(`(${escapedTerm})`, "gi");
  const parts = escapedTerm ? item.caption.split(regex) : [item.caption];

  const setToggleItem = (id: string) => {
    setIsOpen(id);
  };

  const isSameLevel =
    selectedLevel !== null &&
    selectedLevel === level &&
    selectedGroupId === parentGroupId;

  /** Top/bottom zone inside an item (in pixels) for drag-and-drop.
      6px is chosen so it's easy to trigger reordering without being too small or too large. */
  const DRAG_REORDER_EDGE_THRESHOLD = 6;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <TreeListItemWrapper
        draggable={draggable}
        role="button"
        data-group-id={groupId}
        aria-label="tree-list-item"
        $isSelected={isSelected === item.id}
        $showHierarchyLine={showHierarchyLine}
        onClick={async () => {
          let prevent = false;

          if (onChange) {
            await onChange(item.id);
          }

          if (item.onClick) {
            await item.onClick({
              item,
              preventDefault: () => {
                prevent = true;
              },
            });
          }

          if (!prevent) {
            if (isHavingContent && collapsible) {
              await setToggleItem(item.id);
            }
          }
        }}
        $isHovered={isHovered === item.id || openRowId === item.id}
        $isDropParent={dropIntent === "containment" && isOver}
        $style={style}
        onDragStart={() =>
          setDragItem({
            id: item.id,
            oldGroupId: groupId!,
            oldPosition: index,
            item: {
              id: item.id,
              caption: item.caption,
            },
          })
        }
        onDragOver={(e) => {
          e.preventDefault();
          if (draggable) {
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;
            const half = rect.height / 2;

            const isEdge =
              offsetY < DRAG_REORDER_EDGE_THRESHOLD ||
              offsetY > rect.height - DRAG_REORDER_EDGE_THRESHOLD;

            if (canContainChildren && !isEdge) {
              setDropIntent("containment");
              setDropPosition(null);
            } else {
              setDropIntent("reordering");
              setDropPosition(offsetY < half ? "top" : "bottom");
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

          if (dropIntent === "containment") {
            onDragged?.({
              id: dragItem.id,
              oldGroupId: dragItem.oldGroupId,
              newGroupId: item.id,
              oldPosition: dragItem.oldPosition,
              newPosition: 0,
            });

            setDropIntent(null);
            return;
          }

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

          onDragged?.({
            id: dragItem.id,
            oldGroupId: dragItem.oldGroupId,
            newGroupId: groupId!,
            oldPosition: dragItem.oldPosition,
            newPosition: clampedPosition,
          });
        }}
        onMouseLeave={() => {
          setIsHovered(null);
          setDropIntent(null);
        }}
        onMouseEnter={() => setIsHovered(item.id)}
        $level={level + 1}
      >
        {item.iconOnActive && isSelected === item.id ? (
          <item.iconOnActive
            aria-label="tree-list-icon-on-active"
            size={21}
            style={{ color: item.iconColor ?? "black" }}
          />
        ) : (
          item.icon && (
            <item.icon
              aria-label="tree-list-icon"
              size={21}
              style={{ color: item.iconColor ?? "black" }}
            />
          )
        )}

        {isHavingContent && collapsible && (
          <ArrowIcon
            aria-label="arrow-icon"
            $level={level}
            $showHierarchy={showHierarchyLine}
            $isSelected={isSelected === item.id}
            $isHovered={isHovered === item.id}
            onClick={(e) => {
              e.stopPropagation();
              setToggleItem(item.id);
            }}
            aria-expanded={isOpen[item.id]}
            size={20}
          />
        )}
        <div
          aria-label="tree-list-caption"
          style={{
            width: "100%",
          }}
        >
          {parts.map((part, index) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
              <HighlightedText key={index}>{part}</HighlightedText>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </div>
        {item.actions &&
          (() => {
            const listActions = item.actions;

            const actionsWithIcons = listActions.map((action) => ({
              ...action,
              icon: {
                ...action.icon,
                image: action.icon.image ?? RiArrowRightSLine,
              },
              onClick: (e?: React.MouseEvent) => {
                e?.stopPropagation();
                action.onClick?.(item.id);
                if (listActions.length > 2) setIsHovered(null);
              },
            }));

            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                <ContextMenu
                  onOpen={(prop: boolean) => {
                    if (prop) {
                      setOpenRowId(item.id);
                    } else {
                      setOpenRowId(null);
                    }
                  }}
                  open={openRowId === item.id}
                  maxActionsBeforeCollapsing={2}
                  focusBackgroundColor="#d4d4d4"
                  hoverBackgroundColor="#d4d4d4"
                  activeBackgroundColor="#d4d4d4"
                  actions={actionsWithIcons}
                  styles={{
                    containerStyle: css`
                      display: none;

                      ${(isHovered === item.id
                        ? isHovered === item.id
                        : openRowId === item.id) &&
                      css`
                        display: inherit;
                      `}
                    `,
                    self: css`
                      width: 20px;
                      height: 20px;
                      padding: 0;
                    `,
                  }}
                />
              </div>
            );
          })()}
        {draggable && (
          <DraggableWrapper
            $isHovered={isHovered === item.id}
            $alwaysShowDragIcon={alwaysShowDragIcon}
            aria-label="draggable-request"
          >
            <RiDraggable size={18} />
          </DraggableWrapper>
        )}
        {showHierarchyLine && (
          <TreeListHierarchyVerticalLine
            aria-label="vertical-line"
            $level={level}
            $isSameLevel={isSameLevel}
            $isSelected={isSelected === item.id}
          />
        )}

        {isOver && dropPosition && (
          <DragLine
            $level={level}
            $showHierarchyLine={showHierarchyLine}
            $position={dropPosition}
          />
        )}
      </TreeListItemWrapper>

      {showHierarchyLine &&
        Array.from({ length: level }).map((_, idx) => {
          const isSameLevelLine =
            selectedLevel === idx && selectedGroupId === parentGroupId;

          return (
            <TreeListHierarchyVerticalLine
              key={idx}
              aria-label="vertical-line-level"
              $level={idx}
              $isSameLevel={isSameLevelLine}
            />
          );
        })}

      <AnimatePresence initial={false}>
        {isOpen[item.id] && (
          <motion.div
            style={{
              position: "relative",
            }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              const groupLoading = isLoading[item.id];

              return groupLoading?.isLoading ? (
                <>
                  <LoadingSpinner
                    style={css`
                      transform: translateX(${level * 20 + 20}px);
                      gap: 8px;
                    `}
                    label={groupLoading.caption}
                  />
                </>
              ) : item.items?.length > 0 ? (
                item.items?.map((child, index) => (
                  <TreeListItem
                    key={child.id}
                    item={child}
                    isSelected={isSelected}
                    onChange={onChange}
                    searchTerm={searchTerm}
                    showHierarchyLine={showHierarchyLine}
                    level={level + 1}
                    isHavingContent={child?.items?.length > 0}
                    collapsible={collapsible}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    emptyItemSlate={emptyItemSlate}
                    isLoading={isLoading}
                    selectedLevel={selectedLevel}
                    selectedGroupId={selectedGroupId}
                    parentGroupId={parentGroupId}
                    groupId={item.id}
                    alwaysShowDragIcon={alwaysShowDragIcon}
                    draggable={draggable}
                    groupLength={item?.items?.length}
                    index={index}
                    canContainChildren={item.canContainChildren ?? true}
                  />
                ))
              ) : (
                emptyItemSlate !== null && (
                  <EmptyContent
                    key="drop-here"
                    aria-label="tree-list-empty-slate"
                    initial="open"
                    animate={isOpen ? "open" : "collapsed"}
                    $style={css`
                      margin-left: ${level * 20 + 12}px;
                      ${emptyItemSlateStyle}
                    `}
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
                        const {
                          id: draggedId,
                          oldGroupId,
                          oldPosition,
                        } = dragItem;

                        onDragged?.({
                          id: draggedId,
                          oldGroupId,
                          newGroupId: item.id,
                          oldPosition,
                          newPosition: 0,
                        });

                        setDragItem(null);
                      }
                    }}
                  >
                    {emptyItemSlate}
                  </EmptyContent>
                )
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TreeListWrapper = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${(props) => props.$containerStyle}
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

const EmptyContent = styled(motion.div)<{ $style?: CSSProp }>`
  height: 0.5rem;
  margin-top: 0.25rem;
  margin-left: 12px;
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

const DragLine = styled.div<{
  $position: "top" | "bottom";
  $level?: number;
  $showHierarchyLine?: boolean;
}>`
  position: absolute;
  right: 0;
  height: 2px;
  background-color: #3b82f6;
  z-index: 1000;
  border-radius: 2px;

  left: ${({ $level, $showHierarchyLine }) =>
    $showHierarchyLine
      ? `${($level ?? 0) * 12 + 9}px`
      : `${($level ?? 0) * 15 + 0}px`};
  top: ${({ $position }) => ($position === "top" ? "0" : "auto")};
  bottom: ${({ $position }) => ($position === "bottom" ? "0" : "auto")};
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1em;
`;

const ActionItem = styled.div<{
  $style?: CSSProp;
  $isSelected?: boolean;
  $isActive?: boolean;
}>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  align-items: center;
  padding: 0.25rem 1.2rem;
  gap: 0.5rem;
  cursor: pointer;
  border-left: 3px solid transparent;
  user-select: none;
  min-height: 36px;

  &:hover {
    background-color: #f5f5f5;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      background-color: #f5f5f5;
    `}

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      background-color: #f5f5f5;
      border-left: 3px solid #3b82f6;
    `}
  ${(props) => props.$style}
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #d1d5db;
  margin-bottom: 1em;
`;

const GroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;

  &:not(:last-child) {
    padding-bottom: 8px;
  }
`;

const GroupTitleWrapper = styled.div<{ $collapsible?: boolean }>`
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  user-select: none;

  ${({ $collapsible }) =>
    $collapsible &&
    css`
      cursor: pointer;
    `}
`;

const GroupTitle = styled.span`
  font-weight: 500;
  padding: 2px 1rem;
  padding-left: 1.4rem;
`;

const ArrowIcon = styled(RiArrowRightSLine)<{
  $isHovered?: boolean;
  $isSelected?: boolean;
  $showHierarchy?: boolean;
  $level?: number;
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.2s ease-in-out;

  ${({ $level }) => css`
    left: ${$level * 12 + 0}px;
    z-index: 9999;
    border-radius: 9999px;
  `}

  ${({ $isHovered, $isSelected, $showHierarchy }) =>
    $isHovered || $isSelected
      ? css`
          background-color: #f3f4f6;
        `
      : $showHierarchy &&
        css`
          background-color: white;
        `}

  &[aria-expanded="true"] {
    transform: translateY(-50%) rotate(90deg);
  }
`;

const ItemsWrapper = styled(motion.ul)<{ $collapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  list-style: none;
  padding: 0;
  padding-bottom: 0.5em;
  margin: 0;
  cursor: pointer;

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      display: none;
    `};
`;

const TreeListHierarchyVerticalLine = styled.div<{
  $level?: number;
  $isSelected?: boolean;
  $isSameLevel?: boolean;
  $style?: CSSProp;
}>`
  position: absolute;
  top: 0;
  width: 1px;
  z-index: 8888;
  ${({ $level, $isSelected, $isSameLevel }) => css`
    height: 100%;
    left: ${$level * 12 + 9}px;

    ${$isSelected
      ? css`
          border-left: 2px solid #3b82f6;
        `
      : $isSameLevel
        ? css`
            border-left: 2px solid #d7d6d6;
          `
        : css`
            border-left: 2px solid rgb(243 243 243);
          `}
  `}

  ${({ $style }) => $style}
`;

const TreeListItemWrapper = styled.li<{
  $isSelected: boolean;
  $showHierarchyLine: boolean;
  $style?: CSSProp;
  $level?: number;
  $isHovered?: boolean;
  $isDropParent?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  cursor: pointer;
  justify-content: space-between;
  min-height: 36px;
  gap: 4px;
  user-select: none;
  width: 100%;

  ${({ $showHierarchyLine, $isSelected }) =>
    !$showHierarchyLine &&
    css`
      border-left: 3px solid ${$isSelected ? "#3b82f6" : "transparent"};
    `}
  background-color: ${({ $isSelected, $isDropParent }) =>
    $isDropParent ? "#f3f4f6" : $isSelected ? "#f3f4f6" : "white"};
  ${({ $isHovered }) =>
    $isHovered &&
    css`
      background-color: #f3f4f6;
    `}

  padding: 0.25rem 1.2rem;
  padding-right: 8px;
  list-style: none;

  ${({ $level }) =>
    $level &&
    css`
      padding-left: ${$level * 12 + 8}px;
    `}

  ${(props) => props.$style}
`;

const HighlightedText = styled.span`
  background-color: #e5e7eb;
  font-weight: 600;
  border-radius: 4px;
`;

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

TreeList.findItemById = findItemById;
TreeList.findGroupOfItem = findGroupOfItem;
TreeList.findTreeListNode = findTreeListNode;
TreeList.hasChild = hasChild;

export { TreeList };
