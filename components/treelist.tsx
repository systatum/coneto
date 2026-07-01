import styled, { css, CSSProp } from "styled-components";
import React, {
  createContext,
  HTMLAttributes,
  ReactNode,
  useContext,
  useState,
} from "react";
import { RiArrowRightSLine, RiDraggable } from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";
import ContextMenu, { ContextMenuAction } from "./context-menu";
import { LoadingSpinner } from "./loading-spinner";
import { ButtonSubMenu } from "./button";
import { Tooltip } from "./tooltip";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "./../theme/provider";
import { TreeListThemeConfig } from "./../theme";
import { BaseAction } from "../constants/action";
import { applyClassName } from "./../constants/classname";

export interface TreeListProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    | "style"
    | "onChange"
    | "content"
    | "onMouseDown"
    | "onMouseMove"
    | "onKeyDown"
    | "onMouseEnter"
  > {
  content: TreeListContent[];
  children?: ReactNode;
  emptySlate?: ReactNode;
  emptyItemSlate?: ReactNode | null;
  searchTerm?: string;
  actions?: TreeListAction[];
  selectedItems?: string | string[];
  onChange?: (id: string | string[]) => void;
  onOpenChange?: (props?: TreeListOnOpenChange) => void;
  showHierarchyLine?: boolean;
  collapsible?: boolean;
  draggable?: boolean;
  alwaysShowDragIcon?: boolean;
  onDragged?: (props: TreeListOnDragged) => void;
  styles?: TreeListStyles;
  id?: string;
  arrowSize?: number;
  ref?: (props: { el: HTMLLIElement | null; item: TreeListContent }) => void;
  onKeyDown?: (props: {
    event?: React.KeyboardEvent;
    item?: TreeListContent;
  }) => void;
  onMouseMove?: (props: {
    event?: React.MouseEvent;
    item?: TreeListContent;
  }) => void;
  onMouseEnter?: (props: {
    event: React.MouseEvent;
    item?: TreeListContent;
  }) => void;
  onMouseDown?: (props: {
    event: React.MouseEvent;
    item?: TreeListContent;
  }) => void;
  // treelist.item
  refItem?: (props: { el: HTMLLIElement | null; item: TreeListItem }) => void;
  onKeyDownItem?: (props: {
    event?: React.KeyboardEvent;
    item?: TreeListItem;
  }) => void;
  onMouseMoveItem?: (props: {
    event?: React.MouseEvent;
    item?: TreeListItem;
  }) => void;
  onMouseEnterItem?: (props: {
    event: React.MouseEvent;
    item?: TreeListItem;
  }) => void;
  onMouseDownItem?: (props: {
    event: React.MouseEvent;
    item?: TreeListContent;
  }) => void;
  multiple?: boolean;
  maxActionsBeforeCollapsing?: number;
}

export interface TreeListStyles extends TreeListItemStyles {
  // ===== Root / layout =====
  containerStyle?: CSSProp;
  containerGroupStyle?: CSSProp;
  dividerStyle?: CSSProp;

  // ===== Actions (top area) =====
  actionWrapperStyle?: CSSProp;
  actionStyle?: CSSProp;

  // ===== Group (TreeListContent) =====
  titleStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  arrowGroupStyle?: CSSProp;
  emptySlateStyle?: CSSProp;
}

export interface TreeListOnDragged {
  id: string;
  oldGroupId: string;
  newGroupId: string;
  oldPosition: number;
  newPosition: number;
}

export interface TreeListOnOpenChange {
  id?: string;
  isOpen?: boolean;
  setIsLoading?: (isLoading: boolean, caption?: string) => void;
  lastFetch?: Date;
  setLastFetch?: (date: Date) => void;
}

export const TreeListInitialState = {
  Closed: "closed",
  Opened: "opened",
} as const;

export type TreeListInitialState =
  (typeof TreeListInitialState)[keyof typeof TreeListInitialState];

export interface TreeListContent {
  id: string;
  caption?: ReactNode;
  items?: TreeListItem[];
  initialState?: TreeListInitialState;
  actions?: TreeListContentAction[];
  className?: string;
  collapsible?: boolean;
}

export interface TreeListContentAction
  extends Omit<ContextMenuAction, "onClick"> {
  onClick?: (id?: string) => void;
}

