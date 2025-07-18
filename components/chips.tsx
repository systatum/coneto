import { RiAddBoxFill, RiAddLine, RiCloseLine } from "@remixicon/react";
import { cn } from "./../lib/utils";
import { Badge, BadgeProps } from "./badge";
import { Checkbox } from "./checkbox";
import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
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
    data: ChangeEvent<HTMLInputElement>,
    type?: ColorPickProps
  ) => void;
  chipsContainerClassName?: string;
  chipContainerClassName?: string;
  chipClassName?: string;
  chipsDrawerClassName?: string;
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

  const buttonAddClass = cn(
    "cursor-pointer border border-transparent rounded-full p-[1px] text-[#c3c3c3] hover:shadow-md hover:border-gray-300",
    open && "border-gray-300"
  );

  const chipsClassName = cn(
    "flex flex-row gap-[3px] flex-wrap p-2",
    props.chipsContainerClassName
  );

  const inputElement = (
    <>
      <div className={chipsClassName}>
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
            className={"rounded-sm"}
            textColor={data.textColor}
            caption={data.caption}
            withCircle
          />
        ))}

        <RiAddLine
          ref={refs.setReference}
          className={buttonAddClass}
          {...getReferenceProps()}
        />
      </div>

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
    <div className={cn(`flex w-full flex-col gap-2 text-xs`)}>
      {props.label && <label>{props.label}</label>}
      <div className="flex flex-col gap-1 text-xs">
        {inputElement}
        {props.showError && (
          <span className="text-red-600">{props.errorMessage}</span>
        )}
      </div>
    </div>
  );
}

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
  chipClassName,
  chipContainerClassName,
  chipsDrawerClassName = "max-w-[250px]",
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

  const chipsDrawerClass = cn(
    "flex flex-col bg-white border text-sm border-gray-300 rounded-xs w-full shadow-xs list-none outline-none z-[9999]",
    chipsDrawerClassName
  );

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
    <ul
      {...getFloatingProps()}
      ref={refs.setFloating}
      style={floatingStyles}
      tabIndex={-1}
      role="listbox"
      className={chipsDrawerClass}
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
            className="border-none rounded-none"
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
          <div
            aria-label="divider"
            className="border-b w-full border-gray-300 h-px"
          />

          <div className="flex flex-col gap-1 p-1">
            {filterNewLabel && creatable && (
              <div
                onMouseEnter={() => setHovered(0)}
                onClick={async () => {
                  await setMode("create");
                  await inputNameTagRef.current.focus();
                }}
                className={cn(
                  "flex items-start cursor-pointer text-xs rounded-xs gap-1 text-black p-2 w-full",
                  inputValue.search.length > 10 ? "flex-col" : "flex-row",
                  hovered === 0 && "bg-blue-100"
                )}
              >
                <div className="flex flex-row w-full min-w-[130px] gap-1">
                  <RiAddLine size={14} />
                  <span>{newLabelPlaceholder}</span>
                </div>
                <span
                  className={cn(
                    "text-gray-600 w-full font-medium break-all",

                    inputValue.search.length <= 10 ? "truncate" : ""
                  )}
                >
                  "{inputValue.search}"
                </span>
              </div>
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
                        !isClicked && (
                          <div
                            aria-label="divider"
                            className="border-b w-full border-gray-200 h-px"
                          />
                        )}

                      <Chip
                        badge={data}
                        chipContainerClassName={chipContainerClassName}
                        hovered={hovered}
                        isClicked={isClicked}
                        setHovered={setHovered}
                        onOptionClicked={onOptionClicked}
                        chipClassName={chipClassName}
                        deletable={deletable}
                        onDeleteRequested={onDeleteRequested}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              !filterNewLabel && (
                <span className="text-xs text-gray-600 text-center p-2">
                  No matching actions
                </span>
              )
            )}
          </div>
        </>
      )}

      {mode === "create" && (
        <div className="flex flex-col">
          <div className="flex flex-row py-2 px-3 gap-2 text-xs items-center font-medium">
            <RiAddBoxFill size={18} />
            <span className="pt-[2px]">Create a new tag</span>
          </div>
          <div
            aria-label="divider"
            className="border-b w-full border-gray-300 h-px"
          />
          <div className="flex flex-col p-3 gap-3">
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

            <div className="flex flex-row justify-between w-full">
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
                className="text-xs"
              >
                {cancelAddingButtonLabel}
              </Button>
              <Button
                onClick={onNewTagCreated}
                size="sm"
                variant="primary"
                className="text-xs"
              >
                {addButtonLabel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ul>
  );
}

function Chip({
  badge,
  isClicked,
  hovered,
  setHovered,
  onOptionClicked,
  chipContainerClassName,
  chipClassName,
  onDeleteRequested,
  deletable,
}: {
  badge: BadgeProps;
  isClicked: boolean;
  hovered: number | null;
  setHovered: (number: number) => void;
  onOptionClicked?: (badge: BadgeProps) => void;
  chipClassName?: string;
  chipContainerClassName?: string;
  onDeleteRequested?: (badge: BadgeProps) => void;
  deletable?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex py-[4px] flex-row px-3 gap-[2px] items-center cursor-pointer justify-between relative",
        hovered === badge.id && "bg-blue-100",
        chipContainerClassName
      )}
      onClick={() => onOptionClicked?.(badge)}
      onMouseEnter={() => setHovered(badge.id)}
    >
      <Checkbox
        checked={isClicked}
        containerClassName={cn(
          "border-transparent w-[10px] h-[10px] mb-[6px] rounded-xs",
          hovered === badge.id && "border-[#61A9F9]"
        )}
        className="w-[10px] h-[10px]"
        readOnly
      />
      <Badge
        variant={badge.variant}
        backgroundColor={badge.backgroundColor}
        circleColor={badge.circleColor}
        className={chipClassName}
        textColor={badge.textColor}
        caption={badge.caption}
        withCircle
      />
      {deletable && (
        <RiCloseLine
          role="button"
          aria-label="Delete requested data"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequested(badge);
          }}
          size={14}
          className={cn(
            "absolute top-1/2 right-4 -translate-y-1/2 hover:bg-gray-300 text-transparent cursor-pointer",
            hovered === badge.id && "text-gray-400 hover:text-gray-600"
          )}
        />
      )}
    </div>
  );
}

export { Chips, Chip };
