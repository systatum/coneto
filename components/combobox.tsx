import {
  forwardRef,
  KeyboardEvent,
  Ref,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DrawerProps, OptionsProps, Selectbox } from "./selectbox";
import { RemixiconComponentType } from "@remixicon/react";
import styled, { CSSProp } from "styled-components";

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
  inputValue: OptionsProps;
  setInputValue: (data: OptionsProps) => void;
  clearable?: boolean;
  placeholder?: string;
  emptySlate?: string;
  highlightOnMatch?: boolean;
  strict?: boolean;
  actions?: ComboboxActionProps[];
  name?: string;
}

export interface ComboboxActionProps {
  onClick?: () => void;
  icon?: RemixiconComponentType;
  title: string;
  style?: CSSProp;
}

type ComboboxDrawerProps = Omit<DrawerProps, "refs"> &
  BaseComboboxProps & {
    refs?: {
      setFloating?: Ref<HTMLUListElement>;
      reference?: Ref<HTMLElement> & { current?: HTMLElement | null };
    };
  };

const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      setInputValue,
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
      inputValue,
      strict,
      actions,
      onKeyDown,
      onClick,
      name,
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
          selectboxStyle={selectboxStyle}
          options={options}
          inputValue={inputValue}
          setInputValue={setInputValue}
          placeholder={placeholder}
          clearable={clearable}
          strict={strict}
          onKeyDown={onKeyDown}
        >
          {(props) => {
            return (
              <ComboboxDrawer
                {...props}
                highlightOnMatch={highlightOnMatch}
                emptySlate={emptySlate}
                actions={actions}
                onClick={onClick}
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
  setInputValue,
  setIsOpen,
  inputValue,
  actions,
  onClick,
  emptySlate = "Not Available.",
}: ComboboxDrawerProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === inputValue.value),
    [options, inputValue.value]
  );

  useEffect(() => {
    if (!hasScrolled && inputValue?.value != null && options.length > 0) {
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
      width={refs.reference.current?.getBoundingClientRect().width}
      style={{ ...floatingStyles }}
    >
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
          const isSelected = option.value === inputValue.value;
          const shouldHighlight =
            highlightOnMatch && isSelected ? true : highlightedIndex === index;

          return (
            <OptionItem
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={isSelected}
              selected={isSelected}
              data-highlighted={shouldHighlight}
              highlighted={shouldHighlight}
              onMouseDown={() => {
                setInputValue(option);
                setIsOpen(false);
                onClick?.();
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              ref={(el) => {
                listRef.current[index] = el;
              }}
            >
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

const DrawerWrapper = styled.ul<{ width?: number }>`
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
  width: ${({ width }) => (width ? `${width}px` : "100%")};
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

const OptionItem = styled.li<{ selected?: boolean; highlighted?: boolean }>`
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  ${({ highlighted }) => (highlighted ? "background-color: #dbeafe;" : "")}
  ${({ selected }) =>
    selected
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
