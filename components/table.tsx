import {
  ChangeEvent,
  Children,
  cloneElement,
  createContext,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Checkbox } from "./checkbox";
import { LoadingSpinner } from "./loading-spinner";
import { Toolbar } from "./toolbar";
import { TipMenuItemProps } from "./tip-menu";
import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiMoreFill,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import styled, { css, CSSProp } from "styled-components";
import { Searchbox } from "./searchbox";
import { Button } from "./button";

export type RowData = (string | ReactNode)[];

export interface ColumnTableProps {
  caption: string;
  sortable?: boolean;
  style?: CSSProp;
  width?: string;
}

export interface TableActionsProps {
  title?: string;
  icon?: RemixiconComponentType;
  onClick?: () => void;
  style?: CSSProp;
  subMenuList?: SubMenuListTableProps[];
  disabled?: boolean;
}

export type SubMenuListTableProps = TipMenuItemProps;

export interface TableProps {
  selectable?: boolean;
  searchable?: boolean;
  onSearchboxChange?: (
    e?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  actions?: TableActionsProps[];
  columns: ColumnTableProps[];
  onItemsSelected?: (data: string[]) => void;
  children: ReactNode;
  isLoading?: boolean;
  containerStyle?: CSSProp;
  tableRowContainerStyle?: CSSProp;
  isOpen?: boolean;
  setIsOpen?: () => void;
  subMenuList?: (columnCaption: string) => TipMenuItemProps[];
  emptySlate?: ReactNode;
  onLastRowReached?: () => void;
  showPagination?: boolean;
  onNextPageRequested?: () => void;
  onPreviousPageRequested?: () => void;
  disablePreviousPageButton?: boolean;
  disableNextPageButton?: boolean;
  pageNumberText?: string | number;
  totalSelectedItemText?: (count: number) => string;
}

export interface TableRowProps {
  content?: RowData;
  isSelected?: boolean;
  selectable?: boolean;
  handleSelect?: (data: string) => void;
  rowStyle?: CSSProp;
  rowCellStyle?: CSSProp;
  rowId?: string;
  children?: ReactNode;
  actions?: (columnCaption: string) => TipMenuItemProps[];
  onClick?: (args?: { toggleCheckbox: () => void }) => void;
}

export interface TableRowGroupProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  selectable?: boolean;
}

export interface TableRowCellProps {
  children: ReactNode;
  contentStyle?: CSSProp;
  width?: string;
  onClick?: () => void;
}

const TableColumnContext = createContext<ColumnTableProps[]>([]);
const useTableColumns = () => useContext(TableColumnContext);

