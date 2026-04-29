import {
  forwardRef,
  Fragment,
  KeyboardEvent,
  Ref,
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
import { List, ListItemAction, ListItemStyles } from "./list";
import { FieldLaneDropdownOption, FieldLaneProps } from "./field-lane";
import { FigureProps } from "./figure";
import { StatefulForm } from "./stateful-form";
import { useTheme } from "./../theme/provider";
import { ComboboxThemeConfig } from "./../theme";
import { applyClassName } from "./../constants/classname";
import {
  TreeList,
  TreeListAction,
  TreeListContent,
  TreeListItem,
} from "./treelist";
import { Searchbox } from "./searchbox";

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
}

export const ComboboxGroupInitialState = {
  Opened: "opened",
  Closed: "closed",
} as const;

export type ComboboxGroupInitialState =
  (typeof ComboboxGroupInitialState)[keyof typeof ComboboxGroupInitialState];

export type ComboboxOption = ComboboxSingleOption & {
  groupOptions?: ComboboxOption[];
  groupSetting?: ComboboxGroupSetting;
};

interface ComboboxGroupSetting {
  collapsible?: boolean;
  initialState?: ComboboxGroupInitialState;
}

export type ComboboxSingleOption = SelectboxOption & ComboboxActionOption;

export interface ComboboxActionOption {
  actions?: (id?: string) => ComboboxItemAction[];
}

export type ComboboxItemAction = ListItemAction;

export type ComboboxDropdownOption = FieldLaneDropdownOption;

export interface ComboboxLabelsProps extends SelectboxLabels {}

export interface ComboboxStyles extends Omit<SelectboxStyles, "self"> {
  containerStyle?: CSSProp;
  selectboxStyle?: CSSProp;
  labelStyle?: CSSProp;
  drawerStyle?: CSSProp;
}

export interface ComboboxAction {
  onClick?: () => void;
  icon?: FigureProps;
  title: string;
  styles?: ComboboxActionStyles;
  hidden?: boolean;
}

export type ComboboxActionStyles = ListItemStyles;

type ComboboxDrawerProps = Omit<DrawerProps, "refs"> &
  BaseComboboxProps & {
    inputRef?: Ref<HTMLInputElement>;
    handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    selectedOptionsLocal: SelectboxOption;
    setSelectedOptionsLocal: (value: SelectboxOption) => void;
    setHasInteracted?: (value: boolean) => void;
    setConfirmedValue?: (option: SelectboxOption | null) => void;
    openedCategoryGroup?: Set<String>;
    setOpenedCategoryGroup?: (
      updater: (prev: Set<string>) => Set<string>
    ) => void;
    refs?: {
      setFloating?: Ref<HTMLUListElement>;
      reference?: Ref<HTMLElement> & { current?: HTMLElement | null };
    };
  };

