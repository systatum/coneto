import { cn } from "./../lib/utils";

interface LoadingSpinnerProps {
  iconSize?: number;
  textSize?: number;
  label?: string;
  gap?: number;
  className?: string;
}

function LoadingSpinner({
  iconSize = 16,
  textSize = 16,
  label,
  gap = 2,
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex flex-row items-center", className)}
      style={{
        gap: `${gap}px`,
      }}
    >
      <svg
        aria-label="circle"
        className={cn("animate-spin text-blue-500", label && "mr-2")}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        height={iconSize}
        width={iconSize}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {label && (
        <span
          style={{
            fontSize: `${textSize}px`,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export { LoadingSpinner };