function Table({
  selectable = false,
  columns,
  onItemsSelected,
  children,
  isLoading,
  containerStyle,
  tableRowContainerStyle,
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
  totalSelectedItemText,
  searchable,
  onSearchboxChange,
}: TableProps) {
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [allRowsLocal, setAllRowsLocal] = useState<string[]>([]);

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

  return (
    <TableColumnContext.Provider value={columns}>
      <Wrapper $containerStyle={containerStyle}>
        {(selectedData.length > 0 ||
          showPagination ||
          actions ||
          searchable) && (
          <HeaderActions>
            {(actions || showPagination) && (
              <ActionsWrapper>
                {showPagination && (
                  <>
                    <PaginationButton
                      disabled={disablePreviousPageButton}
                      aria-label="previous-button-pagination"
                      onClick={onPreviousPageRequested}
                    >
                      <RiArrowLeftSLine size={16} />
                    </PaginationButton>
                    <PaginationButton
                      disabled={disableNextPageButton}
                      aria-label="next-button-pagination"
                      onClick={onNextPageRequested}
                    >
                      <RiArrowRightSLine size={16} />
                    </PaginationButton>
                  </>
                )}
                {actions &&
                  actions.map((data, index) => (
                    <Button
                      key={index}
                      onClick={data.onClick}
                      tipMenu={data.subMenuList ? true : false}
                      subMenuList={data.subMenuList}
                      disabled={data.disabled}
                      buttonStyle={css`
                        display: flex;
                        flex-direction: row;
                        gap: 0.25rem;
                        align-items: center;
                        cursor: pointer;
                        padding: 0.25rem 0.5rem;
                        background-color: transparent;
                        color: #565555;
                        ${data.subMenuList
                          ? css`
                              border-top: 1px solid #e5e7eb;
                              border-left: 1px solid #e5e7eb;
                              border-bottom: 1px solid #e5e7eb;
                            `
                          : css`
                              border: 1px solid #e5e7eb;
                            `}
                        border-radius: 6px;
                        position: relative;

                        &:hover {
                          background-color: #e2e0e0;
                        }

                        &:disabled {
                          background-color: rgb(227 227 227);
                          opacity: 0.5;
                          cursor: not-allowed;
                        }
                        ${data.style}
                      `}
                      toggleStyle={
                        data.subMenuList &&
                        css`
                          display: flex;
                          flex-direction: row;
                          gap: 0.25rem;
                          align-items: center;
                          cursor: pointer;
                          color: #565555;
                          border-top: 1px solid #e5e7eb;
                          border-right: 1px solid #e5e7eb;
                          border-bottom: 1px solid #e5e7eb;
                          border-top-right-radius: 6px;
                          border-bottom-right-radius: 6px;
                          padding: 0.25rem 0.5rem;
                          background-color: transparent;
                          position: relative;

                          &:hover {
                            background-color: #e2e0e0;
                          }

                          &:disabled {
                            background-color: rgb(227 227 227);
                            opacity: 0.5;
                            cursor: not-allowed;
                          }
                          ${data.style}
                        `
                      }
                      dividerStyle={css`
                        border: 1px solid rgb(236 236 236);
                      `}
                      dropdownStyle={css`
                        position: absolute;
                        margin-top: 2px;
                        z-index: 9999;
                        width: 200px;
                      `}
                    >
                      <data.icon size={14} />
                      <span
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        {data.title}
                      </span>
                    </Button>
                  ))}
              </ActionsWrapper>
            )}
            {searchable && (
              <Searchbox
                containerStyle={css`
                  ${actions &&
                  css`
                    margin-left: 40px;
                  `}
                  ${(showPagination || selectable) &&
                  css`
                    margin-right: 40px;
                  `}
                    max-height: 33px;
                `}
                style={css`
                  background-color: transparent;
                  &:hover {
                    border-color: #61a9f9;
                    background-color: white;
                  }
                  &:focus {
                    background-color: white;
                  }
                `}
                name="search"
                onChange={(e) => {
                  if (searchable) onSearchboxChange?.(e);
                }}
              />
            )}
            {(selectable || showPagination) && (
              <PaginationInfo>
                {showPagination && (
                  <>
                    <span>
                      {typeof pageNumberText === "number"
                        ? `Pg. ${pageNumberText}`
                        : pageNumberText}
                    </span>
                    <Divider aria-label="divider" />
                  </>
                )}
                {selectable && (
                  <span>
                    {totalSelectedItemText
                      ? totalSelectedItemText(selectedData.length)
                      : `${selectedData.length} items selected`}
                  </span>
                )}
              </PaginationInfo>
            )}
          </HeaderActions>
        )}

        <TableContainer $hasSelected={selectedData.length > 0}>
          <TableHeader>
            {selectable && (
              <CheckboxWrapper>
                <Checkbox
                  containerStyle={{
                    width: 12,
                    height: 12,
                  }}
                  onChange={handleSelectAll}
                  checked={allRowSelectedLocal}
                  indeterminate={someSelectedLocal}
                />
              </CheckboxWrapper>
            )}
            {columns.map((col, i) => (
              <TableRowCell
                key={i}
                width={col.width}
                contentStyle={css`
                  display: flex;
                  position: relative;
                  align-items: center;
                  width: ${col.width};
                  ${col.width
                    ? css`
                        flex-direction: row;
                      `
                    : css`
                        flex: 1;
                      `}
                `}
              >
                {col.caption}
                {col.sortable && (
                  <Toolbar
                    style={css`
                      width: fit-content;
                      position: absolute;
                      right: 0.5rem;
                      z-index: 20;
                    `}
                  >
                    <Toolbar.Menu
                      closedIcon={RiArrowUpDownLine}
                      openedIcon={RiArrowUpDownLine}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      dropdownStyle={css`
                        min-width: 235px;
                      `}
                      triggerStyle={css`
                        color: black;
                        &:hover {
                          background-color: #d4d4d4;
                        }
                      `}
                      toggleActiveStyle={css`
                        background-color: #d4d4d4;
                      `}
                      variant="none"
                      subMenuList={subMenuList(`${col.caption}`)}
                    />
                  </Toolbar>
                )}
              </TableRowCell>
            ))}
          </TableHeader>

          {rowChildren.length > 0 ? (
            <TableRowContainer
              aria-label="table-scroll-container"
              $tableRowContainerStyle={tableRowContainerStyle}
            >
              {rowChildren}
            </TableRowContainer>
          ) : (
            <EmptyState>{emptySlate}</EmptyState>
          )}
          {isLoading && (
            <TableLoadingOverlay>
              <LoadingSpinner iconSize={24} />
            </TableLoadingOverlay>
          )}
        </TableContainer>
      </Wrapper>
    </TableColumnContext.Provider>
  );
}

