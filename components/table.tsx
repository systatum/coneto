import React, {
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
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiDraggable,
} from "@remixicon/react";
import { AnimatePresence, motion } from "framer-motion";
import styled, { css, CSSProp } from "styled-components";
import { Searchbox, SearchboxProps, SearchboxResultMenu } from "./searchbox";
import { Capsule, CapsuleProps } from "./capsule";
import ContextMenu from "./context-menu";
import { ActionButton, ActionButtonProps } from "./action-button";
import { OverlayBlocker } from "./overlay-blocker";
import { useTheme } from "./../theme/provider";
import { TableThemeConfig } from "./../theme";
import { applyClassName } from "./../constants/classname";
import { Figure } from "./figure";

export interface TableColumn {
  caption: string;
  sortable?: boolean;
  styles?: TableColumnStyle;
  width?: string;
  id: string;
}

export interface TableColumnStyle {
  labelStyle?: CSSProp;
  containerStyle?: CSSProp;
  toggleSortableStyle?: CSSProp;
  dropdownSortableStyle?: CSSProp;
}

export const TableActionType = {
  Button: "button",
  Capsule: "capsule",
} as const;

export type TableActionType =
  (typeof TableActionType)[keyof typeof TableActionType];

export interface TableAction extends ActionButtonProps {
  type?: TableActionType;
  capsuleProps?: CapsuleProps;
}

export interface TableProps {
  selectable?: boolean;
  searchable?: boolean;
  draggable?: boolean;
  selectedItems?: string[];
  onDragged?: (props: {
    id?: string;
    oldGroupId: string;
    newGroupId: string;
    oldPosition: number;
    newPosition: number;
  }) => void;
  actions?: TableAction[];
  columns: TableColumn[];
  onItemsSelected?: (items: string[]) => void;
  children: ReactNode;
  isLoading?: boolean;
  subMenuList?: (columnCaption: string) => TableSubMenuList[];
  emptySlate?: ReactNode;
  onLastRowReached?: () => void;
  showPagination?: boolean;
  onNextPageRequested?: () => void;
  onPreviousPageRequested?: () => void;
  disablePreviousPageButton?: boolean;
  disableNextPageButton?: boolean;
  labels?: TableLabels;
  sumRow?: TableSummaryRowColumn[];
  styles?: TableStyles;
  searchbox?: TableSearchbox;
  loose?: boolean;
  id?: string;
  className?: string;
}

type TableSearchbox = SearchboxProps;

export type TableSubMenuList = TipMenuItemProps;

export interface TableStyles {
  containerStyle?: CSSProp;
  tableHeaderStyle?: CSSProp;
  tableBodyStyle?: CSSProp;
  paginationWrapperStyle?: CSSProp;
  paginationNumberStyle?: CSSProp;
  totalSelectedItemTextStyle?: CSSProp;
}

export interface TableLabels {
  totalSelectedItemText?: ((count: number) => string) | null;
  pageNumberText?: string | number;
}

interface TableAlwaysShowDragIcon {
  alwaysShowDragIcon?: boolean;
}

export interface TableSummaryRowColumn {
  span?: number;
  content?: ReactNode;
  bold?: boolean;
  styles?: TableSummaryRowColumnStyles;
}

export interface TableSummaryRowColumnStyles {
  self?: CSSProp;
}

export type TableResultMenuProps = SearchboxResultMenu;

const DnDContext = createContext<{
  dragItem: {
    oldGroupId: string;
    oldPosition: number;
    newGroupId?: string;
    newPosition?: number;
    id: string;
  } | null;
  setDragItem: (props: {
    oldGroupId: string;
    oldPosition: number;
    newGroupId?: string;
    newPosition?: number;
    id: string;
  }) => void;
  onDragged?: TableProps["onDragged"];
}>({
  dragItem: null,
  setDragItem: () => {},
});

const TableColumnContext = createContext<TableColumn[]>([]);
const useTableColumns = () => useContext(TableColumnContext);

const TableLooseContext = createContext<{
  loose?: boolean;
  selectable?: boolean;
}>({
  loose: false,
  selectable: false,
});
const useTableLoose = () => useContext(TableLooseContext);

