"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  createContext,
} from "react";
import ReactDOM from "react-dom";
import styled, { keyframes, CSSProp, css } from "styled-components";
import { RiCloseLine } from "@remixicon/react";
import { Button } from "./button";

const fadeIn = keyframes`from {opacity: 0;} to {opacity: 1;}`;
const fadeOut = keyframes`from {opacity: 1;} to {opacity: 0;}`;
const zoomIn = keyframes`from {transform: translate(-50%, -50%) scale(0.95); opacity: 0;} to {transform: translate(-50%, -50%) scale(1); opacity: 1;}`;
const zoomOut = keyframes`from {transform: translate(-50%, -50%) scale(1); opacity: 1;} to {transform: translate(-50%, -50%) scale(0.95); opacity: 0;}`;

type StyleProp = {
  $style?: CSSProp;
};

const DialogContext = createContext<{
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
} | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog />");
  }
  return context;
}

function usePortal() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    ref.current = document.body;
    setMounted(true);
  }, []);

  return { mounted, target: ref.current };
}

function Dialog({
  children,
  isOpen,
  onVisibilityChange,
}: {
  children: ReactNode;
  isOpen: boolean;
  onVisibilityChange: (isOpen: boolean) => void;
}) {
  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen: onVisibilityChange }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  const { isOpen, setIsOpen } = useDialogContext();
  return (
    <div
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          setIsOpen(!isOpen);
        }
      }}
      style={{ display: "inline-block", cursor: "pointer" }}
    >
      {children}
    </div>
  );
}

function DialogClose({ children }: { children: ReactNode }) {
  const { setIsOpen } = useDialogContext();

  return (
    <div onClick={() => setIsOpen(false)} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}

export interface DialogContentProps {
  children: ReactNode;
  hideClose?: boolean;
  styles?: DialogContentStylesProps;
}

export interface DialogContentStylesProps {
  style?: CSSProp;
  overlayStyle?: CSSProp;
  closeButtonStyle?: CSSProp;
}

function DialogContent({
  children,
  hideClose = false,
  styles,
}: DialogContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, setIsOpen } = useDialogContext();
  const { mounted, target } = usePortal();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    },
    [setIsOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!mounted || !target || !isVisible) return null;

  return ReactDOM.createPortal(
    <>
      <StyledOverlay
        $isOpen={isOpen}
        $style={styles?.overlayStyle}
        onClick={() => setIsOpen(false)}
      />
      <StyledContent $isOpen={isOpen} $style={styles?.style}>
        {!hideClose && (
          <Button
            variant="transparent"
            onClick={() => setIsOpen(false)}
            aria-label="Close dialog"
            styles={{
              containerStyle: css`
                position: absolute;
                top: 1rem;
                right: 1.2rem;
                cursor: pointer;
                transition: all 0.3s;
                border-radius: 2px;
                padding: 2px;
              `,
              self: css`
                width: 20px;
                height: 20px;
                padding: 2px;
                ${styles?.closeButtonStyle}
              `,
            }}
          >
            <RiCloseLine />
          </Button>
        )}
        {children}
      </StyledContent>
    </>,
    target
  );
}

function DialogHeader({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProp;
}) {
  return <StyledHeader $style={style}>{children}</StyledHeader>;
}

function DialogFooter({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProp;
}) {
  return <StyledFooter $style={style}>{children}</StyledFooter>;
}

function DialogTitle({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProp;
}) {
  return <StyledTitle $style={style}>{children}</StyledTitle>;
}

function DialogDescription({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProp;
}) {
  return <StyledDescription $style={style}>{children}</StyledDescription>;
}

const StyledOverlay = styled.div<{ $isOpen: boolean } & StyleProp>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.5);
  z-index: 50;

  animation: ${({ $isOpen }) => ($isOpen ? fadeIn : fadeOut)} 0.2s forwards;
  ${({ $style }) => $style}
`;

const StyledContent = styled.div<{ $isOpen: boolean } & StyleProp>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 50;
  background: white;
  padding: 1.5rem;
  border-radius: 2px;
  max-width: calc(100% - 2rem);
  width: 100%;
  max-width: 640px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  animation: ${({ $isOpen }) => ($isOpen ? zoomIn : zoomOut)} 0.2s forwards;
  ${({ $style }) => $style}
`;

const StyledHeader = styled.div<StyleProp>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;

  ${({ $style }) => $style}
`;

const StyledFooter = styled.div<StyleProp>`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
  flex-direction: row;
  justify-content: flex-end;

  ${({ $style }) => $style}
`;

const StyledTitle = styled.h2<StyleProp>`
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.25;
  ${({ $style }) => $style}
`;

const StyledDescription = styled.p<StyleProp>`
  font-size: 0.875rem;
  color: #6b7280;
  ${({ $style }) => $style}
`;

Dialog.Content = DialogContent;
Dialog.Description = DialogDescription;
Dialog.Footer = DialogFooter;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Trigger = DialogTrigger;
Dialog.Close = DialogClose;

export { Dialog };
