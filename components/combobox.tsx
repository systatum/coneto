import {
  forwardRef,
  ForwardRefExoticComponent,
  KeyboardEvent,
  ReactNode,
  Ref,
  RefAttributes,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  castValue,
  DrawerProps,
  SelectboxOption,
  Selectbox,
  SelectboxLabels,
  SelectboxSelectedOptions,
  SelectboxStyles,
} from "./selectbox";
import styled, { css, CSSProp } from "styled-components";
import { FieldLaneDropdownOption, FieldLaneProps } from "./field-lane";
import { StatefulForm } from "./stateful-form";
import { useTheme } from "./../theme/provider";
import { ComboboxThemeConfig } from "./../theme";
import { applyClassName } from "./../constants/classname";
import {
  TreeList,
  TreeListAction,
  TreeListContent,
  TreeListItem,
  TreeListItemAction,
} from "./treelist";
import { Searchbox, SearchboxProps } from "./searchbox";
import { Checkbox, CheckboxProps } from "./checkbox";
import { createPortal } from "react-dom";

interface BaseComboboxProps {
  selectedOptions?: SelectboxSelectedOptions;
  onChange?: (selectedOptions: SelectboxSelectedOptions) => void;
  clearable?: boolean;
  placeholder?: string;
  emptySlate?: string;
  highlightOnMatch?: boolean;
  actions?: ComboboxAction[];
  name?: string;
  multiple?: boolean;
  maxSelectableItems?: number | undefined;
  styles?: ComboboxStyles;
  helper?: string;
  disabled?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  strict?: boolean;
  options: ComboboxOption[];
  isLoading?: boolean;
  labels?: ComboboxLabelsProps;
  mobile?: boolean;
  drawerHeight?: string;
}

export const ComboboxGroupInitialState = {
  Opened: "opened",
  Closed: "closed",
} as const;

export type ComboboxGroupInitialState =
  (typeof ComboboxGroupInitialState)[keyof typeof ComboboxGroupInitialState];

export type ComboboxOption = SelectboxOption &
  ComboboxActionOption & {
    groupOptions?: ComboboxOption[];
    groupSetting?: ComboboxGroupSetting;
  };

interface ComboboxGroupSetting {
  collapsible?: boolean;
  initialState?: ComboboxGroupInitialState;
}

interface ComboboxActionOption {
  actions?: (id?: string) => ComboboxItemAction[];
}

export type ComboboxItemAction = TreeListItemAction;

export type ComboboxDropdownOption = FieldLaneDropdownOption;

export interface ComboboxLabelsProps extends SelectboxLabels {}

export interface ComboboxStyles extends Omit<SelectboxStyles, "self"> {
  selectboxStyle?: CSSProp;
  drawerStyle?: CSSProp;
  rowStyle?: CSSProp;
  rowContainerStyle?: CSSProp;
}

export type ComboboxAction = TreeListAction;

export type ComboboxDrawerProps = Omit<DrawerProps, "refs"> &
  BaseComboboxProps & {
    inputRef?: Ref<HTMLInputElement>;
    handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    selectedOptionsLocal: SelectboxOption;
    setSelectedOptionsLocal: (value: SelectboxOption) => void;
    setHasInteracted?: (value: boolean) => void;
    setConfirmedValue?: (option: SelectboxOption | null) => void;
    openedCategoryGroup?: Set<string>;
    setOpenedCategoryGroup?: (
      updater: (prev: Set<string>) => Set<string>
    ) => void;
    refs?: {
      setFloating?: Ref<HTMLUListElement>;
      reference?: Ref<HTMLElement> & { current?: HTMLElement | null };
    };
    children?: ReactNode;
    navigableOptions?: SelectboxOption[];
    fadeEffect?: ComboboxDrawerFadeEffect[];
    searchbox?: SearchboxProps | boolean;
    checkbox?: CheckboxProps | boolean;
  };

export const ComboboxDrawerFadeEffect = {
  Top: "top",
  Bottom: "bottom",
} as const;

export type ComboboxDrawerFadeEffect =
  (typeof ComboboxDrawerFadeEffect)[keyof typeof ComboboxDrawerFadeEffect];

