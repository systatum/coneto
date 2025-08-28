import { RemixiconComponentType, RiCloseLine } from "@remixicon/react";
import { useAnimation, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import styled, { css, CSSProp } from "styled-components";

export interface DrawerTabProps {
  tabs: DrawerTabContentProps[];
  tabStyle?: CSSProp;
  drawerTabStyle?: CSSProp;
  position?: "left" | "right";
}

export interface DrawerTabContentProps {
  id: string | number;
  title: string;
  icon: RemixiconComponentType;
  content: ReactNode;
}

function DrawerTab({
  tabs,
  drawerTabStyle,
  tabStyle,
  position = "right",
}: DrawerTabProps) {
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
      $style={drawerTabStyle}
    >
      <TabButtonsContainer $position={position} $style={tabStyle}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            role="button"
            tabIndex={0}
            aria-label={`Open ${tab.title} tab`}
            $selected={tab.id === selected}
            $position={position}
            onClick={() => {
              const isSame = selected === tab.id;
              if (isSame && isDrawerTab) {
                handleToggleDrawer(false);
                setTimeout(() => setSelected(null), 400);
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
        <TabContentContainer key={tab.id}>
          <TabHeader>
            <span>{tab.title}</span>
            <CloseButton
              onClick={(e) => {
                e.stopPropagation();
                handleToggleDrawer(false);
                setTimeout(() => setSelected(null), 400);
              }}
            >
              <RiCloseLine size={16} />
            </CloseButton>
          </TabHeader>
          <Divider />
          <Content>{tab.content}</Content>
        </TabContentContainer>
      ))}
    </DrawerTabContainer>
  );
}

const DrawerTabContainer = styled(motion.div)<{
  $position: "left" | "right";
  $style?: CSSProp;
}>`
  position: fixed;
  top: 2.5rem;
  display: flex;
  flex-direction: column;
  width: 16rem;
  min-width: 300px;
  padding-bottom: 1rem;
  gap: 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 40;

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
  z-index: 50;
  background: transparent;
  border-color: #d1d5db;

  ${({ $position }) =>
    $position === "left" ? "left: 298px;" : "right: 298px;"}

  ${({ $style }) => $style}
`;

const TabButton = styled.div<{
  $selected: boolean;
  $position: "left" | "right";
}>`
  cursor: pointer;
  padding: 0.5rem;
  background: white;
  border-color: #d1d5db;

  &:hover {
    background: #f3f4f6;
  }

  ${({ $selected, $position }) =>
    $selected
      ? $position === "left"
        ? css`
            border-top: 1px solid #d1d5db;
            border-bottom: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            border-left: none;
            border-radius: 0 0.75rem 0.75rem 0;
          `
        : css`
            border-top: 1px solid #d1d5db;
            border-bottom: 1px solid #d1d5db;
            border-left: 1px solid #d1d5db;
            border-right: none;
            border-radius: 0.75rem 0 0 0.75rem;
          `
      : css`
          border: 1px solid #d1d5db;

          ${$position === "left"
            ? css`
                border-radius: 0 0.75rem 0.75rem 0;
              `
            : css`
                border-radius: 0.75rem 0 0 0.75rem;
              `}

          &:hover {
            border: 1px solid #d1d5db;
          }
        `}
`;

const TabContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 30;
  background: white;
`;

const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0.5rem 6px 1rem;
  background-color: #f3f4f6;
  position: relative;
  z-index: 40;

  span {
    font-weight: 500;
    font-size: 0.875rem;
  }
`;

const Divider = styled.div`
  position: absolute;
  top: 2rem;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #e5e7eb;
`;

const Content = styled.span`
  padding: 0 1rem;
  position: relative;
  z-index: 40;
`;

const CloseButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 0.25rem;
  color: #4b5563;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: #d1d5db;
  }
`;

export { DrawerTab };
