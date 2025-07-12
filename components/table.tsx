import {
  Children,
  cloneElement,
  createContext,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext,
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
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiMoreFill,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";

export type RowData = (string | ReactNode)[];

export interface ColumnTableProps {
  caption: string;
  sortable?: boolean;
  className?: string;
  width?: string;
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
  showPagination?: boolean;
  onNextPageRequested?: () => void;
  onPreviousPageRequested?: () => void;
  pageNumberText?: number;
  disablePreviousPageButton?: boolean;
  disableNextPageButton?: boolean;
  allRowIds?: string[];
}

export interface TableRowProps {
  content?: RowData;
  isSelected?: boolean;
  selectable?: boolean;
  handleSelect?: (data: string) => void;
  className?: string;
  rowId?: string;
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
  col: ReactNode;
  className?: string;
  width?: string;
}

const TableColumnContext = createContext<ColumnTableProps[]>([]);
const useTableColumns = () => useContext(TableColumnContext);

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
  showPagination,
  disableNextPageButton = false,
  disablePreviousPageButton = false,
  onNextPageRequested,
  onPreviousPageRequested,
  pageNumberText = 1,
}: TableProps) {
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [allRowsLocal, setAllRowsLocal] = useState<string[]>([]);

  const classTableRow = clsx(
    "flex flex-col overflow-auto relative w-full",
    classNameTableRow
  );

  const handleSelectAll = () => {
    const currentPageIds = getAllRowContentsFromChildren(children);

    const allPageSelected = currentPageIds.every((id) =>
      selectedData.includes(id)
    );

    if (allPageSelected) {
      const newSelected = selectedData.filter(
        (id) => !currentPageIds.includes(id)
      );
      setSelectedData(newSelected);
      onItemsSelected?.(newSelected);
    } else {
      const newSelected = Array.from(
        new Set([...selectedData, ...currentPageIds])
      );
      setSelectedData(newSelected);
      onItemsSelected?.(newSelected);
    }
  };

  const allRowSelectedLocal =
    allRowsLocal?.every((id) => selectedData.includes(id)) ?? false;
  const someSelectedLocal = selectedData.length > 0 && !allRowSelectedLocal;

  useEffect(() => {
    const currentIds = getAllRowContentsFromChildren(children);

    setAllRowsLocal((prev) => Array.from(new Set([...prev, ...currentIds])));
  }, [children]);

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
        (d) => JSON.stringify(d) === JSON.stringify(props.rowId)
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
    <TableColumnContext.Provider value={columns}>
      <div className={tableClass}>
        {(selectedData.length > 0 || showPagination || actions) && (
          <div className="w-full flex flex-row items-center justify-between py-2 text-white bg-gray-600 border-b-[0.5px] px-[14px]">
            {(actions || showPagination) && (
              <div className="flex flex-row gap-1">
                {showPagination && (
                  <Fragment>
                    <button
                      disabled={disablePreviousPageButton}
                      aria-label="previous-button-pagination"
                      onClick={() => {
                        if (onPreviousPageRequested) {
                          onPreviousPageRequested();
                        }
                      }}
                      className={cn(
                        "flex cursor-pointer gap-1 border rounded-full items-center hover:bg-[#5c626a] border-gray-500 p-1",
                        "disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
                      )}
                    >
                      <RiArrowLeftSLine size={16} />
                    </button>
                    <button
                      disabled={disableNextPageButton}
                      aria-label="next-button-pagination"
                      onClick={() => {
                        if (onNextPageRequested) {
                          onNextPageRequested();
                        }
                      }}
                      className={cn(
                        "flex cursor-pointer gap-1 border rounded-full items-center hover:bg-[#5c626a] border-gray-500 p-1",
                        "disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
                      )}
                    >
                      <RiArrowRightSLine size={16} />
                    </button>
                  </Fragment>
                )}
                {actions &&
                  actions.map((data, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (data.onClick) {
                          data.onClick();
                        }
                      }}
                      className={cn(
                        "flex flex-row cursor-pointer gap-1 border rounded-xl items-center hover:bg-[#5c626a] border-gray-500 py-1 px-2",
                        data.className
                      )}
                    >
                      <data.icon size={14} />
                      <span className="text-sm">{data.title}</span>
                    </button>
                  ))}
              </div>
            )}
            {(selectable || showPagination) && (
              <div className="flex flex-row gap-2">
                {showPagination && (
                  <div className="flex flex-row gap-2">
                    <span>Pg. {pageNumberText}</span>
                    <div
                      aria-label="divider"
                      className="w-[3px] h-full border-l border-white"
                    />
                  </div>
                )}
                {selectable && (
                  <span>{selectedData.length} items selected</span>
                )}
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex flex-col relative",
            selectedData.length > 0 ? "border-t-[0.5]" : ""
          )}
        >
          <div className="flex flex-row p-3 bg-[#0f3969] items-center font-semibold text-white">
            {selectable && (
              <div className="w-8 bg-[#0f3969] flex justify-center cursor-pointer pointer-events-auto items-center">
                <Checkbox
                  onChange={handleSelectAll}
                  checked={allRowSelectedLocal}
                  indeterminate={someSelectedLocal}
                />
              </div>
            )}
            {columns.map((col, i) => {
              return (
                <div
                  className={cn(
                    "flex relative items-center w-full",
                    col.width ? "flex-row" : "flex-1"
                  )}
                  key={i}
                  style={{
                    width: col.width,
                  }}
                >
                  <TableRowCell
                    col={col.caption}
                    width={col.width}
                    className={col.className}
                  />
                  {col.sortable && (
                    <Toolbar className="w-fit absolute right-0 justify-end z-20">
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
              );
            })}
          </div>
          {rowChildren.length > 0 ? (
            <div className={classTableRow}>{rowChildren}</div>
          ) : (
            <div className="border-b border-x border-gray-300">
              {emptySlate}
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-30">
              <LoadingSpinner iconSize={24} />
            </div>
          )}
        </div>
      </div>
    </TableColumnContext.Provider>
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
        (d) => JSON.stringify(d) === JSON.stringify(props.rowId)
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
  rowId,
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
  const columns = useTableColumns();
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
      onMouseEnter={() => setIsHovered(rowId)}
      className={tableRowClass}
    >
      {selectable && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (rowId) {
              handleSelect?.(rowId);
            }
          }}
          className="w-8 flex justify-center cursor-pointer pointer-events-auto items-center"
        >
          <Checkbox {...props} checked={isSelected} />
        </div>
      )}
      {content &&
        content.map((col, i) => {
          const column = columns[i];

          return (
            <TableRowCell
              width={column?.width}
              className={i === columns.length - 1 ? "pr-9" : ""}
              key={i}
              col={col}
            />
          );
        })}

      {isHovered === rowId && actions && (
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
            subMenuList={actions(`${rowId}`)}
          />
        </Toolbar>
      )}
      {children}
    </div>
  );
}

function TableRowCell({ col, className, width }: TableRowCellProps) {
  return (
    <div
      className={cn("px-2", width ? "flex flex-row" : "flex-1", className)}
      style={{
        width: width,
      }}
    >
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

    if (TableRowProps.type === TableRow && TableRowProps.props.rowId) {
      result.push(TableRowProps.props.rowId);
    }
  });

  return result;
}

Table.Row = TableRow;
TableRow.Group = TableRowGroup;
TableRow.Cell = TableRowCell;

export { Table };
