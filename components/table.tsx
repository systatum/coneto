import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useState,
} from "react";
import Checkbox from "./checkbox";
import { cn } from "./../lib/utils";
import LoadingSpinner from "./loading-spinner";
import clsx from "clsx";
import { Toolbar } from "./toolbar";
import { TipMenuItemProps } from "./tip-menu";
import { RiMoreFill } from "@remixicon/react";

export type RowData = (string | ReactNode)[];

interface ColumnTableProps {
  caption: string;
  sortable?: boolean;
}

interface TableProps {
  selectable?: boolean;
  columns: ColumnTableProps[];
  onItemsSelected?: (data: RowData[]) => void;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  classNameTableRow?: string;
  isOpen?: boolean;
  setIsOpen?: () => void;
  subMenuList?: (columnCaption: string) => TipMenuItemProps[];
}

interface TableRowProps {
  content: RowData;
  isSelected?: boolean;
  selectable?: boolean;
  handleSelect?: (data: RowData) => void;
  className?: string;
  index?: number;
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
  className,
  classNameTableRow,
  isOpen,
  setIsOpen,
  subMenuList,
}: TableProps) {
  const [selectedData, setSelectedData] = useState<RowData[]>([]);
  const classTableRow = clsx(
    "flex flex-col overflow-scroll w-full",
    classNameTableRow
  );

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

  const rowChildren = Children.map(children, (child, index) => {
    if (!isValidElement<TableRowProps>(child)) return null;
    const isSelected = selectedData.some(
      (d) => JSON.stringify(d) === JSON.stringify(child.props.content)
    );
    return cloneElement(child, {
      selectable,
      isSelected,
      handleSelect,
      index,
    });
  });

  const tableClass = cn("flex flex-col relative rounded-xs", className);

  return (
    <div className={tableClass}>
      {selectedData.length > 0 && (
        <div className="w-full py-2 text-white bg-gray-600 border-gray-300 border border-b-[0.5px] px-6">
          {selectedData.length} items selected
        </div>
      )}
      <div
        className={cn(
          "border flex flex-col border-gray-300 relative",
          selectedData.length > 0 ? "border-t-[0.5]" : ""
        )}
      >
        <div className="flex flex-row bg-blue-500 items-center font-semibold text-white p-3">
          {selectable && (
            <div className="w-8 flex justify-center cursor-pointer pointer-events-auto items-center">
              <Checkbox
                onChange={handleSelectAll}
                checked={allSelected}
                indeterminate={someSelected}
              />
            </div>
          )}
          {columns.map((col, i) => (
            <div
              key={i}
              className="flex flex-row w-full flex-1 justify-between items-center"
            >
              <TableRowCell col={col.caption} />
              {col.sortable && (
                <Toolbar className="w-full justify-end">
                  <Toolbar.Menu
                    closedIcon={RiMoreFill}
                    openedIcon={RiMoreFill}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    className="min-w-[235px]"
                    classNameContainer="bg-transparent"
                    variant="primary"
                    subMenuList={subMenuList(`${col.caption}`)}
                  />
                </Toolbar>
              )}
            </div>
          ))}
        </div>
        <div className={classTableRow}>{rowChildren}</div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-30">
            <LoadingSpinner iconSize={24} />
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
  className,
  index = 0,
  ...props
}: TableRowProps) {
  const tableRowClass = cn(
    "flex relative p-3 items-center border-b w-full border-gray-200 cursor-default",
    className,
    isSelected && index % 2 === 0
      ? "bg-blue-50"
      : isSelected
        ? "bg-blue-100"
        : index % 2 === 0
          ? "bg-white hover:bg-[rgb(217,231,251)]"
          : "bg-gray-50 hover:bg-[rgb(217,231,251)]"
  );

  return (
    <div className={tableRowClass}>
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
  return <div className={cn("px-2 flex-1", className)}>{col}</div>;
}

Table.RowCell = TableRowCell;
Table.Row = TableRow;
export { Table };