export interface ComboboxProps
  extends BaseComboboxProps,
    Omit<
      FieldLaneProps,
      "mobile" | "styles" | "type" | "children" | "actions"
    > {}

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      onChange,
      clearable = false,
      placeholder,
      styles,
      highlightOnMatch = false,
      emptySlate = "Not available.",
      errorMessage,
      label,
      showError,
      selectedOptions,
      strict,
      actions,
      onKeyDown,
      onClick,
      name,
      multiple,
      maxSelectableItems,
      helper,
      disabled,
      dropdowns,
      errorIconPosition,
      id,
      labelPosition,
      labelGap,
      labelWidth,
      required,
      isLoading,
      labels,
      className,
      mobile,
      drawerHeight,
    },
    ref
  ) => {
    const inputId = StatefulForm.sanitizeId({
      prefix: "combobox",
      name,
      id,
    });

    const finalGroup = useMemo(() => {
      const collectOpened = (items: ComboboxOption[]): string[] => {
        return items.flatMap((item) => {
          if (item.hidden) return [];
          const self =
            (item.groupSetting?.initialState ?? "closed") === "opened"
              ? [String(item.value)]
              : [];
          const children = item.groupOptions?.length
            ? collectOpened(item.groupOptions)
            : [];
          return [...self, ...children];
        });
      };
      return collectOpened(options ?? []);
    }, [options]);

    const [openedCategoryGroup, setOpenedCategoryGroup] = useState<Set<string>>(
      () => new Set(finalGroup)
    );

    const flatOptions = useMemo<SelectboxOption[]>(() => {
      return (
        options?.flatMap((item) => {
          if (item.hidden) return [];
          if (item.groupOptions?.length) {
            const allChildren = item.groupOptions
              .filter((o) => !o.hidden)
              .flatMap((child) =>
                child.groupOptions?.length
                  ? [child, ...child.groupOptions.filter((o) => !o.hidden)]
                  : [child]
              );
            return [item, ...allChildren];
          }
          return [item];
        }) ?? []
      );
    }, [options]);

    const navigableOptions = useMemo<SelectboxOption[]>(() => {
      const flatten = (items: ComboboxOption[]): SelectboxOption[] => {
        return items.flatMap((item) => {
          if (item.hidden) return [];

          if (item.groupOptions?.length) {
            // Group parent → skip self, only include children if open
            if (!openedCategoryGroup.has(String(item.value))) return [];
            return flatten(item.groupOptions);
          }

          // Leaf node
          return [item];
        });
      };

      return flatten(options ?? []);
    }, [options, openedCategoryGroup]);

    return (
      <Selectbox
        ref={ref}
        className={applyClassName("combobox", className)}
        isLoading={isLoading}
        mobile={!!mobile}
        helper={helper}
        errorIconPosition={errorIconPosition}
        dropdowns={dropdowns}
        showError={showError}
        errorMessage={errorMessage}
        labelGap={labelGap}
        labelWidth={labelWidth}
        labelPosition={labelPosition}
        label={label}
        highlightOnMatch={highlightOnMatch}
        required={required}
        labels={labels}
        styles={{
          bodyStyle: styles?.bodyStyle,
          controlStyle: styles?.controlStyle,
          containerStyle: styles?.containerStyle,
          labelStyle: styles?.labelStyle,
          self: css`
            ${dropdowns &&
            css`
              border-top-left-radius: 0px;
              border-bottom-left-radius: 0px;
            `}
            ${styles?.selectboxStyle}
          `,
        }}
        id={inputId}
        options={flatOptions}
        navigableOptions={navigableOptions}
        selectedOptions={selectedOptions}
        onChange={onChange}
        placeholder={placeholder}
        clearable={clearable}
        strict={strict}
        onKeyDown={onKeyDown}
        multiple={multiple}
        maxSelectableItems={maxSelectableItems}
        actions={actions}
        disabled={disabled}
      >
        {(props) => {
          /**
           * filteredForDrawer — search-filtered options passed to the drawer.
           * When the user has typed, we filter each group's children (or flat
           * options) by the search text. Mirrors the old combobox behaviour.
           */
          const filterOptions = (
            opts: ComboboxOption[],
            search: string
          ): ComboboxOption[] => {
            return opts
              .map((opt) => {
                if (opt.hidden) return null;

                if (opt.groupOptions?.length) {
                  const selfMatches = opt.text.toLowerCase().includes(search);

                  // Parent matches — keep it with ALL children untouched
                  if (selfMatches) {
                    return opt;
                  }

                  // Parent doesn't match — recurse into children
                  const filteredChildren = filterOptions(
                    opt.groupOptions,
                    search
                  );
                  if (filteredChildren.length > 0) {
                    return { ...opt, groupOptions: filteredChildren };
                  }

                  return null;
                }

                // Leaf node
                return opt.text.toLowerCase().includes(search) ? opt : null;
              })
              .filter(Boolean) as ComboboxOption[];
          };

          /**
           * filteredNavigableOptions — search-filtered navigable options passed to the drawer.
           * When the user has typed, we filter navigable options by the search text
           * so that the flatIndexMap in the drawer stays in sync with the rendered options.
           * Without this, highlighted index would mismatch against the filtered drawer options.
           */

          const filteredNavigableOptions: SelectboxOption[] =
            props?.hasInteracted
              ? navigableOptions.filter((opt) =>
                  opt?.text
                    ?.toLowerCase()
                    .includes(
                      props?.selectedOptionsLocal?.text?.toLowerCase() ?? ""
                    )
                )
              : navigableOptions;

          // Then replace the filteredForDrawer block:
          const filteredForDrawer: ComboboxOption[] = props?.hasInteracted
            ? filterOptions(
                options ?? [],
                props?.selectedOptionsLocal?.text?.toLowerCase() ?? ""
              )
            : options;

          return (
            <ComboboxDrawer
              {...props}
              styles={styles}
              mobile={mobile}
              navigableOptions={filteredNavigableOptions}
              inputRef={props.ref}
              name={name}
              disabled={disabled}
              selectedOptions={selectedOptions}
              onChange={onChange}
              highlightOnMatch={highlightOnMatch}
              emptySlate={emptySlate}
              actions={actions}
              onClick={onClick}
              options={filteredForDrawer}
              drawerHeight={drawerHeight}
              maxSelectableItems={maxSelectableItems}
              searchbox={multiple}
              checkbox={multiple}
              multiple={multiple}
              openedCategoryGroup={openedCategoryGroup}
              setOpenedCategoryGroup={setOpenedCategoryGroup}
            />
          );
        }}
      </Selectbox>
    );
  }
) as ForwardRefExoticComponent<
  ComboboxProps & RefAttributes<HTMLInputElement>
