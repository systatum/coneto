import { ReactNode, useCallback, useState } from "react";
import { Capsule } from "./capsule";
import styled, { css, CSSProp } from "styled-components";

export interface CapsuleTabProps {
  tabs: CapsuleTabContentProps[];
  activeTab?: string;
  activeBackgroundColor?: string;
  styles?: CapsuleTabStylesProps;
  onTabChange?: (id: string) => void;
}

export interface CapsuleTabStylesProps {
  self?: CSSProp;
  contentStyle?: CSSProp;
  capsuleWrapperStyle?: CSSProp;
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
  onTabChange,
}: CapsuleTabProps) {
  const [selectedLocal, setSelectedLocal] = useState<string>(activeTab);

  const isControlled = activeTab !== undefined;
  const selected = isControlled ? activeTab : selectedLocal;

  const setSelected = useCallback(
    (next: string) => {
      if (!isControlled) {
        setSelectedLocal(next);
      }

      onTabChange?.(next);
    },
    [isControlled, onTabChange]
  );
  const activeContent = tabs.filter((tab) => tab.id === selected);

  return (
    <CapsuleTabWrapper aria-label="capsule-tab-wrapper" $style={styles?.self}>
      <Capsule
        styles={{
          containerStyle: css`
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;

            ${styles?.capsuleWrapperStyle};
          `,
          tabStyle: css`
            border-radius: 12px;
            ${styles?.tabStyle};
          `,
        }}
        tabs={tabs}
        onTabChange={setSelected}
        activeTab={selected}
        activeBackgroundColor={activeBackgroundColor}
        full
      />

      <ContentWrapper
        aria-label="capsule-tab-content"
        $style={styles?.contentStyle}
      >
        {activeContent.map((props) => props.content)}
      </ContentWrapper>
    </CapsuleTabWrapper>
  );
}

const CapsuleTabWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #ebebeb;
  border-radius: 2px;
  box-shadow: 0 1px 3px -3px #5b5b5b;

  ${({ $style }) => $style}
`;

const ContentWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ $style }) => $style}
`;

export { CapsuleTab };
