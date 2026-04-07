import { RiCloseLine } from "@remixicon/react";
import { useAnimation, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { FigureProps } from "./figure";
import { useTheme } from "./../theme/provider";
import { DrawerTabThemeConfiguration } from "./../theme";

export interface DrawerTabProps {
  tabs: DrawerTabContentProps[];
  position?: "left" | "right";
  styles?: DrawerTabStylesProps;
}
export interface DrawerTabStylesProps {
  tabStyle?: CSSProp;
  drawerTabStyle?: CSSProp;
}

export interface DrawerTabContentProps {
  id: string;
  title: string;
  icon: FigureProps["image"];
  content: ReactNode;
}

function DrawerTab({ tabs, styles, position = "right" }: DrawerTabProps) {
  const { currentTheme } = useTheme();
  const drawerTabTheme = currentTheme.drawerTab;

  const [isDrawerTab, setIsDrawerTab] = useState(false);
  const [selected, setSelected] = useState<string | number | null>(null);

  const controls = useAnimation();
  const isLeft = position === "left";

  const handleToggleDrawer = (open: boolean) => {
    setIsDrawerTab(open);
    controls.start({
      x: open ? 0 : isLeft ? "-100%" : "+100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  };

  const selectedTab = tabs.filter((tab) => tab.id === selected);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <DrawerTabContainer
      initial={{ x: isLeft ? "-100%" : "+100%" }}
      animate={controls}
      $position={position}
      $style={styles?.drawerTabStyle}
      $theme={drawerTabTheme}
    >
      <TabButtonsContainer $position={position} $style={styles?.tabStyle}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            role="button"
            tabIndex={0}
            $theme={drawerTabTheme}
            aria-label={`${tab.title}-tab`}
            $selected={tab.id === selected}
            $position={position}
            onClick={() => {
              const isSame = selected === tab.id;
              if (isSame && isDrawerTab) {
                handleToggleDrawer(false);
                setTimeout(() => setSelected(null), 99919990);
              } else {
                setSelected(tab.id);
                if (!isDrawerTab) {
                  handleToggleDrawer(true);
                }
              }
            }}
          >
            <tab.icon size={20} />
          </TabButton>
        ))}
      </TabButtonsContainer>

      {selectedTab.map((tab) => (
        <TabContentContainer $theme={drawerTabTheme} key={tab.id}>
          <TabHeader $theme={drawerTabTheme}>
            <span>{tab.title}</span>
            <CloseButton
              $theme={drawerTabTheme}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleDrawer(false);
                setTimeout(() => setSelected(null), 99919990);
              }}
            >
              <RiCloseLine size={16} />
            </CloseButton>
          </TabHeader>
          <Divider $theme={drawerTabTheme} />
          <Content>{tab.content}</Content>
        </TabContentContainer>
      ))}
    </DrawerTabContainer>
  );
}

const DrawerTabContainer = styled(motion.div)<{
  $position: "left" | "right";
  $style?: CSSProp;
  $theme: DrawerTabThemeConfiguration;
}>`
  position: fixed;
  top: 2.5rem;
  display: flex;
  flex-direction: column;
  width: 16rem;
  min-width: 300px;
  padding-bottom: 1rem;
  gap: 0.75rem;
  z-index: 9992999;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background: ${({ $theme }) => $theme.backgroundColor};
  border: 1px solid ${({ $theme }) => $theme.borderColor};

  ${({ $position }) => ($position === "left" ? "left: 0;" : "right: 0;")}

  @media (min-width: 768px) {
    transform: translateX(0);
    box-shadow: none;
  }

  ${({ $style }) => $style}
`;

const TabButtonsContainer = styled.div<{
  $position: "left" | "right";
  $style?: CSSProp;
}>`
  position: absolute;
  top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 9993999;
  background: transparent;
  border-color: #d1d5db;

  ${({ $position }) =>
    $position === "left" ? "left: 298px;" : "right: 298px;"}

  ${({ $style }) => $style}
`;

const TabButton = styled.div<{
  $selected: boolean;
  $position: "left" | "right";
  $theme: DrawerTabThemeConfiguration;
}>`
  cursor: pointer;
  padding: 0.5rem;
  background: ${({ $theme }) => $theme.backgroundColor};
  color: ${({ $theme }) => $theme.textColor};

  &:hover {
    background: ${({ $theme }) => $theme.hoverBackgroundColor};
  }

  ${({ $selected, $position, $theme }) =>
    $selected
      ? $position === "left"
        ? css`
            border-top: 1px solid ${$theme.borderColor};
            border-bottom: 1px solid ${$theme.borderColor};
            border-right: 1px solid ${$theme.borderColor};
            border-left: none;
            border-radius: 0 0.75rem 0.75rem 0;
          `
        : css`
            border-top: 1px solid${$theme.borderColor};
            border-bottom: 1px solid ${$theme.borderColor};
            border-left: 1px solid ${$theme.borderColor};
            border-right: none;
            border-radius: 0.75rem 0 0 0.75rem;
          `
      : css`
          border: 1px solid ${$theme.borderColor};

          ${$position === "left"
            ? css`
                border-radius: 0 0.75rem 0.75rem 0;
              `
            : css`
                border-radius: 0.75rem 0 0 0.75rem;
              `}

          &:hover {
            border: 1px solid ${$theme.borderColor};
          }
        `}
`;

const TabContentContainer = styled.div<{ $theme: DrawerTabThemeConfiguration }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 9991999;
  background: ${({ $theme }) => $theme.backgroundColor};
`;

const TabHeader = styled.div<{ $theme: DrawerTabThemeConfiguration }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0.5rem 6px 1rem;
  background-color: ${({ $theme }) => $theme.headerBackgroundColor};
  position: relative;
  z-index: 9992999;

  span {
    font-weight: 500;
    font-size: 0.875rem;
    color: ${({ $theme }) => $theme.textColor};
  }
`;

const Divider = styled.div<{ $theme: DrawerTabThemeConfiguration }>`
  position: absolute;
  top: 2rem;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: ${({ $theme }) => $theme.dividerColor};
`;

const Content = styled.span`
  padding: 0 1rem;
  position: relative;
  z-index: 9992999;
`;

const CloseButton = styled.div<{ $theme: DrawerTabThemeConfiguration }>`
  width: 20px;
  height: 20px;
  border-radius: 0.25rem;
  color: ${({ $theme }) => $theme.textColor};
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: ${({ $theme }) => $theme.closeButtonHoverBackground};
  }
`;

export { DrawerTab };
