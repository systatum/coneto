import { ReactNode, useState } from "react";
import { Capsule } from "./capsule";
import styled, { CSSProp } from "styled-components";

interface CapsuleTabProps {
  tabs: Array<{
    id: number | string;
    title: string;
    content: ReactNode;
  }>;
  activeTab?: number;
  style?: CSSProp;
}

function CapsuleTab({ tabs, style, activeTab = 1 }: CapsuleTabProps) {
  const CONTENT_TABS = tabs.map((data) => data.id);
  const NUMBER_ACTIVE_TAB = activeTab - 1;
  const [selected, setSelected] = useState<string | number>(
    CONTENT_TABS[NUMBER_ACTIVE_TAB]
  );

  const activeContent = tabs.filter((data) => data.id === selected);

  return (
    <CapsuleTabWrapper $containerStyle={style}>
      <Capsule
        fields={tabs}
        setView={setSelected}
        activeBackgroundColor="black"
        view={selected}
        full
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {activeContent.map((data, index) => (
          <div
            key={index}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            {data.content}
          </div>
        ))}
      </div>
    </CapsuleTabWrapper>
  );
}

const CapsuleTabWrapper = styled.div<{
  $containerStyle?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
  padding-bottom: 5px;
  border: 1px solid #ebebeb;
  border-radius: 0.375rem;
  box-shadow: 0 1px 4px -3px #5b5b5b;

  ${({ $containerStyle }) => $containerStyle}
`;

export { CapsuleTab };