function Table({
  selectable = false,
  columns,
  onItemsSelected,
  selectedItems = [],
  children,
  isLoading,
  subMenuList,
  emptySlate,
  actions,
  onLastRowReached,
  showPagination,
  disableNextPageButton = false,
  disablePreviousPageButton = false,
  onNextPageRequested,
  onPreviousPageRequested,
  labels,
  searchable,
  draggable,
  onDragged,
  sumRow,
  styles,
  alwaysShowDragIcon = true,
  searchbox,
  loose,
  className,
  id,
}: TableProps & TableAlwaysShowDragIcon) {
  const { currentTheme } = useTheme();
  const tableTheme = currentTheme.table;

  const [dragItem, setDragItem] = useState<{
    oldGroupId: string;
    oldPosition: number;
    newGroupId?: string;
    newPosition?: number;
    id: string;
  } | null>(null);

  const [selectedData, setSelectedData] = useState<string[]>(selectedItems);
  const [allRowsLocal, setAllRowsLocal] = useState<string[]>([]);
  const [rowActions, setRowActions] = useState<TipMenuItemProps[]>([]);
  const [openRowId, setOpenRowId] = useState<string | null>("");

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
    const allRowActions = getRowActionsFromChildren(children);

    setRowActions(allRowActions);

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
  const flatChildren = resolveChildren(children);

  const rowChildren = flatChildren.map((child, index) => {
    const hasRowGroup = child.type === TableRowGroup;
    const hasRow = child.type === TableRow;

    if (hasRowGroup) {
      return cloneElement(child, {
        selectable,
        selectedData,
        handleSelect,
        draggable,
        openRowId,
        setOpenRowId,
        alwaysShowDragIcon,
      } as TableRowGroupProps &
        TableAlwaysShowDragIcon & {
          selectedData?: string[];
          handleSelect?: (data: string) => void;
          draggable?: boolean;
          isSelected?: boolean;
        });
    }

    if (hasRow) {
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
        draggable,
        openRowId,
        setOpenRowId,
        groupLength: Children?.count(children),
        index: index,
        alwaysShowDragIcon,
        onDropItem: (newPosition: number) => {
          if (dragItem) {
            const { oldGroupId, newGroupId, oldPosition, id } = dragItem;
            onDragged?.({
              oldGroupId: oldGroupId || "",
              newGroupId: newGroupId || "",
              oldPosition,
              newPosition,
              id: id,
            });

            setDragItem(null);
          }
        },
      } as TableRowProps & TableAlwaysShowDragIcon);
    }

    return null;
  });

  const tableBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tableBodyRef.current;
    if (!el || openRowId === null) return;

    const startScrollTop = el.scrollTop;

    const handleScroll = () => {
      const delta = Math.abs(el.scrollTop - startScrollTop);
      if (delta >= 100) {
        setOpenRowId(null);
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [openRowId]);

  const filteredActions = Array.isArray(actions)
    ? actions?.filter((action) => !action?.hidden)
    : [];

  const hasActions = filteredActions.length > 0;

  // Scroll sync for loose mode.
  // Header and summary don't scroll on their own — their scrollLeft is driven
  // by TableBody (the only real scroll container).

  const headerScrollRef = useRef<HTMLDivElement>(null);
  const summaryScrollRef = useRef<HTMLDivElement>(null);

  // Sync horizontal scroll: wrapper → summary
  const handleWrapperScroll = () => {
    const scrollLeft = tableBodyRef.current?.scrollLeft ?? 0;
    if (headerScrollRef.current)
      headerScrollRef.current.scrollLeft = scrollLeft;
    if (summaryScrollRef.current)
      summaryScrollRef.current.scrollLeft = scrollLeft;
  };

  // Sync horizontal scroll: summary → wrapper (if user drags summary scrollbar)
  const handleSummaryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    if (tableBodyRef.current) tableBodyRef.current.scrollLeft = scrollLeft;
    if (headerScrollRef.current)
      headerScrollRef.current.scrollLeft = scrollLeft;
    if (summaryScrollRef.current)
      summaryScrollRef.current.scrollLeft = scrollLeft;
  };

  return (
    <DnDContext.Provider value={{ dragItem, setDragItem, onDragged }}>
      <TableLooseContext.Provider value={{ loose, selectable }}>
        <TableColumnContext.Provider value={columns}>
          <Wrapper
            id={id}
            $theme={tableTheme}
            className={applyClassName("table", className)}
            $style={styles?.containerStyle}
          >
            {((selectedData.length > 0 &&
              labels?.totalSelectedItemText !== null) ||
              showPagination ||
              actions ||
              searchable) && (
              <HeaderActions $theme={tableTheme} aria-label="header-wrapper">
                {(actions || showPagination) && (
                  <ActionsWrapper>
                    {showPagination && (
                      <>
                        <PaginationButton
                          $theme={tableTheme}
                          disabled={disablePreviousPageButton}
                          aria-label="previous-button-pagination"
                          onClick={onPreviousPageRequested}
                        >
                          <RiArrowLeftSLine size={16} />
                        </PaginationButton>
                        <PaginationButton
                          $theme={tableTheme}
                          disabled={disableNextPageButton}
                          aria-label="next-button-pagination"
                          onClick={onNextPageRequested}
                        >
                          <RiArrowRightSLine size={16} />
                        </PaginationButton>
                      </>
                    )}
                    {hasActions &&
                      filteredActions.map((action, index) => {
                        const { capsuleProps, ...rest } = action;

                        if (action.type === "capsule") {
                          return (
                            <ActionCapsule key={index} {...capsuleProps} />
                          );
                        }

                        return <ActionButton key={index} {...rest} forTable />;
                      })}
                  </ActionsWrapper>
                )}
                {searchable && (
                  <Searchbox
                    autoComplete="off"
                    name="search"
                    {...searchbox}
                    styles={{
                      ...searchbox?.styles,
                      containerStyle: css`
                        ${actions &&
                        css`
                          margin-left: 40px;
                        `};
                        ${(showPagination || selectable) &&
                        css`
                          margin-right: 40px;
                        `};
                        max-height: 33px;
                        ${searchbox?.styles?.containerStyle}
                      `,
                      self: css`
                        background-color: transparent;

                        ${searchbox?.styles?.self}
                      `,
                    }}
                  />
                )}
                {(selectable || showPagination) && (
                  <PaginationInfo
                    aria-label="pagination-wrapper"
                    $style={styles?.paginationWrapperStyle}
                  >
                    {showPagination && (
                      <PaginationNumber
                        aria-label="pagination-number"
                        $style={styles?.paginationNumberStyle}
                      >
                        {typeof labels.pageNumberText === "number"
                          ? `Pg. ${labels.pageNumberText}`
                          : labels.pageNumberText}
                      </PaginationNumber>
                    )}
                    {selectable && (
                      <PaginationSelectedItem
                        aria-label="pagination-selected-item"
                        $style={styles?.totalSelectedItemTextStyle}
                      >
                        {labels?.totalSelectedItemText
                          ? labels?.totalSelectedItemText(selectedData.length)
                          : `${selectedData.length} items selected`}
                      </PaginationSelectedItem>
                    )}
                  </PaginationInfo>
                )}
              </HeaderActions>
            )}

            <TableContainer
              $theme={tableTheme}
              $loose={loose}
              $hasSelected={selectedData.length > 0}
            >
              <ScrollWrapper
                ref={headerScrollRef}
                onScroll={loose ? handleSummaryScroll : undefined}
                $loose={loose}
              >
                <TableHeader
                  $theme={tableTheme}
                  $loose={loose}
                  aria-label="table-header"
                  $style={styles?.tableHeaderStyle}
                >
                  {selectable && (
                    <CheckboxWrapper
                      $position="header"
                      $theme={tableTheme}
                      $loose={loose}
                    >
                      <Checkbox
                        styles={{
                          boxStyle: css`
                            width: 100%;
                          `,
                        }}
                        onChange={handleSelectAll}
                        checked={allRowSelectedLocal}
                        indeterminate={someSelectedLocal}
                      />
                    </CheckboxWrapper>
                  )}
                  {columns.map((col, i) => {
                    const isLast =
                      rowActions?.length > 0 && columns.length - 1 === i;

                    return (
                      <TableRowCell
                        key={i}
                        _index={i}
                        width={col.width}
                        contentStyle={css`
                          display: flex;
                          align-items: center;

                          background: ${tableTheme?.headerBackgroundColor ||
                          "linear-gradient(to bottom, #f0f0f0, #e4e4e4)"};

                          ${col.width
                            ? css`
                                width: ${col.width};
                                flex-direction: row;
                              `
                            : loose
                              ? css`
                                  flex: unset;
                                `
                              : css`
                                  flex: 1;
                                `}

                          ${col?.styles?.containerStyle}
                        `}
                      >
                        <Label
                          aria-label="table-column-label"
                          $style={col?.styles?.labelStyle}
                        >
                          {col.caption}
                        </Label>
                        {col.sortable && (
                          <Toolbar
                            styles={{
                              self: css`
                                width: fit-content;
                                z-index: 20;
                                ${isLast &&
                                css`
                                  padding-right: 14px;
                                `}
                              `,
                            }}
                          >
                            <Toolbar.Menu
                              closedIcon={RiArrowUpDownLine}
                              openedIcon={RiArrowUpDownLine}
                              styles={{
                                triggerStyle: col?.styles?.toggleSortableStyle,
                                dropdownStyle: css`
                                  min-width: 235px;

                                  ${col?.styles?.dropdownSortableStyle}
                                `,
                              }}
                              subMenuList={
                                subMenuList ? subMenuList(col.id) : undefined
                              }
                              variant="ghost"
                            />
                          </Toolbar>
                        )}
                      </TableRowCell>
                    );
                  })}
                </TableHeader>
              </ScrollWrapper>

              {rowChildren.length > 0 ? (
                <TableBody
                  ref={tableBodyRef}
                  onScroll={loose ? handleWrapperScroll : undefined}
                  $theme={tableTheme}
                  aria-label="table-body"
                  $loose={loose}
                  $style={styles?.tableBodyStyle}
                >
                  {rowChildren}
                </TableBody>
              ) : (
                <EmptyState $theme={tableTheme}>{emptySlate}</EmptyState>
              )}

              {sumRow && (
                <ScrollWrapper
                  ref={summaryScrollRef}
                  $loose={loose}
                  onScroll={loose ? handleSummaryScroll : undefined}
                >
                  <TableSummary
                    $loose={loose}
                    $theme={tableTheme}
                    $selectable={selectable}
                    aria-label="table-summary-wrapper"
                  >
                    {selectable && (
                      <CheckboxWrapper
                        aria-label="empty-checkbox"
                        $position="summary"
                        $theme={tableTheme}
                        $loose={loose}
                        $style={
                          loose &&
                          css`
                            width: 36px;
                            height: 49px;
                          `
                        }
                      />
                    )}
                    {(() => {
                      const cells: ReactNode[] = [];
                      let colPointer = 0;

                      const totalCells = sumRow.reduce(
                        (acc, col) => acc + (col.span ?? 1),
                        0
                      );

                      sumRow.map((col, i) => {
                        const span = col.span ?? 1;

                        for (let s = 0; s < span; s++) {
                          const columnWidth = columns[colPointer]?.width;

                          const isLast =
                            rowActions && colPointer === totalCells - 1;

                          const isFirst = i === 0;

                          cells.push(
                            <TableRowCell
                              _index={i}
                              key={`${colPointer}-${s}`}
                              width={columnWidth}
                              bold={col.bold}
                              contentStyle={css`
                                display: flex;
                                align-items: center;
                                background: ${tableTheme?.summaryBackgroundColor ??
                                "#e4e4e4"};

                                ${columnWidth
                                  ? css`
                                      width: ${columnWidth};
                                      flex-direction: row;
                                    `
                                  : css`
                                      flex: 1;
                                    `}
                                ${isLast &&
                                css`
                                  padding-right: 36px;
                                `}

                                ${loose &&
                                css`
                                  flex: unset;

                                  ${isFirst &&
                                  css`
                                    z-index: 40;
                                  `}
                                `}
                            ${col.styles?.self}
                              `}
                            >
                              {s === 0 ? col.content : ""}
                            </TableRowCell>
                          );

                          colPointer++;
                        }
                      });

                      return cells;
                    })()}
                  </TableSummary>
                </ScrollWrapper>
              )}
            </TableContainer>

            {isLoading && (
              <OverlayBlocker
                styles={{
                  self: css`
                    display: flex;
                    align-items: start;
                    padding-left: 10px;
                    padding-top: 10px;
                  `,
                }}
                show={isLoading}
                onClick="preventDefault"
              >
                <LoadingSpinner
                  styles={{
                    containerStyle: css`
                      background-color: black;
                      border-radius: 20px;
                      opacity: 0.8;
                      color: white;
                      padding: 4px;
                      padding-right: 8px;
                    `,
                  }}
                  label="Loading"
                  gap={10}
                  iconSize={24}
                />
              </OverlayBlocker>
            )}
          </Wrapper>
        </TableColumnContext.Provider>
      </TableLooseContext.Provider>
    </DnDContext.Provider>
  );
}