export interface ComboboxProps
  extends BaseComboboxProps,
    Omit<FieldLaneProps, "styles" | "type" | "children" | "actions"> {}

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
    },
    ref
  ) => {
    const inputId = StatefulForm.sanitizeId({
      prefix: "combobox",
      name,
      id,
    });

    const finalGroup = useMemo(() => {
      return options
        ?.filter((item) => !item?.hidden)
        ?.filter(
          (item) => (item?.groupSetting?.initialState ?? "closed") === "opened"
        )
        ?.map((item) => String(item.value));
    }, [options]);

    const [openedCategoryGroup, setOpenedCategoryGroup] = useState<Set<string>>(
      () => new Set(finalGroup)
    );

    const flatOptions = useMemo<SelectboxOption[]>(() => {
      return (
        options
          ?.flatMap((item) => {
            if (item.hidden) return [];
            if (item.groupOptions?.length) {
              const children = openedCategoryGroup.has(String(item.value))
                ? item.groupOptions.filter((o) => !o.hidden)
                : [];
              return [item, ...children];
            }
            return [item];
          })
          ?.filter(Boolean) ?? []
      );
    }, [options, openedCategoryGroup]);

    return (
      <Selectbox
        ref={ref}
        className={applyClassName("combobox", className)}
        isLoading={isLoading}
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
          const filteredForDrawer: ComboboxOption[] = props?.hasInteracted
            ? (options
                ?.map((item) => {
                  if (item.hidden) return null;
                  // Option with children — filter children by search text
                  if (item.groupOptions?.length) {
                    const matched = item.groupOptions.filter(
                      (opt) =>
                        !opt.hidden &&
                        opt.text
                          .toLowerCase()
                          .includes(
                            props?.selectedOptionsLocal?.text?.toLowerCase() ??
                              ""
                          )
                    );
                    // Also keep parent itself if its own text matches
                    const selfMatches = item.text
                      ?.toLowerCase()
                      .includes(
                        props?.selectedOptionsLocal?.text?.toLowerCase() ?? ""
                      );
                    if (matched.length > 0 || selfMatches) {
                      return { ...item, groupOptions: matched };
                    }
                    return null;
                  }
                  // Flat option
                  if (
                    item.text
                      ?.toLowerCase()
                      .includes(
                        props?.selectedOptionsLocal?.text?.toLowerCase() ?? ""
                      )
                  ) {
                    return item;
                  }
                  return null;
                })
                ?.filter(Boolean) as ComboboxOption[])
            : options;
          return (
            <ComboboxDrawer
              {...props}
              styles={styles}
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
              maxSelectableItems={maxSelectableItems}
              multiple={multiple}
              openedCategoryGroup={openedCategoryGroup}
              setOpenedCategoryGroup={setOpenedCategoryGroup}
            />
          );
        }}
      </Selectbox>
    );
  }
);

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
  setIsOpen,
  actions,
  onClick,
  multiple,
  emptySlate = "Not Available.",
  setHasInteracted,
  inputRef,
  handleKeyDown,
  maxSelectableItems,
  name,
  interactionMode,
  setInteractionMode,
  setConfirmedValue,
  openedCategoryGroup,
  setOpenedCategoryGroup,
  styles,
}: ComboboxDrawerProps) {
  const { currentTheme } = useTheme();
  const comboboxTheme = currentTheme?.combobox;

  const [hasScrolled, setHasScrolled] = useState(false);

  const floatingRef = useRef<HTMLUListElement>(null);

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
      multiple &&
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
  }, [highlightedIndex, multiple, interactionMode]);

  const filteredActions: TreeListAction[] = Array.isArray(actions)
    ? actions
        ?.filter((action) => !action?.hidden)
        .map((action) => ({
          id: action?.title,
          caption: action?.title,
          hidden: action?.hidden,
          icon: action?.icon,
          onClick: action?.onClick,
        }))
    : [];

  const generateContent = (): TreeListContent[] => {
    const mapToItem = (opt: ComboboxOption): TreeListItem => ({
      id: String(opt.value),
      caption: opt.render ?? opt.text,
      collapsible:
        opt?.groupSetting?.collapsible ??
        (opt?.groupOptions?.length > 0 ? true : false),
      className: opt?.groupOptions?.length > 0 ? "has-group-options" : "",
      onClick: ({ withoutSelection }) => {
        if (opt?.groupOptions?.length > 0) {
          withoutSelection();
        }
      },
      ...(opt?.groupOptions?.length > 0
        ? { items: opt.groupOptions.map(mapToItem) }
        : {}),
    });

    const mapToContent = (option: ComboboxOption): TreeListContent => ({
      id: String(option.value),
      caption: option.render ?? option.text,
      initialState: option?.groupSetting?.initialState ?? "closed",
      collapsible:
        option?.groupSetting?.collapsible ??
        (option?.groupOptions?.length > 0 ? true : false),
      className: option?.groupOptions?.length > 0 ? "has-group-options" : "",
      ...(option?.groupOptions?.length > 0
        ? { items: option.groupOptions.map(mapToItem) }
        : {}),
    });

    return options.map(mapToContent);
  };

  return (
    <DrawerWrapper
      {...getFloatingProps()}
      ref={(node) => {
        if (typeof refs.setFloating === "function") {
          refs.setFloating(node);
        }
        floatingRef.current = node;
      }}
      $theme={comboboxTheme}
      id="combo-list"
      aria-label={`combobox-drawer-${name}`}
      role="listbox"
      $width={refs.reference.current?.getBoundingClientRect().width}
      style={{ ...floatingStyles }}
      $style={styles?.drawerStyle}
    >
      {(finalOptions || actions) && (
        <>
          {multiple && (
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
              ref={inputRef}
              value={selectedOptionsLocal.text}
              styles={{
                containerStyle: css`
                  position: sticky;
                  top: 0;
                  background-color: ${comboboxTheme?.backgroundColor};
                  z-index: 10000;
                  height: 38px;
                `,
                iconStyle: css`
                  left: 16px;
                `,
                self: css`
                  max-height: 35px;
                  margin-top: 7px;
                  margin-bottom: 7px;
                  padding-bottom: 7px;
                  padding-top: 7px;
                  margin-left: 4px;
                  margin-right: 4px;
                `,
              }}
            />
          )}
          <TreeList
            emptySlate={emptySlate}
            emptyItemSlate={emptySlate}
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
            arrowSize={14}
            actions={filteredActions}
            styles={{
              actionWrapperStyle: css`
                margin-bottom: 0px;
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
              `,
              textWrapperStyle: css`
                min-height: 36px;
                padding-left: 12px;
                padding-right: 12px;
                padding-top: 8px;
                padding-bottom: 8px;
                &[data-has-options="true"] {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding-left: 18px;
                  padding-right: 8px;
                  background-color: ${comboboxTheme?.groupBackgroundColor};
                }
              `,
              hierarchyLineStyle: css`
                &[data-level="0"] {
                  border-left: none !important;
                }

                &[data-has-options="true"] {
                  border-left: none;
                }
              `,
              titleStyle: css`
                width: 100%;
                font-weight: normal;
                padding: 0px;
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
              itemStyle: css`
                &[data-selected="true"] {
                  background-color: ${comboboxTheme?.selectedBackgroundColor};
                }
              `,
            }}
            showHierarchyLine
            content={generateContent()}
          />
        </>
      )}
    </DrawerWrapper>
  );
}

const DrawerWrapper = styled.ul<{
  $width?: number;
  $theme: ComboboxThemeConfig;
  $style?: CSSProp;
}>`
  position: absolute;
  z-index: 9992999;
  max-height: 15rem;
  overflow-y: auto;
  border-radius: 4px;
  border: 1px solid ${({ $theme }) => $theme?.borderColor};
  background-color: ${({ $theme }) => $theme?.backgroundColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};
  width: ${({ $width }) => ($width ? `${$width}px` : "100%")};

  &::-webkit-scrollbar-thumb {
    background-color: ${({ $theme }) => $theme?.scrollThumbColor || "#3f3f46"};
    border-radius: 999px;
  }

  ${({ $style }) => $style}
`;

const Divider = styled.div<{ $theme: ComboboxThemeConfig }>`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid ${({ $theme }) => $theme.dividerColor};
  margin: 2px 0;
`;

const EmptyState = styled.li<{ $theme: ComboboxThemeConfig }>`
  padding: 0.5rem;
  text-align: center;
  color: ${({ $theme }) => $theme.emptyTextColor};
`;

function isGroupedOption(item: ComboboxOption): item is ComboboxOption {
  return "options" in item && !("value" in item);
}

export { Combobox };
