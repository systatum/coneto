import {
  forwardRef,
  Fragment,
  KeyboardEvent,
  Ref,
  RefObject,
  useEffect,
  useMemo,
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
  selectionOptions: string[];
  setSelectionOptions: (data: string[]) => void;
  clearable?: boolean;
  placeholder?: string;
  emptySlate?: string;
  highlightOnMatch?: boolean;
  strict?: boolean;
  actions?: ComboboxActionProps[];
  name?: string;
  multiple?: boolean;
}

export interface ComboboxActionProps {
  onClick?: () => void;
  icon?: RemixiconComponentType;
  title: string;
  style?: CSSProp;
}

type ComboboxDrawerProps = Omit<DrawerProps, "refs"> &
  BaseComboboxProps & {
    refInput?: Ref<HTMLInputElement>;
    selectionOptionsLocal: OptionsProps;
    setSelectionOptionsLocal: (value: OptionsProps) => void;
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
      setSelectionOptions,
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
      selectionOptions,
      strict,
      actions,
      onKeyDown,
      onClick,
      name,
      multiple,
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
          selectionOptions={selectionOptions}
          setSelectionOptions={setSelectionOptions}
          placeholder={placeholder}
          clearable={clearable}
          strict={strict}
          onKeyDown={onKeyDown}
          multiple={multiple}
        >
          {(props) => {
            return (
              <ComboboxDrawer
                {...props}
                refInput={props.ref}
                selectionOptions={selectionOptions}
                setSelectionOptions={setSelectionOptions}
                highlightOnMatch={highlightOnMatch}
                emptySlate={emptySlate}
                actions={actions}
                onClick={onClick}
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
  setSelectionOptions,
  setSelectionOptionsLocal,
  selectionOptionsLocal,
  selectionOptions,
  setIsOpen,
  actions,
  onClick,
  multiple,
  emptySlate = "Not Available.",
  setHasInteracted,
  refInput,
}: ComboboxDrawerProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  const selectedIndex = useMemo(
    () =>
      options.findIndex((option) => selectionOptions.includes(option.value)),
    [options, selectionOptions]
  );

  useEffect(() => {
    if (
      !hasScrolled &&
      selectionOptions.length > 0 &&
      !multiple &&
      options.length > 0
    ) {
      const selectedEl = listRef.current[selectedIndex];
      if (selectedEl) {
        requestAnimationFrame(() => {
          selectedEl.scrollIntoView({ block: "center" });
        });
        setHasScrolled(true);
      }
    }
  }, [selectedIndex]);

  return (
    <DrawerWrapper
      {...getFloatingProps()}
      ref={refs.setFloating}
      id="combo-list"
      role="listbox"
      $width={refs.reference.current?.getBoundingClientRect().width}
      style={{ ...floatingStyles }}
    >
      {multiple && (
        <Fragment>
          <Searchbox
            ref={refInput}
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                setHighlightedIndex(
                  highlightedIndex === null
                    ? 0
                    : Math.min(highlightedIndex + 1, options.length - 1)
                );
                e.preventDefault();
              } else if (e.key === "ArrowUp") {
                setHighlightedIndex(
                  highlightedIndex === null
                    ? options.length - 1
                    : Math.max(highlightedIndex - 1, 0)
                );
                e.preventDefault();
              } else if (e.key === "Enter") {
                if (highlightedIndex !== null) {
                  const selectedOption = options[highlightedIndex];
                  if (multiple) {
                    setSelectionOptions(
                      selectionOptions.includes(selectedOption.value)
                        ? selectionOptions.filter(
                            (v) => v !== selectedOption.value
                          )
                        : [...selectionOptions, selectedOption.value]
                    );
                  } else {
                    setSelectionOptions([selectedOption.value]);
                  }
                }
                e.preventDefault();
              }
            }}
            name="multiple"
            value={selectionOptionsLocal.text}
            containerStyle={css`
              padding: 4px;
              background-color: white;
              position: sticky;
              top: 0;
              z-index: 30;
            `}
            onChange={(e) => {
              const { value } = e.target;
              setHasInteracted(true);
              setSelectionOptionsLocal({
                ...selectionOptionsLocal,
                text: value,
              });
            }}
          />
        </Fragment>
      )}
      {actions && (
        <ActionWrapper>
          {actions.map((data, index) => (
            <ActionItem
              key={index}
              onMouseEnter={() => setHighlightedIndex(null)}
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
          ))}
          <Divider aria-label="divider" />
        </ActionWrapper>
      )}
      {options.length > 0 ? (
        options.map((option, index) => {
          const isSelected = selectionOptions.includes(option.value);
          const shouldHighlight =
            highlightOnMatch && isSelected ? true : highlightedIndex === index;

          return (
            <OptionItem
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={isSelected && !multiple}
              data-highlighted={shouldHighlight}
              $selected={isSelected && !multiple}
              $highlighted={shouldHighlight}
              onClick={() => {
                if (multiple) {
                  setSelectionOptions(
                    selectionOptions.includes(option.value)
                      ? selectionOptions.filter((val) => val !== option.value)
                      : [...selectionOptions, option.value]
                  );
                } else {
                  setIsOpen(false);
                  setSelectionOptionsLocal(option);
                  setSelectionOptions([option.value]);
                }
                onClick?.();
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              ref={(el) => {
                listRef.current[index] = el;
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
                  checked={isSelected}
                />
              )}
              {option.text}
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

const ActionItem = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  gap: 0.5rem;

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

const OptionItem = styled.li<{ $selected?: boolean; $highlighted?: boolean }>`
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

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
