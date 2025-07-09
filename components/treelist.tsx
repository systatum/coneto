import { ReactNode, useState } from "react";
import { cn } from "./../lib/utils";
import { RemixiconComponentType } from "@remixicon/react";

interface TreeListProps<T extends TreeListItemsProps> {
  content: Array<{
    title?: string;
    items: T[];
  }>;
  containerClassName?: string;
  children?: ReactNode;
  emptySlate?: ReactNode;
  searchTerm?: string;
  actions?: TreeListActionsProps[];
}

export interface TreeListActionsProps {
  title?: string;
  onClick?: () => void;
  icon?: RemixiconComponentType;
  className?: string;
}

interface TreeListItemsProps {
  id: number;
  title: string;
  onClick: (item?: TreeListItemsProps) => void;
  setIsSelected?: (item?: string) => void;
  isSelected?: string;
}

function TreeList<T extends TreeListItemsProps>({
  content,
  containerClassName,
  children,
  emptySlate,
  searchTerm = "",
  actions,
}: TreeListProps<T>) {
  const [isSelected, setIsSelected] = useState("");

  const treeListClass = cn("flex flex-col gap-4", containerClassName);

  return (
    <div className={treeListClass}>
      {actions && (
        <div className="flex flex-col w-full gap-1">
          {actions.map((data, index) => (
            <div
              key={index}
              onClick={() => {
                if (data.onClick) {
                  data.onClick();
                }
              }}
              className={cn(
                "flex flex-row relative hover:bg-gray-100 w-full items-center cursor-pointer px-3 py-1 gap-2",
                data.className
              )}
            >
              {data.icon && (
                <span>
                  <data.icon size={16} />
                </span>
              )}
              <div>{data.title}</div>
            </div>
          ))}
        </div>
      )}
      {content && actions && (
        <div
          aria-label="divider"
          className="w-full h-px border-b border-gray-300"
        />
      )}

      {content.length > 0 ? (
        content.map((data, index) => (
          <div key={index} className="flex flex-col gap-1">
            {data.title && (
              <span className={"font-medium px-4 py-[2px]"}>{data.title}</span>
            )}
            <div className="flex flex-col">
              {data.items.map((val) => (
                <TreeListItem
                  item={{ ...val, isSelected, setIsSelected }}
                  key={val.id}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>{emptySlate}</div>
      )}

      {children}
    </div>
  );
}

function TreeListItem<T extends TreeListItemsProps>({
  item,
  searchTerm = "",
}: {
  item: T;
  searchTerm?: string;
}) {
  const regex = new RegExp(`(${searchTerm})`, "i");
  const parts = item.title.split(regex);

  const treeListItemClass = cn(
    "cursor-pointer border-l-3 border-transparent hover:bg-gray-100 py-1 px-4",
    item.isSelected === item.title
      ? "bg-gray-100 border-blue-500"
      : "border-transparent"
  );

  return (
    <div
      className={treeListItemClass}
      onClick={() => {
        item.onClick(item);
        item.setIsSelected(item.title);
      }}
    >
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm?.toLowerCase() ? (
          <span key={index} className="bg-gray-200 font-semibold rounded-xs">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </div>
  );
}

TreeList.Item = TreeListItem;
export { TreeList };