const ScrollWrapper = styled.div<{ $loose?: boolean }>`
  flex-shrink: 0;
  overflow-x: ${({ $loose }) => ($loose ? "auto" : "hidden")};
  overflow-y: hidden;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

function ActionCapsule(capsule: CapsuleProps) {
  const { currentTheme } = useTheme();
  const capsuleTheme = currentTheme.actionCapsule;

  return (
    <Capsule
      {...capsule}
      activeBackgroundColor={
        capsule?.activeBackgroundColor ?? capsuleTheme.activeBackgroundColor
      }
      styles={{
        ...capsule?.styles,
        capsuleWrapperStyle: css`
          box-shadow: ${capsuleTheme.boxShadow};
          min-height: 32px;
          max-height: 32px;
          border-radius: ${capsuleTheme.borderRadius};
          font-size: ${capsuleTheme.capsuleFontSize};
          border-color: ${capsuleTheme.borderColor};
          ${capsule.styles?.containerStyle}
        `,
        bodyStyle: css`
          min-height: 0;
        `,
        tabStyle: css`
          border-radius: ${capsuleTheme.tabBorderRadius};
          color: ${capsuleTheme.tabTextColor};

          ${capsule.styles?.tabStyle}
        `,
      }}
    />
  );
}

const Wrapper = styled.div<{
  $style?: CSSProp;
  $theme?: TableThemeConfig;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: 100%;

  color: ${({ $theme }) => $theme?.textColor};

  ${({ $style }) => $style}
`;