> & {
  Drawer: typeof ComboboxDrawer;
};

function ComboboxDrawer({
  floatingStyles,
  getFloatingProps,
  highlightedIndex,
  highlightOnMatch,
  listRef,
  options,
  refs,
  setHighlightedIndex,
  onChange,
  setSelectedOptionsLocal,
  selectedOptionsLocal,
  selectedOptions,
  isOpen,
  setIsOpen,
  actions,
  onClick,
  multiple,
  emptySlate = "Not Available.",
  setHasInteracted,
  inputRef,
  handleKeyDown,
  maxSelectableItems,
  interactionMode,
  setInteractionMode,
  setConfirmedValue,
  openedCategoryGroup,
  setOpenedCategoryGroup,
  styles,
  navigableOptions,
  mobile,
  drawerHeight,
  searchbox,
  children,
  checkbox,
  fadeEffect,
}: ComboboxDrawerProps) {
  const { mode, currentTheme } = useTheme();
  const comboboxTheme = currentTheme?.combobox;
  const treeListTheme = currentTheme?.treelist;

  const [hasScrolled, setHasScrolled] = useState(false);
  const [showFadeTop, setShowFadeTop] = useState(true);
  const [showFadeBottom, setShowFadeBottom] = useState(true);

  const floatingRef = useRef<HTMLUListElement>(null);

  const hasNestedOptions = options?.some((opt) => opt.groupOptions?.length);

  const finalOptions = useMemo<SelectboxOption[]>(() => {
    return (
      options?.flatMap((item) => {
        if (item?.hidden) return [];
        if (item.groupOptions?.length) {
          return [item, ...item.groupOptions.filter((o) => !o.hidden)];
        }
        return [item];
      }) ?? []
    );
  }, [options, openedCategoryGroup]);

  const finalSelectedOptions = useMemo(() => {
    if (Array.isArray(selectedOptions)) {
      return selectedOptions.map(String);
    }
    if (selectedOptions != null) {
      return [String(selectedOptions)];
    }
    return [];
  }, [selectedOptions]);

  const selectedIndex = useMemo(
    () =>
      finalOptions?.findIndex((option) =>
        finalSelectedOptions?.includes(String(option.value))
      ) + (actions?.length ?? 0),
    [finalOptions, finalSelectedOptions, actions]
  );

  const handleOnChange = (values: string[]) => {
    if (!onChange) return;

    if (Array.isArray(selectedOptions)) {
      onChange(castValue(values, selectedOptions));
      return;
    }

    onChange(castValue(values[0], selectedOptions));
  };

  useEffect(() => {
    if (isOpen && selectedIndex) {
      setHighlightedIndex(selectedIndex);
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      !hasScrolled &&
      finalSelectedOptions?.length > 0 &&
      finalOptions?.length > 0
    ) {
      const selectedEl = listRef.current[selectedIndex];
      if (selectedEl) {
        requestAnimationFrame(() => {
          selectedEl.scrollIntoView({ block: "center" });
        });
        setHasScrolled(true);
      }
    }
  }, [
    selectedIndex,
    hasScrolled,
    finalSelectedOptions?.length,
    finalOptions?.length,
  ]);

  useEffect(() => {
    if (
      highlightedIndex !== null &&
      listRef.current[highlightedIndex] &&
      searchbox &&
      interactionMode === "keyboard"
    ) {
      const element = listRef.current[highlightedIndex];
      const container = floatingRef.current;

      if (element && container) {
        const searchboxHeight = 38;
        const elementTop = element.offsetTop;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;

        if (elementTop < containerScrollTop + searchboxHeight) {
          container.scrollTop = elementTop - searchboxHeight;
        } else if (
          elementTop + element.clientHeight >
          containerScrollTop + containerHeight
        ) {
          container.scrollTop =
            elementTop + element.clientHeight - containerHeight;
        }
      }
    }
  }, [highlightedIndex, searchbox, interactionMode]);

  const filteredActions: TreeListAction[] = Array.isArray(actions)
    ? actions
        ?.filter((action) => !action?.hidden)
        .map((action, index) => {
          const shouldHighlight = highlightedIndex === index;

          return {
            id: action?.id,
            caption: action?.caption,
            hidden: action?.hidden,
            icon: action?.icon,
            onClick: () => {
              action?.onClick();
              setIsOpen(false);
            },
            onMouseEnter: () => {
              if (interactionMode !== "mouse") return;
              setHighlightedIndex(index);
            },
            className: shouldHighlight ? "is-highlighted" : "",
            styles: {
              ...action?.styles,
              self: css`
                ${rowStyle({
                  interactionMode,
                  multiple: !!searchbox,
                  theme: comboboxTheme,
                  mobile: !!mobile,
                  hasNestedOptions,
                  level: 0,
                })};
                ${action?.styles?.self}
              `,
            },
          };
        })
    : [];

  const optionByTreeId = useRef<Record<string, ComboboxOption>>({});

  const flatIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    const offset = filteredActions.length;

    navigableOptions?.forEach((opt, i) => {
      map[String(opt.value)] = i + offset;
    });

    return map;
  }, [navigableOptions, filteredActions.length]);

  const checkboxProps = typeof checkbox === "object" && checkbox;

  const generateContent = (): TreeListContent[] => {
    optionByTreeId.current = {};

    const registerAll = (opts: ComboboxOption[]) => {
      for (const opt of opts) {
        optionByTreeId.current[String(opt.value)] = opt;
        if (opt.groupOptions?.length) registerAll(opt.groupOptions);
      }
    };

    registerAll(finalOptions);

    const renderCaption = (opt: ComboboxOption): ReactNode => {
      const isSelected = finalSelectedOptions.includes(String(opt.value));

      const label = opt.render ?? opt.text;
      const hasChildren = Boolean(opt?.groupOptions?.length);

      if (multiple && hasChildren) {
        return label;
      }

      return (
        <>
          {checkbox && (
            <Checkbox
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              {...checkboxProps}
              styles={{
                ...checkboxProps?.styles,
                containerStyle: css`
                  margin-top: 2px;
                  ${mobile &&
                  css`
                    margin-top: 7px;
                  `};

                  ${mobile && opt?.render
                    ? css`
                        margin-top: 10px;
                      `
                    : opt?.render &&
                      css`
                        margin-top: 7px;
                      `};

                  ${checkboxProps?.styles?.containerStyle}
                `,
                iconStyle: css`
                  ${mobile
                    ? css`
                        width: 12px;
                        height: 12px;
                      `
                    : css`
                        width: 8px;
                        height: 8px;
                      `};

                  ${checkboxProps?.styles?.iconStyle};
                `,
                self: css`
                  ${mobile
                    ? css`
                        width: 20px;
                        height: 20px;
                      `
                    : css`
                        width: 14px;
                        height: 14px;
                      `};

                  ${checkboxProps?.styles?.self};
                `,
              }}
            />
          )}
          {label}
        </>
      );
    };

    const mapToItem = (opt: ComboboxOption): TreeListItem => {
      const id = String(opt.value);

      const itemIndex = flatIndexMap[id];
      const isSelected = finalSelectedOptions.includes(id);
      const shouldHighlight =
        highlightOnMatch && isSelected ? true : highlightedIndex === itemIndex;

      return {
        id,
        caption: renderCaption(opt),
        collapsible:
          opt?.groupSetting?.collapsible ??
          (opt?.groupOptions?.length > 0 ? true : false),
        className: [
          opt.groupOptions?.length ? "has-group-options" : "",
          shouldHighlight ? "is-highlighted" : "",
        ]
          .join(" ")
          .trim(),
        actions: opt?.actions?.(String(opt.value))?.map((action) => ({
          ...action,
          onClick: () => action.onClick?.(String(opt.value)),
        })),
        onClick: ({ withoutSelection }) => {
          if (opt?.groupOptions?.length > 0) {
            withoutSelection();
          }
        },
        ...(opt?.groupOptions?.length > 0
          ? {
              items: opt.groupOptions
                .filter((child) => !child.hidden)
                .map((child) => mapToItem(child)),
            }
          : {}),
      };
    };

    const mapToContent = (option: ComboboxOption): TreeListContent => {
      const id = String(option.value);

      const itemIndex = flatIndexMap[id];
      const isSelected = finalSelectedOptions.includes(id);
      const shouldHighlight =
        highlightOnMatch && isSelected ? true : highlightedIndex === itemIndex;

      return {
        id,
        caption: renderCaption(option),
        initialState: option?.groupSetting?.initialState ?? "closed",
        collapsible:
          option?.groupSetting?.collapsible ??
          (option?.groupOptions?.length > 0 ? true : false),
        className: [
          option.groupOptions?.length ? "has-group-options" : "",
          shouldHighlight ? "is-highlighted" : "",
        ]
          .join(" ")
          .trim(),
        actions: option?.actions?.(String(option.value))?.map((action) => ({
          ...action,
          onClick: () => action.onClick?.(String(option.value)),
        })),
        ...(option?.groupOptions?.length > 0
          ? {
              items: option.groupOptions
                .filter((child) => !child.hidden)
                .map((child) => mapToItem(child)),
            }
          : {}),
      };
    };

    return (options ?? []).filter((opt) => !opt.hidden).map(mapToContent);
  };

  const content = useMemo(
    () => generateContent(),
    [
      options,
      finalSelectedOptions,
      highlightedIndex,
      highlightOnMatch,
      flatIndexMap,
      multiple,
      mobile,
    ]
  );

  const onMouseDown = (props: {
    event: React.MouseEvent;
    item?: TreeListContent;
  }) => {
    const { event, item } = props;
    event?.preventDefault();
    event?.stopPropagation();

    const hasChildren = item?.items?.length > 0;

    if (hasChildren) return;

    const originalOption = optionByTreeId.current[item?.id];

    const option: ComboboxOption = {
      text: originalOption?.text ?? "",
      value: item?.id,
    };

    const optionValue = item?.id;

    if (multiple) {
      if (!finalSelectedOptions.includes(item?.id)) {
        if (
          !maxSelectableItems ||
          finalSelectedOptions?.length < maxSelectableItems
        ) {
          handleOnChange([...finalSelectedOptions, item?.id]);
        }
      } else {
        handleOnChange(finalSelectedOptions.filter((val) => val !== item?.id));
      }

      (inputRef as RefObject<HTMLInputElement>)?.current?.focus();
    } else {
      const hasChildren = (item?.items?.length ?? 0) > 0;
      if (hasChildren) return;

      setIsOpen(false);
      setConfirmedValue?.(option);
      setSelectedOptionsLocal(option);
      handleOnChange([optionValue]);
      setHasInteracted(false);
    }

    requestAnimationFrame(() => {
      if (!multiple) setHighlightedIndex(null);
    });
    onClick?.();
  };

  const onMouseMove = () => {
    if (interactionMode !== "mouse") {
      setInteractionMode("mouse");
    }
  };

  const onMouseEnter = (props: {
    event: React.MouseEvent;
    item?: TreeListContent;
  }) => {
    const { item } = props;
    const index = flatIndexMap[item.id];

    if (interactionMode !== "mouse") return;
    if (typeof index === "number") {
      setHighlightedIndex(index);
    }
  };

  /**
   * Dynamically show/hide the top and bottom fade overlays based on the
   * selected item's position relative to the scrollable container.
   *
   * The fade hides when the selected item's center point comes within
   * `threshold` pixels of that edge, and reappears once it scrolls past.
   */
  useEffect(() => {
    const container = floatingRef.current;
    if (!container || !mobile) return;

    const updateFade = () => {
      const selectedEl = listRef.current[selectedIndex];

      if (!selectedEl) {
        setShowFadeTop(true);
        setShowFadeBottom(true);
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const itemRect = selectedEl.getBoundingClientRect();

      const itemMidY = itemRect.top + itemRect.height / 2;

      const distanceFromTop = itemMidY - containerRect.top;
      const distanceFromBottom = containerRect.bottom - itemMidY;

      const threshold = 40;

      const itemNearTop = distanceFromTop >= 0 && distanceFromTop <= threshold;
      const itemNearBottom =
        distanceFromBottom >= 0 && distanceFromBottom <= threshold;

      setShowFadeTop(!itemNearTop);
      setShowFadeBottom(!itemNearBottom);
      setShowFadeBottom(!itemNearBottom);
    };

    updateFade();
    container.addEventListener("scroll", updateFade);

    return () => container.removeEventListener("scroll", updateFade);
  }, [selectedIndex, finalOptions.length]);

  const searchboxProps = typeof searchbox === "object" && searchbox;

  const mainCombobox = (
    <DrawerWrapper
      {...getFloatingProps()}
      ref={(node) => {
        if (typeof refs?.setFloating === "function") {
          refs?.setFloating(node);
        }
        floatingRef.current = node;
      }}
      $hasNestedOptions={hasNestedOptions}
      style={mobile ? {} : { ...floatingStyles }}
      $theme={comboboxTheme}
      $drawerHeight={drawerHeight}
      id="combo-list"
      aria-label="combobox-drawer"
      role="listbox"
      $width={refs?.reference?.current?.getBoundingClientRect().width}
      $mobile={mobile}
      $style={styles?.drawerStyle}
      $searchbox={!!searchbox}
    >
      {searchbox && (
        <Searchbox
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            const { value } = e.target;
            setHasInteracted(true);
            setHighlightedIndex(0);
            setSelectedOptionsLocal({
              ...selectedOptionsLocal,
              text: value,
            });
          }}
          autoComplete="off"
          ref={inputRef}
          value={selectedOptionsLocal.text}
          {...searchboxProps}
          styles={{
            ...searchboxProps?.styles,
            containerStyle: css`
              position: sticky;
              background-color: ${mobile
                ? comboboxTheme?.mobileBackgroundColor
                : comboboxTheme?.backgroundColor};
              z-index: 10000;
              height: 38px;
              top: 0;
              ${mobile &&
              !searchbox &&
              css`
                transform: translateY(-90px);
              `};
              ${mobile &&
              css`
                max-height: 46px;
                height: 46px;
              `};
              ${searchboxProps?.styles?.containerStyle};
            `,
            iconStyle: css`
              left: 16px;
              ${searchboxProps?.styles?.iconStyle};
            `,
            self: css`
              max-height: 35px;
              margin-top: 7px;
              margin-bottom: 7px;
              padding-bottom: 7px;
              padding-top: 7px;
              margin-left: 4px;
              margin-right: 4px;
              background-color: ${mobile
                ? comboboxTheme?.mobileBackgroundColor
                : comboboxTheme?.backgroundColor};
              &:focus {
                background-color: ${mobile
                  ? comboboxTheme?.mobileBackgroundColor
                  : comboboxTheme?.backgroundColor};
              }

              ${searchboxProps?.styles?.self};
            `,
          }}
        />
      )}

      {children}

      {(finalOptions || actions || children) && (
        <>
          <TreeList
            ref={({ el, item }) => {
              const index = flatIndexMap[item.id];
              if (typeof index === "number") {
                listRef.current[index] = el;
              }
            }}
            refItem={({ el, item }) => {
              const index = flatIndexMap[item.id];
              if (typeof index === "number") {
                listRef.current[index] = el;
              }
            }}
            multiple={multiple}
            selectedItems={finalSelectedOptions}
            emptySlate={emptySlate}
            emptyItemSlate={emptySlate}
            onMouseDown={onMouseDown}
            onMouseDownItem={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseMoveItem={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseEnterItem={onMouseEnter}
            onOpenChange={({ id }) => {
              setOpenedCategoryGroup((prev) => {
                const next = new Set(prev);
                if (next.has(id)) {
                  next.delete(id);
                } else {
                  next.add(id);
                }
                return next;
              });
            }}
            arrowSize={mobile ? 18 : 14}
            maxActionsBeforeCollapsing={1}
            actions={filteredActions}
            styles={{
              actionWrapperStyle: css`
                margin-bottom: 0px;
              `,
              emptySlateStyle: css`
                margin-left: 0px;
                min-height: 36px;
                margin-top: 0px;
                border: none;
              `,
              actionStyle: css`
                padding-left: 12px;
                padding-right: 12px;
                padding-top: 8px;
                padding-bottom: 8px;
                border-left: 0px;
                flex-direction: row-reverse;
                justify-content: space-between;
              `,
              dividerStyle: css`
                border-color: ${comboboxTheme?.dividerColor};
                margin-bottom: 0px;
              `,
              containerGroupStyle: css`
                gap: 0px;
                &:not(:last-child) {
                  padding-bottom: 0px;
                }
                cursor: pointer;
              `,
              textWrapperStyle: css`
                min-height: 36px;
                padding-left: 12px;
                padding-right: 12px;
                padding-top: 8px;
                padding-bottom: 8px;
                animation: all 0.2s ease-in-out;
                gap: 6px;

                &[data-has-options="true"] {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  background-color: ${mobile
                    ? comboboxTheme?.mobileGroupBackgroundColor
                    : comboboxTheme?.groupBackgroundColor};
                  border: 1px solid transparent;

                  &[aria-expanded="true"] {
                    border-bottom: 1px solid ${comboboxTheme?.borderColor};
                  }
                }

                ${rowStyle({
                  interactionMode,
                  multiple,
                  theme: comboboxTheme,
                  hasNestedOptions,
                  mobile: !!mobile,
                })}

                gap: 20px;

                ${styles?.rowContainerStyle};
              `,
              hierarchyLineStyle: css`
                border-left-width: 2px;

                &[data-selected="false"] {
                  border-color: ${mode === "light"
                    ? "rgb(215, 214, 214)}"
                    : treeListTheme?.dividerHierarchyColor};
                }

                &[data-level="0"] {
                  border-left: none !important;
                }

                &[aria-label="vertical-line-level"] {
                  border-left: none !important;
                }

                &[data-has-options="true"] {
                  border-left: none;
                }
              `,
              titleStyle: css`
                width: 100%;
                padding: 0px;
                display: flex;
                flex-direction: row;
                ${mobile
                  ? css`
                      gap: 14px;
                    `
                  : css`
                      gap: 6px;
                    `}

                &[data-has-options="false"] {
                  font-weight: 400;
                }

                ${styles?.rowStyle};
              `,
              arrowGroupStyle: css`
                [data-has-options="true"] & {
                  transform: none;
                  display: flex;
                  position: relative;
                  flex-direction: column;
                  justify-content: center;
                  height: 100%;
                  top: auto;
                  left: auto;

                  &[aria-expanded="true"] {
                    transform: rotate(90deg);
                  }
                }
              `,
              arrowStyle: css`
                margin-left: 3px;
              `,
              itemStyle: (level?: number) => css`
                ${rowStyle({
                  interactionMode,
                  multiple,
                  theme: comboboxTheme,
                  mobile: !!mobile,
                  hasNestedOptions,
                  level,
                })}
                gap: 6px;

                ${styles?.rowStyle}
              `,
            }}
            showHierarchyLine
            content={content}
          />
        </>
      )}
    </DrawerWrapper>
  );

  if (mobile) {
    const finalFadeEffect =
      fadeEffect ?? (searchbox ? ["bottom"] : ["top", "bottom"]);

    return createPortal(
      <DrawerContainer
        aria-label="combobox-drawer-mobile"
        $theme={comboboxTheme}
        $mobile={mobile}
      >
        {finalFadeEffect?.includes("top") && (
          <FadeTop
            aria-label="combobox-fade-top"
            $theme={comboboxTheme}
            $visible={showFadeTop}
          />
        )}
        {finalFadeEffect?.includes("bottom") && (
          <FadeBottom
            aria-label="combobox-fade-bottom"
            $theme={comboboxTheme}
            $visible={showFadeBottom}
          />
        )}
        {mainCombobox}
      </DrawerContainer>,
      document.body
    );
  }

  return mainCombobox;
}

