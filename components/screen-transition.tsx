import React, {
  cloneElement,
  createContext,
  isValidElement,
  ReactNode,
  useContext,
  useRef,
} from "react";
import { PaperDialog, PaperDialogRef } from "./paper-dialog";
import { css } from "styled-components";

export interface ScreenProps {
  gotoNextScreen: (() => void) | null;
  gotoPrevScreen: (() => void) | null;
}

export interface ScreenTransitionProps {
  children: ReactNode | ((props: ScreenProps) => ReactNode);
  nextScreen?: React.ComponentType | null;
}

const ParentDialogContext =
  createContext<React.RefObject<PaperDialogRef | null> | null>(null);

function ScreenTransition({
  children,
  nextScreen: NextScreen,
}: ScreenTransitionProps) {
  const parentDialogRef = useContext(ParentDialogContext);

  const dialogRef = useRef<PaperDialogRef>(null);

  const injectedProps: ScreenProps = {
    gotoNextScreen: NextScreen
      ? () => {
          dialogRef?.current?.openDialog();
        }
      : null,
    gotoPrevScreen: parentDialogRef
      ? () => {
          parentDialogRef?.current?.minimizeDialog();

          setTimeout(() => {
            parentDialogRef?.current?.closeDialog();
          }, 400);
        }
      : null,
  };

  return (
    <ParentDialogContext.Provider value={dialogRef}>
      {typeof children === "function"
        ? children(injectedProps)
        : isValidElement(children)
          ? cloneElement(children, injectedProps)
          : children}
      <PaperDialog
        styles={{
          contentStyle: css`
            gap: 0px;
          `,
        }}
        ref={dialogRef}
        closable={false}
        controls={[]}
        width={"100dvw"}
        height={"100dvh"}
      >
        {NextScreen && <NextScreen />}
      </PaperDialog>
    </ParentDialogContext.Provider>
  );
}

export { ScreenTransition };