export interface TreeListItem {
  id: string;
  caption?: ReactNode;
  canContainChildren?: boolean;
  onClick?: (props: TreeListItemOnClick) => void;
  actions?: TreeListItemAction[];
  items?: TreeListItem[];
  icon?: FigureProps["image"];
  iconOnActive?: FigureProps["image"];
  iconColor?: string;
  initialState?: TreeListInitialState;
  className?: string;
  collapsible?: boolean;
  styles?: TreeListItemStyles;
}

export interface TreeListItemAction extends Omit<ContextMenuAction, "onClick"> {
  onClick?: (id?: string) => void;
}

export interface TreeListItemOnClick {
  item?: TreeListItem;
  preventDefault?: () => void;
  withoutSelection?: () => void;
}

export interface TreeListAction extends Omit<BaseAction, "onClick"> {
  onClick?: (props?: { setActive?: (prop: boolean) => void }) => void;
  styles?: { self?: CSSProp };
  subMenu?: (props: TreeListSubMenu) => ReactNode;
}

type TreeListSubMenu = Omit<ButtonSubMenu, "list">;

const DnDContext = createContext<{
  dragItem: {
    id: string;
    item: TreeListItem;
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
  onOpenChange,
  emptyItemSlate = "Empty Content",
  showHierarchyLine,
  collapsible,
  draggable,
  onDragged,
  alwaysShowDragIcon = true,
  styles,
  className,
  id,
  arrowSize = 20,
  ref,
  onKeyDown,
  onMouseEnter,
  onMouseMove,
  onMouseDown,
  // for treelist.item
  refItem,
  onKeyDownItem,
  onMouseEnterItem,
  onMouseMoveItem,
  onMouseDownItem,
  multiple,
  selectedItems: _selectedItems,
  maxActionsBeforeCollapsing = 2,
  ...props
}: TreeListProps) {
  const { currentTheme } = useTheme();
  const treeListTheme = currentTheme.treelist;

  /** Normalise selectedItem (string | string[] | undefined) → string[] */
  function normaliseSelected(value: string | string[] | undefined): string[] {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }

  const [dragItem, setDragItem] = useState(null);

  const [localSelected, setLocalSelected] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<string | null>("");
  const [openRowId, setOpenRowId] = useState<string | null>("");

  const isControlled = _selectedItems !== undefined;

  const selectedItems: string[] = isControlled
    ? normaliseSelected(_selectedItems)
    : localSelected;

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
  const [isHovered, setIsHovered] = useState<string | null>(undefined);

  const primarySelected = selectedItems[0] ?? "";

  const selectedLevel = content
    .map((group) => {
      if (group.items) return findLevelById(group.items, primarySelected, 0);
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
    let next: string | string[];

    if (multiple) {
      const current = selectedItems;
      const nextArr = current.includes(id)
        ? current.filter((s) => s !== id)
        : [...current, id];
      next = nextArr;
    } else {
      next = id;
    }

    if (onChange) onChange(next);

    if (!isControlled) {
      setLocalSelected(Array.isArray(next) ? next : [next]);
    }
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

  const selectedGroupId = findGroupOfItem(content, primarySelected);

  const filteredActions = Array.isArray(actions)
    ? actions?.filter((action) => !action?.hidden)
    : [];

  const hasActions = filteredActions.length > 0;

  return (
    <DnDContext.Provider value={{ dragItem, setDragItem, onDragged }}>
      <TreeListWrapper
        id={id}
        aria-label="tree-list-wrapper"
        className={applyClassName("tree-list", className)}
        $style={styles?.containerStyle}
        $textColor={treeListTheme.textColor}
        {...props}
      >
        {hasActions && (
          <ActionsWrapper
            $style={styles?.actionWrapperStyle}
            aria-label="tree-list-action-wrapper"
          >
            {filteredActions.map((action, index) => {
              const {
                className: classNameAction,
                onMouseEnter: onMouseEnterAction,
              } = action as TreeListActionInternalProps;
              const isActiveAction = action.id === isActive;
              const isSelectedAction = selectedItems.includes(action.id);

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
                  onMouseEnter={onMouseEnterAction}
                  className={classNameAction}
                  isActive={isActiveAction}
                  isSelected={isSelectedAction}
                  onClick={handleActionClick}
                  caption={action.caption}
                  icon={action.icon}
                  styles={{
                    self: css`
                      ${styles?.actionStyle}
                      ${action?.styles?.self}
                    `,
                  }}
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
                        triggerStyle: css`
                          width: 100%;
                        `,
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
                        containerStyle: css`
                          width: 100%;
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

        {content?.length > 0 && actions?.length > 0 && (
          <Divider
            $style={styles?.dividerStyle}
            role="separator"
            aria-label="divider"
          />
        )}

        {content.length > 0 ? (
          content.map((item, index) => {
            const isCollapsible = item.collapsible ?? collapsible;

            return (
              <GroupWrapper $style={styles?.containerGroupStyle} key={index}>
                {item.caption && (
                  <GroupTitleWrapper
                    ref={(el) => ref?.({ el: el, item: item })}
                    onKeyDown={(event) =>
                      onKeyDown({ event: event, item: item })
                    }
                    data-has-options={item?.className?.includes(
                      "has-group-options"
                    )}
                    data-first={index === 0}
                    data-last={index === content.length - 1}
                    data-action-opened={item.id === openRowId}
                    data-selected={selectedItems?.includes(item.id)}
                    data-highlighted={item?.className?.includes(
                      "is-highlighted"
                    )}
                    aria-expanded={isOpen[item.id]}
                    $style={styles?.textWrapperStyle}
                    aria-label="tree-list-group-title"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMouseDown?.({ event: e, item });
                      if (isCollapsible) {
                        handleSelected(item.id);
                      }
                    }}
                    $collapsible={isCollapsible}
                    onMouseLeave={() => setIsHovered(null)}
                    onMouseMove={(e) => onMouseMove?.({ event: e, item })}
                    onMouseEnter={(e) => {
                      onMouseEnter?.({ event: e, item });
                      setIsHovered(item.id);
                    }}
                    data-level={0}
                  >
                    <Title
                      role="option"
                      data-has-options={item?.className?.includes(
                        "has-group-options"
                      )}
                      $style={styles?.titleStyle}
                    >
                      {item.caption}
                    </Title>

                    {item.actions &&
                      (() => {
                        const listActions = item.actions;
                        const actionsWithIcons = item.actions
                          ?.filter((action) => !action?.hidden)
                          .map((action) => ({
                            ...action,
                            icon: {
                              ...action?.icon,
                              image: action?.icon?.image ?? RiArrowRightSLine,
                            },
                            onClick: (e?: React.MouseEvent) => {
                              e?.stopPropagation();
                              action.onClick?.(item.id);
                              if (listActions.length > 2) setIsHovered(null);
                            },
                          }));

                        return (
                          <ContextMenu
                            onOpen={(prop: boolean) => {
                              setOpenRowId(prop ? item.id : null);
                            }}
                            activeBackgroundColor={
                              treeListTheme.rowActionBackgroundColor
                            }
                            focusBackgroundColor={
                              treeListTheme.rowActionBackgroundColor
                            }
                            hoverBackgroundColor={
                              treeListTheme.rowActionBackgroundColor
                            }
                            open={openRowId === item.id}
                            maxActionsBeforeCollapsing={
                              maxActionsBeforeCollapsing
                            }
                            actions={actionsWithIcons}
                            styles={{
                              containerStyle: css`
                                display: none;
                                ${(isHovered === item.id ||
                                  openRowId === item.id) &&
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
                        );
                      })()}

                    {isCollapsible && (
                      <ArrowIcon
                        aria-label="arrow-icon"
                        aria-expanded={isOpen[item.id]}
                        size={arrowSize}
                        $style={styles?.arrowGroupStyle}
                      />
                    )}
                  </GroupTitleWrapper>
                )}

                <AnimatePresence initial={false}>
                  {isOpen[item.id] && (
                    <ItemsWrapper
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {(() => {
                        const groupLoading = loadingByGroup[item.id];

                        if (groupLoading?.isLoading) {
                          return (
                            <LoadingSpinner
                              styles={{
                                containerStyle: css`
                                  padding-left: 20px;
                                  gap: 8px;
                                `,
                              }}
                              label={groupLoading.caption}
                            />
                          );
                        }

                        if (item.items?.length > 0) {
                          return item.items.map((val, index) => (
                            <TreeListItem
                              key={val.id}
                              item={{ ...val }}
                              className={val?.className}
                              onMouseDownItem={onMouseDownItem}
                              onKeyDownItem={onKeyDownItem}
                              onMouseMoveItem={onMouseMoveItem}
                              onMouseEnterItem={onMouseEnterItem}
                              refItem={refItem}
                              canContainChildren={
                                val.canContainChildren ?? true
                              }
                              styles={{
                                titleItemStyle: styles?.titleItemStyle,
                                itemStyle: styles?.itemStyle,
                                highlightedTextStyle:
                                  styles?.highlightedTextStyle,
                                emptyItemSlateStyle:
                                  styles?.emptyItemSlateStyle,
                                arrowStyle: styles?.arrowStyle,
                                hierarchyLineStyle: styles?.hierarchyLineStyle,
                              }}
                              arrowSize={arrowSize}
                              alwaysShowDragIcon={alwaysShowDragIcon}
                              isSelected={selectedItems}
                              onChange={handleOnChange}
                              isLoading={loadingByGroup}
                              searchTerm={searchTerm}
                              draggable={draggable}
                              showHierarchyLine={showHierarchyLine}
                              collapsible={isCollapsible}
                              isHavingContent={val.items?.length > 0}
                              setIsOpen={handleSelected}
                              isOpen={isOpen}
                              emptyItemSlate={emptyItemSlate}
                              selectedLevel={selectedLevel}
                              groupId={item.id}
                              parentGroupId={item.id}
                              selectedGroupId={selectedGroupId}
                              groupLength={item.items?.length}
                              index={index}
                              openRowId={openRowId}
                              setOpenRowId={setOpenRowId}
                            />
                          ));
                        }

                        if (emptyItemSlate !== null) {
                          return (
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
                          );
                        }
                      })()}
                    </ItemsWrapper>
                  )}
                </AnimatePresence>
              </GroupWrapper>
            );
          })
        ) : emptySlate ? (
          <EmptyContent $style={styles?.emptySlateStyle}>
            {emptySlate}
          </EmptyContent>
        ) : null}

        {children}
      </TreeListWrapper>
    </DnDContext.Provider>
  );
}

