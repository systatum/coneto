import { cn } from "./../lib/utils";

interface SeparatorProps {
  title?: string;
  className?: string;
}

export default function Separator({ title, className }: SeparatorProps) {
  return (
    <div className={cn("flex w-full relative", className)}>
      <span className="h-[2px] absolute w-full top-1 rounded-sm bg-gray-900 shadow-[inset_0_2px_2px_#ffffff,inset_0_-1px_1px_#7a7a7a]"></span>
      <h2 className="font-medium text-gray-500 absolute -top-2 bg-white left-3 px-2">
        {title}
      </h2>
    </div>
  );
}