const DrawerContainer = styled.div<{
  $theme?: ComboboxThemeConfig;
  $mobile?: boolean;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }
  overflow: hidden;
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 96dvw;
  z-index: 99939999;
  border-radius: 14px;
  background-color: ${({ $mobile, $theme }) =>
    $mobile ? $theme.mobileBackgroundColor : $theme.backgroundColor};
`;

const DrawerWrapper = styled.ul<{
  $width?: number;
  $theme: ComboboxThemeConfig;
  $style?: CSSProp;
  $mobile?: boolean;
  $searchbox?: boolean;
  $hasNestedOptions?: boolean;
  $drawerHeight?: string;
}>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }
  list-style: none;
  margin: 0;
  padding: 0;

  position: relative;
  z-index: 9992999;
  overflow-y: auto;
  border-radius: 4px;
  border: 1px solid
    ${({ $theme, $mobile }) =>
      $mobile ? $theme?.fadeColor : $theme?.borderColor};
  background-color: ${({ $theme }) => $theme?.backgroundColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};
  width: ${({ $width }) => ($width ? `${$width}px` : "100%")};

  scrollbar-width: thin;
  scrollbar-color: ${({ $theme }) => $theme?.scrollThumbColor || "#52525b"}
    transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 4px;
  }

  ${({ $mobile, $theme, $searchbox, $hasNestedOptions, $drawerHeight }) => {
    const $height = $drawerHeight ?? "220px";

    return css`
      min-height: fit-content;
      max-height: ${$height};

      ${$mobile &&
      css`
        width: 100%;
        z-index: 9992999;
        border-radius: 14px;
        min-height: ${$height};
        max-height: ${$height};
        border-width: 0.5;
        ${!$searchbox &&
        css`
          padding: calc(${$height} * 0.4545) 0;
        `}

        background-color: ${$mobile && $hasNestedOptions
          ? $theme.mobileGroupBackgroundColor
          : $mobile
            ? $theme.mobileBackgroundColor
            : $theme.backgroundColor};
      `}
    `;
  }}

  ${({ $style }) => $style}
`;