const Label = styled.span<{ $style?: CSSProp }>`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;

  ${({ $style }) => $style}
`;

const HeaderActions = styled.div<{
  $theme?: TableThemeConfig;
}>`
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 14px;
  position: relative;
  border-bottom: 0.5px solid
    ${({ $theme }) => $theme?.headerBorderColor || "#e5e7eb"};
  color: ${({ $theme }) => $theme?.textColor || "#343434"};
  background: ${({ $theme }) =>
    $theme?.headerActionBackgroundColor ||
    "linear-gradient(to bottom, #fbf9f9, #f0f0f0)"};
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  gap: 0.25rem;
  align-items: center;
`;

const PaginationButton = styled.button<{ $theme?: TableThemeConfig }>`
  border-width: 0;

  display: flex;
  gap: 0.25rem;
  align-items: center;
  cursor: pointer;
  border-radius: 9999px;
  padding: 0.25rem;
  background-color: ${({ $theme }) =>
    $theme?.rowBackgroundColor || "transparent"};
  border-color: ${({ $theme }) => $theme?.rowBorderColor || "#e5e7eb"};
  color: ${({ $theme }) => $theme?.textColor || "inherit"};

  &:hover {
    background-color: ${({ $theme }) =>
      $theme?.rowHoverBackgroundColor || "#e2e0e0"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: end;
  align-items: center;
  min-width: 140px;

  ${({ $style }) => $style}
`;

const PaginationNumber = styled.span<{ $style?: CSSProp }>`
  ${({ $style }) => $style}
`;

const PaginationSelectedItem = styled.span<{ $style?: CSSProp }>`
  ${({ $style }) => $style}
`;

const TableContainer = styled.div<{
  $hasSelected: boolean;
  $theme?: TableThemeConfig;
  $loose?: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: ${({ $theme }) => $theme?.rowBackgroundColor};

  ${({ $hasSelected, $theme }) =>
    $hasSelected &&
    css`
      border-top: 0.5px solid ${$theme?.rowBorderColor};
    `}
`;

const TableHeader = styled.div<{
  $style?: CSSProp;
  $textColor?: string;
  $theme?: TableThemeConfig;
  $loose?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 600;
  color: ${({ $textColor }) => $textColor};
  border-bottom: 1px solid
    ${({ $theme }) => $theme?.headerBorderColor || "#d1d5db"};
  border-left: 1px solid
    ${({ $theme }) => $theme?.headerBackgroundColor || "#d1d5db"};
  border-right: 1px solid
    ${({ $theme }) => $theme?.headerBackgroundColor || "#d1d5db"};
  box-shadow: ${({ $theme }) =>
    $theme?.boxShadow || "0 1px 2px 0 rgba(0, 0, 0, 0.05)"};
  align-items: stretch;

  ${({ $loose }) =>
    $loose &&
    css`
      min-width: max-content;
    `}

  ${({ $style }) => $style}
`;

const TableBody = styled.div<{
  $style?: CSSProp;
  $theme: TableThemeConfig;
  $loose?: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ $theme }) => $theme?.backgroundColor};

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ $theme }) => $theme?.scrollbarThumbColor};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ $theme }) => $theme?.scrollbarTrackColor};
  }

  ${({ $loose, $theme }) =>
    $loose
      ? css`
          overflow: auto;

          --row-bg: ${$theme?.headerBackgroundColor ?? "#e4e4e4"};
        `
      : css`
          overflow-y: auto;
          overflow-x: hidden;
        `}

  ${({ $style }) => $style};