interface TreeListActionInternalProps extends BaseAction {
  isSelected?: boolean;
  isActive?: boolean;
  styles?: { self?: CSSProp };
  className?: string;
  onMouseEnter?: (event: React.MouseEvent) => void;
}

function TreeListAction({
  isSelected,
  isActive,
  onClick,
  caption,
  icon,
  styles,
  disabled,
  hidden,
  id,
  className,
  onMouseEnter,
}: TreeListActionInternalProps) {
  if (hidden) {
    return;
  }

  if (!onClick) onClick = () => {};
  const { currentTheme } = useTheme();
  const treeListTheme = currentTheme.treelist;

  return (
    <ActionItem
      id={id}
      $disabled={disabled}
      $theme={treeListTheme}
      $isActive={isActive}
      $isSelected={isSelected}
      role="button"
      tabIndex={0}
      aria-label="tree-list-action"
      data-has-options={false}
      data-highlighted={className?.includes("is-highlighted")}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseDown={() => onClick()}
      $style={styles?.self}
    >
      {icon && <Figure {...icon} />}
      {caption}
    </ActionItem>
  );
}

function collectAllItemIds(
  items: TreeListItem[],
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
  items: TreeListItem[],
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

function findGroupOfItem(content: TreeListContent[], selectedId: string) {
  for (const group of content) {
    if (!group.items) continue;
    if (containsId(group.items, selectedId)) {
      return group.id;
    }
  }
  return null;
}
function containsId(items: TreeListItem[], id: string) {
  for (const item of items) {
    if (item.id === id) return true;
    if (item.items && containsId(item.items, id)) return true;
  }
  return false;
}

interface TreeListItemComponent<T extends TreeListItem> {
  item: T;
  searchTerm?: string;
  onChange?: (item?: string) => void;
  isSelected?: string[];
  styles?: TreeListItemStyles;
  showHierarchyLine?: boolean;
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
  alwaysShowDragIcon?: boolean;
  canContainChildren?: boolean;
  arrowSize?: number;
  className?: string;
  onKeyDownItem?: (props: {
    event: React.KeyboardEvent;
    item: TreeListItem;
  }) => void;
  onMouseMoveItem?: (props: {
    event: React.MouseEvent;
    item: TreeListItem;
  }) => void;
  onMouseEnterItem?: (props: {
    event: React.MouseEvent;
    item: TreeListItem;
  }) => void;
  onMouseDownItem?: (props: {
    event: React.MouseEvent;
    item: TreeListItem;
  }) => void;
  refItem?: (props: { el: HTMLLIElement | null; item: TreeListItem }) => void;
}

export interface TreeListItemStyles {
  itemStyle?: ((level: number) => CSSProp) | CSSProp;
  emptyItemSlateStyle?: CSSProp;
  arrowStyle?: CSSProp;
  hierarchyLineStyle?: CSSProp;
  highlightedTextStyle?: CSSProp;
  titleItemStyle?: CSSProp;
}

interface TreeListOpenWithId {
  openRowId?: string | null;
  setOpenRowId?: (prop: string | null) => void;
}

function findItemById(
  items: TreeListItem[] | undefined,
  id: string
): TreeListItem | undefined {
  if (!items) return;

  for (const item of items) {
    if (item.id === id) return item;

    const found = findItemById(item.items, id);
    if (found) return found;
  }

  return undefined;
}

export type TreeListNode = TreeListContent & Partial<TreeListItem>;

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
  if (!("items" in parent) || !parent.items) return false;

  return parent.items.some(
    (item) => item.id === childId || hasChild(item, childId)
  );
}
function TreeListItem<T extends TreeListItem>({
  item,
  isSelected,
  onChange,
  searchTerm = "",
  showHierarchyLine,
  styles,
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
  parentGroupId,
  alwaysShowDragIcon,
  openRowId,
  setOpenRowId,
  canContainChildren,
  arrowSize,
  onKeyDownItem,
  onMouseEnterItem,
  onMouseMoveItem,
  onMouseDownItem,
  refItem,
}: TreeListItemComponent<T> & TreeListOpenWithId) {
  const { currentTheme } = useTheme();
  const treeListTheme = currentTheme.treelist;

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
        backgroundColor: "inherit",
      }}
    >
      <TreeListItemWrapper
        ref={(el) => refItem?.({ el: el, item })}
        draggable={draggable}
        role="button"
        data-group-id={groupId}
        aria-label="tree-list-item"
        $style={
          typeof styles?.itemStyle === "function"
            ? styles?.itemStyle(level)
            : styles?.itemStyle
        }
        $isSelected={isSelected.includes(item.id)}
        aria-expanded={isOpen[item.id]}
        $showHierarchyLine={showHierarchyLine}
        data-selected={isSelected.includes(item.id)}
        data-has-options={item?.className?.includes("has-group-options")}
        data-highlighted={item?.className?.includes("is-highlighted")}
        data-first={index === 0}
        data-last={index === item?.items?.length - 1}
        onKeyDown={(e) => {
          onKeyDownItem?.({ event: e, item });
        }}
        onMouseDown={async (e) => {
          let prevent = false;
          let withoutSelection = false;

          onMouseDownItem?.({
            event: e,
            item,
          });

          if (item.onClick) {
            await item.onClick({
              item,
              withoutSelection: () => {
                withoutSelection = true;
              },
              preventDefault: () => {
                prevent = true;
              },
            });
          }

          if (!withoutSelection) {
            if (onChange) {
              await onChange(item.id);
            }
          }

          if (!prevent) {
            if (isHavingContent && collapsible) {
              await setToggleItem(item.id);
            }
          }
        }}
        $theme={treeListTheme}
        data-action-opened={openRowId === item.id}
        $isHovered={isHovered === item.id || openRowId === item.id}
        $isDropParent={dropIntent === "containment" && isOver}
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
        onMouseLeave={(e) => {
          setIsHovered(null);
          setDropIntent(null);
          onMouseMoveItem?.({ event: e, item });
        }}
        onMouseEnter={(e) => {
          setIsHovered(item.id);
          onMouseEnterItem?.({ event: e, item });
        }}
        $level={level + 1}
        data-level={level}
      >
        {item.iconOnActive && isSelected.includes(item.id) ? (
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
            $isSelected={isSelected.includes(item.id)}
            $isHovered={isHovered === item.id}
            $style={styles?.arrowStyle}
            onMouseDown={(e) => {
              e.stopPropagation();
              setToggleItem(item.id);
            }}
            aria-expanded={isOpen[item.id]}
            size={arrowSize}
          />
        )}
        <Title
          aria-label="tree-list-caption"
          $style={css`
            display: flex;
            flex-direction: row;
            padding: 0px;
            gap: 10px;
            align-items: center;
            width: 100%;
            font-weight: inherit;
            ${styles?.titleItemStyle}
          `}
        >
          {typeof item.caption === "string"
            ? (escapedTerm ? item.caption.split(regex) : [item.caption]).map(
                (part, index) =>
                  part.toLowerCase() === searchTerm.toLowerCase() ? (
                    <HighlightedText
                      $style={styles?.highlightedTextStyle}
                      key={index}
                    >
                      {part}
                    </HighlightedText>
                  ) : (
                    <span key={index}>{part}</span>
                  )
              )
            : item.caption}
        </Title>
        {item.actions &&
          (() => {
            const listActions = item.actions;

            const actionsWithIcons = item.actions
              ?.filter((action) => !action?.hidden)
              .map((action) => ({
                ...action,
                icon: {
                  ...action?.icon,
                  image: action?.icon?.image ?? RiArrowRightSLine,
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
            $theme={treeListTheme}
            aria-label="vertical-line"
            data-level={level}
            $level={level}
            $isSameLevel={isSameLevel}
            $style={styles?.hierarchyLineStyle}
            data-same-level={isSameLevel}
            data-has-options={item?.className?.includes("has-group-options")}
            data-selected={isSelected.includes(item.id)}
            $isSelected={isSelected.includes(item.id)}
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
              data-level={idx}
              $theme={treeListTheme}
              aria-label="vertical-line-level"
              $level={idx}
              data-has-options={Boolean(
                item?.className?.includes("has-group-options")
              )}
              $isSameLevel={isSameLevelLine}
              $style={styles?.hierarchyLineStyle}
              data-selected={isSelected.includes(item.id)}
            />
          );
        })}

      <AnimatePresence initial={false}>
        {isOpen[item.id] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {(() => {
              const groupLoading = isLoading[item.id];

              return groupLoading?.isLoading ? (
                <>
                  <LoadingSpinner
                    styles={{
                      containerStyle: css`
                        transform: translateX(${level * 20 + 20}px);
                        gap: 8px;
                      `,
                    }}
                    label={groupLoading.caption}
                  />
                </>
              ) : item.items?.length > 0 ? (
                item.items?.map((child, index) => (
                  <TreeListItem
                    key={index}
                    styles={{
                      itemStyle: styles?.itemStyle,
                      titleItemStyle: styles?.titleItemStyle,
                      highlightedTextStyle: styles?.highlightedTextStyle,
                      emptyItemSlateStyle: styles?.emptyItemSlateStyle,
                      arrowStyle: styles?.arrowStyle,
                      hierarchyLineStyle: styles?.hierarchyLineStyle,
                    }}
                    className={child?.className}
                    onKeyDownItem={onKeyDownItem}
                    onMouseMoveItem={onMouseMoveItem}
                    onMouseEnterItem={onMouseEnterItem}
                    refItem={refItem}
                    onMouseDownItem={onMouseDownItem}
                    arrowSize={arrowSize}
                    item={child}
                    isSelected={isSelected}
                    onChange={onChange}
                    searchTerm={searchTerm}
                    showHierarchyLine={showHierarchyLine}
                    level={level + 1}
                    isHavingContent={child?.items?.length > 0}
                    collapsible={child?.collapsible ?? collapsible}
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
                    openRowId={openRowId}
                    setOpenRowId={setOpenRowId}
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
                      ${styles?.emptyItemSlateStyle}
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
                      e.stopPropagation();
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
  $style?: CSSProp;
  $textColor?: string;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  display: flex;
  flex-direction: column;
  width: 100%;
  color: ${({ $textColor }) => $textColor};

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

const ActionsWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1em;

  ${({ $style }) => $style}
`;

const ActionItem = styled.div<{
  $style?: CSSProp;
  $isSelected?: boolean;
  $isActive?: boolean;
  $theme?: TreeListThemeConfig;
  $disabled?: boolean;
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
    background-color: ${({ $theme }) => $theme?.hoverBackgroundColor};
  }

  ${({ $isActive, $theme }) =>
    $isActive &&
    css`
      background-color: ${$theme?.selectedBackgroundColor};
    `};

  ${({ $isSelected, $theme }) =>
    $isSelected &&
    css`
      background-color: ${$theme?.selectedBackgroundColor};
      border-left: 3px solid ${$theme?.dividerHierarchySelectedColor};
    `};

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.6;
      user-select: none;
      cursor: not-allowed;
    `}

  ${({ $style }) => $style};
`;

const Divider = styled.div<{ $style?: CSSProp }>`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #d1d5db;
  margin-bottom: 1em;

  ${({ $style }) => $style};
`;

const GroupWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  background-color: inherit;

  &:not(:last-child) {
    padding-bottom: 8px;
  }

  ${({ $style }) => $style};
`;

const GroupTitleWrapper = styled.li<{
  $style?: CSSProp;
  $collapsible?: boolean;
}>`
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  user-select: none;
  justify-content: space-between;
  padding-right: 8px;

  ${({ $collapsible }) =>
    $collapsible &&
    css`
      cursor: pointer;
    `};

  ${({ $style }) => $style};
`;

const Title = styled.span<{
  $style?: CSSProp;
}>`
  font-weight: 500;
  padding: 2px 1rem;
  padding-left: 1.4rem;

  ${({ $style }) => $style};
`;

const ArrowIcon = styled(RiArrowRightSLine)<{
  $isHovered?: boolean;
  $isSelected?: boolean;
  $showHierarchy?: boolean;
  $level?: number;
  $style?: CSSProp;
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

  background-color:inherit;

  &[aria-expanded="true"] {
    transform: translateY(-50%) rotate(90deg);
  }

  ${({ $style }) => $style}
`;

const ItemsWrapper = styled(motion.ul)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  list-style: none;
  padding: 0;
  margin: 0;
  min-height: 0;
`;

const TreeListHierarchyVerticalLine = styled.div<{
  $level?: number;
  $isSelected?: boolean;
  $isSameLevel?: boolean;
  $style?: CSSProp;
  $theme?: TreeListThemeConfig;
}>`
  position: absolute;
  top: 0;
  width: 1px;
  z-index: 8888;
  ${({ $level, $isSelected, $isSameLevel, $theme }) => css`
    height: 100%;
    left: ${$level * 12 + 9}px;

    ${$isSelected
      ? css`
          border-left: 2px solid ${$theme?.dividerHierarchySelectedColor};
        `
      : $isSameLevel
        ? css`
            border-left: 2px solid ${$theme?.dividerHierarchyRelatedColor};
          `
        : css`
            border-left: 2px solid ${$theme?.dividerHierarchyColor};
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
  $theme?: TreeListThemeConfig;
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

  ${({ $showHierarchyLine, $isSelected, $theme }) =>
    !$showHierarchyLine &&
    css`
      border-left: 3px solid
        ${$isSelected ? $theme?.dividerHierarchySelectedColor : "transparent"};
    `};

  background-color: ${({ $isSelected, $isDropParent, $theme }) =>
    $isDropParent
      ? $theme?.hoverBackgroundColor
      : $isSelected
        ? $theme?.selectedBackgroundColor
        : $theme?.backgroundColor};

  ${({ $isHovered, $theme }) =>
    $isHovered &&
    css`
      background-color: ${$theme?.hoverBackgroundColor};
    `};

  padding: 0.25rem 1.2rem;
  padding-right: 8px;
  list-style: none;

  ${({ $level }) =>
    $level &&
    css`
      padding-left: ${$level * 12 + 8}px;
    `}

  ${({ $style }) => $style}
`;

const HighlightedText = styled.span<{
  $theme?: TreeListThemeConfig;
  $style?: CSSProp;
}>`
  border-radius: 4px;
  background-color: ${({ $theme }) => $theme?.highlightedText};

  ${({ $style }) => $style}
`;

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

TreeList.findItemById = findItemById;
TreeList.findGroupOfItem = findGroupOfItem;
TreeList.findTreeListNode = findTreeListNode;
TreeList.hasChild = hasChild;

export { TreeList };
