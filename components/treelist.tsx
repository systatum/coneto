import styled, { css, CSSProp } from "styled-components";
import { ReactNode, useState } from "react";
import { RemixiconComponentType, RiArrowRightSLine } from "@remixicon/react";
import { motion, AnimatePresence } from "framer-motion";

export interface TreeListProps {
  content: TreeListContentProps[];
  containerStyle?: CSSProp;
  children?: ReactNode;
  emptySlate?: ReactNode;
  searchTerm?: string;
  actions?: TreeListActionsProps[];
  selectedItem?: string;
  onChange?: (id: string) => void;
}

export interface TreeListContentProps {
  caption?: string;
  items: TreeListItemsProps[];
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
}: TreeListProps) {
  const [isSelected, setIsSelected] = useState(selectedItem);
  const [isOpen, setIsOpen] = useState<Record<number, boolean>>(
    Object.fromEntries(content.map((_, i) => [i, true]))
  );

  const handleOnChange = (id: string) => {
    if (onChange) {
      onChange(id);
    }

    setIsSelected(id);
  };

  const handleSelected = (index: number) => {
    setIsOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
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
                  if (data.collapsible) handleSelected(index);
                }}
                $collapsible={data.collapsible}
              >
                <GroupTitle>{data.caption}</GroupTitle>
                {data.collapsible && (
                  <GroupIcon aria-expanded={isOpen[index]} size={20} />
                )}
              </GroupTitleWrapper>
            )}
            <AnimatePresence initial={false}>
              <ItemsWrapper
                key={`items-wrapper-${index}`}
                animate={
                  isOpen[index]
                    ? { height: "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.2, ease: "easeInOut" }}
                $collapsed={!isOpen[index]}
              >
                {data.items.map((val) => (
                  <TreeListItem
                    key={val.id}
                    item={{ ...val }}
                    isSelected={isSelected}
                    onChange={handleOnChange}
                    searchTerm={searchTerm}
                  />
                ))}
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
    >
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <HighlightedText key={index}>{part}</HighlightedText>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
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

const TreeListItemWrapper = styled.li<{ $isSelected: boolean }>`
  cursor: pointer;
  border-left: 3px solid
    ${(props) => (props.$isSelected ? "#3b82f6" : "transparent")};
  background-color: ${(props) =>
    props.$isSelected ? "#f3f4f6" : "transparent"};
  padding: 0.25rem 1.2rem;
  &:hover {
    background-color: #f3f4f6;
  }
  list-style: none;
`;

const HighlightedText = styled.span`
  background-color: #e5e7eb;
  font-weight: 600;
  border-radius: 4px;
`;

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

TreeList.Item = TreeListItem;
export { TreeList };
