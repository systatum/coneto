import { cn } from "./../lib/utils";
import { ReactNode, useState } from "react";

interface CapsuleTabProps {
  tabs: Array<{
    id: number;
    title: string;
    content: ReactNode;
  }>;
  activeTab?: number;
  className?: string;
}

export default function CapsuleTab({
  tabs,
  className,
  activeTab = 1,
}: CapsuleTabProps) {
  const CONTENT_TABS = tabs.map((data) => data.title);
  const NUMBER_ACTIVE_TAB = activeTab - 1;
  const [selected, setSelected] = useState<string>(
    CONTENT_TABS[NUMBER_ACTIVE_TAB]
  );

  const activeContent = tabs.filter((data) => data.title === selected);

  const capsuleTabClass = cn(
    "flex flex-col gap-1 border w-full border-gray-300 rounded-xs",
    className
  );

  return (
    <div className={capsuleTabClass}>
      <div className="flex flex-row gap-2 bg-gray-100 ">
        {tabs.map((data, index) => (
          <h2
            key={index}
            onClick={() => setSelected(data.title)}
            className={cn(
              "cursor-pointer p-2",
              selected === data.title ? "text-black bg-white" : "text-gray-500"
            )}
          >
            {data.title}
          </h2>
        ))}
      </div>
      <div className="flex flex-col w-full">
        {activeContent.map((data, index) => (
          <div key={index} className="w-full h-full">
            {data.content}
          </div>
        ))}
      </div>
    </div>
  );
}
