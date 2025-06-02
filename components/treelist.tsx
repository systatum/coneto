import { ReactNode } from "react";
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
}

function TreeList<T extends TreeListItemsProps>({
  content,
  classNameContainer,
  children,
  empty,
  searchTerm,
}: TreeListProps<T>) {
  const treeListClass = cn("flex flex-col gap-4", classNameContainer);

  return (
    <div className={treeListClass}>
      {content.length > 0 ? (
        content.map((data, index) => (
          <div key={index} className="flex flex-col gap-1">
            <h2 className="font-medium">{data.label}</h2>
            <div className="flex flex-col gap-1">
              {data.items.map((val) => (
                <TreeListItem item={val} key={val.id} searchTerm={searchTerm} />
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

  return (
    <div className="cursor-pointer" onClick={() => item.onClick(item)}>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm?.toLowerCase() ? (
          <span key={index} className="bg-gray-200 font-semibold rounded-xs">
            {part}
          </span>
        ) : (
          <span>{part}</span>
        )
      )}
    </div>
  );
}

TreeList.Item = TreeListItem;
export { TreeList };
