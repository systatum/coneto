import { cn } from "./../lib/utils";
import { ReactNode, useState } from "react";
import { Capsule } from "./capsule";

interface CapsuleTabProps {
  tabs: Array<{
    id: number | string;
    title: string;
    content: ReactNode;
  }>;
  activeTab?: number;
  className?: string;
}

function CapsuleTab({ tabs, className, activeTab = 1 }: CapsuleTabProps) {
  const CONTENT_TABS = tabs.map((data) => data.id);
  const NUMBER_ACTIVE_TAB = activeTab - 1;
  const [selected, setSelected] = useState<string | number>(
    CONTENT_TABS[NUMBER_ACTIVE_TAB]
  );

  const activeContent = tabs.filter((data) => data.id === selected);

  const capsuleTabClass = cn(
    "flex flex-col gap-1 border w-full border-[#ebebeb] shadow-[0_1px_4px_-3px_#5b5b5b] pb-[5px] rounded-xs ",
    className
  );

  return (
    <div className={capsuleTabClass}>
      <Capsule
        fields={tabs}
        setView={setSelected}
        activeBackgroundColor="black"
        view={selected}
        full
      />

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

export { CapsuleTab };
