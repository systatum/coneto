import React, {
  Children,
  createContext,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Checkbox } from "./checkbox";
import { LoadingSpinner } from "./loading-spinner";
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
import { Scrollbar, ScrollbarRef } from "./scrollbar";
import { Button, ButtonProps } from "./button";
import { useVirtualizer } from "@tanstack/react-virtual";

export interface TableColumn {
  caption: string;
  styles?: TableColumnStyle;
  width?: string;
  id: string;
  actions?: (id?: string) => TableColumnAction;
}

export interface TableColumnAction
  extends Omit<
    ActionButtonProps,
    "showSubMenuOn" | "caption" | "onClick" | "variant"
  > {
  title?: string;
  variant?: TableColumnVariant;
}

export type TableColumnVariant = Exclude<
  ButtonProps["variant"],
  `outline-${string}`
>;

export type TableSubMenuList = TipMenuItemProps;

export interface TableColumnStyle {
  labelStyle?: CSSProp;
  containerStyle?: CSSProp;
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
  onDragged?: TableProps["onDragged"];
}>(null);
const useTableDND = () => useContext(DnDContext);

/**
 * Keeps `active` true for at least `minDurationMs` after it first turns
 * true, so a loading indicator driven by a fast-resolving fetch doesn't
 * flash on and immediately off.
 */
function useMinVisibleDuration(active: boolean, minDurationMs: number) {
  const [visible, setVisible] = useState(active);
  const shownAtRef = useRef<number | null>(active ? Date.now() : null);

  useEffect(() => {
    if (active) {
      shownAtRef.current = Date.now();
      setVisible(true);
      return;
    }

    if (shownAtRef.current == null) {
      setVisible(false);
      return;
    }

    const remaining = minDurationMs - (Date.now() - shownAtRef.current);
    if (remaining <= 0) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => setVisible(false), remaining);
    return () => clearTimeout(timer);
  }, [active, minDurationMs]);

  return visible;
}

const TableColumnContext = createContext<TableColumn[]>([]);
const useTableColumns = () => useContext(TableColumnContext);

const TableLooseContext = createContext<{
  loose?: boolean;
  selectable?: boolean;
  withRowActions?: boolean;
  setWithRowActions?: (value: boolean) => void;
}>({
  loose: false,
  selectable: false,
  withRowActions: false,
});
const useTableLoose = () => useContext(TableLooseContext);

// Selection state, often changes, isolated from static config
const TableSelectionContext = createContext<{
  selectedData: string[];
  handleSelect: (id: string) => void;
}>({
  selectedData: [],
  handleSelect: () => {},
});
const useTableSelection = () => useContext(TableSelectionContext);

// Which row's context-menu/expanded-content is open, changes often
const TableOpenRowContext = createContext<{
  openRowId: string | null;
  setOpenRowId: (id: string | null) => void;
}>({
  openRowId: null,
  setOpenRowId: () => {},
});
const useTableOpenRow = () => useContext(TableOpenRowContext);

interface RowPosition {
  /** Index of this row among its siblings within the same group. */
  localIndex: number;
  /** Total row count in this row's group. */
  groupLength: number;
}

/*
 * Per-row metadata a row used to receive via cloneElement props;
 * centralized here so a row looks itself up instead of being cloned into.
 */
const TableRowMetaContext = createContext<{
  /** Flat, document-order row ids. Used to detect the very last row. */
  rowIds: string[];
  /** Each row's position within its own group. Used for drag-and-drop reordering. */
  rowPositions: Map<string, RowPosition>;
  onLastRowReached?: () => void;
  draggable?: boolean;
  alwaysShowDragIcon?: boolean;
}>({
  rowIds: [],
  rowPositions: new Map(),
});
const useTableRowMeta = () => useContext(TableRowMetaContext);

/*
 * Provided by a row's enclosing group so it can resolve its own groupId
 * without prop cloning. A row outside any group has no provider above it,
 * so it falls back to its own groupId prop.
 */
const TableRowGroupIdContext = createContext<string | undefined>(undefined);

