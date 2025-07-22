import {
  RemixiconComponentType,
  RiCheckLine,
  RiPencilFill,
} from "@remixicon/react";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/utils";

export interface DormantTextProps {
  className?: string;
  onActionClick?: () => void;
  icon?: RemixiconComponentType;
  dormantedFontSize?: number;
  children?: ReactNode;
  content?: string | number;
  fullWidth?: boolean;
}

function DormantText({
  onActionClick,
  className,
  dormantedFontSize = 17,
  icon: Icon = RiCheckLine,
  children,
  content,
  fullWidth,
}: DormantTextProps) {
  const [dormantedLocal, setDormantedLocal] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [labelHeight, setLabelHeight] = useState<number>(0);
  const [labelWidth, setLabelWidth] = useState<number>(0);
  const [inputHeight, setInputHeight] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dormantPencilSize = dormantedFontSize * 1.05;

  useEffect(() => {
    if (!inputRef.current) return;

    const type = inputRef.current.dataset.type;

    if (type === "selectbox") {
      setLabelWidth((prev) => prev + 30);
    }
  }, [dormantedLocal]);

  const measureLabelSize = (el: HTMLLabelElement | HTMLDivElement | null) => {
    if (el) {
      const height = el.getBoundingClientRect().height;
      const width = el.getBoundingClientRect().width;
      if (el instanceof HTMLLabelElement) {
        setLabelHeight(height);
        setLabelWidth(width);
      } else {
        setInputHeight(height);
      }
    }
  };

  const dormantChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return null;

    const typedChild = child as ReactElement<
      React.InputHTMLAttributes<HTMLInputElement> & {
        ref?: Ref<HTMLInputElement>;
      }
    >;

    return cloneElement(typedChild, {
      ref: inputRef,
    });
  });

  return dormantedLocal ? (
    <label
      ref={measureLabelSize}
      onClick={() => {
        setDormantedLocal(false);
        setIsHovered(false);

        setTimeout(() => {
          inputRef.current.focus();
        }, 0);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
      className={cn(
        "p-2 rounded-xs cursor-pointer duration-100 transform transition-all flex flex-row justify-between items-center w-fit relative gap-1 hover:bg-[#e9e9e9] border hover:border-[#e9e9e9] border-transparent",
        className
      )}
      style={{
        minWidth: fullWidth && "100%",
        fontSize: dormantedFontSize,
      }}
    >
      {content}
      <RiPencilFill
        className={cn(
          "duration-100 transform transition-all",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        size={dormantPencilSize}
      />
    </label>
  ) : (
    <div
      className={cn(
        "relative w-full flex gap-[2px] flex-row ring-0 h-full justify-start items-center",
        className
      )}
      style={{
        minHeight: labelHeight,
      }}
    >
      <div
        style={{
          maxWidth: labelWidth,
        }}
        ref={measureLabelSize}
        className="w-full h-full"
      >
        {dormantChildren}
      </div>
      <button
        className={cn(
          "text-muted-foreground flex min-w-[30px] p-[2px] relative rounded-xs transition-all duration-200 cursor-pointer hover:bg-gray-300"
        )}
        style={{
          minHeight: 32.5 | inputHeight,
        }}
        onClick={(e) => {
          e.preventDefault();
          if (onActionClick) {
            onActionClick();
          }
          setDormantedLocal(true);
        }}
      >
        <Icon
          className="top-1/2 -translate-y-1/2 left-[6px]  absolute"
          size={18}
        />
      </button>
    </div>
  );
}

export { DormantText };
