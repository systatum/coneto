import { RiAddBoxFill, RiAddLine, RiCloseLine } from "@remixicon/react";
import { Badge, BadgeProps } from "./badge";
import { Checkbox } from "./checkbox";
import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  ReactElement,
  useEffect,
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
import { Colorbox, ColorPickProps } from "./colorbox";
import { Button } from "./button";
import styled, { css, CSSProp } from "styled-components";

type InputValueProps = {
  search: string;
  name_tag: string;
  background_color: string;
  text_color: string;
  circle_color: string;
};

export type ChipsProps = BaseChipsProps & {
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  type?: string;
};
interface BaseChipsProps {
  options?: BadgeProps[];
  inputValue?: InputValueProps;
  setInputValue?: (
    data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type?: ColorPickProps
  ) => void;
  chipsContainerStyle?: CSSProp;
  chipContainerStyle?: CSSProp;
  chipSelectedStyle?: CSSProp;
  chipStyle?: CSSProp;
  labelStyle?: CSSProp;
  chipsDrawerStyle?: CSSProp;
  filterPlaceholder?: string;
  newLabelPlaceholder?: string;
  addButtonLabel?: string;
  cancelAddingButtonLabel?: string;
  creatable?: boolean;
  onOptionClicked?: (badge: BadgeProps) => void;
  selectedOptions?: number[];
  onDeleteRequested?: (badge: BadgeProps) => void;
  deletable?: boolean;
  onNewTagCreated?: () => void;
}

