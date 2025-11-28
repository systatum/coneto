import styled, { css, CSSProp } from "styled-components";
import { Fragment, ReactNode, useState } from "react";
import { RemixiconComponentType, RiArrowRightSLine } from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";
import { TipMenuItemProps } from "./tip-menu";
import ContextMenu from "./context-menu";
import { LoadingSpinner } from "./loading-spinner";

export interface TreeListProps {
  content: TreeListContentProps[];
  containerStyle?: CSSProp;
  children?: ReactNode;
  emptySlate?: ReactNode;
  emptyItemSlate?: ReactNode;
  searchTerm?: string;
  actions?: TreeListActionsProps[];
  selectedItem?: string;
  onChange?: (id: string) => void;
  onOpenChange?: (props?: TreeListOnOpenChangeProps) => void;
  showHierarchyLine?: boolean;
  collapsible?: boolean;
  preventDefault?: boolean;
}

interface TreeListOnOpenChangeProps {
  id?: string;
  isOpen?: boolean;
  setIsLoading?: (isLoading: boolean, caption?: string) => void;
  lastFetch?: Date;
  setLastFetch?: (date: Date) => void;
}

export interface TreeListContentProps {
  id: string;
  caption?: string;
  items?: TreeListItemsProps[];
}

export interface TreeListItemsProps {
  id: string;
  caption: string;
  onClick?: (item?: TreeListItemsProps) => void;
  actions?: SubMenuTreeList[];
  items?: TreeListItemsProps[];
  icon?: RemixiconComponentType;
  iconOnActive?: RemixiconComponentType;
  iconColor?: string;
}

export interface TreeListActionsProps {
  caption?: string;
  onClick?: () => void;
  icon?: RemixiconComponentType;
  style?: CSSProp;
}

export interface SubMenuTreeList extends Omit<TipMenuItemProps, "onClick"> {
  onClick: (id?: string) => void;
}

