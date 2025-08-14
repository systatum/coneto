import styled, { CSSProp } from "styled-components";
import { ReactNode, useState } from "react";
import { RemixiconComponentType } from "@remixicon/react";

export interface TreeListProps {
  content: TreeListContentProps[];
  containerStyle?: CSSProp;
  children?: ReactNode;
  emptySlate?: ReactNode;
  searchTerm?: string;
  actions?: TreeListActionsProps[];
}

export interface TreeListContentProps {
  title?: string;
  items: TreeListItemsProps[];
}

export interface TreeListActionsProps {
  title?: string;
  onClick?: () => void;
  icon?: RemixiconComponentType;
  style?: CSSProp;
}

export interface TreeListItemsProps {
  id: number;
  title: string;
  onClick?: (item?: TreeListItemsProps) => void;
  setIsSelected?: (item?: string) => void;
  isSelected?: string;
}

function TreeList({
  content,
  containerStyle,
  children,
  emptySlate,
  searchTerm = "",
  actions,
}: TreeListProps) {
  const [isSelected, setIsSelected] = useState("");

  return (
    <TreeListWrapper $containerStyle={containerStyle}>
      {actions && (
        <ActionsWrapper>
          {actions.map((data, index) => (
            <ActionItem
              key={index}
              role="button"
              tabIndex={0}
              aria-label={data.title}
              onClick={() => data.onClick?.()}
              $style={data.style}
            >
              {data.icon && <data.icon size={16} />}
              <div>{data.title}</div>
            </ActionItem>
          ))}
        </ActionsWrapper>
      )}

      {content && actions && <Divider role="separator" aria-label="divider" />}

      {content.length > 0 ? (
        content.map((data, index) => (
          <GroupWrapper key={index}>
            {data.title && <GroupTitle>{data.title}</GroupTitle>}
            <ItemsWrapper>
              {data.items.map((val) => (
                <TreeListItem
                  key={val.id}
                  item={{ ...val, isSelected, setIsSelected }}
                  searchTerm={searchTerm}
                />
              ))}
            </ItemsWrapper>
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
  searchTerm = "",
}: {
  item: T;
  searchTerm?: string;
}) {
  const escapedTerm = escapeRegExp(searchTerm.trim());
  const regex = new RegExp(`(${escapedTerm})`, "gi");
  const parts = escapedTerm ? item.title.split(regex) : [item.title];

  return (
    <TreeListItemWrapper
      role="button"
      aria-label="tree-list-item"
      $isSelected={item.isSelected === item.title}
      onClick={() => {
        item.onClick(item);
        item.setIsSelected?.(item.title);
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
  gap: 1rem;
  ${(props) => props.$containerStyle}
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.25rem;
`;

const ActionItem = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  align-items: center;
  padding: 0.25rem 0.75rem;
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
`;

const GroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const GroupTitle = styled.span`
  font-weight: 500;
  padding: 2px 1rem;
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TreeListItemWrapper = styled.div<{ $isSelected: boolean }>`
  cursor: pointer;
  border-left: 3px solid
    ${(props) => (props.$isSelected ? "#3b82f6" : "transparent")};
  background-color: ${(props) =>
    props.$isSelected ? "#f3f4f6" : "transparent"};
  padding: 0.25rem 1rem;
  &:hover {
    background-color: #f3f4f6;
  }
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
