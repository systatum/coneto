import { cn } from "./../lib/utils";
import { ReactNode } from "react";

interface EmptySlateProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  containerClassName?: string;
  actions?: ReactNode;
}

export default function EmptySlate({
  imageUrl,
  title,
  subtitle,
  actions,
  containerClassName,
}: EmptySlateProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 items-center py-20",
        containerClassName
      )}
    >
      {imageUrl && (
        <div className="w-[250px] sm:w-[350px] md:w-[400px] h-[150px] sm:h-[180px] md:h-[200px]">
          <img
            src={imageUrl}
            alt="Image for Empty Slate Coneto Product from Systatum."
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 items-center">
        <h2 className="font-semibold text-xl">{title}</h2>
        <span className="text-sm">{subtitle}</span>
        <div className="flex flex-row gap-2 mt-2">{actions}</div>
      </div>
    </div>
  );
}