const Wrapper = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: "flex";
  flex-direction: "column";
  position: "relative";
  border-radius: "4px";
  ${({ $containerStyle }) => $containerStyle}
`;

const HeaderActions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 14px;
  color: #343434;
  background: linear-gradient(to bottom, #fbf9f9, #f0f0f0);
  border-bottom: 0.5px solid #e5e7eb;
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
`;

const PaginationButton = styled.button`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  padding: 0.25rem;
  background-color: transparent;
  color: inherit;

  &:hover {
    background-color: #e2e0e0;
  }

  &:disabled {
    background-color: rgb(227 227 227);
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
  min-width: 140px;
`;

const Divider = styled.div`
  width: 3px;
  height: 100%;
  border-left: 1px solid white;
`;

const TableContainer = styled.div<{ $hasSelected: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  ${({ $hasSelected }) =>
    $hasSelected &&
    css`
      border-top: 0.5px solid #e5e7eb;
    `}
`;

const TableHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.75rem;
  background: linear-gradient(to bottom, #f0f0f0, #e4e4e4);
  align-items: center;
  font-weight: 600;
  color: #343434;
  border-bottom-width: 1px;
  border-color: #d1d5db;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const TableRowContainer = styled.div<{ $tableRowContainerStyle?: CSSProp }>`
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
  width: 100%;

  ${({ $tableRowContainerStyle }) => $tableRowContainerStyle}
`;

const EmptyState = styled.div`
  border-bottom: 1px solid #d1d5db;
  border-left: 1px solid #d1d5db;
  border-right: 1px solid #d1d5db;
`;

const TableLoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 30;
`;

const CheckboxWrapper = styled.div`
  min-width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
`;

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
    <TableRowGroupContainer>
      <TableRowGroupSticky onClick={() => setIsOpen(!isOpen)}>
        <RotatingIcon $isOpen={isOpen}>
          <RiArrowDownSLine />
        </RotatingIcon>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {title && <span>{title}</span>}
          {subtitle && (
            <span
              style={{
                fontSize: "14px",
                color: "#1f2937",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </TableRowGroupSticky>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {rowChildren}
          </motion.div>
        )}
      </AnimatePresence>
    </TableRowGroupContainer>
  );
}

const TableRowGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: visible;
`;

const TableRowGroupSticky = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: 0.75rem;
  z-index: 10;
  position: sticky;
  top: 0px;
  align-items: center;
  width: 100%;
  border: 1px solid #e5e7eb;
  gap: 1rem;
  background-color: #f3f4f6;

  will-change: transform;
  backface-visibility: hidden;
  isolation: isolate;
  transform: translateZ(0);
  contain: layout style paint;
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
`;

const RotatingIcon = styled.span<{ $isOpen?: boolean }>`
  transition: transform 300ms;
  margin-left: 2px;
  ${(props) =>
    props.$isOpen &&
    css`
      transform: rotate(-180deg);
    `}
`;

function TableRow({
  content,
  selectable = false,
  isSelected = false,
  handleSelect,
  rowStyle,
  rowCellStyle,
  rowId,
  children,
  actions,
  isLast,
  onLastRowReached,
  onClick,
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

  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <TableRowWrapper
      ref={rowRef}
      $isSelected={isSelected}
      onMouseLeave={() => setIsHovered(null)}
      onMouseEnter={() => setIsHovered(rowId)}
      onClick={() => {
        if (onClick) {
          onClick?.({
            toggleCheckbox: () => {
              if (rowId && selectable) {
                handleSelect?.(rowId);
              }
            },
          });
        }
      }}
      $rowCellStyle={css`
        ${rowStyle};
        ${onClick &&
        css`
          cursor: pointer;
        `}
      `}
    >
      {selectable && (
        <CheckboxWrapperRow
          onClick={(e) => {
            e.stopPropagation();
            if (rowId) {
              handleSelect?.(rowId);
            }
          }}
        >
          <Checkbox
            containerStyle={{
              width: 12,
              height: 12,
            }}
            {...props}
            checked={isSelected}
          />
        </CheckboxWrapperRow>
      )}
      {content
        ? content.map((col, i) => {
            const column = columns[i];
            const isLast = actions && i === childArray.length - 1;

            return (
              <TableRowCell
                key={i}
                width={column.width}
                contentStyle={
                  isLast
                    ? css`
                        padding-right: 36px;
                        ${rowCellStyle}
                      `
                    : rowCellStyle
                }
              >
                {col}
              </TableRowCell>
            );
          })
        : childArray.map((child, i) => {
            if (!isValidElement<TableRowCellProps>(child)) return child;
            const widthColumn = columns[i].width;
            const isLast = actions && i === childArray.length - 1;

            return cloneElement(child, {
              width: child.props.width ?? widthColumn,
              contentStyle: isLast
                ? css`
                    padding-right: 36px;
                    ${child.props.contentStyle};
                  `
                : child.props.contentStyle,
            });
          })}

      {isHovered === rowId && actions && (
        <Toolbar
          style={css`
            width: fit-content;
            position: absolute;
            right: 0.5rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 50;
          `}
        >
          <Toolbar.Menu
            closedIcon={RiMoreFill}
            openedIcon={RiMoreFill}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            dropdownStyle={css`
              min-width: 235px;
              z-index: 50;
            `}
            triggerStyle={css`
              color: black;
              &:hover {
                background-color: #d4d4d4;
              }
            `}
            toggleActiveStyle={css`
              background-color: #d4d4d4;
            `}
            variant="none"
            subMenuList={actions(`${rowId}`)}
          />
        </Toolbar>
      )}
    </TableRowWrapper>
  );
}

const TableRowWrapper = styled.div<{
  $isSelected?: boolean;
  $rowCellStyle?: CSSProp;
}>`
  display: flex;
  position: relative;
  padding: 0.75rem;
  align-items: stretch;
  width: 100%;
  height: 100%;
  border-left: 1px solid #e5e7eb;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  cursor: default;
  background-color: ${({ $isSelected }) =>
    $isSelected ? "#f3f4f6" : "#f9fafb"};

  &:hover {
    background-color: ${({ $isSelected }) =>
      $isSelected ? "#f3f4f6" : "#e5e7eb"};
  }

  ${({ $rowCellStyle }) => $rowCellStyle}
`;

const CheckboxWrapperRow = styled.div`
  min-width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
`;

function TableRowCell({
  children,
  contentStyle,
  width,
  onClick,
}: TableRowCellProps) {
  return (
    <CellContent
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      width={width}
      $contentStyle={css`
        ${contentStyle};
        ${onClick &&
        css`
          cursor: pointer;
        `}
      `}
    >
      {children}
    </CellContent>
  );
}

const CellContent = styled.div<{ width?: string; $contentStyle?: CSSProp }>`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  display: flex;
  align-items: center;
  ${({ width }) =>
    !width &&
    css`
      flex: 1;
      height: fit-content;
      width: "100%";
    `}

  width: ${({ width }) => width};
  min-height: inherit;
  ${({ $contentStyle }) => $contentStyle};
`;

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
