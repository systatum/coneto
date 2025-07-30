import clsx from "clsx";
import { RiSearchLine, RiCloseLine } from "@remixicon/react";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";

export interface SearchboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  value: string;
  className?: string;
  onChange: (data: ChangeEvent<HTMLInputElement>) => void;
}

const Searchbox = forwardRef<HTMLInputElement, SearchboxProps>(
  ({ name, value, className, onChange, ...props }, ref) => {
    const inputId = `textbox-${name}`;
    const inputRef = useRef<HTMLInputElement>(null);

    const inputClass = clsx(
      "rounded-3xl text-black px-9 bg-white text-xs w-full py-[8px] outline-none",
      "border border-gray-300 border-2 focus:ring-[#61A9F9] focus:border-[#61A9F9]",
      className
    );

    const valueLengthChecker = value.length > 0;

    useEffect(() => {
      let didFocusInitially = false;

      if (!didFocusInitially) {
        didFocusInitially = true;
        inputRef.current?.focus();
      }
    }, []);

    return (
      <div ref={ref} className="relative w-full ring-0">
        <RiSearchLine
          size={14}
          className="absolute top-1/2 text-gray-400 left-3 -translate-y-1/2"
        />

        <input
          ref={inputRef}
          id={inputId}
          aria-label={"textbox-search"}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />

        {valueLengthChecker && (
          <RiCloseLine
            role="button"
            aria-label="delete-input"
            onClick={() => {
              const event = {
                target: {
                  name,
                  value: "",
                },
              } as ChangeEvent<HTMLInputElement>;
              onChange(event);
            }}
            size={14}
            className="absolute top-1/2 right-3 text-gray-400 -translate-y-1/2 cursor-pointer"
          />
        )}
      </div>
    );
  }
);

export { Searchbox };