function TreeList({
  content,
  containerStyle,
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
  preventDefault,
}: TreeListProps) {
  const [isSelected, setIsSelected] = useState(selectedItem);

  const initialOpenMap = Object.fromEntries(
    content.map((group) => [group.id, !!group.items?.length])
  );

  for (const group of content) {
    if (group.items) {
      Object.assign(initialOpenMap, collectAllItemIds(group.items));
    }
  }

  const selectedLevel = content
    .map((group) => {
      if (group.items) return findLevelById(group.items, isSelected, 0);
      return null;
    })
    .find((level) => level !== null);

  const [isOpen, setIsOpen] = useState<Record<string, boolean>>(initialOpenMap);

  const [lastFetchGroup, setLastFetchGroup] = useState<Record<string, Date>>(
    Object.fromEntries(content.map((data) => [data.id, null]))
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
    <TreeListWrapper $containerStyle={containerStyle}>
      {actions && (
        <ActionsWrapper>
          {actions.map((data, index) => (
            <ActionItem
              key={index}
              role="button"
              tabIndex={0}
              aria-label="tree-list-action"
              onClick={() => data.onClick?.()}
              $style={data.style}
            >
              {data.icon && <data.icon size={16} />}
              <div>{data.caption}</div>
            </ActionItem>
          ))}
        </ActionsWrapper>
      )}

      {content && actions && <Divider role="separator" aria-label="divider" />}

      {content.length > 0 ? (
        content.map((data, index) => (
          <GroupWrapper key={index}>
            {data.caption && (
              <GroupTitleWrapper
                onClick={() => {
                  if (collapsible) {
                    handleSelected(data.id);
                  }
                }}
                $collapsible={collapsible}
              >
                <GroupTitle>{data.caption}</GroupTitle>
                {collapsible && (
                  <ArrowIcon
                    aria-label="arrow-icon"
                    aria-expanded={isOpen[data.id]}
                    size={20}
                  />
                )}
              </GroupTitleWrapper>
            )}

            <AnimatePresence initial={false}>
              <ItemsWrapper
                key={`items-wrapper-${index}`}
                animate={
                  isOpen[data.id]
                    ? { height: "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.2, ease: "easeInOut" }}
                $collapsed={!isOpen[data.id]}
              >
                {(() => {
                  const groupLoading = loadingByGroup[data.id];

                  return groupLoading?.isLoading ? (
                    <LoadingSpinner
                      style={css`
                        padding-left: 20px;
                        gap: 8px;
                      `}
                      label={groupLoading.caption}
                    />
                  ) : data.items?.length > 0 ? (
                    data.items.map((val) => {
                      return (
                        <TreeListItem
                          key={val.id}
                          item={{ ...val }}
                          isSelected={isSelected}
                          onChange={handleOnChange}
                          isLoading={loadingByGroup}
                          searchTerm={searchTerm}
                          showHierarchyLine={showHierarchyLine}
                          collapsible={collapsible}
                          isHavingContent={val.items?.length > 0}
                          setIsOpen={handleSelected}
                          isOpen={isOpen}
                          emptyItemSlate={emptyItemSlate}
                          selectedLevel={selectedLevel}
                          groupId={data.id}
                          selectedGroupId={selectedGroupId}
                          preventDefault={preventDefault}
                        />
                      );
                    })
                  ) : (
                    emptyItemSlate
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
  );
}

function collectAllItemIds(
  items: TreeListItemsProps[],
  acc = {} as Record<string, boolean>
) {
  for (const item of items) {
    acc[item.id] = !!item.items?.length;

    if (item.items?.length) collectAllItemIds(item.items, acc);
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
  selectedGroupId?: string;
  preventDefault?: boolean;
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
  preventDefault,
}: TreeListItemComponent<T>) {
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
    selectedGroupId === groupId;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <TreeListItemWrapper
        role="button"
        aria-label="tree-list-item"
        $isSelected={isSelected === item.id}
        $showHierarchyLine={showHierarchyLine}
        onClick={() => {
          item.onClick?.(item);
          onChange?.(item.id);
          if (!preventDefault && isHavingContent && collapsible) {
            setToggleItem(item.id);
          }
        }}
        $style={css`
          ${isHovered === item.id &&
          css`
            background-color: #f3f4f6;
          `}
          ${style}
        `}
        onMouseLeave={() => setIsHovered(null)}
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
        {parts.map((part, index) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <HighlightedText key={index}>{part}</HighlightedText>
          ) : (
            <span key={index} style={{ width: "100%" }}>
              {part}
            </span>
          )
        )}
        {item.id === isHovered &&
          item.actions &&
          (() => {
            const list = item.actions;

            const actionsWithIcons = list.map((prop) => ({
              ...prop,
              icon: prop.icon ?? RiArrowRightSLine,
              onClick: (e?: React.MouseEvent) => {
                e?.stopPropagation();
                prop.onClick?.(item.id);
                if (list.length > 2) setIsHovered(null);
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
                  maxActionsBeforeCollapsing={2}
                  iconSize={16}
                  focusBackgroundColor="#d4d4d4"
                  hoverBackgroundColor="#d4d4d4"
                  activeBackgroundColor="#d4d4d4"
                  actions={actionsWithIcons}
                  buttonStyle={css`
                    width: 20px;
                    height: 20px;
                    padding: 0;
                  `}
                />
              </div>
            );
          })()}
        {showHierarchyLine && (
          <TreeListHierarchyVerticalLine
            aria-label="vertical-line"
            $level={level}
            $isSameLevel={isSameLevel}
            $isSelected={isSelected === item.id}
          />
        )}
      </TreeListItemWrapper>

      {showHierarchyLine &&
        Array.from({ length: level }).map((_, idx) => {
          const isSameLevelLine =
            selectedLevel === idx && selectedGroupId === groupId;

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
                item.items?.map((child) => (
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
                    groupId={groupId}
                    preventDefault={preventDefault}
                  />
                ))
              ) : (
                <div
                  style={{
                    transform: `translateX(${level * 20 + 20}px)`,
                  }}
                >
                  emptyItemSlate
                </div>
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

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.25rem;
  margin-bottom: 1em;
`;

const ActionItem = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  align-items: center;
  padding: 0.25rem 0.75rem;
  padding-left: 1.4rem;
  gap: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
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
  background-color: ${(props) => (props.$isSelected ? "#f3f4f6" : "white")};
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
  width: 100%;
`;

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

TreeList.Item = TreeListItem;
export { TreeList };
