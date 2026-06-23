import React, {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { PaperDialog, PaperDialogRef } from "./paper-dialog";
import { css } from "styled-components";

export interface ScreenProps {
  goToScreen: ((key: string) => void) | null;
  goBack: (() => void) | null;
}

type ScreensMap = Record<string, ComponentType<Partial<ScreenProps>>>;

export interface ScreenTransitionProps {
  /** Registry of every screen this transition can render, keyed by id */
  screens: ScreensMap;
  /** Ordered stack of active screen keys. First = base, rest = nested dialogs */
  activeScreens: string[];
  /** Called with the next stack whenever navigation happens */
  onScreenChange: (screens: string[]) => void;
}

function ScreenTransition({
  screens,
  activeScreens,
  onScreenChange,
}: ScreenTransitionProps) {
  const dialogRefsRef = useRef<
    Map<number, React.RefObject<PaperDialogRef | null>>
  >(new Map());

  const mountedIndicesRef = useRef<Set<number> | null>(null);
  if (mountedIndicesRef.current === null) {
    const seeded = new Set<number>();
    // Seed all initial screens — including index 0 — so none animate on mount
    for (let i = 0; i < activeScreens.length; i++) {
      seeded.add(i);
    }
    mountedIndicesRef.current = seeded;
  }

  const getDialogRef = (index: number) => {
    if (!dialogRefsRef.current.has(index)) {
      dialogRefsRef.current.set(index, React.createRef<PaperDialogRef>());
    }
    return dialogRefsRef.current.get(index)!;
  };

  const goToScreen = useCallback(
    (key: string) => {
      if (!screens[key]) {
        console.warn(`ScreenTransition: screen "${key}" is not registered`);
        return;
      }
      onScreenChange([...activeScreens, key]);
    },
    [screens, activeScreens, onScreenChange]
  );

  const goBack = useCallback(() => {
    if (activeScreens.length === 0) return;

    const topIndex = activeScreens.length - 1; // the dialog wrapping the top screen
    const ref = dialogRefsRef.current.get(topIndex);

    ref?.current?.minimizeDialog();
    setTimeout(() => {
      ref?.current?.closeDialog();
      onScreenChange(activeScreens.slice(0, -1));
      mountedIndicesRef.current!.delete(topIndex);
    }, 300);
  }, [activeScreens, onScreenChange]);

  const renderStack = (index: number): ReactNode => {
    const key = activeScreens[index];
    if (!key) return null;

    const ScreenComponent = screens[key] as ComponentType<Partial<ScreenProps>>;
    if (!ScreenComponent) {
      console.warn(`ScreenTransition: screen "${key}" is not registered`);
      return null;
    }

    const screenProps: ScreenProps = {
      goToScreen,
      goBack,
    };

    const skipInitialAnimation = mountedIndicesRef.current!.has(index);
    if (!skipInitialAnimation) mountedIndicesRef.current!.add(index);

    return (
      <DialogLevel
        dialogRef={getDialogRef(index)}
        skipInitialAnimation={skipInitialAnimation}
      >
        <ScreenComponent {...screenProps} />
        {index < activeScreens.length - 1 && renderStack(index + 1)}
      </DialogLevel>
    );
  };

  if (activeScreens.length === 0) return null;

  return renderStack(0);
}

function DialogLevel({
  dialogRef,
  children,
  skipInitialAnimation,
}: {
  dialogRef: React.RefObject<PaperDialogRef | null>;
  children: ReactNode;
  skipInitialAnimation?: boolean;
}) {
  useEffect(() => {
    // Only animate-open if this dialog wasn't pre-existing/already mounted.
    if (!skipInitialAnimation) {
      dialogRef?.current?.openDialog();
    }
  }, [dialogRef, skipInitialAnimation]);

  return (
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
      initialDialogState={skipInitialAnimation ? "restored" : "closed"}
      skipInitialAnimation={skipInitialAnimation}
    >
      {children}
    </PaperDialog>
  );
}

export { ScreenTransition };