`;

const TableSummary = styled.div<{
  $selectable?: boolean;
  $theme?: TableThemeConfig;
  $loose: boolean;
}>`
  display: flex;
  flex-direction: row;

  align-items: center;
  border-bottom-width: 1px;
  background: ${({ $theme }) => $theme?.summaryBackgroundColor};
  color: ${({ $theme }) => $theme?.textColor};
  border-bottom: 1px solid ${({ $theme }) => $theme?.summaryBorderColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};

  ${({ $loose, $theme }) =>
    $loose &&
    css`
      min-width: max-content;
      bottom: 0;
      position: sticky;
      left: 0;
      z-index: 40;
      --row-bg: ${$theme?.summaryBackgroundColor ?? "#e4e4e4"};
    `}
`;

const EmptyState = styled.div<{ $theme?: TableThemeConfig }>`
  border-bottom: 1px solid
    ${({ $theme }) => $theme?.rowBorderColor || "#d1d5db"};
  border-left: 1px solid ${({ $theme }) => $theme?.rowBorderColor || "#d1d5db"};
  border-right: 1px solid ${({ $theme }) => $theme?.rowBorderColor || "#d1d5db"};
`;

const CheckboxWrapper = styled.div<{
  $loose: boolean;
  $theme?: TableThemeConfig;
  $position?: "header" | "content" | "summary";
  $style?: CSSProp;
}>`
  min-width: 2rem;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  padding-left: 1rem;
  background-color: inherit;
  padding-right: 2px;

  ${({ $theme, $position }) =>
    $position === "content"
      ? css`
          background-color: ${$theme?.rowContentBackgroundColor};
        `
      : $position === "summary"
        ? css`
            background: ${$theme?.summaryBackgroundColor};
          `
        : css`
            background: ${$theme?.headerBackgroundColor};
          `}

  ${({ $loose, $position }) =>
    $loose &&
    css`
      position: sticky;
      left: 0px;
      z-index: 40;

      ${$position === "header" &&
      css`
        z-index: 50;
        top: 0px;
      `}
    `}

    ${({ $style }) => $style}
`;

export interface TableRowGroupProps {
  id?: string;
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  selectable?: boolean;
  className?: string;
  styles?: TableRowGroupStyles;
}

export interface TableRowGroupStyles {
  containerStyle?: CSSProp;
  headerStyle?: CSSProp;
  bodyStyle?: CSSProp;
  chevronStyle?: CSSProp;
  textWrapperStyle?: CSSProp;
  subtitleStyle?: CSSProp;
  titleStyle?: CSSProp;
}

export interface TableRowCellProps {
  children: ReactNode;
  contentStyle?: CSSProp;
  width?: string;
  onClick?: () => void;
  className?: string;
  id?: string;
}

function TableRowGroup({
  id,
  children,
  title,
  subtitle,
  selectable = false,
  handleSelect,
  selectedData,
  isLast,
  onLastRowReached,
  draggable,
  className,
  styles,
  ...props
}: TableRowGroupProps & {
  selectedData?: string[];
  handleSelect?: (data: string) => void;
  onLastRowReached?: () => void;
  isLast?: boolean;
  draggable?: boolean;
}) {
  const { currentTheme } = useTheme();
  const tableTheme = currentTheme.table;

  const { openRowId, setOpenRowId, alwaysShowDragIcon } =
    props as TableAlwaysShowDragIcon & TableRowOpenWithId;

  const { dragItem, setDragItem, onDragged } = useContext(DnDContext);

  const rowChildren = resolveRowChildren(children).map((child, index) => {
    if (!isValidElement<TableRowProps & TableRowOpenWithId>(child)) return null;
    if (child.type === TableRow) {
      const props = child.props as TableRowProps & TableRowOpenWithId;

      const isSelected = selectedData.some(
        (d) => JSON.stringify(d) === JSON.stringify(props.rowId)
      );

      return cloneElement(child, {
        selectable,
        isSelected,
        handleSelect,
        isLast,
        onLastRowReached,
        index: index,
        groupLength: Children?.count(children),
        draggable: draggable,
        groupId: id,
        openRowId,
        setOpenRowId,
        alwaysShowDragIcon,
        onDropItem: (newPosition: number) => {
          if (dragItem) {
            const { oldGroupId, oldPosition, id: rowId } = dragItem;
            onDragged?.({
              oldGroupId,
              newGroupId: id,
              oldPosition,
              newPosition: newPosition,
              id: rowId,
            });

            setDragItem(null);
          }
        },
      } as TableRowProps &
        TableAlwaysShowDragIcon & {
          index?: number;
          onDropItem?: (position: number) => void;
          groupLength?: number;
          draggable?: boolean;
        });
    }
  });

  const [isOpen, setIsOpen] = useState(true);

  return (
    <TableRowGroupContainer
      id={id}
      className={applyClassName("table-row-group", className)}
      $style={styles?.containerStyle}
    >
      <TableRowGroupHeader
        $theme={tableTheme}
        aria-label="table-row-group-header"
        onClick={() => setIsOpen(!isOpen)}
        $style={styles?.headerStyle}
      >
        <Figure
          styles={{
            self: css`
              transition: transform 300ms;
              margin-left: 6px;
              ${isOpen &&
              css`
                transform: rotate(-180deg);
              `};
              ${styles?.chevronStyle}
            `,
          }}
          size={20}
          aria-label="table-row-group-chevron"
          image={RiArrowDownSLine}
        />

        <TableRowGroupTextWrapper
          aria-label="table-row-group-text-wrapper"
          $style={styles?.textWrapperStyle}
        >
          {title && (
            <TableRowGroupTitle
              aria-label="table-row-group-title"
              $style={styles?.titleStyle}
            >
              {title}
            </TableRowGroupTitle>
          )}
          {subtitle && (
            <TableRowGroupSubtitle
              aria-label="table-row-group-subtitle"
              $style={styles?.subtitleStyle}
              $color={tableTheme?.rowGroupSubtitleTextColor}
            >
              {subtitle}
            </TableRowGroupSubtitle>
          )}
        </TableRowGroupTextWrapper>
      </TableRowGroupHeader>

      <AnimatePresence initial={false}>
        {isOpen && (
          <TableRowGroupBody
            aria-label="table-row-group-body"
            $style={styles?.bodyStyle}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {rowChildren}
          </TableRowGroupBody>
        )}
      </AnimatePresence>
    </TableRowGroupContainer>
  );
}

const TableRowGroupTextWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  ${({ $style }) => $style}
`;

