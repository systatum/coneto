import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiDraggable,
  RiFile2Fill,
} from "@remixicon/react";
import {
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
import styled, { CSSProp } from "styled-components";

export interface ListProps {
  searchable?: boolean;
  onSearchRequested?: (search: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  containerStyle?: CSSProp;

  isLoading?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  onDragged?: (props: {
    id: number;
    oldGroupId: string;
    newGroupId: string;
    oldPosition: number;
    newPosition: number;
  }) => void;
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
  rightSideContent?: ReactNode[];
  openerStyle?: "chevron" | "togglebox" | "none";
}

export interface ListItemProps {
  id?: number;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  iconUrl?: RemixiconComponentType;
  draggable?: boolean;
  groupId?: string;
  selectable?: boolean;
  onSelected?: (selected: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  rightSideContent?: ReactNode[];
  containerStyle?: CSSProp;
  selectedOptions?: {
    value?: string | number;
    checked?: boolean;
  };
}

const DnDContext = createContext<{
  dragItem: {
    id: number;
    item: ListItemProps;
    oldGroupId: string;
    oldPosition: number;
  } | null;
  setDragItem: (props: {
    id: number | string;
    oldGroupId: string;
    oldPosition: number;
    item: {
      id: number;
      title: string;
      subtitle: string;
      imageUrl?: string;
      iconUrl?: RemixiconComponentType;
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
  contentStyle,
  draggable,
  selectable,
  subtitle,
  rightSideContent,
  openerStyle = "chevron",
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <HeaderText>{title}</HeaderText>
          {subtitle && <HeaderSubtext>{subtitle}</HeaderSubtext>}
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
          {rightSideContent &&
            rightSideContent.map((data, index) => (
              <Fragment key={index}>{data}</Fragment>
            ))}
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
              if (dragItem) {
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
            isOpen && (
              <ListGroupContent
                key={`list-group-content-${index}`}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                $contentStyle={contentStyle}
              >
                {modifiedChild}
              </ListGroupContent>
            )
          );
        })}

        {childArray.length === 0 && (
          <EmptyContent
            key="drop-here"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (dragItem) {
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
  overflow: hidden;
  ${({ $contentStyle }) => $contentStyle}
`;

const HeaderButton = styled.button`
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
  iconUrl: Icon = RiFile2Fill,
  imageUrl,
  subtitle,
  title,
  containerStyle,
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
}: ListItemProps & {
  index?: number;
  onDropItem?: (position: number) => void;
  groupLength?: number;
}) {
  const { setDragItem, dragItem } = useContext(DnDContext);
  const [isOver, setIsOver] = useState(false);
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(
    null
  );

  return (
    <ListItemWrapper
      $containerStyle={containerStyle}
      onClick={onClick}
      draggable={draggable}
      onDragStart={() =>
        setDragItem({
          id: index,
          oldGroupId: groupId!,
          oldPosition: index,
          item: {
            id: index,
            title,
            subtitle,
            ...(imageUrl ? { imageUrl } : { iconUrl: Icon }),
          },
        })
      }
      onDragOver={(e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;
        const half = rect.height / 2;

        if (offsetY < half) {
          setDropPosition("top");
        } else {
          setDropPosition("bottom");
        }

        setIsOver(true);
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
            onChange={onSelected}
          />
        )}
        {imageUrl ? (
          <ImageStyle src={imageUrl} alt="Image from coneto, Systatum." />
        ) : (
          <Icon size={22} color="#4b5563" />
        )}
        <TextWrapper>
          {title && <Title>{title}</Title>}
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TextWrapper>
      </ListItemLeft>

      <ListItemRight>
        {rightSideContent &&
          rightSideContent.map((content, id) => <div key={id}>{content}</div>)}
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
    </ListItemWrapper>
  );
}

const ListItemWrapper = styled.div<{
  $containerStyle?: CSSProp;
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

  &:hover {
    background-color: #dbeafe;
  }

  ${({ $containerStyle }) => $containerStyle}
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

const Title = styled.h3`
  font-weight: 500;
  font-size: 0.875rem;
  color: #1f2937;
`;

const Subtitle = styled.span`
  font-size: 0.75rem;
  color: #4b5563;
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

List.Group = ListGroup;
List.Item = ListItem;
export { List };
