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
  OptionsProps,
  Selectbox,
  SelectboxLabelsProps,
  SelectboxSelectedOptions,
  SelectboxStylesProps,
} from "./selectbox";
import styled, { css, CSSProp } from "styled-components";
import { List, ListItemStylesProps } from "./list";
import { FieldLaneProps } from "./field-lane";
import { Figure, FigureProps } from "./figure";
import { StatefulForm } from "./stateful-form";
import { FalsyOr } from "./../lib/falsy";

interface BaseComboboxProps {
  selectedOptions?: SelectboxSelectedOptions;
  onChange?: (selectedOptions: SelectboxSelectedOptions) => void;
  clearable?: boolean;
  placeholder?: string;
  emptySlate?: string;
  highlightOnMatch?: boolean;
  actions?: ComboboxActionProps[];
  name?: string;
  multiple?: boolean;
  maxSelectableItems?: number | undefined;
  styles?: ComboboxStylesProps;
  helper?: string;
  disabled?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  strict?: boolean;
  options: OptionsProps[];
  isLoading?: boolean;
  labels?: ComboboxLabelsProps;
}

export interface ComboboxLabelsProps extends SelectboxLabelsProps {}

export interface ComboboxStylesProps
  extends Omit<SelectboxStylesProps, "self"> {
  containerStyle?: CSSProp;
  selectboxStyle?: CSSProp;
  labelStyle?: CSSProp;
}

export type ComboboxActionProps = FalsyOr<ComboboxInternalActionProps>;

export interface ComboboxInternalActionProps {
  onClick?: () => void;
  icon?: FigureProps;
  title: string;
  styles?: ComboboxActionStylesProps;
}

export type ComboboxActionStylesProps = ListItemStylesProps;

type ComboboxDrawerProps = Omit<DrawerProps, "refs"> &
  BaseComboboxProps & {
    inputRef?: Ref<HTMLInputElement>;
    handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    selectedOptionsLocal: OptionsProps;
    setSelectedOptionsLocal: (value: OptionsProps) => void;
    setHasInteracted?: (value: boolean) => void;
    setConfirmedValue?: (option: OptionsProps | null) => void;
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
      strict = true,
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
    },
    ref
  ) => {
    const inputId = StatefulForm.sanitizeId({
      prefix: "combobox",
      name,
      id,
    });

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
            border-color: #d1d5db;
            &:focus {
              border-color: ${showError ? "#f87171" : "#61a9f9"};
            }
            ${dropdowns &&
            css`
              border-top-left-radius: 0px;
              border-bottom-left-radius: 0px;
            `}
            ${styles?.selectboxStyle}
              ${showError &&
            css`
              border-color: #f87171;
            `}
          `,
        }}
        id={inputId}
        options={options}
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
              maxSelectableItems={maxSelectableItems}
              multiple={multiple}
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
}: ComboboxDrawerProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const floatingRef = useRef<HTMLUListElement>(null);

  const finalOptions = useMemo(
    () => (Array.isArray(options) ? options : []),
    [options]
  );

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
      finalOptions.findIndex((option) =>
        finalSelectedOptions.includes(String(option.value))
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
      finalSelectedOptions.length > 0 &&
      finalOptions.length > 0
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
    finalSelectedOptions.length,
    finalOptions.length,
  ]);

  useEffect(() => {
    if (highlightedIndex !== null && listRef.current[highlightedIndex]) {
      const element = listRef.current[highlightedIndex];
      const container = floatingRef.current;

      if (element && container) {
        const searchboxHeight = multiple ? 38 : 0;
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
  }, [highlightedIndex, multiple]);

  const filteredActions = Array.isArray(actions)
    ? actions?.filter((action): action is ComboboxInternalActionProps =>
        Boolean(action)
      )
    : [];

  const hasActions = filteredActions.length > 0;

  return (
    <DrawerWrapper
      {...getFloatingProps()}
      ref={(node) => {
        if (typeof refs.setFloating === "function") {
          refs.setFloating(node);
        }
        floatingRef.current = node;
      }}
      id="combo-list"
      aria-label={`combobox-drawer-${name}`}
      role="listbox"
      $width={refs.reference.current?.getBoundingClientRect().width}
      style={{ ...floatingStyles }}
    >
      {(finalOptions || actions) && (
        <List
          styles={{
            containerStyle: listContainerStyle,
            searchboxStyles: {
              containerStyle: css`
                position: sticky;
                top: 0;
                background-color: white;
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
              const isLast = index === actions.length - 1;

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
                    onClick={() => {
                      action.onClick?.();
                      setIsOpen(false);
                    }}
                  />

                  {isLast && <Divider aria-label="divider" aria-hidden />}
                </Fragment>
              );
            })}

          {finalOptions.length > 0 ? (
            finalOptions.map((option, index) => {
              const optionValue = String(option.value);
              const isSelected = finalSelectedOptions.includes(optionValue);
              const shouldHighlight =
                highlightOnMatch && isSelected
                  ? true
                  : highlightedIndex === index + (actions?.length || 0);

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
                          finalSelectedOptions.length < maxSelectableItems
                        ) {
                          handleOnChange([
                            ...finalSelectedOptions,
                            optionValue,
                          ]);
                        }
                      } else {
                        handleOnChange(
                          finalSelectedOptions.filter(
                            (val) => val !== option.value
                          )
                        );
                      }
                      (
                        inputRef as RefObject<HTMLInputElement>
                      )?.current?.focus();
                    } else {
                      setIsOpen(false);
                      setConfirmedValue(option);
                      setSelectedOptionsLocal(option);
                      handleOnChange([optionValue]);
                      setHasInteracted(false);
                    }

                    onClick?.();
                  }}
                  onMouseMove={() => {
                    if (interactionMode !== "mouse") {
                      setInteractionMode("mouse");
                    }
                  }}
                  onMouseEnter={() => {
                    if (interactionMode !== "mouse") return;

                    setHighlightedIndex(index + (actions?.length || 0));
                  }}
                  ref={(el) => {
                    listRef.current[index + (actions?.length || 0)] = el;
                  }}
                />
              );
            })
          ) : (
            <EmptyState>{emptySlate}</EmptyState>
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
`;

const listItemRowStyle = ({
  shouldHighlight,
  interactionMode,
  isSelected,
  multiple,
}: {
  shouldHighlight?: boolean;
  interactionMode?: "mouse" | "keyboard";
  isSelected?: boolean;
  multiple?: boolean;
}) => css`
  border-radius: 0px;
  padding: 0.5rem 0.75rem;
  transition: background-color 0ms;

  ${interactionMode !== "mouse" &&
  css`
    background-color: white;
  `}

  ${shouldHighlight &&
  css`
    background-color: #dbeafe;
  `}

  ${isSelected &&
  !multiple &&
  css`
    background-color: #61a9f9;
    font-weight: 600;
    color: white;
  `}
`;

const listItemLeftSideWithRender = css`
  align-items: start;
  padding-top: 3px;
`;

const listItemTitleWithRender = css`
  transform: translateY(-4px);
`;

const DrawerWrapper = styled.ul<{ $width?: number }>`
  position: absolute;
  z-index: 1000;
  max-height: 15rem;
  overflow-y: auto;
  border-radius: 4px;
  border: 1px solid #f3f4f6;
  background-color: white;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: ${({ $width }) => ($width ? `${$width}px` : "100%")};
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #d1d5db;
  margin: 2px 0;
`;

const EmptyState = styled.li`
  padding: 0.5rem;
  text-align: center;
  color: #6b7280;
`;

export { Combobox };
