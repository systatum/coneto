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
import Searchbox from "./searchbox";
import { cn } from "./../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "./loading-spinner";

export interface ListProps {
  searchable?: boolean;
  onSearchRequested?: (search: ChangeEvent<HTMLInputElement>) => void;
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  draggable?: boolean;
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
  children: ReactNode;
  draggable?: boolean;
  containerClassName?: string;
  contentClassName?: string;
}

export interface ListItemProps {
  id?: number;
  title?: string;
  subtitle?: string;
  icon?: RemixiconComponentType;
  className?: string;
  draggable?: boolean;
  groupId?: string;
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
      icon: RemixiconComponentType;
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
  className,
  onDragged,
  draggable,
  isLoading,
}: ListProps) {
  const [dragItem, setDragItem] = useState(null);
  const [value, setValue] = useState("");

  const childArray = Children.toArray(children).filter(isValidElement);
  const listClass = cn("flex flex-col gap-2", className);

  return (
    <DnDContext.Provider value={{ dragItem, setDragItem, onDragged }}>
      <div className={listClass}>
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

        {childArray.map((child, index) => {
          const componentChild = child as ReactElement<ListItemProps>;
          const modifiedChild = cloneElement(componentChild, {
            draggable: draggable,
          });

          return (
            <Fragment key={`list-${index}`}>
              {modifiedChild}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-30">
                  <LoadingSpinner iconSize={24} />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </DnDContext.Provider>
  );
}

function ListGroup({
  id,
  title,
  children,
  containerClassName,
  contentClassName,
  draggable,
}: ListGroupProps) {
  const childArray = Children.toArray(children).filter(isValidElement);
  const [isOpen, setIsOpen] = useState(true);
  const { dragItem, setDragItem, onDragged } = useContext(DnDContext);

  const listGroupContainerClass = cn(
    "flex flex-col relative",
    containerClassName
  );

  const listGroupContentClass = cn(
    "flex flex-col relative pt-[2px] overflow-hidden",
    contentClassName
  );

  return (
    <div className={listGroupContainerClass}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex items-center cursor-pointer justify-between w-full py-2"
      >
        <h2 className="text-sm font-medium select-none text-left">{title}</h2>

        <RiArrowDownSLine
          className={cn(
            "transition-transform duration-200",
            isOpen ? "rotate-0" : "-rotate-180"
          )}
          size={18}
        />
      </button>
      <div
        aria-label="divider"
        className="border-b w-full border-gray-300 h-px"
      />

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
              <motion.div
                key={`list-group-content-${index}`}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={listGroupContentClass}
              >
                {modifiedChild}
              </motion.div>
            )
          );
        })}

        {childArray.length === 0 && (
          <motion.div
            key="drop-here"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-2 mt-1 py-2 border border-dashed border-gray-300 rounded flex items-center justify-center text-sm text-gray-400"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ListItem({
  icon: Icon = RiFile2Fill,
  subtitle,
  title,
  className,
  draggable,
  index,
  onDropItem,
  groupId,
  groupLength,
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

  const listItemClass = cn(
    "flex flex-row relative py-1 px-2 hover:bg-blue-100 duration-300 items-center cursor-pointer gap-2",
    className
  );

  return (
    <div
      draggable={draggable}
      onDragStart={() =>
        setDragItem({
          id: index,
          oldGroupId: groupId!,
          oldPosition: index,
          item: { id: index, title, subtitle, icon: Icon },
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

        if (dragItem?.oldGroupId === groupId) {
          position = dropPosition === "top" ? index : index;
        } else {
          position = dropPosition === "top" ? index : index + 1;
        }

        const clampedPosition = Math.min(position, groupLength ?? 0);

        onDropItem?.(clampedPosition);
      }}
      className={listItemClass}
    >
      <Icon size={22} className="text-gray-700" />
      <div className="flex flex-col select-none ">
        {title && (
          <h3 className="font-medium text-sm text-gray-800">{title}</h3>
        )}
        {subtitle && <span className="text-xs text-gray-600">{subtitle}</span>}
      </div>
      {draggable && (
        <RiDraggable
          role="button"
          aria-label="Draggable request"
          size={18}
          className={cn(
            "absolute top-1/2 cursor-grab -translate-y-1/2 right-2 rounded-xs"
          )}
        />
      )}

      {isOver && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded" />
      )}
    </div>
  );
}

List.Group = ListGroup;
List.Item = ListItem;
export { List };