function Table({
  selectable = false,
  columns,
  onItemsSelected,
  selectedItems = [],
  children,
  isLoading,
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

  const showLoadingOverlay = useMinVisibleDuration(!!isLoading, 100);

  const [selectedData, setSelectedData] = useState<string[]>(selectedItems);
  const [allRowsLocal, setAllRowsLocal] = useState<string[]>([]);
  const [rowActions, setRowActions] = useState<TipMenuItemProps[]>([]);
  const [openRowId, setOpenRowId] = useState<string | null>("");
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  const [withRowActions, setWithRowActions] = useState(false);

  /*
   * Drives the shadow effect on sticky left columns / sticky row actions as
   * the table scrolls horizontally. This used to be React state, but
   * crossing the shadow threshold (leaving either edge) flipped it and
   * re-rendered every TableRowCell across every visible + overscanned
   * row/column through TableLooseContext, which is what showed up as
   * jitter right at the scroll edges. Writing CSS custom properties
   * directly on tableContainerRef instead costs a style recalc scoped to
   * the handful of pseudo-elements that read the variable, not a re-render.
   */
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const applyScrollShadow = useCallback((isLeft: boolean, isRight: boolean) => {
    const el = tableContainerRef.current;
    if (!el) return;
    el.style.setProperty("--table-scrolled-left", isLeft ? "1" : "0");
    el.style.setProperty("--table-scrolled-right", isRight ? "1" : "0");
  }, []);

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
  /*
   * No more cloning: flatten wrapper components into real elements. Their
   * identity stays stable across selection/drag/openRow changes since
   * `children` doesn't change on those state updates.
   */
  const flatChildren = useMemo(() => resolveChildren(children), [children]);

  /** Flat, document-order row ids, replacing the `index`/`isLast` props a row used to receive via cloneElement. */
  const rowIds = useMemo(
    () => getAllRowContentsFromChildren(children),
    [children]
  );

  /** Each row's index and size within its own group, replacing the `index`/`groupLength` props a row used to receive via cloneElement. */
  const rowPositions = useMemo(
    () => getRowPositionsFromChildren(children),
    [children]
  );

  const tableBodyRef = useRef<ScrollbarRef>(null);

  const getViewport = () => tableBodyRef.current?.getViewport();

  // get scroll element for react-virtualizer
  // re-check the viewport whenever rows are rendered, since the scroll
  // element may not be available on the initial mount.
  useEffect(() => {
    setScrollElement(getViewport() ?? null);
  }, [flatChildren.length > 0]);

  useEffect(() => {
    const viewport = getViewport();
    if (!viewport || openRowId === null) return;

    const startScrollTop = viewport.scrollTop;

    const handleScroll = () => {
      const delta = Math.abs(viewport.scrollTop - startScrollTop);
      if (delta >= 100) {
        setOpenRowId(null);
      }
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [openRowId]);

  const filteredActions = Array.isArray(actions)
    ? actions?.filter((action) => !action?.hidden)
    : [];

  const hasActions = filteredActions.length > 0;

  // Scroll sync for loose mode. Header and summary don't scroll on their own,
  // their scrollLeft is driven by TableBody (the only real scroll container).
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const summaryScrollRef = useRef<HTMLDivElement>(null);

  // Normalizes access across the three scroll containers: body is wrapped
  // in Scrollbar (needs getViewport()), header/summary are plain divs.
  const scrollTargets = useRef([
    {
      key: "body" as const,
      getEl: () => tableBodyRef.current?.getViewport() ?? null,
    },
    { key: "header" as const, getEl: () => headerScrollRef.current },
    { key: "summary" as const, getEl: () => summaryScrollRef.current },
  ]).current;

  /*
   * Guards against the echo below: assigning `el.scrollLeft` on header/summary
   * queues a native "scroll" event on them, which re-enters this function
   * during the same frame. Without this flag every real scroll tick did 3x
   * the work (3 separate scrollWidth/clientWidth reads, each forcing a sticky
   * layout recalc on `loose` tables) even though the two echoed calls always
   * find nothing left to do. That redundant thrash is what shows up as
   * horizontal-scroll jitter on wide `loose` tables.
   */
  const isSyncingScrollRef = useRef(false);

  // Any of the three can be the source. Propagates to the other two, guarded
  // by value-equality so the chain self-terminates instead of ping-ponging.
  const syncScroll = useCallback(
    (sourceKey: "body" | "header" | "summary") => {
      if (isSyncingScrollRef.current) return;

      const source = scrollTargets.find((t) => t.key === sourceKey)?.getEl();
      if (!source) return;

      const scrollLeft = source.scrollLeft;

      // Shadow indicators depend on scroll position + total scrollWidth, which
      // is the same across all three (same columns), so it's safe to compute
      // from whichever container triggered the event.
      const scrollRight = source.scrollWidth - source.clientWidth - scrollLeft;
      applyScrollShadow(scrollLeft > 5, scrollRight > 5);

      isSyncingScrollRef.current = true;
      for (const target of scrollTargets) {
        if (target.key === sourceKey) continue;
        const el = target.getEl();
        if (el && el.scrollLeft !== scrollLeft) {
          el.scrollLeft = scrollLeft;
        }
      }
      // Native "scroll" events queued by the assignments above fire before
      // the next paint, in the same batch as rAF callbacks. Releasing here
      // still lets this frame's echoes hit the early-return, while leaving
      // the guard clear in time for the next real user scroll tick.
      requestAnimationFrame(() => {
        isSyncingScrollRef.current = false;
      });
    },
    [scrollTargets, applyScrollShadow]
  );

  const handleHeaderScroll = useCallback(
    () => syncScroll("header"),
    [syncScroll]
  );
  const handleBodyScroll = useCallback(() => syncScroll("body"), [syncScroll]);
  const handleSummaryScroll = useCallback(
    () => syncScroll("summary"),
    [syncScroll]
  );

  // Re-derive the shadows whenever the body's overflow could have changed
  // (initial mount, and whenever the sticky row-actions column appears or
  // disappears and shifts how much content overflows), not just on scroll.
  useEffect(() => {
    const viewport = tableBodyRef.current?.getViewport();
    if (!viewport) return;
    const { scrollLeft, scrollWidth, clientWidth } = viewport;
    applyScrollShadow(
      scrollLeft > 5,
      scrollWidth - clientWidth - scrollLeft > 5
    );
  }, [rowActions, applyScrollShadow]);

  const rowVirtualizer = useVirtualizer({
    count: flatChildren?.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 48,
    overscan: 20,
  });

  /* Memoized so identity only changes when the underlying values change, to prevent unnecessary consumer re-renders. */
  const selectionContextValue = useMemo(
    () => ({ selectedData, handleSelect }),
    [selectedData, handleSelect]
  );

  const openRowContextValue = useMemo(
    () => ({ openRowId, setOpenRowId }),
    [openRowId]
  );

  const rowMetaContextValue = useMemo(
    () => ({
      rowIds,
      rowPositions,
      onLastRowReached,
      draggable,
      alwaysShowDragIcon,
    }),
    [rowIds, rowPositions, onLastRowReached, draggable, alwaysShowDragIcon]
  );

  const dndContextValue = useMemo(() => ({ onDragged }), [onDragged]);

  const looseContextValue = useMemo(
    () => ({ loose, selectable, withRowActions, setWithRowActions }),
    [loose, selectable, withRowActions]
  );

  return (
    <DnDContext.Provider value={dndContextValue}>
      <TableSelectionContext.Provider value={selectionContextValue}>
        <TableOpenRowContext.Provider value={openRowContextValue}>
          <TableRowMetaContext.Provider value={rowMetaContextValue}>
            <TableLooseContext.Provider value={looseContextValue}>
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
                    <HeaderActions
                      $theme={tableTheme}
                      aria-label="header-wrapper"
                    >
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
                              const { capsuleProps, type, ...rest } = action;

                              if (type === "capsule") {
                                return (
                                  <ActionCapsule
                                    key={index}
                                    {...capsuleProps}
                                  />
                                );
                              }

                              return (
                                <ActionButton key={index} {...rest} forTable />
                              );
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
                                margin-left: 34px;
                              `};
                              ${(showPagination || selectable) &&
                              css`
                                margin-right: 34px;
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
                                ? labels?.totalSelectedItemText(
                                    selectedData.length
                                  )
                                : `${selectedData.length} items selected`}
                            </PaginationSelectedItem>
                          )}
                        </PaginationInfo>
                      )}
                    </HeaderActions>
                  )}

                  <TableContainer
                    ref={tableContainerRef}
                    $theme={tableTheme}
                    $loose={loose}
                    $hasSelected={selectedData.length > 0}
                  >
                    <ScrollWrapper
                      ref={headerScrollRef}
                      onScroll={loose ? handleHeaderScroll : undefined}
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
                                controlStyle: css`
                                  height: 100%;
                                `,
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
                        <IndexedCells lastGetsPadding={!!withRowActions}>
                          {columns.map((col, i) => {
                            const columnAction =
                              typeof col.actions === "function" &&
                              col.actions(col.id);

                            const variant = columnAction?.variant ?? "ghost";
                            const finalColumnAction: ButtonProps =
                              columnAction &&
                                !columnAction.hidden && {
                                  ...columnAction,
                                  icon: {
                                    ...columnAction?.icon,
                                    image:
                                      columnAction?.icon?.image ??
                                      RiArrowUpDownLine,
                                    size: columnAction?.icon?.size ?? 20,
                                  },
                                  showSubMenuOn: "self",
                                  tipMenuSize:
                                    columnAction?.tipMenuSize ?? "md",
                                  styles: {
                                    ...columnAction?.styles,
                                    self: css`
                                      padding: 0px;
                                      height: 34px;
                                      width: 34px;
                                      border-radius: 6px;
                                      &:not(:focus-visible):not(:active):not(
                                          :hover
                                        ):not(:focus) {
                                        background-color: transparent;
                                      }
                                      ${columnAction?.styles?.self};
                                    `,
                                  },
                                  hoverBackgroundColor:
                                    variant === "ghost" &&
                                    tableTheme?.headerActionHoverBackgroundColor,
                                  variant,
                                  "aria-label": "table-column-action",
                                };

                            return (
                              <TableRowCell
                                key={i}
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
                                    : css`
                                        flex: 1;
                                      `}

                                  ${finalColumnAction &&
                                  css`
                                    padding: 4px 19.2px;
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
                                {finalColumnAction && (
                                  <Button {...finalColumnAction} />
                                )}
                              </TableRowCell>
                            );
                          })}
                        </IndexedCells>

                        {loose && withRowActions && (
                          <StickyRowActions
                            aria-label="header-row-loose-action"
                            $theme={tableTheme}
                            $loose={loose}
                          />
                        )}
                      </TableHeader>
                    </ScrollWrapper>

                    {flatChildren.length > 0 ? (
                      <Scrollbar
                        style={{ height: "100%", width: "100%" }}
                        overflowX={loose ? "scroll" : "hidden"}
                        overflowY="scroll"
                        autoHideDelay={800}
                        onScroll={loose ? handleBodyScroll : undefined}
                        ref={tableBodyRef}
                        totalSize={rowVirtualizer.getTotalSize()}
                        scrollOffset={rowVirtualizer.scrollOffset ?? 0}
                      >
                        <TableBody
                          $theme={tableTheme}
                          aria-label="table-body"
                          $loose={loose}
                          $style={styles?.tableBodyStyle}
                          // Reserve the full virtualized height so rows can be positioned correctly.
                          style={{
                            position: "relative",
                            height: `${rowVirtualizer.getTotalSize()}px`,
                          }}
                        >
                          {rowVirtualizer
                            .getVirtualItems()
                            .map((virtualRow) => {
                              return (
                                <div
                                  key={virtualRow.key}
                                  data-index={virtualRow.index}
                                  ref={rowVirtualizer.measureElement}
                                  style={{
                                    position: "absolute",
                                    // Not transform: translateY() here. A
                                    // transform on this ancestor would create
                                    // a new containing block, which breaks
                                    // TableRowGroupHeader's `position: sticky`
                                    // for grouped rows.
                                    top: virtualRow.start,
                                    left: 0,
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                  }}
                                >
                                  {flatChildren[virtualRow.index]}
                                </div>
                              );
                            })}
                        </TableBody>
                      </Scrollbar>
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
                          <IndexedCells lastGetsPadding={!!withRowActions}>
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
                                  const columnWidth =
                                    columns[colPointer]?.width;

                                  const isLast =
                                    rowActions && colPointer === totalCells - 1;

                                  const isFirst = i === 0;

                                  cells.push(
                                    <TableRowCell
                                      key={`${colPointer}-${s}`}
                                      width={columnWidth}
                                      bold={col.bold}
                                      contentStyle={css`
                                        display: flex;
                                        align-items: center;

                                        ${columnWidth
                                          ? css`
                                              width: ${columnWidth};
                                              flex-direction: row;
                                            `
                                          : css`
                                              flex: 1;
                                            `};

                                        ${isLast &&
                                        css`
                                          padding-right: 36px;
                                        `};

                                        ${loose &&
                                        css`
                                          ${isFirst &&
                                          css`
                                            z-index: 40;
                                            background: ${tableTheme?.summaryBackgroundColor ??
                                            "#e4e4e4"};
                                          `}
                                        `};

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

                            {loose && withRowActions && (
                              <StickyRowActions
                                aria-label="summary-row-loose-action"
                                $theme={tableTheme}
                                $loose={loose}
                                $position={"summary"}
                              />
                            )}
                          </IndexedCells>
                        </TableSummary>
                      </ScrollWrapper>
                    )}
                  </TableContainer>

                  {showLoadingOverlay && (
                    <OverlayBlocker
                      relative
                      styles={{
                        self: css`
                          display: flex;
                          align-items: start;
                          padding-left: 10px;
                          padding-top: 10px;
                        `,
                      }}
                      show={showLoadingOverlay}
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
          </TableRowMetaContext.Provider>
        </TableOpenRowContext.Provider>
      </TableSelectionContext.Provider>
    </DnDContext.Provider>
  );
}

const ScrollWrapper = styled.div<{ $loose?: boolean }>`
  flex-shrink: 0;
  overflow-x: ${({ $loose }) => ($loose ? "auto" : "visible")};
  overflow-y: ${({ $loose }) => ($loose ? "hidden" : "visible")};

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

const StickyRowActions = styled.div<{
  $loose?: boolean;
  $theme?: TableThemeConfig;
  $position?: "header" | "summary";
  $isFirefox?: boolean;
}>`
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  height: auto;
  width: 48px;
  transform: none;
  padding-left: 8px;
  padding-right: 8px;
  background: ${({ $theme, $position }) =>
    $position === "summary"
      ? $theme?.summaryBackgroundColor
      : $theme?.headerBackgroundColor};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -6px;
    bottom: 0;
    width: 6px;
    /* toggled via CSS var rather than a React prop, to minimize re-rendering. */
    background: ${({ $theme }) => $theme?.rightLooseEffectColor};
    opacity: var(--table-scrolled-right, 0);
    pointer-events: none;
  }
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
  font-weight: 600;
  color: ${({ $textColor }) => $textColor};
  border-bottom: 1px solid
    ${({ $theme }) => $theme?.headerBorderColor || "#d1d5db"};
  border-left: 1px solid
    ${({ $theme }) => $theme?.headerBorderColor || "#d1d5db"};
  border-right: 1px solid
    ${({ $theme }) => $theme?.headerBorderColor || "#d1d5db"};
  box-shadow: ${({ $theme }) =>
    $theme?.boxShadow || "0 1px 2px 0 rgba(0, 0, 0, 0.05)"};
  align-items: stretch;
  background: ${({ $theme }) => $theme?.headerBackgroundColor};

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
  $isFirefox?: boolean;
}>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${({ $theme }) => $theme?.backgroundColor};

  ${({ $loose, $theme }) =>
    $loose &&
    css`
      --row-bg: ${$theme?.headerBackgroundColor ?? "#e4e4e4"};
      min-width: max-content;
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
  align-items: stretch;
  height: 100%;
  border-bottom-width: 1px;
  color: ${({ $theme }) => $theme?.textColor};
  border-bottom: 1px solid ${({ $theme }) => $theme?.summaryBorderColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};
  background: ${({ $theme }) => $theme?.summaryBackgroundColor};

  ${({ $loose, $theme }) =>
    $loose &&
    css`
      min-width: max-content;
      z-index: 40;

      --row-bg: ${$theme?.summaryBackgroundColor ?? "#e4e4e4"};
    `};
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

function TableRowGroup({
  id,
  children,
  title,
  subtitle,
  className,
  styles,
}: TableRowGroupProps) {
  const { currentTheme } = useTheme();
  const tableTheme = currentTheme.table;

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
            <TableRowGroupIdContext.Provider value={id ?? "default"}>
              {children}
            </TableRowGroupIdContext.Provider>
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
  actions?: (columnId: string) => TableRowAction[];
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

/*
 * Set by IndexedCells, one level per cell, so a cell resolves its own
 * position (for the sticky first column) and width without a parent
 * cloning props onto it.
 */
const TableRowCellPositionContext = createContext<{
  index?: number;
  width?: string;
  isLastCol?: boolean;
} | null>({
  index: 0,
  width: undefined,
  isLastCol: false,
});
const useTableRowCellPosition = () => useContext(TableRowCellPositionContext);

function TableRow({
  content,
  styles,
  rowId,
  children,
  actions,
  onClick,
  groupId: groupIdProp = "default",
  className,
  id,
}: TableRowProps) {
  const { currentTheme } = useTheme();
  const tableTheme = currentTheme.table;

  const { onDragged } = useTableDND();
  const { openRowId, setOpenRowId } = useTableOpenRow();
  const { selectedData, handleSelect } = useTableSelection();
  const {
    rowIds,
    rowPositions,
    alwaysShowDragIcon,
    draggable,
    onLastRowReached,
  } = useTableRowMeta();
  const { loose, selectable, setWithRowActions } = useTableLoose();

  /*
   * A row inside a Table.Row.Group always takes that group's id, the same
   * way TableRowGroup used to unconditionally inject `groupId`. A row
   * outside any group has no provider above it, so it falls back to its
   * own prop.
   */
  const contextGroupId = useContext(TableRowGroupIdContext);
  const groupId = contextGroupId ?? groupIdProp;

  const isSelected = !!rowId && selectedData.includes(rowId);
  /** Position among all rows in the table, used only to detect the very last row (see the effect below). */
  const index = rowId ? rowIds.indexOf(rowId) : -1;
  const isLast = index === rowIds.length - 1;

  const rowPosition = rowId ? rowPositions.get(rowId) : undefined;
  /** Position within this row's own group, used for drag-and-drop reordering below. */
  const localIndex = rowPosition?.localIndex ?? 0;
  const groupLength = rowPosition?.groupLength ?? 0;

  const rowActions = actions?.(rowId ?? "").filter((action) => !action.hidden);
  const hasRowActions = (rowActions?.length ?? 0) > 0;

  useEffect(() => {
    setWithRowActions(hasRowActions);
  }, [hasRowActions]);

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
        onDragStart={(e) =>
          e.dataTransfer.setData(
            "application/json",
            JSON.stringify({
              id: rowId,
              oldGroupId: groupId,
              oldPosition: localIndex,
            })
          )
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

          const dragItem = JSON.parse(
            e.dataTransfer.getData("application/json")
          ) as {
            id: string;
            oldGroupId: string;
            oldPosition: number;
          };

          let position = 0;
          const isSameGroup = dragItem?.oldGroupId === groupId;

          if (dropPosition === "top") {
            position = localIndex;
          } else {
            position = localIndex + 1;
          }

          if (isSameGroup && dragItem?.oldPosition < position) {
            position -= 1;
          }

          const clampedPosition = Math.min(position, groupLength ?? 0);

          if (dragItem) {
            onDragged?.({
              id: dragItem.id,
              oldGroupId: dragItem.oldGroupId || "",
              oldPosition: dragItem.oldPosition,
              newGroupId: groupId || "",
              newPosition: clampedPosition,
            });
          }
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
                controlStyle: css`
                  height: 100%;
                `,
                boxStyle: css`
                  width: 100%;
                `,
              }}
              checked={isSelected}
            />
          </CheckboxWrapper>
        )}
        <IndexedCells lastGetsPadding={!!actions}>
          {content
            ? content.map((col, i) => {
                const column = columns[i];
                const isLastCol = actions && i === childArray.length - 1;

                return (
                  <TableRowCell
                    key={i}
                    width={column?.width}
                    contentStyle={
                      isLastCol
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
            : /* width/padding for a caller-provided Table.Row.Cell now come from IndexedCells via position context, not a clone. */
              childArray.map((child) => {
                if (!isValidElement<TableRowCellProps>(child)) return child;

                const isTableRowCell = child.type === Table.Row.Cell;
                if (!isTableRowCell) return child;

                return child;
              })}
        </IndexedCells>

        {isOver && dropPosition && <DragLine position={dropPosition} />}

        {actions &&
          (() => {
            const listActions = actions(`${rowId}`);
            const actionsWithIcons = listActions
              ?.filter((action): action is TableRowAction => Boolean(action))
              ?.filter((action) => !action.hidden)
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
                    `};

                    ${draggable
                      ? css`
                          right: 2.4rem;
                        `
                      : css`
                          right: 0.5rem;
                        `};

                    ${loose &&
                    css`
                      position: sticky;
                      right: 0;
                      display: flex;
                      align-items: center;
                      height: auto;
                      transform: none;
                      padding-left: 8px;
                      padding-right: 8px;
                      background-color: var(--row-bg, #ffffff);

                      &::before {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: -6px;
                        bottom: 0;
                        width: 6px;
                        /* CSS var toggled imperatively by syncScroll. */
                        background: ${tableTheme?.rightLooseEffectColor};
                        opacity: var(--table-scrolled-right, 0);
                        pointer-events: none;
                      }
                    `};
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

