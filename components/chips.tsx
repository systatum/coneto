import { RiAddLine } from "@remixicon/react";
import { Badge, BadgeActionProps, BadgeProps } from "./badge";
import { Checkbox } from "./checkbox";
import {
  ChangeEvent,
  CSSProperties,
  Fragment,
  KeyboardEvent,
  ReactElement,
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
import Helper from "./helper";

export type ChipActionsProps = BadgeActionProps;

export type ChipsProps = BaseChipsProps & {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  type?: string;
  name?: string;
  styles?: ChipsStylesProps;
  helper?: string;
};

interface BaseChipsProps {
  options?: BadgeProps[];
  inputValue?: string;
  setInputValue?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  filterPlaceholder?: string;
  missingOptionLabel?: string;
  creatable?: boolean;
  onOptionClicked?: (badge: BadgeProps) => void;
  selectedOptions?: BadgeProps[];
  missingOptionForm?:
    | ReactNode
    | ((props?: MissingOptionFormProps) => ReactNode);
  emptySlate?: ReactNode;
  renderer?: (props: ChipRendererProps) => ReactNode;
}

export interface ChipsStylesProps {
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

function Chips(props: ChipsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
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

  const ALL_OPTIONS = useMemo(() => {
    const selectedIds = new Set(props.selectedOptions.map((d) => d.id));

    const clickedOptions = props.selectedOptions;
    const unClickedOptions = props.options.filter(
      (opt) => !selectedIds.has(opt.id)
    );

    const allOpts = [...clickedOptions, ...unClickedOptions];

    if (hasInteracted && props.inputValue) {
      return allOpts.filter((opt) =>
        opt.caption.toLowerCase().includes(props.inputValue.toLowerCase())
      );
    }

    return allOpts;
  }, [props.selectedOptions, props.options, props.inputValue, hasInteracted]);

  const CLICKED_OPTIONS = props.selectedOptions;

  const inputElement: ReactElement = (
    <>
      <InputGroup $containerStyle={props?.styles?.chipsContainerStyle}>
        {CLICKED_OPTIONS.map((data) =>
          typeof props.renderer === "function" ? (
            props.renderer({
              id: data.id,
              caption: data.caption,
              metadata: data.metadata,
            })
          ) : (
            <Badge
              key={data.id}
              onClick={(e) => {
                e.stopPropagation();
                dismiss;
              }}
              variant={data.variant}
              backgroundColor={data.backgroundColor}
              circleColor={data.circleColor}
              badgeStyle={css`
                border-radius: 4px;
                ${props.styles?.chipSelectedStyle}
              `}
              textColor={data.textColor}
              caption={data.caption}
              withCircle
            />
          )
        )}

        <AddButton
          ref={refs.setReference}
          role="button"
          $isOpen={isOpen}
          {...getReferenceProps()}
        />
      </InputGroup>

      {isOpen && (
        <ChipsDrawer
          {...props}
          getFloatingProps={getFloatingProps}
          setHasInteracted={setHasInteracted}
          floatingStyles={floatingStyles}
          refs={refs}
          options={ALL_OPTIONS}
        />
      )}
    </>
  );

  return (
    <InputWrapper $style={props.styles?.containerStyle}>
      {props.label && (
        <Label $style={props.styles?.labelStyle}>
          {props.label}

          {props.helper && <Helper value={props.helper} />}
        </Label>
      )}
      <InputContent>
        {inputElement}
        {props.showError && props.errorMessage && (
          <ErrorText>{props.errorMessage}</ErrorText>
        )}
      </InputContent>
    </InputWrapper>
  );
}

const InputGroup = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 3px;

  ${({ $containerStyle }) => $containerStyle}
`;

const InputWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;
  position: relative;

  ${({ $style }) => $style}
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const Label = styled.label<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;

  ${({ $style }) => $style}
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

const AddButton = styled(RiAddLine)<{ $isOpen?: boolean }>`
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 9999px;
  padding: 1px;
  color: #c3c3c3;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-color: #d1d5db;
    `}
`;

type ChipsDrawerProps = ChipsProps & {
  getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"];
  floatingStyles: CSSProperties;
  refs: ReturnType<typeof useFloating>["refs"];
  setHasInteracted: (data: boolean) => void;
};

function ChipsDrawer({
  floatingStyles,
  getFloatingProps,
  refs,
  setHasInteracted,
  filterPlaceholder = "Change or add labels...",
  inputValue,
  missingOptionLabel = "Create a new label:",
  options,
  setInputValue,
  creatable,
  onOptionClicked,
  selectedOptions,
  missingOptionForm,
  emptySlate,
  name = "chips",
  styles,
}: ChipsDrawerProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mode, setMode] = useState<"idle" | "create">("idle");
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputMissingRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "idle") {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (isTyping) setTimeout(() => setIsTyping(false), 50);
  }, [isTyping]);

  const filteredSearch = options.filter(
    (opt) => opt.caption.toLowerCase() === inputValue.toLowerCase()
  );

  const hasNoFilter = filteredSearch.length === 0 && inputValue.length > 1;

  useEffect(() => {
    if (isTyping && hasNoFilter && creatable) {
      setHovered("0");
    } else if (isTyping && options && options.length > 0) {
      setHovered(options[0]?.id);
    }
  }, [inputValue, options, mode, creatable, hasNoFilter, isTyping]);

  const handleKeyDown = async (e: KeyboardEvent<HTMLUListElement>) => {
    if (mode !== "idle") return;

    const index = options.findIndex((opt) => opt.id === hovered);
    const hasCreateOption = hasNoFilter && creatable;
    const allOptions = [{ id: "0" }, ...options];

    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (hasCreateOption) {
        const currentIndex = allOptions.findIndex((opt) => opt.id === hovered);
        const nextIndex = (currentIndex + 1) % allOptions.length;
        setHovered(allOptions[nextIndex].id);
      } else {
        const nextIndex = (index + 1) % options.length;
        setHovered(options[nextIndex].id);
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (hasCreateOption) {
        const currentIndex = allOptions.findIndex((opt) => opt.id === hovered);
        const prevIndex =
          (currentIndex - 1 + allOptions.length) % allOptions.length;
        setHovered(allOptions[prevIndex].id);
      } else {
        const prevIndex = (index - 1 + options.length) % options.length;
        setHovered(options[prevIndex].id);
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const selected = options.find((opt) => opt.id === hovered);
      if (hovered === "0") {
        await setMode("create");
        await inputMissingRef.current?.focus();
      } else if (selected && onOptionClicked) {
        onOptionClicked(selected);
      }
    }
  };

  return (
    <ChipsDrawerWrapper
      {...getFloatingProps()}
      ref={refs.setFloating}
      style={floatingStyles}
      tabIndex={-1}
      role="listbox"
      $style={styles?.chipsDrawerStyle}
      onKeyDown={handleKeyDown}
    >
      {mode === "idle" && (
        <>
          <Textbox
            ref={inputRef}
            name={name}
            type="text"
            aria-label="chip-input-box"
            placeholder={filterPlaceholder}
            value={inputValue}
            styles={{
              self: {
                border: "none",
                minHeight: "34px",
                borderRadius: 0,
              },
            }}
            autoComplete="off"
            onChange={(e) => {
              setHasInteracted?.(true);
              setInputValue(e);
              setIsTyping(true);
            }}
          />
          <Divider aria-label="divider" />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              padding: "4px",
            }}
          >
            {hasNoFilter && creatable && (
              <EmptyOptionContainer
                onClick={async () => {
                  await setMode("create");
                  await inputMissingRef.current?.focus();
                }}
                onMouseEnter={() => setHovered("0")}
                $hovered={hovered === "0"}
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
                  <span style={{ color: "#4b5563" }}>"{inputValue}"</span>
                </span>
              </EmptyOptionContainer>
            )}

            {options && options.length > 0 ? (
              <>
                {options.map((data, index) => {
                  const isClicked = selectedOptions?.some(
                    (clicked) => clicked.id === data.id
                  );

                  return (
                    <div key={data.id}>
                      {index > 0 &&
                        options[index - 1] &&
                        selectedOptions?.some(
                          (clicked) => clicked.id === options[index - 1].id
                        ) &&
                        !isClicked && <Divider aria-label="divider" />}

                      <Chips.Item
                        badge={data}
                        chipContainerStyle={styles?.chipContainerStyle}
                        hovered={hovered}
                        isClicked={isClicked}
                        inputRef={inputRef}
                        setHovered={setHovered}
                        onOptionClicked={onOptionClicked}
                        chipStyle={styles?.chipStyle}
                      />
                    </div>
                  );
                })}
              </>
            ) : hasNoFilter && emptySlate && !creatable ? (
              <Fragment>{emptySlate}</Fragment>
            ) : (
              hasNoFilter &&
              !creatable && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#4b5563",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  No matching actions
                </span>
              )
            )}
          </div>
        </>
      )}

      {mode === "create" && (
        <Fragment>
          {typeof missingOptionForm === "function"
            ? missingOptionForm({
                firstInputRef: inputMissingRef,
                closeForm: async () => {
                  await setMode("idle");
                  await inputRef.current?.focus();
                },
              })
            : missingOptionForm}
        </Fragment>
      )}
    </ChipsDrawerWrapper>
  );
}
const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #d1d5db;
`;

const ChipsDrawerWrapper = styled.ul<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  border-radius: 2px;
  width: fit-content;
  max-width: 240px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  list-style: none;
  outline: none;
  z-index: 9999;
  ${({ $style }) => $style}
`;