function Chips(props: ChipsProps) {
  const [open, setOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
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

  const getAllOptions = () => {
    const selectedIds = new Set(props.selectedOptions);

    const clickedOptions = props.selectedOptions
      .map((id) => props.options.find((opt) => opt.id === id))
      .filter(Boolean);
    const unClickedOptions = props.options.filter(
      (opt) => !selectedIds.has(opt.id)
    );
    return [...clickedOptions, ...unClickedOptions];
  };

  const CLICKED_OPTIONS = props.selectedOptions
    .map((id) => props.options.find((opt) => opt.id === id))
    .filter(Boolean);

  const ALL_OPTIONS = hasInteracted
    ? getAllOptions().filter((opt) =>
        opt.caption
          .toLowerCase()
          .includes(props.inputValue.search.toLowerCase())
      )
    : getAllOptions();

  const inputElement: ReactElement = (
    <>
      <InputGroup $containerStyle={props.chipsContainerStyle}>
        {CLICKED_OPTIONS.map((data) => (
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
              ${props.chipSelectedStyle}
            `}
            textColor={data.textColor}
            caption={data.caption}
            withCircle
          />
        ))}

        <AddButton
          ref={refs.setReference}
          role="button"
          {...getReferenceProps()}
        />
      </InputGroup>

      {open && (
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
    <InputWrapper>
      {props.label && <Label $style={props.labelStyle}>{props.label}</Label>}
      <InputContent>
        {inputElement}
        {props.showError && <ErrorText>{props.errorMessage}</ErrorText>}
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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;
  position: relative;
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const Label = styled.label<{
  $style?: CSSProp;
}>`
  ${({ $style }) => $style}
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

const AddButton = styled(RiAddLine)<{ $open?: boolean }>`
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

  ${({ $open }) =>
    $open &&
    css`
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
  onNewTagCreated,
  floatingStyles,
  getFloatingProps,
  refs,
  setHasInteracted,
  addButtonLabel = "Add",
  cancelAddingButtonLabel = "Cancel",
  chipStyle,
  chipContainerStyle,
  chipsDrawerStyle,
  filterPlaceholder = "Change or add labels...",
  inputValue,
  newLabelPlaceholder = "Create a new label:",
  options,
  setInputValue,
  creatable,
  onOptionClicked,
  selectedOptions,
  deletable,
  onDeleteRequested,
}: ChipsDrawerProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mode, setMode] = useState<"idle" | "create">("idle");
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputNameTagRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "idle") {
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (mode === "create") {
      inputNameTagRef.current?.focus();
    }
  }, [mode]);

  useEffect(() => {
    if (isTyping) setTimeout(() => setIsTyping(false), 50);
  }, [isTyping]);

  const filteredSearch = options.filter(
    (opt) => opt.caption.toLowerCase() === inputValue.search.toLowerCase()
  );

  const filterNewLabel =
    filteredSearch.length === 0 && inputValue.search.length > 1;

  useEffect(() => {
    if (isTyping && filterNewLabel && creatable) {
      setHovered(0);
    } else if (isTyping && options && options.length > 0) {
      setHovered(options[0]?.id);
    }
  }, [inputValue.search, options, mode, creatable, filterNewLabel, isTyping]);

  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (mode !== "idle") return;

    const index = options.findIndex((opt) => opt.id === hovered);
    const hasCreateOption = filterNewLabel && creatable;
    const allOptions = [{ id: 0 }, ...options];

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
      if (hovered === 0) {
        setMode("create");
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
      $style={chipsDrawerStyle}
      onKeyDown={handleKeyDown}
    >
      {mode === "idle" && (
        <>
          <Textbox
            ref={inputRef}
            name="search"
            type="text"
            placeholder={filterPlaceholder}
            value={inputValue.search}
            style={{
              border: "none",
              minHeight: "34px",
              borderRadius: 0,
            }}
            autoComplete="off"
            onChange={(e) => {
              setHasInteracted?.(true);
              setInputValue(e);
              setIsTyping(true);
              const inputNameTagEvent = {
                target: {
                  name: "name_tag",
                  value: e.target.value,
                },
              } as ChangeEvent<HTMLInputElement>;
              setInputValue(inputNameTagEvent);
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
            {filterNewLabel && creatable && (
              <NewTagOption
                onMouseEnter={() => setHovered(0)}
                onClick={async () => {
                  await setMode("create");
                  await inputNameTagRef.current.focus();
                }}
                $hovered={hovered === 0}
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
                  {newLabelPlaceholder}&nbsp;
                  <span style={{ color: "#4b5563" }}>
                    "{inputValue.search}"
                  </span>
                </span>
              </NewTagOption>
            )}

            {options && options.length > 0 ? (
              <>
                {options.map((data, index) => {
                  const isClicked = selectedOptions?.some(
                    (clicked) => clicked === data.id
                  );

                  return (
                    <div key={data.id}>
                      {index > 0 &&
                        options[index - 1] &&
                        selectedOptions?.some(
                          (clicked) => clicked === options[index - 1].id
                        ) &&
                        !isClicked && <Divider aria-label="divider" />}

                      <Chips.Item
                        badge={data}
                        chipContainerStyle={chipContainerStyle}
                        hovered={hovered}
                        isClicked={isClicked}
                        setHovered={setHovered}
                        onOptionClicked={onOptionClicked}
                        chipStyle={chipStyle}
                        deletable={deletable}
                        onDeleteRequested={onDeleteRequested}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              !filterNewLabel && (
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "240px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "8px 12px",
              gap: "8px",
              fontSize: "0.75rem",
              fontWeight: 500,
              alignItems: "center",
            }}
          >
            <RiAddBoxFill size={18} />
            <span
              style={{
                paddingTop: "2px",
              }}
            >
              Create a new tag
            </span>
          </div>
          <Divider aria-label="divider" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "12px",
              gap: "12px",
            }}
          >
            <Textbox
              ref={inputNameTagRef}
              name="name_tag"
              placeholder={newLabelPlaceholder}
              value={inputValue.name_tag}
              autoComplete="off"
              onChange={(e) => {
                setInputValue(e);
              }}
            />
            <Colorbox
              placeholder="Select background color..."
              name={"background_color"}
              value={inputValue.background_color}
              onChange={setInputValue}
            />
            <Colorbox
              placeholder="Select text color..."
              name={"text_color"}
              value={inputValue.text_color}
              onChange={setInputValue}
            />
            <Colorbox
              placeholder="Select circle color..."
              name={"circle_color"}
              value={inputValue.circle_color}
              onChange={setInputValue}
            />
            <Badge
              textColor={inputValue.text_color}
              backgroundColor={inputValue.background_color}
              circleColor={inputValue.circle_color}
              withCircle
              caption={inputValue.name_tag}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                onClick={async () => {
                  await setMode("idle");
                  const inputSearchEvent = {
                    target: {
                      name: "search",
                      value: inputValue.name_tag,
                    },
                  } as ChangeEvent<HTMLInputElement>;
                  await setInputValue(inputSearchEvent);
                  await inputRef.current.focus();
                }}
                size="sm"
                buttonStyle={{
                  fontSize: "12px",
                }}
              >
                {cancelAddingButtonLabel}
              </Button>
              <Button
                onClick={onNewTagCreated}
                size="sm"
                variant="primary"
                buttonStyle={{
                  fontSize: "12px",
                }}
              >
                {addButtonLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ChipsDrawerWrapper>
  );
}

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

const NewTagOption = styled.div<{ $hovered: boolean }>`
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
  cursor: pointer;

  ${({ $hovered }) =>
    $hovered &&
    css`
      background-color: #bfdbfe;
    `}
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #d1d5db;
`;

function ChipsItem({
  badge,
  isClicked,
  hovered,
  setHovered,
  onOptionClicked,
  chipContainerStyle,
  chipStyle,
  onDeleteRequested,
  deletable,
}: {
  badge: BadgeProps;
  isClicked: boolean;
  hovered: number | null;
  setHovered: (number: number) => void;
  onOptionClicked?: (badge: BadgeProps) => void;
  chipStyle?: CSSProp;
  chipContainerStyle?: CSSProp;
  onDeleteRequested?: (badge: BadgeProps) => void;
  deletable?: boolean;
}) {
  return (
    <ChipItemWrapper
      $hovered={hovered === badge.id}
      $style={chipContainerStyle}
      onClick={() => onOptionClicked?.(badge)}
      onMouseEnter={() => setHovered(badge.id)}
    >
      <Checkbox
        checked={isClicked}
        wrapperStyle={css`
          width: 14px;
          height: 14px;
        `}
        inputStyle={css`
          width: 14px;
          height: 14px;
        `}
        containerStyle={css`
          margin-bottom: 1px;
        `}
        iconStyle={css`
          min-width: 9px;
          min-height: 9px;
        `}
        readOnly
      />
      <Badge
        variant={badge.variant}
        backgroundColor={badge.backgroundColor}
        circleColor={badge.circleColor}
        badgeStyle={css`
          cursor: pointer;
          ${chipStyle}
        `}
        textColor={badge.textColor}
        caption={badge.caption}
        withCircle
      />
      {deletable && (
        <CloseButton
          role="button"
          $hovered={hovered === badge.id}
          aria-label="Delete requested data"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequested(badge);
          }}
          size={14}
        />
      )}
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
    `}
  ${({ $style }) => $style}
`;

const CloseButton = styled(RiCloseLine)<{
  $hovered: boolean;
}>`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  color: transparent;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: #d1d5db;
  }

  &:active {
    background-color: #999999;
  }

  &:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px #00000033;
    transition: box-shadow 0.2s ease;
  }

  ${({ $hovered }) =>
    $hovered &&
    css`
      color: #9ca3af;

      &:hover {
        color: #4b5563;
      }
    `}
`;

Chips.Item = ChipsItem;

export { Chips };
