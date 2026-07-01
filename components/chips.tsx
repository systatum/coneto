import { RiAddLine } from "@remixicon/react";
import { Badge, BadgeAction, BadgeProps } from "./badge";
import { Checkbox } from "./checkbox";
import {
  ChangeEvent,
  CSSProperties,
  Fragment,
  KeyboardEvent,
  ReactNode,
  Ref,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  autoUpdate,
  flip,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { Textbox } from "./textbox";
import styled, { css, CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStyles } from "./field-lane";
import { useTheme } from "./../theme/provider";
import { ChipsThemeConfig } from "./../theme";
import { applyClassName } from "./../constants/classname";
import { Combobox, ComboboxDrawerProps, ComboboxOption } from "./combobox";
import { SelectboxOption, SelectboxSelectedOptions } from "./selectbox";
import { props } from "cypress/types/bluebird";

export type ChipAction = BadgeAction;

export type ChipProps = BadgeProps;

interface BaseChipsProps {
  options?: ChipProps[];
  inputValue?: string;
  setInputValue?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  filterPlaceholder?: string;
  missingOptionLabel?: string;
  creatable?: boolean;
  selectedOptions?: string[];
  onOptionClicked?: (badgeIds: string[]) => void;
  missingOptionForm?:
    | ReactNode
    | ((props?: MissingOptionFormProps) => ReactNode);
  emptySlate?: string;
  renderer?: (props: ChipRendererProps) => ReactNode;
  styles?: BaseChipsStyles;
  name?: string;
  id?: string;
  disabled?: boolean;
  mobile?: boolean;
  drawerHeight?: string;
}

export interface BaseChipsStyles {
  chipsContainerStyle?: CSSProp;
  chipContainerStyle?: CSSProp;
  chipSelectedStyle?: CSSProp;
  chipStyle?: CSSProp;
  labelStyle?: CSSProp;
  chipsDrawerStyle?: CSSProp;
  containerStyle?: CSSProp;
}

export interface ChipRendererProps {
  id?: string;
  caption?: string;
  metadata?: Record<string, unknown>;
}

export interface MissingOptionFormProps {
  firstInputRef?: Ref<HTMLInputElement>;
  closeForm?: () => void;
}

function BaseChips({
  creatable,
  disabled,
  emptySlate = null,
  filterPlaceholder = "Change or add labels...",
  inputValue,
  missingOptionLabel = "Create a new label:",
  id,
  missingOptionForm,
  name = "search",
  onOptionClicked,
  options = [],
  renderer,
  selectedOptions = [],
  setInputValue,
  styles,
  mobile,
  drawerHeight,
}: BaseChipsProps) {
  const { currentTheme } = useTheme();
  const chipsTheme = currentTheme.chips;

  const inputRef = useRef<HTMLInputElement>(null);
  const inputMissingRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"idle" | "create">("idle");

  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [interactionMode, setInteractionMode] = useState<"mouse" | "keyboard">(
    "keyboard"
  );

  const listRef = useRef<(HTMLLIElement | null)[]>([]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: disabled ? null : setIsOpen,
    middleware: [
      offset(6),
      flip({ fallbackPlacements: ["bottom-end", "top-start", "top-end"] }),
    ],
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // Keep selected options at the top, following the order in selectedOptions.
  // Unselected options preserve their original order.
  const sortedOptions = [...options].sort((a, b) => {
    const aIndex = selectedOptions?.findIndex((id) => id === a.id) ?? -1;
    const bIndex = selectedOptions?.findIndex((id) => id === b.id) ?? -1;

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    return 0;
  });

  const FINAL_OPTIONS: ComboboxOption[] = useMemo(() => {
    return sortedOptions.map((badge, index) => {
      const isSelected = selectedOptions?.some(
        (selectedOption) => selectedOption === badge.id
      );

      return {
        text: badge.caption,
        value: badge.id,
        render: (
          <Fragment key={badge.id}>
            {index > 0 &&
              sortedOptions[index - 1] &&
              selectedOptions?.some(
                (selectedOption) =>
                  selectedOption === sortedOptions[index - 1].id
              ) &&
              !isSelected && (
                <Divider $theme={chipsTheme} aria-label="divider" />
              )}

            <Badge
              {...badge}
              onMouseDown={(e) => e.preventDefault()}
              styles={{
                self: css`
                  cursor: pointer;
                  width: 100%;
                  ${mobile
                    ? css`
                        margin-top: 2px;

                        font-size: 18px;
                      `
                    : css`
                        margin-top: 2px;
                      `}

                  ${styles?.chipStyle}
                `,
              }}
              withCircle
            />
          </Fragment>
        ),
      };
    });
  }, [sortedOptions, selectedOptions, styles?.chipStyle, chipsTheme]);

  const FILTERED_OPTIONS: ComboboxOption[] = useMemo(() => {
    if (!hasInteracted || !inputValue) return FINAL_OPTIONS;

    const search = inputValue.toLowerCase();

    return FINAL_OPTIONS.filter((option) => {
      return option.text?.toLowerCase().includes(search);
    });
  }, [hasInteracted, inputValue, FINAL_OPTIONS]);

  const hasNoFilter = FILTERED_OPTIONS.length === 0 && inputValue.length > 1;

  const RENDER_SELECTED_OPTIONS: BadgeProps[] = useMemo(() => {
    return sortedOptions.filter((badge) =>
      selectedOptions?.some((selectedOption) => selectedOption === badge.id)
    );
  }, [sortedOptions, selectedOptions]);

  useEffect(() => {
    if (isOpen && mode === "idle") {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const finalDrawerHeight = mobile
    ? (drawerHeight ?? "320px")
    : (drawerHeight ?? "220px");

  return (
    <>
      <InputGroup
        id={id}
        aria-label="chip-input"
        $disabled={disabled}
        $containerStyle={styles?.chipsContainerStyle}
      >
        {RENDER_SELECTED_OPTIONS.map((badge) =>
          typeof renderer === "function" ? (
            renderer({
              id: badge.id,
              caption: badge.caption,
              metadata: badge.metadata,
            })
          ) : (
            <Badge
              key={badge.id}
              onClick={(e) => {
                e.stopPropagation();
              }}
              variant={badge.variant}
              backgroundColor={badge.backgroundColor}
              circleColor={badge.circleColor}
              styles={{
                self: css`
                  border-radius: 4px;
                  ${styles?.chipSelectedStyle}
                `,
              }}
              textColor={badge.textColor}
              caption={badge.caption}
              withCircle
            />
          )
        )}

        <AddButton
          $theme={chipsTheme}
          $disabled={disabled}
          ref={refs.setReference}
          role="button"
          $isOpen={isOpen}
          {...getReferenceProps()}
        />
      </InputGroup>

      {isOpen && (
        <Combobox.Drawer
          emptySlate={emptySlate}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          withSearchbox={mobile && mode === "idle"}
          refs={refs as unknown as ComboboxDrawerProps["refs"]}
          highlightedIndex={highlightedIndex}
          setHighlightedIndex={setHighlightedIndex}
          interactionMode={interactionMode}
          setInteractionMode={setInteractionMode}
          selectedOptions={selectedOptions}
          multiple
          selectedOptionsLocal={{
            text: inputValue,
            value: "",
          }}
          styles={{
            drawerStyle: css`
              ${!mobile &&
              css`
                width: fit-content;
                max-width: 240px;
                background-color: ${chipsTheme.backgroundColor};
              `};

              ${finalDrawerHeight &&
              css`
                min-height: ${finalDrawerHeight};
                max-height: ${finalDrawerHeight};
              `};

              ${FILTERED_OPTIONS?.length < 5 && mobile
                ? css`
                    min-height: 80px;
                  `
                : FILTERED_OPTIONS?.length < 5 &&
                  !mobile &&
                  css`
                    min-height: fit-content;
                  `};

              ${mobile &&
              mode === "create" &&
              css`
                padding: 0px;
              `};

              ${mode === "create" &&
              css`
                min-width: 240px;
              `}
            `,
          }}
          onChange={async (selectedOptions?: SelectboxSelectedOptions) => {
            if (!Array.isArray(selectedOptions)) return;
            onOptionClicked?.(selectedOptions as string[]);
          }}
          setSelectedOptionsLocal={(selectedOptionsLocal?: SelectboxOption) => {
            setInputValue?.({
              target: {
                name,
                value: selectedOptionsLocal?.text || "",
              },
            } as ChangeEvent<HTMLInputElement>);
          }}
          setHasInteracted={setHasInteracted}
          options={mode === "idle" ? FILTERED_OPTIONS : []}
          navigableOptions={mode === "idle" ? FILTERED_OPTIONS : []}
          mobile={mobile}
          floatingStyles={floatingStyles}
          getFloatingProps={getFloatingProps}
          listRef={listRef}
          inputRef={inputRef}
        >
          {mode === "idle" && (
            <>
              {!mobile && (
                <>
                  <Textbox
                    ref={inputRef}
                    name={name}
                    type="text"
                    aria-label="chip-input-box"
                    placeholder={filterPlaceholder}
                    value={inputValue}
                    styles={{
                      containerStyle: css`
                        position: sticky;
                        top: 1px;
                        z-index: 99993999;
                      `,
                      self: css`
                        border: none;
                        min-height: 34px;
                        border-radius: 0;
                        border-width: 2px;
                      `,
                    }}
                    autoComplete="off"
                    onChange={(e) => {
                      setHasInteracted?.(true);
                      setInputValue(e);
                      setHighlightedIndex(0);
                      setInteractionMode("keyboard");
                    }}
                  />
                  <Divider $theme={chipsTheme} aria-label="divider" />
                </>
              )}

              {hasNoFilter && creatable && (
                <EmptyOptionContainer
                  onClick={async () => {
                    await setMode("create");
                    await inputMissingRef?.current?.focus();
                  }}
                  $hovered={highlightedIndex === 0}
                  $theme={chipsTheme}
                >
                  <RiAddLine size={14} style={{ minWidth: "14px" }} />
                  <span
                    style={{
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {missingOptionLabel}&nbsp;
                    <span style={{ color: chipsTheme?.mutedTextColor }}>
                      "{inputValue}"
                    </span>
                  </span>
                </EmptyOptionContainer>
              )}
            </>
          )}
          {mode === "create" && (
            <>
              {typeof missingOptionForm === "function"
                ? missingOptionForm({
                    firstInputRef: inputMissingRef,
                    closeForm: async () => {
                      await setMode("idle");
                      await inputRef.current?.focus();
                    },
                  })
                : missingOptionForm}
            </>
          )}
        </Combobox.Drawer>
      )}
    </>
  );
}

const InputGroup = styled.div<{
  $containerStyle?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 3px;

  ${({ $disabled }) =>
    $disabled &&
    css`
      user-select: none;
      cursor: not-allowed;
    `};

  ${({ $containerStyle }) => $containerStyle}
`;

const AddButton = styled(RiAddLine)<{
  $isOpen?: boolean;
  $disabled?: boolean;
  $theme?: ChipsThemeConfig;
}>`
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 9999px;
  padding: 1px;
  color: ${({ $theme }) => $theme?.mutedTextColor || "#c3c3c3"};
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  ${({ $disabled, $theme }) =>
    $disabled
      ? css`
          user-select: none;
          cursor: not-allowed;
        `
      : css`
          &:hover {
            box-shadow: ${$theme?.boxShadow || "0 4px 6px rgba(0,0,0,0.1)"};
            border-color: ${$theme?.borderColor || "#d1d5db"};
          }
        `};

  ${({ $isOpen, $theme }) =>
    $isOpen &&
    css`
      box-shadow: ${$theme?.boxShadow || "0 4px 6px rgba(0,0,0,0.1)"};
      border-color: ${$theme?.borderColor || "#d1d5db"};
    `}
`;

export type ChipsStyles = BaseChipsStyles & FieldLaneStyles;

export interface ChipsProps
  extends Omit<BaseChipsProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns" | "actions"> {
  styles?: ChipsStyles;
}

function Chips({
  label,
  showError,
  styles,
  errorMessage,
  helper,
  disabled,
  name = "chips",
  id,
  labelGap,
  labelWidth,
  labelPosition,
  className,
  required,
  ...props
}: ChipsProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "chips",
    name,
    id,
  });

  const {
    bodyStyle,
    controlStyle,
    containerStyle,
    labelStyle,
    ...baseChipStyles
  } = styles ?? {};

  return (
    <FieldLane
      id={inputId}
      showError={showError}
      errorMessage={errorMessage}
      label={label}
      helper={helper}
      disabled={disabled}
      labelGap={labelGap}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
      className={applyClassName("chips", className)}
      required={required}
      styles={{
        bodyStyle: css`
          align-items: center;
          ${bodyStyle}
        `,
        controlStyle,
        containerStyle,
        labelStyle,
      }}
    >
      <BaseChips
        {...props}
        id={inputId}
        name={name}
        styles={baseChipStyles}
        disabled={disabled}
      />
    </FieldLane>
  );
}

const Divider = styled.div<{
  $theme?: ChipsThemeConfig;
}>`
  position: absolute;
  top: 0;
  width: calc(100%);
  transform: translateX(-8%);
  height: 1px;

  border-bottom: 1px solid ${({ $theme }) => $theme?.dividerColor};
`;

const EmptyOptionContainer = styled.div<{
  $hovered?: boolean;
  $theme: ChipsThemeConfig;
}>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 4px;
  padding: 8px;
  font-size: 0.75rem;
  font-weight: 500;

  color: ${({ $theme }) => $theme.textColor};

  width: 100%;
  border-radius: 2px;
  cursor: pointer;

  ${({ $hovered, $theme }) => css`
    &:hover {
      background-color: ${$theme.hoverBackgroundColor};
    }

    ${$hovered &&
    css`
      background-color: ${$theme.hoverBackgroundColor};
    `}
  `}
`;

export { Chips };
