import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useAnimation } from "framer-motion";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { motion } from "framer-motion";
import styled, { css, CSSProp } from "styled-components";
import { OverlayBlocker } from "./overlay-blocker";
import { SidebarThemeConfiguration } from "theme";
import { useTheme } from "./../theme/provider";

export interface SidebarProps {
  children?: ReactNode;
  styles?: SidebarStylesProps;
  position?: "left" | "right";
}

export interface SidebarStylesProps {
  mobileStyle?: CSSProp;
  desktopStyle?: CSSProp;
}

export interface SidebarItemProps {
  isFixed?: boolean;
  children?: ReactNode;
  styles?: SidebarItemStylesProps;
}

export interface SidebarItemStylesProps {
  self?: CSSProp;
}

function Sidebar({ children, styles, position = "left" }: SidebarProps) {
  const { currentTheme } = useTheme();
  const sidebarTheme = currentTheme.sidebar;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const controls = useAnimation();

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
      controls.set({
        x: !mobile ? 0 : position === "left" ? "-100%" : "+100%",
      });
    }
  }, [controls, position]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
      controls.set({
        x: !mobile ? 0 : position === "left" ? "-100%" : "+100%",
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [controls, position]);

  const handleToggleSidebar = (open: boolean) => {
    setIsSidebarOpen(open);
    if (isMobile) {
      controls.start({
        x: open ? 0 : position === "left" ? "-100%" : "+100%",
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      isMobile && handleToggleSidebar(position === "left" ? false : true),
    onSwipedRight: () =>
      isMobile && handleToggleSidebar(position === "left" ? true : false),
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <>
      {isSidebarOpen && isMobile && (
        <OverlayBlocker
          show={isSidebarOpen}
          onClick={() => handleToggleSidebar(false)}
        />
      )}

      <MotionSidebar
        $theme={sidebarTheme}
        initial={{ x: position === "left" ? "-100%" : "+100%" }}
        animate={isMobile ? controls : { x: 0 }}
        $position={position}
        $style={styles?.mobileStyle}
      >
        {children}
      </MotionSidebar>

      {isMobile && !isSidebarOpen && (
        <ToggleButton
          {...handlers}
          $theme={sidebarTheme}
          onClick={() => handleToggleSidebar(true)}
          $position={position}
        >
          {position === "left" ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
        </ToggleButton>
      )}

      <DesktopSidebar
        $theme={sidebarTheme}
        $position={position}
        $style={styles?.desktopStyle}
      >
        {children}
      </DesktopSidebar>
    </>
  );
}

const MotionSidebar = styled(motion.div)<{
  $position: "left" | "right";
  $style?: CSSProp;
  $theme?: SidebarThemeConfiguration;
}>`
  position: fixed;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  width: 16rem;
  min-width: 300px;
  padding: 2.5rem 1.5rem 1.5rem;

  background-color: ${({ $theme }) => $theme?.backgroundColor};
  color: ${({ $theme }) => $theme?.textColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};

  ${({ $theme, $position }) =>
    $position === "left"
      ? css`
          left: 0;
          border-right: 1px solid ${$theme?.borderColor};
        `
      : css`
          right: 0;
          border-left: 1px solid ${$theme?.borderColor};
        `}
  @media (min-width: 768px) {
    display: none;
  }
  ${({ $style }) => $style}
`;

const ToggleButton = styled.button<{
  $position: "left" | "right";
  $theme?: SidebarThemeConfiguration;
}>`
  position: fixed;
  top: 0;
  z-index: 30;
  display: block;
  height: 100%;
  padding: 2px;
  border-radius: var(--radius-xs);
  cursor: pointer;

  box-shadow: ${({ $theme }) => $theme?.boxShadow};
  background-color: ${({ $theme }) => $theme?.toggle?.backgroundColor};
  border: 1px solid ${({ $theme }) => $theme?.toggle?.borderColor};
  color: ${({ $theme }) => $theme?.textColor};

  &:hover {
    background-color: ${({ $theme }) => $theme?.toggle?.hoverBackgroundColor};
  }

  ${({ $position }) => ($position === "left" ? "left: 0;" : "right: 0;")}

  @media (min-width: 768px) {
    display: none;
  }
`;

const DesktopSidebar = styled.div<{
  $position: "left" | "right";
  $style?: CSSProp;
  $theme?: SidebarThemeConfiguration;
}>`
  position: fixed;
  z-index: 40;
  display: none;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  width: 16rem;
  min-width: 300px;
  overflow-y: auto;
  padding: 2.5rem 1.5rem 1.5rem;

  color: ${({ $theme }) => $theme?.textColor};
  box-shadow: ${({ $theme }) => $theme?.boxShadow};

  ${({ $theme, $position }) =>
    $position === "left"
      ? css`
          left: 0;
          border-right: 1px solid ${$theme?.borderColor};
        `
      : css`
          right: 0;
          border-left: 1px solid ${$theme?.borderColor};
        `}

  @media (min-width: 768px) {
    display: flex;
  }

  ${({ $style }) => $style}
`;

function SidebarItem({ isFixed, styles, children }: SidebarItemProps) {
  return (
    <StyledSidebarItem isFixed={isFixed} $style={styles?.self}>
      {children}
    </StyledSidebarItem>
  );
}
const StyledSidebarItem = styled.div<{
  isFixed?: boolean;
  $style?: CSSProp;
}>`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;

  ${({ isFixed }) => !isFixed && `max-height: 300px;`}
  ${({ $style }) => $style}
`;

export interface SidebarSpacerProps {
  mobileWidth?: string;
  desktopWidth?: string;
}

function SidebarSpacer({ desktopWidth, mobileWidth }: SidebarSpacerProps) {
  return (
    <StyledSidebarSpacer
      $desktopWidth={desktopWidth}
      $mobileWidth={mobileWidth}
    />
  );
}

const StyledSidebarSpacer = styled.div<{
  $mobileWidth?: string;
  $desktopWidth?: string;
}>`
  display: flex;
  background-color: transparent;
  min-width: ${({ $mobileWidth }) =>
    $mobileWidth ? `${$mobileWidth}` : "30px"};

  @media (min-width: 768px) {
    display: block;
    min-width: ${({ $desktopWidth }) =>
      $desktopWidth ? `${$desktopWidth}` : "300px"};
  }
`;

Sidebar.Spacer = SidebarSpacer;
Sidebar.Item = SidebarItem;
export { Sidebar };
