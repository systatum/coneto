import clsx from "clsx";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import  {
  ChangeEvent,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from "react";

interface BaseTextboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  value: string;
  showError?: boolean;
  errorMessage?: string;
  className?: string;
  classNameParent?: string;
  onChange: (data: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

type TextboxProps =
  | (BaseTextboxProps &
      InputHTMLAttributes<HTMLInputElement> & {
        rows?: undefined;
      })
  | (BaseTextboxProps &
      TextareaHTMLAttributes<HTMLTextAreaElement> & {
        rows: number;
      });

export default function Textbox({
  label,
  showError,
  errorMessage,
  rows,
  name,
  onChange,
  value,
  className,
  classNameParent,
  type = "text",
  ...props
}: TextboxProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (showError) {
      setShowPassword(false);
    }
  }, [showError]);

  const inputId = `textbox-${name}`;

  if (type === "hidden") {
    return <input {...props} className="hidden" />;
  }

  const inputClass = clsx(
    "rounded-xs text-black px-2 w-full py-[7px] outline-none",
    showError
      ? "border border-red-500 focus:border-red-500 focus:ring-red-500 text-red-800"
      : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500",
    className,
  );

  const inputElement = rows ? (
    <div className="relative w-full ring-0">
      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={inputClass}
        {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
      {showError && (
        <AlertCircle
          size={18}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-red-600 text-white"
        />
      )}
    </div>
  ) : (
    <div className="relative w-full ring-0">
      <input
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass}
        type={type === "password" && showPassword ? "text" : type}
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
      />

      {type === "password" && !showError && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-gray-500"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {showError && (
        <AlertCircle
          size={18}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-red-600 text-white"
        />
      )}
    </div>
  );

  return (
    <div
      className={clsx(`flex w-full flex-col gap-2 text-xs`, classNameParent)}
    >
      {label && <label htmlFor={inputId}>{label}</label>}
      <div className="flex flex-col gap-1 text-xs">
        {inputElement}
        {showError && <span className="text-red-600">{errorMessage}</span>}
      </div>
    </div>
  );
}
