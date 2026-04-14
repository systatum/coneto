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
import { List, ListItemStyles } from "./list";
import { FieldLaneProps } from "./field-lane";
import { Figure, FigureProps } from "./figure";
import { StatefulForm } from "./stateful-form";
import { useTheme } from "./../theme/provider";
import { ComboboxThemeConfig } from "./../theme";

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
  controlled?: boolean;
}

export const ComboboxGroupInitialState = {
  Opened: "opened",
  Closed: "closed",
} as const;

export type ComboboxGroupInitialState =
  (typeof ComboboxGroupInitialState)[keyof typeof ComboboxGroupInitialState];

export interface ComboboxGroupedOption {
  category?: string;
  options?: ComboboxSingleOption[];
  collapsible?: boolean;
  hidden?: boolean;
  initialState?: ComboboxGroupInitialState;
}

export type ComboboxSingleOption = SelectboxOption;

export type ComboboxOption = ComboboxSingleOption | ComboboxGroupedOption;

export interface ComboboxLabelsProps extends SelectboxLabels {}

export interface ComboboxStyles extends Omit<SelectboxStyles, "self"> {
  containerStyle?: CSSProp;
  selectboxStyle?: CSSProp;
  labelStyle?: CSSProp;
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
      controlled = false,
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
        ?.filter(isGroupedOption)
        ?.filter((item) => !item?.hidden)
        ?.filter((item) => (item?.initialState ?? "closed") === "opened")
        ?.map((item) => item.category!);
    }, [options]);

    const [openedCategoryGroup, setOpenedCategoryGroup] = useState<Set<string>>(
      () => new Set(finalGroup)
    );

    const flatOptions = useMemo(() => {
      return options
        ?.map((item) => {
          if (isGroupedOption(item)) {
            if (openedCategoryGroup.has(item.category)) {
              return item.options ?? [];
            }
            return [];
          }
          return [item];
        })
        ?.flat()
        ?.filter((option) => !option.hidden);
    }, [options, openedCategoryGroup]);

    return (
      <Selectbox
        ref={ref}
        isLoading={isLoading}
        helper={helper}
        errorIconPosition={errorIconPosition}
        dropdowns={dropdowns}
        showError={showError}
        errorMessage={errorMessage}
        labelGap={labelGap}
        controlled={controlled}
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
          const filteredForDrawer = props?.hasInteracted
            ? (options
                ?.map((item) => {
                  if (isGroupedOption(item)) {
                    const matched = item.options?.filter(
                      (opt) =>
                        !opt.hidden &&
                        opt.text
                          .toLowerCase()
                          .includes(
                            props?.selectedOptionsLocal.text.toLowerCase()
                          )
                    );

                    return matched && matched.length > 0
                      ? { ...item, options: matched }
                      : null;
                  }

                  if (
                    !item.hidden &&
                    item.text
                      .toLowerCase()
                      .includes(props?.selectedOptionsLocal.text.toLowerCase())
                  ) {
                    return item;
                  }

                  return null;
                })
                ?.filter(Boolean) as typeof options)
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
}: ComboboxDrawerProps) {
  const { currentTheme } = useTheme();
  const comboboxTheme = currentTheme?.combobox;

  const [hasScrolled, setHasScrolled] = useState(false);

  const floatingRef = useRef<HTMLUListElement>(null);

  const finalOptions = useMemo<SelectboxOption[]>(() => {
    return (
      options?.flatMap((item) => {
        if (isGroupedOption(item)) {
          return item?.options?.filter((option) => !option?.hidden) ?? [];
        }

        return item?.hidden ? [] : [item];
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

  const filteredActions = Array.isArray(actions)
    ? actions?.filter((action) => !action?.hidden)
    : [];

  const hasActions = filteredActions?.length > 0;

  const computedOptions = useMemo(() => {
    let index = actions?.length || 0;

    const mapped = (options ?? [])
      ?.filter((item) => !item?.hidden)
      ?.map((item) => {
        if (isGroupedOption(item)) {
          const groupOptions = (item.options ?? [])
            ?.filter((option) => !option?.hidden)
            ?.map((option) => ({
              option,
              index: openedCategoryGroup.has(item.category) ? index++ : null,
            }));

          return {
            type: "group",
            category: item.category,
            options: groupOptions,
            collapsible: item.collapsible ?? true,
            initialState: item.initialState ?? "closed",
          };
        }

        return {
          type: "item",
          option: item,
          index: index++,
        };
      });

    const totalOptions = mapped.flatMap((item) => item).length;

    return { mapped, totalOptions };
  }, [options, openedCategoryGroup]);

  function renderOption(option: SelectboxOption, index: number) {
    const optionValue = String(option.value);
    const isSelected = finalSelectedOptions.includes(optionValue);

    const shouldHighlight =
      highlightOnMatch && isSelected ? true : highlightedIndex === index;

    return (
      <List.Item
        id={String(option.value)}
        title={option.render ? option.render : option.text}
        styles={{
          rowStyle: listItemRowStyle({
            shouldHighlight,
            interactionMode,
            isSelected,
            multiple,
            theme: comboboxTheme,
          }),
          containerStyle: listItemContainerStyle,
          leftSideStyle: [
            listItemLeftSideStyle,
            option.render && listItemLeftSideWithRender,
          ],
          titleStyle: [
            listItemTitleStyle,
            option.render && listItemTitleWithRender,
          ],
        }}
        selectedOptions={{ checked: isSelected }}
        onMouseDown={(e) => {
          e.preventDefault();
          if (multiple) {
            if (!finalSelectedOptions.includes(optionValue)) {
              if (
                !maxSelectableItems ||
                finalSelectedOptions?.length < maxSelectableItems
              ) {
                handleOnChange([...finalSelectedOptions, optionValue]);
              }
            } else {
              handleOnChange(
                finalSelectedOptions.filter((val) => val !== option.value)
              );
            }
            (inputRef as RefObject<HTMLInputElement>)?.current?.focus();
          } else {
            setIsOpen(false);
            setConfirmedValue(option);
            setSelectedOptionsLocal(option);
            handleOnChange([optionValue]);
            setHasInteracted(false);
          }

          requestAnimationFrame(() => {
            setHighlightedIndex(null);
          });
          onClick?.();
        }}
        onMouseMove={() => {
          if (interactionMode !== "mouse") {
            setInteractionMode("mouse");
          }
        }}
        onMouseEnter={() => {
          if (interactionMode !== "mouse") return;

          if (typeof index === "number") {
            setHighlightedIndex(index);
          }
        }}
        ref={(el) => {
          if (typeof index === "number") {
            listRef.current[index] = el;
          }
        }}
      />
    );
  }

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
    >
      {(finalOptions || actions) && (
        <List
          onOpen={({ id }) => {
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
          styles={{
            containerStyle: listContainerStyle,
            searchboxStyles: {
              containerStyle: css`
                position: sticky;
                top: 0;
                background-color: ${comboboxTheme?.backgroundColor};
                z-index: 30;
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
            },
          }}
          inputRef={inputRef}
          selectable={multiple}
          searchable={multiple}
          onSearchKeyDown={handleKeyDown}
          searchValue={selectedOptionsLocal.text}
          onSearchRequested={(e) => {
            const { value } = e.target;
            setHasInteracted(true);
            setHighlightedIndex(0);
            setSelectedOptionsLocal({
              ...selectedOptionsLocal,
              text: value,
            });
          }}
        >
          {hasActions &&
            filteredActions.map((action, index) => {
              const shouldHighlight = highlightedIndex === index;
              const isLast = index === actions?.length - 1;

              return (
                <Fragment key={index}>
                  <List.Item
                    id={`action-${index}`}
                    ref={(el) => {
                      listRef.current[index] = el;
                    }}
                    styles={{
                      ...action?.styles,
                      titleStyle: css`
                        ${listItemTitleStyle}
                        ${action?.styles?.titleStyle}
                      `,
                      rowStyle: css`
                        ${listItemRowStyle({
                          shouldHighlight,
                          interactionMode,
                          theme: comboboxTheme,
                        })}
                        ${action?.styles?.rowStyle}
                      `,
                      containerStyle: css`
                        ${listItemContainerStyle}
                        ${action?.styles?.containerStyle}
                      `,
                      leftSideStyle: css`
                        ${listItemLeftSideStyle}
                        ${action?.styles?.leftSideStyle}
                      `,
                    }}
                    title={
                      <>
                        {action.title}
                        {action.icon && <Figure {...action.icon} />}
                      </>
                    }
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      action.onClick?.();
                      setIsOpen(false);
                    }}
                  />

                  {isLast && (
                    <Divider
                      $theme={comboboxTheme}
                      aria-label="divider"
                      aria-hidden
                    />
                  )}
                </Fragment>
              );
            })}

          {computedOptions?.totalOptions > 0 ? (
            computedOptions.mapped?.map((item) => {
              if (item.type === "group") {
                return (
                  <List.Group
                    styles={{
                      contentStyle: css`
                        gap: 0px;
                      `,
                      rowStyle: css`
                        background-color: ${comboboxTheme?.groupBackgroundColor};
                        padding-bottom: 8px;
                      `,
                      titleStyle: css`
                        font-size: 12px;
                        padding-left: 12px;
                      `,
                    }}
                    onClick={({ toggle }) => {
                      if (item.collapsible) toggle();
                    }}
                    openerStyle={item.collapsible ? "chevron" : "none"}
                    initialState={item.initialState}
                    key={item.category}
                    id={item.category}
                    title={item.category}
                  >
                    {item.options.map(({ option, index }) =>
                      renderOption(option, index!)
                    )}
                  </List.Group>
                );
              } else {
                return renderOption(item.option, item.index);
              }
            })
          ) : (
            <EmptyState $theme={comboboxTheme}>{emptySlate}</EmptyState>
          )}
        </List>
      )}
    </DrawerWrapper>
  );
}

const listContainerStyle = css`
  gap: 0px;
`;

const listItemContainerStyle = css`
  padding: 0px;
`;

const listItemLeftSideStyle = css`
  padding: 0px;
`;

const listItemTitleStyle = css`
  font-weight: 400;
  padding: 0px;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: inherit;
  &:hover {
    color: inherit;
  }
`;

const listItemRowStyle = ({
  shouldHighlight,
  interactionMode,
  isSelected,
  multiple,
  theme,
}: {
  shouldHighlight?: boolean;
  interactionMode?: "mouse" | "keyboard";
  isSelected?: boolean;
  multiple?: boolean;
  theme?: ComboboxThemeConfig;
}) => css`
  border-radius: 0px;
  padding: 0.5rem 0.75rem;
  transition: background-color 0ms;
  background-color: ${theme.backgroundColor};
  color: ${theme.textColor};

  ${interactionMode !== "mouse" &&
  css`
    background-color: ${theme.backgroundColor};
    &:hover {
      background-color: ${theme.backgroundColor};
    }
  `}

  ${isSelected &&
  !multiple &&
  css`
    font-weight: 600;
    background-color: ${theme.selectedBackgroundColor};
    color: ${theme.selectedTextColor};
    &:hover {
      color: ${theme.textColor};
    }
  `};

  ${shouldHighlight &&
  css`
    background-color: ${theme.highlightBackgroundColor};
    color: ${theme.textColor};

    &:hover {
      background-color: ${theme.highlightBackgroundColor};
    }
  `};
`;

const listItemLeftSideWithRender = css`
  align-items: start;
  padding-top: 3px;
`;

const listItemTitleWithRender = css`
  transform: translateY(-4px);
`;

const DrawerWrapper = styled.ul<{
  $width?: number;
  $theme: ComboboxThemeConfig;
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

function isGroupedOption(
  item: ComboboxSingleOption | ComboboxGroupedOption
): item is ComboboxGroupedOption {
  return "options" in item;
}

export { Combobox };