const EmptyOptionContainer = styled.div<{ $hovered?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 4px;
  padding: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  width: 100%;
  border-radius: 2px;

  ${({ $hovered }) =>
    $hovered &&
    css`
      cursor: pointer;
      background-color: #bfdbfe;
    `}
`;

function ChipsItem({
  badge,
  isClicked,
  hovered,
  setHovered,
  onOptionClicked,
  chipContainerStyle,
  chipStyle,
  inputRef,
}: {
  badge: BadgeProps;
  isClicked: boolean;
  hovered: string | null;
  setHovered: (number: string) => void;
  onOptionClicked?: (badge: BadgeProps) => void;
  chipStyle?: CSSProp;
  chipContainerStyle?: CSSProp;
  inputRef?: RefObject<HTMLInputElement>;
}) {
  const finalValueActions =
    badge.actions?.map((action) => ({
      ...action,
      onClick: () => action.onClick && action.onClick?.(badge),
    })) ?? [];

  return (
    <ChipItemWrapper
      $hovered={hovered === badge.id}
      $style={chipContainerStyle}
      onClick={async (e) => {
        await e.stopPropagation();
        await onOptionClicked?.(badge);
        await inputRef.current.focus();
      }}
      onMouseEnter={() => setHovered(badge.id)}
    >
      <Checkbox
        checked={isClicked}
        styles={{
          boxStyle: css`
            width: 14px;
            height: 14px;
          `,
          self: css`
            width: 14px;
            height: 14px;
          `,
          containerStyle: css`
            margin-bottom: 1px;
            width: fit-content;
          `,
          iconStyle: css`
            min-width: 9px;
            min-height: 9px;
          `,
        }}
        readOnly
      />
      <Badge
        variant={badge.variant}
        backgroundColor={badge.backgroundColor}
        circleColor={badge.circleColor}
        badgeStyle={css`
          cursor: pointer;
          ${chipStyle}
          ${finalValueActions &&
          css`
            padding-right: 0px;
          `}
        `}
        actions={finalValueActions}
        textColor={badge.textColor}
        caption={badge.caption}
        withCircle
      />
    </ChipItemWrapper>
  );
}

const ChipItemWrapper = styled.div<{
  $hovered: boolean;
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: row;
  padding: 4px 12px;
  gap: 2px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;

  ${({ $hovered }) =>
    $hovered &&
    css`
      background-color: #bfdbfe;

      [aria-label="badge-action"] {
        opacity: 1;
        transition: opacity 0.2s;
      }
    `}

  ${({ $style }) => $style}
`;

Chips.Item = ChipsItem;

export { Chips };
