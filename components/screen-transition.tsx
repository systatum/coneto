import React, { createContext, ReactNode, useContext, useRef } from "react";
import { PaperDialog, PaperDialogRef } from "./paper-dialog";
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

  return (
    <ParentDialogContext.Provider value={dialogRef}>
      {typeof children === "function"
        ? children({
            gotoNextScreen: NextScreen
              ? () => {
                  dialogRef?.current?.openDialog();
                }
              : null,
            gotoPrevScreen: () => {
              parentDialogRef?.current?.minimizeDialog();

              setTimeout(() => {
                parentDialogRef?.current?.closeDialog();
              }, 400);
            },
          })
        : children}
      <PaperDialog
        ref={dialogRef}
        closable={false}
        controls={[]}
        width={"100dvw"}
        height={"100dvh"}
      >
        {NextScreen && <NextScreen />}
        test
      </PaperDialog>
    </ParentDialogContext.Provider>
  );
}

export { ScreenTransition };