const TableRowGroupTitle = styled.span<{ $style?: CSSProp }>`
  ${({ $style }) => $style}
`;

const TableRowGroupSubtitle = styled.span<{
  $color?: string;
  $style?: CSSProp;
}>`
  font-size: 14px;
  color: ${({ $color }) => $color || "#1f2937"};
  ${({ $style }) => $style}
`;

const TableRowGroupContainer = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: visible;
  ${({ $style }) => $style}
`;

const TableRowGroupBody = styled(motion.div)<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;

  ${({ $style }) => $style};
`;

const TableRowGroupHeader = styled.div<{
  $theme?: TableThemeConfig;
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  padding: 0.75rem;
  z-index: 10;
  position: sticky;
  top: 0px;
  align-items: center;
  width: 100%;
  gap: 1rem;
  border: 1px solid ${({ $theme }) => $theme.rowBorderColor};
  background-color: ${({ $theme }) =>
    $theme.rowGroupBackgroundColor || "#f3f4f6"};
  color: ${({ $theme }) => $theme.textColor || "#111827"};

  will-change: transform;
  backface-visibility: hidden;
  isolation: isolate;
  transform: translateZ(0);
  contain: layout style paint;
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;

  ${({ $style }) => $style}
`;

export type TableRowAction = TipMenuItemProps;

export type TableRowContent = (string | ReactNode)[];

export interface TableRowProps {
  content?: TableRowContent;
  selectable?: boolean;
  handleSelect?: (data: string) => void;
  rowId?: string;
  children?: ReactNode;
  actions?: (columnCaption: string) => TableRowAction[];
  onClick?: (args?: {
    toggleCheckbox: () => void;
    isFirstClick?: boolean;
    open?: (content: ReactNode) => void;
    close?: () => void;
  }) => void;
  groupId?: string;
  styles?: TableRowStyles;
  id?: string;
  className?: string;
}

export interface TableRowStyles {
  containerStyle?: CSSProp;
  contentStyle?: CSSProp;
  rowStyle?: CSSProp;
  rowCellStyle?: CSSProp;
}

interface TableRowOpenWithId {
  openRowId?: string | null;
  setOpenRowId?: (prop: string | null) => void;
}

function TableRow({
  content,
  selectable = false,
  handleSelect,
  styles,
  rowId,
  children,
  actions,
  onLastRowReached,
  onClick,
  groupLength,
  groupId = "default",
  onDropItem,
  draggable,
  className,
  id,
  ...props
}: TableRowProps &
  Partial<{
    onLastRowReached?: () => void;
    onDropItem?: (position: number) => void;
    groupLength?: number;
    draggable?: boolean;
  }>) {
  const { currentTheme } = useTheme();
  const tableTheme = currentTheme.table;

  const { setDragItem, dragItem } = useContext(DnDContext);
  const {
    openRowId,
    setOpenRowId,
    alwaysShowDragIcon,
    isSelected = false,
    isLast,
    index,
  } = props as TableRowOpenWithId &
    TableAlwaysShowDragIcon & {
      index?: number;
      isSelected?: boolean;
      isLast?: boolean;
    };

  const { loose } = useTableLoose();

  const [isOver, setIsOver] = useState(false);
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | null>(
    null
  );

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

  const [isHovered, setIsHovered] = useState<null | string>(null);
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true);
  const [rowContent, setRowContent] = useState<ReactNode | null>(null);

  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <RowWrapper $style={styles?.containerStyle}>
      <TableRowWrapper
        ref={rowRef}
        id={id}
        $loose={loose}
        className={applyClassName("table-row", className)}
        $theme={tableTheme}
        $isHovered={isHovered === rowId || openRowId === rowId || !!rowContent}
        $isSelected={isSelected}
        aria-label="table-row"
        onMouseLeave={() => setIsHovered(null)}
        onMouseEnter={() => setIsHovered(rowId)}
        onClick={async () => {
          if (onClick) {
            await onClick?.({
              toggleCheckbox: () => {
                if (rowId && selectable) {
                  handleSelect?.(rowId);
                }
              },
              close: async () => {
                await setIsFirstClick((prev) => !prev);
                await setRowContent(null);
              },
              open: async (content) => {
                await setIsFirstClick((prev) => !prev);
                await setRowContent(content);
              },
              isFirstClick,
            });
          }
        }}
        $rowCellStyle={css`
          ${styles?.rowStyle};
          ${onClick &&
          css`
            cursor: pointer;
          `}
        `}
        draggable={draggable}
        onDragStart={() =>
          setDragItem({
            oldGroupId: groupId!,
            oldPosition: index,
            id: rowId ?? "",
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

          if (dragItem) {
            setDragItem({
              ...dragItem,
              id: rowId,
              newGroupId: groupId || "default",
            });
          }

          onDropItem?.(clampedPosition);
        }}
      >
        {selectable && (
          <CheckboxWrapper
            $position="content"
            $theme={tableTheme}
            $loose={loose}
            onClick={(e) => {
              e.stopPropagation();
              if (rowId) {
                handleSelect?.(rowId);
              }
            }}
          >
            <Checkbox
              name={rowId}
              value={isSelected ? "true" : "false"}
              styles={{
                boxStyle: css`
                  width: 100%;
                `,
              }}
              checked={isSelected}
            />
          </CheckboxWrapper>
        )}
        {content
          ? content.map((col, i) => {
              const column = columns[i];
              const isLast = actions && i === childArray.length - 1;

              return (
                <TableRowCell
                  key={i}
                  _index={i}
                  width={column?.width}
                  contentStyle={
                    isLast
                      ? css`
                          padding-right: 36px;
                          ${styles?.rowCellStyle}
                        `
                      : styles?.rowCellStyle
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

              const isTableRowCell = child.type === Table.Row.Cell;

              return cloneElement(child, {
                ...(isTableRowCell
                  ? {
                      width: child.props.width ?? widthColumn,
                      contentStyle: isLast
                        ? css`
                            padding-right: 36px;
                            ${child.props.contentStyle};
                          `
                        : child.props.contentStyle,
                    }
                  : {}),
              });
            })}

        {isOver && dropPosition && <DragLine position={dropPosition} />}

        {actions &&
          (() => {
            const listActions = actions(`${rowId}`);
            const actionsWithIcons = listActions
              ?.filter((action): action is TableRowAction => Boolean(action))
              .map((action) => ({
                ...action,
                icon: {
                  ...action.icon,
                  image: action.icon?.image ?? RiArrowRightSLine,
                },
                onClick: (e?: React.MouseEvent) => {
                  e?.stopPropagation();
                  action.onClick?.(e);
                  if (listActions.length > 1) {
                    setIsHovered(null);
                  }
                },
              }));

            return (
              <ContextMenu
                onOpen={(prop: boolean) => {
                  if (prop) {
                    setOpenRowId(rowId);
                  } else {
                    setOpenRowId(null);
                  }
                }}
                open={openRowId === rowId}
                styles={{
                  containerStyle: css`
                    width: fit-content;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 8;
                    display: none;

                    ${(isHovered === rowId
                      ? isHovered === rowId
                      : openRowId === rowId) &&
                    css`
                      display: inherit;
                    `}

                    ${draggable
                      ? css`
                          right: 2.4rem;
                        `
                      : css`
                          right: 0.5rem;
                        `}
                  `,
                }}
                focusBackgroundColor={
                  tableTheme?.toggleRowBackgroundColor || "#d4d4d4"
                }
                hoverBackgroundColor={
                  tableTheme?.toggleRowBackgroundColor || "#d4d4d4"
                }
                activeBackgroundColor={
                  tableTheme?.toggleRowBackgroundColor || "#d4d4d4"
                }
                actions={actionsWithIcons}
              />
            );
          })()}

        {draggable && (
          <DraggableRequest
            $isHovered={isHovered === rowId}
            $alwaysShowDragIcon={alwaysShowDragIcon}
            aria-label="draggable-request"
          >
            <RiDraggable size={18} />
          </DraggableRequest>
        )}
      </TableRowWrapper>
      <AnimatePresence initial={false}>
        {rowContent && (
          <TableRowContent
            $theme={tableTheme}
            initial="collapsed"
            animate="open"
            exit="collapsed"
            aria-label="table-row-content"
            variants={EXPAND_COLLAPSE_VARIANTS}
            transition={EXPAND_COLLAPSE_TRANSITION}
            $style={styles?.contentStyle}
          >
            {rowContent}
          </TableRowContent>
        )}
      </AnimatePresence>
    </RowWrapper>
  );
}

const EXPAND_COLLAPSE_VARIANTS = {
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.3, ease: "easeInOut" },
      opacity: { duration: 0.8 },
    },
  },
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.25, ease: "easeInOut" },
      opacity: { duration: 0.15 },
    },
  },
} as const;

const EXPAND_COLLAPSE_TRANSITION = {
  duration: 0.3,
  ease: "easeInOut",
} as const;

const RowWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  position: relative;

  ${({ $style }) => $style}
`;

const TableRowWrapper = styled.div<{
  $isSelected?: boolean;
  $rowCellStyle?: CSSProp;
  $isHovered?: boolean;
  $theme?: TableThemeConfig;
  $loose: boolean;
}>`
  display: flex;
  position: relative;
  align-items: stretch;

  border-left: 1px solid ${({ $theme }) => $theme?.rowBorderColor || "#e5e7eb"};
  border-right: 1px solid ${({ $theme }) => $theme?.rowBorderColor || "#e5e7eb"};
  border-bottom: 1px solid
    ${({ $theme }) => $theme?.rowBorderColor || "#e5e7eb"};
  cursor: default;

  ${({ $isHovered, $isSelected, $theme }) =>
    $isHovered
      ? css`
          background-color: ${$theme?.rowHoverBackgroundColor || "#e7f2fc"};
        `
      : $isSelected
        ? css`
            background-color: ${$theme?.rowSelectedBackgroundColor ||
            "#dbeafe"};
          `
        : css`
            background-color: ${$theme?.rowBackgroundColor || "white"};
          `}

  ${({ $loose, $isHovered, $isSelected, $theme }) => css`
    ${$loose &&
    css`
      min-width: max-content;
    `};

    --row-bg: ${$isHovered
      ? ($theme?.rowHoverBackgroundColor ?? "#e7f2fc")
      : $isSelected
        ? ($theme?.rowSelectedBackgroundColor ?? "#dbeafe")
        : ($theme?.rowBackgroundColor ?? "#ffffff")};
  `}

  ${({ $rowCellStyle }) => $rowCellStyle}
`;

const TableRowContent = styled(motion.div)<{
  $style?: CSSProp;
  $theme?: TableThemeConfig;
}>`
  display: flex;
  position: relative;
  box-shadow: ${({ $theme }) =>
    $theme?.rowContentBoxShadow || "0 4px 5px rgba(0, 0, 0, 0.15)"};
  background: ${({ $theme }) =>
    $theme?.rowContentBackgroundColor ||
    "linear-gradient(to bottom, #ececec 0%, #f6f6f6 35%, #f0f0f0 100%)"};
  border: 0;

  --row-bg: ${({ $theme }) =>
    $theme?.rowContentBackgroundColor ||
    "linear-gradient(to bottom, #ececec 0%, #f6f6f6 35%, #f0f0f0 100%)"};

  ${({ $style }) => $style}
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

const DraggableRequest = styled.div<{
  $isHovered: boolean;
  $alwaysShowDragIcon?: boolean;
}>`
  cursor: grab;
  border-radius: 2px;
  color: #4b5563;
  width: fit-content;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 8;
  right: 1rem;
  opacity: 0;

  ${({ $isHovered }) =>
    $isHovered &&
    css`
      opacity: 1;
    `}

  ${({ $alwaysShowDragIcon }) =>
    $alwaysShowDragIcon &&
    css`
      opacity: 1;
    `}
`;

function TableRowCell({
  children,
  contentStyle,
  width,
  onClick,
  bold,
  id,
  className,
  _index,
}: TableRowCellProps &
  Partial<{
    bold?: boolean;
    _index?: number;
  }>) {
  const { loose, selectable } = useTableLoose();
  const isFirst = _index === 0;
  const { currentTheme } = useTheme();
  const tableTheme = currentTheme?.table;

  return (
    <CellContent
      $theme={tableTheme}
      id={id}
      $loose={loose}
      $selectable={selectable}
      $sticky={isFirst}
      className={applyClassName("table-row-cell", className)}
      aria-label="table-row-cell"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      $width={width}
      $bold={bold}
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

const CellContent = styled.div<{
  $width?: string;
  $contentStyle?: CSSProp;
  $bold?: boolean;
  $loose: boolean;
  $sticky: boolean;
  $selectable?: boolean;
  $theme: TableThemeConfig;
}>`
  *,
  ::before,
  ::after {
    border-width: 0;
  }

  padding-left: 1.2rem;
  padding-right: 1.2rem;
  padding-top: 12px;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  word-break: break-word;
  white-space: pre-wrap;
  justify-content: space-between;
  position: relative;

  ${({ $width, $loose }) =>
    $loose
      ? css`
          min-width: 160px;
          flex: unset;
          width: 160px;
        `
      : !$width
        ? css`
            flex: 1;
            height: fit-content;
            width: 100%;
          `
        : ""};

  ${({ $loose, $sticky, $selectable, $theme }) =>
    $sticky &&
    $loose &&
    css`
      position: sticky !important;
      left: ${$selectable ? "34px" : "-0.5px"};
      z-index: 40;
      background-color: var(--row-bg, #ffffff);

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: -6px;
        bottom: 0;
        width: 6px;
        background: ${$theme?.looseEffectColor};
        pointer-events: none;
      }
    `}

  width: ${({ $width }) => $width};
  min-height: inherit;
  ${({ $bold }) =>
    $bold &&
    css`
      font-weight: 600;
    `};

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

function getRowActionsFromChildren(children: ReactNode): TipMenuItemProps[] {
  const result: TipMenuItemProps[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const rowGroup = child as ReactElement<TableRowGroupProps>;
    const row = child as ReactElement<TableRowProps>;

    if (rowGroup.type === TableRowGroup) {
      const groupChildren = rowGroup.props.children as ReactNode;
      result.push(...getRowActionsFromChildren(groupChildren));
    }

    if (row.type === TableRow && row.props.actions && row.props.rowId) {
      const actionsForRow = row.props.actions(row.props.rowId);
      const validActions = actionsForRow.filter(
        (action): action is TipMenuItemProps => Boolean(action)
      );
      result.push(...validActions);
    }
  });

  return result;
}

