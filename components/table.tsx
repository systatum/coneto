import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import Checkbox from "./checkbox";
import { cn } from "./../lib/utils";
import LoadingSpinner from "./loading-spinner";
import clsx from "clsx";
import { Toolbar } from "./toolbar";
import { TipMenuItemProps } from "./tip-menu";
import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiMoreFill,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";

export type RowData = (string | ReactNode)[];

export interface ColumnTableProps {
  caption: string;
  sortable?: boolean;
  className?: string;
}

export interface TableActionsProps {
  title?: string;
  icon?: RemixiconComponentType;
  onClick?: () => void;
  className?: string;
}

export interface TableProps {
  selectable?: boolean;
  actions?: TableActionsProps[];
  columns: ColumnTableProps[];
  onItemsSelected?: (data: string[]) => void;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  classNameTableRow?: string;
  isOpen?: boolean;
  setIsOpen?: () => void;
  subMenuList?: (columnCaption: string) => TipMenuItemProps[];
  emptySlate?: ReactNode;
  onLastRowReached?: () => void;
}

export interface TableRowProps {
  content?: RowData;
  isSelected?: boolean;
  selectable?: boolean;
  handleSelect?: (data: string) => void;
  className?: string;
  dataId?: string;
  children?: ReactNode;
  actions?: (columnCaption: string) => TipMenuItemProps[];
}

export interface TableRowGroupProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  selectable?: boolean;
}

export interface TableRowCellProps {
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
  emptySlate,
  actions,
  onLastRowReached,
}: TableProps) {
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const classTableRow = clsx(
    "flex flex-col overflow-auto relative w-full",
    classNameTableRow
  );

  const allRow = getAllRowContentsFromChildren(children);
  const rowCount = allRow.length;

  const handleSelectAll = () => {
    const allSelected = selectedData.length === rowCount;
    if (allSelected) {
      setSelectedData([]);
      onItemsSelected?.([]);
    } else {
      const newData = getAllRowContentsFromChildren(children);
      setSelectedData(newData);
      onItemsSelected?.(newData);
    }
  };

  const handleSelect = (data: string) => {
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
    if (!isValidElement<TableRowProps | TableRowGroupProps>(child)) return null;

    if (child.type === TableRowGroup) {
      return cloneElement(child, {
        selectable,
        selectedData,
        handleSelect,
      } as TableRowGroupProps & {
        selectedData?: string[];
        handleSelect?: (data: string) => void;
      });
    }
    if (child.type === TableRow) {
      const props = child.props as TableRowProps;

      const isSelected = selectedData.some(
        (d) => JSON.stringify(d) === JSON.stringify(props.dataId)
      );

      const isLast = index === Children.count(children) - 1;

      return cloneElement(child, {
        selectable,
        isSelected,
        handleSelect,
        isLast,
        onLastRowReached,
      } as TableRowProps);
    }

    return null;
  });

  const tableClass = cn("flex flex-col relative rounded-xs", className);

  return (
    <div className={tableClass}>
      {selectedData.length > 0 && (
        <div className="w-full flex flex-row items-center justify-between py-2 text-white bg-gray-600 border-b-[0.5px] px-[14px]">
          {actions && (
            <div className="flex flex-row gap-1">
              {actions.map((data, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-row cursor-pointer gap-1 border rounded-xl items-center hover:bg-[#5c626a] border-gray-500 py-1 px-2",
                    data.className
                  )}
                >
                  <data.icon onClick={data.onClick} size={14} />
                  <span className="text-sm">{data.title}</span>
                </div>
              ))}
            </div>
          )}
          {selectable && <span>{selectedData.length} items selected</span>}
        </div>
      )}
      <div
        className={cn(
          "flex flex-col relative",
          selectedData.length > 0 ? "border-t-[0.5]" : ""
        )}
      >
        <div className="flex flex-row bg-[#0f3969] items-center font-semibold text-white p-3">
          {selectable && (
            <div className="w-8 bg-[#0f3969] flex justify-center cursor-pointer pointer-events-auto items-center">
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
              <TableRowCell col={col.caption} className={col.className} />
              {col.sortable && (
                <Toolbar className="w-full justify-end z-20">
                  <Toolbar.Menu
                    closedIcon={RiMoreFill}
                    openedIcon={RiMoreFill}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    dropdownClassName="min-w-[235px]"
                    triggerClassName="hover:bg-[#002e54]"
                    toggleActiveClassName="bg-[#002e54]"
                    variant="none"
                    subMenuList={subMenuList(`${col.caption}`)}
                  />
                </Toolbar>
              )}
            </div>
          ))}
        </div>
        {rowChildren.length > 0 ? (
          <div className={classTableRow}>{rowChildren}</div>
        ) : (
          <div className="border-b border-x border-gray-300">{emptySlate}</div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-30">
            <LoadingSpinner iconSize={24} />
          </div>
        )}
      </div>
    </div>
  );
}

