import { ChangeEvent, InputHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RemixiconComponentType, RiLock2Fill } from "@remixicon/react";
import { cn } from "./../lib/utils";
import LoadingSpinner from "./loading-spinner";

interface ToggleboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: RemixiconComponentType | null;
  isLoading?: boolean;
  name?: string;
  label?: string;
  description?: string;
  containerClassName?: string;
  titleClassName?: string;
}

export default function Togglebox({
  name,
  checked = false,
  onChange,
  icon: Icon = null,
  isLoading = false,
  label,
  description,
  containerClassName,
  titleClassName,
  ...props
}: ToggleboxProps) {
  const inputId = `togglebox-${name}-${props.value}`;

  return (
    <div className="flex flex-row">
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="loading"
            transition={{ duration: 0.2 }}
            className="w-12 h-6 rounded-full flex items-center justify-center"
          >
            <LoadingSpinner iconSize={20} />
          </motion.div>
        ) : (
          <motion.label
            key="toggle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="relative flex flex-row items-center cursor-pointer w-12 h-6"
          >
            <input
              id={inputId}
              name={name}
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={onChange}
            />
            <div
              className={`w-full h-full rounded-full transition-colors duration-300 ${
                checked ? "bg-[#61A9F9]" : "bg-gray-300"
              }`}
            />
            <motion.div
              className="absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow-md"
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              animate={{
                x: checked ? 24 : 0,
              }}
            >
              {Icon && (
                <Icon
                  size={13}
                  className={cn(
                    "w-full top-1/2 translate-y-1/2",
                    checked && "text-[#61A9F9]"
                  )}
                />
              )}
            </motion.div>
          </motion.label>
        )}
      </AnimatePresence>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <h2 className={cn("text-sm font-medium", titleClassName)}>
              {label}
            </h2>
          )}
          {description && <span className="text-xs">{description}</span>}
        </div>
      )}
    </div>
  );
}
