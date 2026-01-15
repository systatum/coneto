import { ReactNode, useState } from "react";
import { Capsule } from "./capsule";
import styled, { css, CSSProp } from "styled-components";

export interface CapsuleTabProps {
  tabs: CapsuleTabContentProps[];
  activeTab?: string;
  activeBackgroundColor?: string;
  styles?: CapsuleTabStylesProps;
}

export interface CapsuleTabStylesProps {
  containerStyle?: CSSProp;
  tabStyle?: CSSProp;
}

export interface CapsuleTabContentProps {
  id: string;
  title: string;
  content: ReactNode;
}

function CapsuleTab({
  tabs,
  styles,
  activeTab = "1",
  activeBackgroundColor = "black",
}: CapsuleTabProps) {
  const [selected, setSelected] = useState<string>(activeTab);

  const activeContent = tabs.filter((data) => data.id === selected);

  return (
    <CapsuleTabWrapper $containerStyle={styles?.containerStyle}>
      <Capsule
        styles={{
          containerStyle: css`
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;

            ${styles?.tabStyle};
          `,
          tabStyle: css`
            border-radius: 12px;
          `,
        }}
        tabs={tabs}
        onTabChange={setSelected}
        activeTab={selected}
        activeBackgroundColor={activeBackgroundColor}
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
  border-radius: 2px;
  box-shadow: 0 1px 3px -3px #5b5b5b;

  ${({ $containerStyle }) => $containerStyle}
`;

export { CapsuleTab };
