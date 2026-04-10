import { ReactNode, useCallback, useState } from "react";
import { Capsule } from "./capsule";
import styled, { css, CSSProp } from "styled-components";
import { CapsuleTabThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";

export interface CapsuleTabProps {
  tabs: CapsuleTabContentProps[];
  activeTab?: string;
  activeBackgroundColor?: string;
  styles?: CapsuleTabStylesProps;
  onTabChange?: (id: string) => void;
  children?: ReactNode;
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
  activeBackgroundColor,
  onTabChange,
  children,
}: CapsuleTabProps) {
  const { currentTheme } = useTheme();
  const capsuleTabTheme = currentTheme.capsuleTab;

  const [selectedLocal, setSelectedLocal] = useState<string>(activeTab);

  const isControlled = onTabChange && activeTab !== undefined;
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
    <CapsuleTabWrapper
      $theme={capsuleTabTheme}
      aria-label="capsule-tab-wrapper"
      $style={styles?.self}
    >
      <Capsule
        styles={{
          capsuleWrapperStyle: css`
            padding-left: 5px;
            padding-right: 5px;
            background-color: ${capsuleTabTheme?.backgroundColor};

            ${styles?.capsuleWrapperStyle};
          `,
          containerStyle: css`
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;
          `,
          tabStyle: css`
            border-radius: 12px;
            ${styles?.tabStyle};
          `,
        }}
        tabs={tabs}
        onTabChange={setSelected}
        activeTab={selected}
        activeBackgroundColor={
          activeBackgroundColor ?? capsuleTabTheme?.activeBackgroundColor
        }
        full
      />

      <ContentWrapper
        aria-label="capsule-tab-content"
        $style={styles?.contentStyle}
      >
        {activeContent.map((props) => props.content)}
        {children}
      </ContentWrapper>
    </CapsuleTabWrapper>
  );
}

const CapsuleTabWrapper = styled.div<{
  $style?: CSSProp;
  $theme?: CapsuleTabThemeConfig;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 2px;

  border: 1px solid ${({ $theme }) => $theme?.borderColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};

  ${({ $style }) => $style}
`;

const ContentWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;

  ${({ $style }) => $style}
`;

export { CapsuleTab };
