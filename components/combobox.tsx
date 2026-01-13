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
import { List } from "./list";

export type ComboboxProps = Partial<BaseComboboxProps> & {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
};

interface BaseComboboxProps {
  options: OptionsProps[];
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
  styles?: ComboboxStylesProps;
}

interface ComboboxStylesProps {
  containerStyle?: CSSProp;
  selectboxStyle?: CSSProp;
  labelStyle?: CSSProp;
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
    },
    ref
  ) => {
    return (
      <ComboboxWrapper
        $style={styles?.containerStyle}
        aria-label={`combobox-${name}`}
      >
        {label && <Label $style={styles?.labelStyle}>{label}</Label>}
        <Selectbox
          ref={ref}
          highlightOnMatch={highlightOnMatch}
          styles={{
            self: css`
              ${styles?.selectboxStyle}
              ${showError &&
              css`
                border-color: #f87171;
              `}
            `,
          }}
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
                styles={styles}
                inputRef={props.ref}
                name={name}
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

        {showError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
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
  name,
  interactionMode,
  setInteractionMode,
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
      aria-label={`combobox-drawer-${name}`}
      role="listbox"
      $width={refs.reference.current?.getBoundingClientRect().width}
      style={{ ...floatingStyles }}
    >
      {(options || actions) && (
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
                padding-right: 7px;
                padding-left: 7px;
              `,
              iconStyle: css`
                left: 16px;
              `,
              style: css`
                max-height: 35px;
                margin-top: 7px;
                margin-bottom: 7px;
                padding-bottom: 7px;
                padding-top: 7px;
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
          {actions &&
            actions.map((props, index) => {
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
                      titleStyle: listItemTitleStyle,
                      rowStyle: listItemRowStyle({
                        shouldHighlight,
                        interactionMode,
                      }),
                      containerStyle: listItemContainerStyle,
                      leftSideStyle: listItemLeftSideStyle,
                    }}
                    title={
                      <>
                        {props.title}
                        {props.icon && (
                          <IconWrapper>
                            <props.icon size={16} />
                          </IconWrapper>
                        )}
                      </>
                    }
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => {
                      props.onClick?.();
                      setIsOpen(false);
                    }}
                  />

                  {isLast && <Divider aria-label="divider" aria-hidden />}
                </Fragment>
              );
            })}

          {options.length > 0 ? (
            options.map((option, index) => {
              const isSelected = selectedOptions.includes(option.value);
              const shouldHighlight =
                highlightOnMatch && isSelected
                  ? true
                  : highlightedIndex === index + (actions?.length || 0);

              return (
                <List.Item
                  id={option.value}
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
                      if (!selectedOptions.includes(option.value)) {
                        if (
                          !maxSelectableItems ||
                          selectedOptions.length < maxSelectableItems
                        ) {
                          setSelectedOptions([
                            ...selectedOptions,
                            option.value,
                          ]);
                        }
                      } else {
                        setSelectedOptions(
                          selectedOptions.filter((val) => val !== option.value)
                        );
                      }
                      (
                        inputRef as RefObject<HTMLInputElement>
                      )?.current?.focus();
                    } else {
                      setIsOpen(false);
                      setSelectedOptionsLocal(option);
                      setSelectedOptions([option.value]);
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

const EmptyState = styled.li`
  padding: 0.5rem;
  text-align: center;
  color: #6b7280;
`;

export { Combobox };
