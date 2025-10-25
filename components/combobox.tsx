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

import { DrawerProps, OptionsProps, Selectbox } from "./selectbox";
import { RemixiconComponentType } from "@remixicon/react";
import styled, { css, CSSProp } from "styled-components";
import { Searchbox } from "./searchbox";
import { Checkbox } from "./checkbox";

export type ComboboxProps = Partial<BaseComboboxProps> & {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
};

interface BaseComboboxProps {
  options: OptionsProps[];
  containerStyle?: CSSProp;
  selectboxStyle?: CSSProp;
  labelStyle?: CSSProp;
  selectedOptions: string[];
  setSelectedOptions: (data: string[]) => void;
  clearable?: boolean;
  placeholder?: string;
  emptySlate?: string;
  highlightOnMatch?: boolean;
  strict?: boolean;
  actions?: ComboboxActionProps[];
  name?: string;
  multiple?: boolean;
  maxSelectableItems?: number | undefined;
}

export interface ComboboxActionProps {
  onClick?: () => void;
  icon?: RemixiconComponentType;
  title: string;
  style?: CSSProp;
}

type ComboboxDrawerProps = Omit<DrawerProps, "refs"> &
  BaseComboboxProps & {
    inputRef?: Ref<HTMLInputElement>;
    handleKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    selectedOptionsLocal: OptionsProps;
    setSelectedOptionsLocal: (value: OptionsProps) => void;
    setHasInteracted?: (value: boolean) => void;
    refs?: {
      setFloating?: Ref<HTMLUListElement>;
      reference?: Ref<HTMLElement> & { current?: HTMLElement | null };
    };
  };

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      setSelectedOptions,
      clearable = false,
      placeholder,
      containerStyle,
      selectboxStyle,
      labelStyle,
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
    },
    ref
  ) => {
    return (
      <ComboboxWrapper $style={containerStyle} aria-label={`combobox-${name}`}>
        {label && <Label $style={labelStyle}>{label}</Label>}
        <Selectbox
          ref={ref}
          highlightOnMatch={highlightOnMatch}
          containerStyle={containerStyle}
          selectboxStyle={css`
            ${selectboxStyle}
            ${showError &&
            css`
              border-color: #f87171;
            `}
          `}
          options={options}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          placeholder={placeholder}
          clearable={clearable}
          strict={strict}
          onKeyDown={onKeyDown}
          multiple={multiple}
          maxSelectableItems={maxSelectableItems}
          actions={actions}
        >
          {(props) => {
            return (
              <ComboboxDrawer
                {...props}
                inputRef={props.ref}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
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

        {showError && <ErrorText>{errorMessage}</ErrorText>}
      </ComboboxWrapper>
    );
  }
);

const ComboboxWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  position: relative;

  ${({ $style }) => $style}
`;

const Label = styled.label<{ $style?: CSSProp }>`
  ${({ $style }) => $style}
`;

const ErrorText = styled.span`
  color: #dc2626;
`;

function ComboboxDrawer({
  floatingStyles,
  getFloatingProps,
  highlightedIndex,
  highlightOnMatch,
  listRef,
  options,
  refs,
  setHighlightedIndex,
  setSelectedOptions,
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
}: ComboboxDrawerProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const floatingRef = useRef<HTMLUListElement>(null);

  const selectedIndex = useMemo(
    () =>
      options.findIndex((option) => selectedOptions.includes(option.value)) +
      (actions?.length ?? 0),
    [options, selectedOptions, actions]
  );

  useEffect(() => {
    if (!hasScrolled && selectedOptions.length > 0 && options.length > 0) {
      const selectedEl = listRef.current[selectedIndex];
      if (selectedEl) {
        requestAnimationFrame(() => {
          selectedEl.scrollIntoView({ block: "center" });
        });
        setHasScrolled(true);
      }
    }
  }, [selectedIndex]);

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
      role="listbox"
      $width={refs.reference.current?.getBoundingClientRect().width}
      style={{ ...floatingStyles }}
    >
      {multiple && (
        <Fragment>
          <Searchbox
            ref={inputRef}
            autoComplete="off"
            onKeyDown={handleKeyDown}
            name="multiple"
            value={selectedOptionsLocal.text}
            containerStyle={css`
              position: sticky;
              top: 0;
              background-color: white;
              z-index: 30;
              height: 38px;
              padding-right: 7px;
              padding-left: 7px;
            `}
            iconStyle={css`
              left: 16px;
            `}
            style={css`
              max-height: 35px;
              margin-top: 7px;
              margin-bottom: 7px;
              padding-bottom: 7px;
              padding-top: 7px;
            `}
            onChange={(e) => {
              const { value } = e.target;
              setHasInteracted(true);
              setHighlightedIndex(0);
              setSelectedOptionsLocal({
                ...selectedOptionsLocal,
                text: value,
              });
            }}
          />
        </Fragment>
      )}

      {actions && (
        <ActionWrapper>
          {actions.map((data, index) => {
            const shouldHighlight = highlightedIndex === index;

            return (
              <ActionItem
                key={index}
                id={`action-${index}`}
                ref={(el: HTMLLIElement) => {
                  listRef.current[index] = el;
                }}
                $highlighted={shouldHighlight}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => {
                  data.onClick?.();
                  setIsOpen(false);
                }}
                $style={data.style}
              >
                <div>{data.title}</div>
                {data.icon && (
                  <IconWrapper>
                    <data.icon size={16} />
                  </IconWrapper>
                )}
              </ActionItem>
            );
          })}
          <Divider aria-label="divider" />
        </ActionWrapper>
      )}
      {options.length > 0 ? (
        options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.value);
          const shouldHighlight =
            highlightOnMatch && isSelected
              ? true
              : highlightedIndex === index + (actions?.length || 0);
          return (
            <OptionItem
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={isSelected && !multiple}
              data-highlighted={shouldHighlight}
              $selected={isSelected && !multiple}
              $highlighted={shouldHighlight}
              $optionDisplay={!!option.render}
              onMouseDown={(e) => {
                e.preventDefault();
                if (multiple) {
                  if (!selectedOptions.includes(option.value)) {
                    if (
                      !maxSelectableItems ||
                      selectedOptions.length < maxSelectableItems
                    ) {
                      setSelectedOptions([...selectedOptions, option.value]);
                    }
                  } else {
                    setSelectedOptions(
                      selectedOptions.filter((val) => val !== option.value)
                    );
                  }
                  (inputRef as RefObject<HTMLInputElement>)?.current?.focus();
                } else {
                  setIsOpen(false);
                  setSelectedOptionsLocal(option);
                  setSelectedOptions([option.value]);
                  setHasInteracted(false);
                }

                onClick?.();
              }}
              onMouseEnter={() =>
                setHighlightedIndex(index + (actions?.length || 0))
              }
              ref={(el) => {
                listRef.current[index + (actions?.length || 0)] = el;
              }}
            >
              {multiple && (
                <Checkbox
                  iconStyle={css`
                    width: 8px;
                    height: 8px;
                  `}
                  inputStyle={css`
                    width: 14px;
                    height: 14px;
                  `}
                  containerStyle={css`
                    ${option?.render &&
                    css`
                      margin-top: 3px;
                    `}
                  `}
                  checked={isSelected}
                />
              )}
              {option?.render ? option?.render : option.text}
            </OptionItem>
          );
        })
      ) : (
        <EmptyState>{emptySlate}</EmptyState>
      )}
    </DrawerWrapper>
  );
}

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

const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ActionItem = styled.li<{ $style?: CSSProp; $highlighted?: boolean }>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;

  ${({ $highlighted }) => ($highlighted ? "background-color: #dbeafe;" : "")}

  &:hover {
    background-color: #dbeafe;
  }

  ${({ $style }) => $style}
`;

const IconWrapper = styled.span`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #d1d5db;
  margin: 2px 0;
`;

const OptionItem = styled.li<{
  $selected?: boolean;
  $highlighted?: boolean;
  $optionDisplay: boolean;
}>`
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: row;
  gap: 8px;

  ${({ $optionDisplay }) =>
    $optionDisplay
      ? css`
          align-items: start;
        `
      : css`
          align-items: center;
        `}

  ${({ $highlighted }) => ($highlighted ? "background-color: #dbeafe;" : "")}
  ${({ $selected }) =>
    $selected
      ? `
    background-color: #61A9F9;
    font-weight: 600;
    color: white;
  `
      : ""}
`;

const EmptyState = styled.li`
  padding: 0.5rem;
  text-align: center;
  color: #6b7280;
`;

export { Combobox };
