import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";
import Checkbox from "./checkbox";
import clsx from "clsx";

export type RowData = (string | ReactNode)[];

interface TableProps {
  selectable?: boolean;
  columns: string[];
  onItemsSelected?: (data: RowData[]) => void;
  children: ReactNode;
  isLoading?: boolean;
}

interface TableRowProps {
  content: RowData;
  isSelected?: boolean;
  selectable?: boolean;
  handleSelect?: (data: RowData) => void;
}

interface TableRowCellProps {
  col: string | ReactNode;
  className?: string;
}

function Table({
  selectable = false,
  columns,
  onItemsSelected,
  children,
  isLoading,
}: TableProps) {
  const [selectedData, setSelectedData] = useState<RowData[]>([]);

  const rowCount = Children.count(children);

  const handleSelectAll = () => {
    const allSelected = selectedData.length === rowCount;
    if (allSelected) {
      setSelectedData([]);
      onItemsSelected?.([]);
    } else {
      const newData: RowData[] = [];
      Children.forEach(children, (child) => {
        if (isValidElement<TableRowProps>(child)) {
          newData.push(child.props.content);
        }
      });
      setSelectedData(newData);
      onItemsSelected?.(newData);
    }
  };

  const handleSelect = (data: RowData) => {
    const isAlreadySelected = selectedData.some(
      (d) => JSON.stringify(d) === JSON.stringify(data)
    );
    const newData = isAlreadySelected
      ? selectedData.filter((d) => JSON.stringify(d) !== JSON.stringify(data))
      : [...selectedData, data];

    setSelectedData(newData);
    onItemsSelected?.(newData);
  };

  const allSelected = selectedData.length === rowCount;
  const someSelected = selectedData.length > 0 && !allSelected;

  const rowChildren = Children.map(children, (child) => {
    if (!isValidElement<TableRowProps>(child)) return null;
    const isSelected = selectedData.some(
      (d) => JSON.stringify(d) === JSON.stringify(child.props.content)
    );
    return cloneElement(child, {
      selectable,
      isSelected,
      handleSelect,
    });
  });

  return (
    <div className={clsx("flex flex-col relative", selectable ? "mt-10" : "")}>
      {selectedData.length > 0 && (
        <div className="absolute -top-10 z-20 w-full py-2 text-white bg-blue-500 px-6">
          {selectedData.length} items selected
        </div>
      )}
      <div className="border flex flex-col border-gray-300 relative rounded-xs">
        <div className="flex flex-row bg-gray-100 items-center font-semibold text-gray-700 p-4">
          {selectable && (
            <div className="w-8 flex justify-center cursor-pointer pointer-events-auto items-center">
              <Checkbox
                onChange={handleSelectAll}
                checked={someSelected}
                indeterminate={allSelected}
              />
            </div>
          )}
          {columns.map((col, i) => (
            <TableRowCell key={i} col={col} />
          ))}
        </div>
        <div>{rowChildren}</div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-30">
            <div className="w-6 h-6 border-4 border-gray-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

function TableRow({
  content,
  selectable = false,
  isSelected = false,
  handleSelect,
  ...props
}: TableRowProps) {
  return (
    <div
      className={`flex relative p-4 items-center border-b border-gray-200 cursor-default
          ${isSelected ? "bg-blue-100" : "hover:bg-gray-50"}`}
    >
      {selectable && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleSelect?.(content);
          }}
          className="w-8 flex justify-center cursor-pointer pointer-events-auto items-center"
        >
          <Checkbox {...props} checked={isSelected} className="text-blue-600" />
        </div>
      )}
      {content.map((col, i) => (
        <TableRowCell key={i} col={col} />
      ))}
    </div>
  );
}

function TableRowCell({ col, className }: TableRowCellProps) {
  return <div className={clsx("flex-1 px-2", className)}>{col}</div>;
}

Table.Row = TableRow;
export { Table };