/**
 * Recursively resolves React children into a flat array of TableRow or TableRowGroup elements.
 *
 * This allows wrapper components (e.g. <GetRows />, <Testing />) to be passed as children
 * to <Table> and still be recognized correctly, instead of returning null.
 */
function resolveChildren(
  children: ReactNode
): ReactElement<TableRowProps | TableRowGroupProps>[] {
  const result: ReactElement<TableRowProps | TableRowGroupProps>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === TableRow || child.type === TableRowGroup) {
      result.push(child as ReactElement<TableRowProps | TableRowGroupProps>);
    } else if (typeof child.type === "function") {
      // Unwrap wrapper components recursively until we find TableRow or TableRowGroup elements
      const rendered = (child.type as Function)(child.props);
      result.push(...resolveChildren(rendered));
    }
  });

  return result;
}

function resolveRowChildren(
  children: ReactNode
): ReactElement<TableRowProps>[] {
  const result: ReactElement<TableRowProps>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (child.type === TableRow) {
      result.push(child as ReactElement<TableRowProps>);
    } else if (typeof child.type === "function") {
      // Unwrap wrapper components recursively until we find TableRow elements
      const rendered = (child.type as Function)(child.props);
      result.push(...resolveRowChildren(rendered));
    }
  });

  return result;
}

Table.Row = TableRow;
TableRow.Group = TableRowGroup;
TableRow.Cell = TableRowCell;

export { Table };