const rowStyle = ({
  interactionMode,
  multiple,
  theme,
  mobile,
  hasNestedOptions,
  level,
}: {
  interactionMode?: "mouse" | "keyboard";
  multiple?: boolean;
  theme?: ComboboxThemeConfig;
  mobile?: boolean;
  hasNestedOptions?: boolean;
  level?: number;
}) => css`
  transition: background-color 0ms;
  background-color: ${mobile
    ? theme.mobileBackgroundColor
    : theme.backgroundColor};
  color: ${theme.textColor};
  min-height: 36px;

  ${mobile &&
  css`
    padding: 6px 15px;
    font-size: 22px;
    ${hasNestedOptions &&
    css`
      padding-left: ${(level ?? 0) * 14 + 30}px;
    `}
  `}

  &[data-has-options="false"] {
    ${interactionMode !== "mouse" &&
    css`
      background-color: ${mobile
        ? theme.mobileBackgroundColor
        : theme.backgroundColor};
    `}
  }

  ${interactionMode === "mouse" &&
  css`
    &:hover {
      background-color: ${theme.highlightBackgroundColor};
    }
  `}

  &[data-highlighted="true"] {
    ${interactionMode !== "mouse" &&
    css`
      background-color: ${theme.highlightBackgroundColor};
    `}
  }

  &[data-action-opened="true"] {
    background-color: ${theme.highlightBackgroundColor};
  }

  &[data-selected="true"] {
    ${!multiple &&
    css`
      font-weight: 600;
      background-color: ${theme.selectedBackgroundColor};
      color: ${theme.selectedTextColor};

      &:hover {
        background-color: ${theme.selectedBackgroundColor};
      }
    `}
  }
`;

const FadeTop = styled.div<{
  $style?: CSSProp;
  $theme: ComboboxThemeConfig;
  $visible?: boolean;
}>`
  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 40px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  background: linear-gradient(
    to bottom,
    ${({ $theme }) => $theme.fadeColor} 10%,
    transparent 100%
  );
  z-index: 99999999;

  ${({ $style }) => $style}
`;

const FadeBottom = styled.div<{
  $style?: CSSProp;
  $theme: ComboboxThemeConfig;
  $visible?: boolean;
}>`
  pointer-events: none;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
  background: linear-gradient(
    to top,
    ${({ $theme }) => $theme.fadeColor} 10%,
    transparent 100%
  );
  z-index: 99999999;

  ${({ $style }) => $style}
`;

Combobox.Drawer = ComboboxDrawer;

export { Combobox };
