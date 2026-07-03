import { ReactNode, useCallback, useState } from "react";
import { Capsule } from "./capsule";
import styled, { css, CSSProp } from "styled-components";
import { CapsuleTabThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";
import { applyClassName } from "./../constants/classname";

export interface CapsuleTabProps {
  tabs: CapsuleTabTab[];
  activeTab?: string;
  activeBackgroundColor?: string;
  styles?: CapsuleTabStyles;
  mobile?: boolean;
  onTabChange?: (id: string) => void;
  children?: ReactNode;
  id?: string;
  className?: string;
}

export interface CapsuleTabStyles {
  self?: CSSProp;
  contentStyle?: CSSProp;
  capsuleWrapperStyle?: CSSProp;
  tabStyle?: CSSProp;
}

export interface CapsuleTabTab {
  id: string;
  title: string;
  content: ReactNode;
  className?: string;
  hidden?: boolean;
}

function CapsuleTab({
  tabs: _tabs,
  styles,
  activeTab = "1",
  activeBackgroundColor,
  onTabChange,
  children,
  className,
  mobile,
  id,
}: CapsuleTabProps) {
  const { currentTheme } = useTheme();
  const capsuleTabTheme = currentTheme.capsuleTab;

  const tabs = _tabs?.filter((tab) => !tab.hidden);

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

  const mobileCapsuleWrapperStyle =
    mobile &&
    css`
      justify-content: center;
    `;

  const mobileTabStyle =
    mobile &&
    css`
      text-align: center;
      justify-content: center;
      font-size: 16px;
      height: 40px;
    `;

  return (
    <CapsuleTabWrapper
      $theme={capsuleTabTheme}
      aria-label="capsule-tab-wrapper"
      $style={styles?.self}
      className={applyClassName("capsule-tab", className)}
      id={id}
    >
      <Capsule
        mobile={mobile}
        styles={{
          capsuleWrapperStyle: css`
            padding-left: 5px;
            padding-right: 5px;
            background-color: ${capsuleTabTheme?.backgroundColor};

            ${mobileCapsuleWrapperStyle}

            ${styles?.capsuleWrapperStyle};
          `,
          containerStyle: css`
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;
          `,
          tabStyle: css`
            border-radius: 12px;
            ${mobileTabStyle};

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
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

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
  $theme?: CapsuleTabThemeConfig;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;

  background-color: ${({ $theme }) => $theme?.backgroundColor};

  ${({ $style }) => $style}
`;

export { CapsuleTab };
