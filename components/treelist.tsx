import styled, { css, CSSProp } from "styled-components";
import { ReactNode, useMemo, useState } from "react";
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
  collapsible?: boolean;
}

export interface TreeListActionsProps {
  caption?: string;
  onClick?: () => void;
  icon?: RemixiconComponentType;
  style?: CSSProp;
}

export interface TreeListItemsProps {
  id: string;
  caption: string;
  onClick?: (item?: TreeListItemsProps) => void;
  actions?: SubMenuTreeList[];
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
  emptyItemSlate = <div>Empty Content</div>,
}: TreeListProps) {
  const [isSelected, setIsSelected] = useState(selectedItem);
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(
      content.map((data) => [data.id, Boolean(data.items?.length > 0)])
    )
  );

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
                  if (data.collapsible) {
                    handleSelected(data.id);
                  }
                }}
                $collapsible={data.collapsible}
              >
                <GroupTitle>{data.caption}</GroupTitle>
                {data.collapsible && (
                  <GroupIcon aria-expanded={isOpen[data.id]} size={20} />
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
                          item={{ ...val, id: `${data.id}-${val.id}` }}
                          isSelected={isSelected}
                          onChange={handleOnChange}
                          searchTerm={searchTerm}
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

function TreeListItem<T extends TreeListItemsProps>({
  item,
  isSelected,
  onChange,
  searchTerm = "",
}: {
  item: T;
  searchTerm?: string;
  onChange?: (item?: string) => void;
  isSelected?: string;
}) {
  const [isHovered, setIsHovered] = useState<null | string>(null);

  const escapedTerm = escapeRegExp(searchTerm.trim());
  const regex = new RegExp(`(${escapedTerm})`, "gi");
  const parts = escapedTerm ? item.caption.split(regex) : [item.caption];

  return (
    <TreeListItemWrapper
      role="button"
      aria-label="tree-list-item"
      $isSelected={isSelected === item.id}
      onClick={() => {
        item.onClick(item);
        onChange(item.id);
      }}
      $style={css`
        ${isHovered === item.id &&
        css`
          background-color: #f3f4f6;
        `}
      `}
      onMouseLeave={() => setIsHovered(null)}
      onMouseEnter={() => setIsHovered(item.id)}
    >
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <HighlightedText key={index}>{part}</HighlightedText>
        ) : (
          <span
            style={{
              width: "100%",
            }}
            key={index}
          >
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
              if (list.length > 2) {
                setIsHovered(null);
              }
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
    </TreeListItemWrapper>
  );
}

const TreeListWrapper = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;

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

const GroupIcon = styled(RiArrowRightSLine)`
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  transition: transform 0.2s ease-in-out;

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

const TreeListItemWrapper = styled.li<{
  $isSelected: boolean;
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  cursor: pointer;
  justify-content: space-between;
  min-height: 36px;

  border-left: 3px solid
    ${(props) => (props.$isSelected ? "#3b82f6" : "transparent")};
  background-color: ${(props) =>
    props.$isSelected ? "#f3f4f6" : "transparent"};
  padding: 0.25rem 1.2rem;
  padding-right: 8px;
  list-style: none;

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
