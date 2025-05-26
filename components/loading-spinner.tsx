interface LoadingSpinnerProps {
  size?: number;
  label?: string;
}

export default function LoadingSpinner({
  size = 16,
  label,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-row gap-2">
      <svg
        data-testid="circle"
        className="mr-2 animate-spin text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        height={size}
        width={size}
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
            fontSize: `${size}px`,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