/**
 * Wraps a list of cells and assigns each one its position via context.
 * Callers never compute or pass an index themselves: they just render
 * whatever children they have, in order, and this does the counting.
 */
function IndexedCells({
  children,
  lastGetsPadding = false,
}: {
  children: ReactNode;
  lastGetsPadding?: boolean;
}) {
  const columns = useTableColumns();
  const items = Children.toArray(children).filter(isValidElement);

  return items.map((child, index) => (
    <TableRowCellPositionContext.Provider
      key={child.key ?? index}
      value={{
        index,
        isLastCol: lastGetsPadding && index === items.length - 1,
        width: columns[index]?.width,
      }}
    >
      {child}
    </TableRowCellPositionContext.Provider>
  ));
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
  height: 100%;

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

export interface TableRowCellProps {
  children: ReactNode;
  contentStyle?: CSSProp;
  onClick?: () => void;
  bold?: boolean;
  width?: string;
  className?: string;
  id?: string;
}

const TableRowCell = React.memo(function TableRowCell({
  children,
  contentStyle,
  onClick,
  id,
  width,
  className,
  bold,
}: TableRowCellProps) {
  const {
    index,
    isLastCol,
    width: widthFromPosition,
  } = useTableRowCellPosition();

  const { loose, selectable } = useTableLoose();
  const isFirst = index === 0;
  const { currentTheme } = useTheme();
  const tableTheme = currentTheme?.table;

  // An explicit width prop always wins over the column width IndexedCells resolved.
  const resolvedWidth = width ? width : widthFromPosition;

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
      $width={resolvedWidth}
      $bold={bold}
      $contentStyle={css`
        ${isLastCol &&
        css`
          padding-right: 36px;
          ${contentStyle}
        `};
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
});

/*
 * use the provided `width` as the flex-basis while allowing the column to shrink.
 * avoid flex: 1, which would force all columns to grow and ignore the intended width.
 */
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
  flex: 1;

  ${({ $width, $loose }) =>
    $loose
      ? css`
          width: 160px;
        `
      : !$width
        ? css`
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
      /* isolates this cell onto its own compositing layer to avoid intermittent paint */
      transform: translateZ(0);
      will-change: transform;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: -6px;
        bottom: 0;
        width: 6px;
        /* toggled imperatively by syncScroll; previously every cell in every row re-rendered whenever this flipped. */
        background: ${$theme?.leftLooseEffectColor};
        opacity: var(--table-scrolled-left, 0);
        pointer-events: none;
      }
    `};

  ${({ $width }) =>
    $width &&
    css`
      flex: 0 1 ${$width};
      width: ${$width};
    `};

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

/**
 * For each row, finds its index among its own group's rows and that
 * group's total row count. Mirrors getAllRowContentsFromChildren's
 * traversal, but a nested Table.Row.Group starts a new counting scope
 * instead of contributing to its parent's.
 */
function getRowPositionsFromChildren(
  children: ReactNode
): Map<string, RowPosition> {
  const result = new Map<string, RowPosition>();

  // Returns the row ids found directly at this level (not inside a nested
  // group), and records their positions into `result` once the full count
  // for this level is known.
  function walk(nodes: ReactNode): string[] {
    const ownRowIds: string[] = [];

    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return;

      if (child.type === TableRowGroup) {
        const groupChildren = (child.props as TableRowGroupProps).children;
        walk(groupChildren);
        return;
      }

      if (child.type === TableRow) {
        const rowId = (child.props as TableRowProps).rowId;
        if (rowId) ownRowIds.push(rowId);
        return;
      }

      if (typeof child.type === "function") {
        ownRowIds.push(...walk((child.type as Function)(child.props)));
      }
    });

    ownRowIds.forEach((rowId, localIndex) => {
      result.set(rowId, { localIndex, groupLength: ownRowIds.length });
    });

    return ownRowIds;
  }

  walk(children);
  return result;
}

Table.Row = TableRow;
TableRow.Group = TableRowGroup;
TableRow.Cell = TableRowCell;

export { Table };
