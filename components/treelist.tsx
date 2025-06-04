import { ReactNode, useState } from "react";
import { cn } from "./../lib/utils";

interface TreeListProps<T extends TreeListItemsProps> {
  content: Array<{
    label: string;
    items: T[];
  }>;
  classNameContainer?: string;
  children?: ReactNode;
  empty?: ReactNode;
  searchTerm?: string;
}

interface TreeListItemsProps {
  id: number;
  label: string;
  onClick: (item?: TreeListItemsProps) => void;
  setIsSelected?: (item?: string) => void;
  isSelected?: string;
}

function TreeList<T extends TreeListItemsProps>({
  content,
  classNameContainer,
  children,
  empty,
  searchTerm = "",
}: TreeListProps<T>) {
  const [isSelected, setIsSelected] = useState("");

  const treeListClass = cn("flex flex-col gap-4", classNameContainer);

  return (
    <div className={treeListClass}>
      {content.length > 0 ? (
        content.map((data, index) => (
          <div key={index} className="flex flex-col gap-1">
            <h2 className={"font-medium px-4 py-[2px]"}>{data.label}</h2>
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
        <div>{empty}</div>
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
  const parts = item.label.split(regex);

  const treeListItemClass = cn(
    "cursor-pointer border-l-3 border-transparent hover:bg-gray-100 py-1 px-4",
    item.isSelected === item.label
      ? "bg-gray-100 border-blue-500"
      : "border-transparent"
  );

  return (
    <div
      className={treeListItemClass}
      onClick={() => {
        item.onClick(item);
        item.setIsSelected(item.label);
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
