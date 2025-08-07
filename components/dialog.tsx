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
import styled, { keyframes, CSSProp } from "styled-components";
import { RiCloseLine } from "@remixicon/react";

const fadeIn = keyframes`from {opacity: 0;} to {opacity: 1;}`;
const fadeOut = keyframes`from {opacity: 1;} to {opacity: 0;}`;
const zoomIn = keyframes`from {transform: translate(-50%, -50%) scale(0.95); opacity: 0;} to {transform: translate(-50%, -50%) scale(1); opacity: 1;}`;
const zoomOut = keyframes`from {transform: translate(-50%, -50%) scale(1); opacity: 1;} to {transform: translate(-50%, -50%) scale(0.95); opacity: 0;}`;

type StyleProp = {
  $style?: CSSProp;
};

const DialogContext = createContext<{
  open: boolean;
  setOpen: (val: boolean) => void;
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
  open,
  onOpenChange,
}: {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>
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
  const { open, setOpen } = useDialogContext();
  return (
    <div
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          setOpen(!open);
        }
      }}
      style={{ display: "inline-block", cursor: "pointer" }}
    >
      {children}
    </div>
  );
}

function DialogClose({ children }: { children: ReactNode }) {
  const { setOpen } = useDialogContext();

  return (
    <div onClick={() => setOpen(false)} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}

function DialogContent({
  children,
  hideClose = false,
  style,
  overlayStyle,
  closeButtonStyle,
}: {
  children: ReactNode;
  hideClose?: boolean;
  style?: CSSProp;
  overlayStyle?: CSSProp;
  closeButtonStyle?: CSSProp;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { open, setOpen } = useDialogContext();
  const { mounted, target } = usePortal();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    },
    [setOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 200); // 200ms = anim duration
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!mounted || !target || !isVisible) return null;

  return ReactDOM.createPortal(
    <>
      <StyledOverlay
        $isOpen={open}
        $style={overlayStyle}
        onClick={() => setOpen(false)}
      />
      <StyledContent $isOpen={open} $style={style}>
        {!hideClose && (
          <StyledClose
            onClick={() => setOpen(false)}
            aria-label="Close dialog"
            $style={closeButtonStyle}
          >
            <RiCloseLine />
          </StyledClose>
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

const StyledClose = styled.button<StyleProp>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: transparent;
  opacity: 0.7;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
    background-color: #d1d5db;
  }

  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }

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