function TableRowGroup({
  children,
  title,
  subtitle,
  selectable = false,
  handleSelect,
  selectedData,
  isLast,
  onLastRowReached,
}: TableRowGroupProps & {
  selectedData?: string[];
  handleSelect?: (data: string) => void;
  onLastRowReached?: () => void;
  isLast?: boolean;
}) {
  const rowChildren = Children.map(children, (child) => {
    if (!isValidElement<TableRowProps>(child)) return null;
    if (child.type === TableRow) {
      const props = child.props as TableRowProps;

      const isSelected = selectedData.some(
        (d) => JSON.stringify(d) === JSON.stringify(props.dataId)
      );

      return cloneElement(child, {
        selectable,
        isSelected,
        handleSelect,
        isLast,
        onLastRowReached,
      } as TableRowProps);
    }
  });

  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col relative w-full h-full">
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex flex-row cursor-pointer px-3 p-3 z-10 sticky items-center w-full border-x border-gray-200 bg-gray-100 border-y gap-4 top-0"
      >
        <span
          className={cn("transition-transform duration-300 ml-[2px]", {
            "-rotate-180": isOpen,
          })}
        >
          <RiArrowDownSLine />
        </span>
        <div className="flex flex-col">
          {title && <span className="">{title}</span>}
          {subtitle && (
            <span className="text-sm text-gray-800">{subtitle}</span>
          )}
        </div>
        <div></div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="flex flex-col overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {rowChildren}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TableRow({
  content,
  selectable = false,
  isSelected = false,
  handleSelect,
  className,
  dataId,
  children,
  actions,
  isLast,
  onLastRowReached,
  ...props
}: TableRowProps &
  Partial<{
    onLastRowReached?: () => void;
    isLast?: boolean;
  }>) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLast || !onLastRowReached) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onLastRowReached();
      }
    });

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, [isLast, onLastRowReached]);

  const [isOpen, setIsOpen] = useState<null | boolean>(true);
  const [isHovered, setIsHovered] = useState<null | string>(null);

  const tableRowClass = cn(
    "flex relative p-3 items-center border-r border-l border-b w-full border-gray-200 cursor-default",
    className,
    isSelected ? "bg-blue-50" : "bg-gray-50 hover:bg-blue-100"
  );

  return (
    <div
      ref={rowRef}
      onMouseLeave={() => setIsHovered(null)}
      onMouseEnter={() => setIsHovered(dataId)}
      className={tableRowClass}
    >
      {selectable && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (dataId) {
              handleSelect?.(dataId);
            }
          }}
          className="w-8 flex justify-center cursor-pointer pointer-events-auto items-center"
        >
          <Checkbox {...props} checked={isSelected} />
        </div>
      )}
      {content && content.map((col, i) => <TableRowCell key={i} col={col} />)}

      {isHovered === dataId && actions && (
        <Toolbar className="w-fit absolute right-2">
          <Toolbar.Menu
            closedIcon={RiMoreFill}
            openedIcon={RiMoreFill}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            dropdownClassName="min-w-[235px]"
            triggerClassName="hover:bg-blue-200 text-black"
            toggleActiveClassName="text-black bg-blue-200"
            variant="none"
            subMenuList={actions(`${dataId}`)}
          />
        </Toolbar>
      )}
      {children}
    </div>
  );
}

function TableRowCell({ col, className }: TableRowCellProps) {
  return (
    <div className={cn("px-2 flex-1", className)}>
      <div>{col}</div>
    </div>
  );
}

function getAllRowContentsFromChildren(children: ReactNode): string[] {
  const result: string[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const TableRowGroupProps = child as ReactElement<TableRowGroupProps>;
    const TableRowProps = child as ReactElement<TableRowProps>;

    if (TableRowGroupProps.type === TableRowGroup) {
      const groupChildren = TableRowGroupProps.props.children as ReactNode;
      result.push(...getAllRowContentsFromChildren(groupChildren));
    }

    if (TableRowProps.type === TableRow && TableRowProps.props.dataId) {
      result.push(TableRowProps.props.dataId);
    }
  });

  return result;
}

Table.Row = TableRow;
TableRow.Group = TableRowGroup;
TableRow.Cell = TableRowCell;

export { Table };
