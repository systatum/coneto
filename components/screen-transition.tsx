import React, {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  PaperDialog,
  PaperDialogRef,
  PaperDialogResizable,
  PaperDialogState,
  PaperDialogStyles,
  PaperDialogTrigger,
} from "./paper-dialog";
import { css } from "styled-components";

export interface ScreenProps<TScreenKey extends string = string> {
  goToScreen: ((key: TScreenKey) => void) | null;
  goBack: (() => void) | null;
}

type ScreensComponent = ComponentType<Partial<ScreenProps>>;

type ScreenConfig = {
  component: ScreensComponent;
  sheet?: ScreenSheetConfig;
  width?: string;
  height?: string;
};

type ScreenSheetConfig =
  | boolean
  | Omit<PaperDialogResizable, "minWidth" | "maxWidth">;

export type ScreenEntry = ScreensComponent | ScreenConfig;

export type ScreensMap = Record<string, ScreenEntry>;

export interface ScreenTransitionProps<TScreens extends ScreensMap> {
  /** Registry of every screen this transition can render, keyed by id */
  screens: TScreens;
  /** Ordered stack of active screen keys. First = base, rest = nested dialogs */
  activeScreens: (keyof TScreens)[] | string[];
  /** Called with the next stack whenever navigation happens */
  onScreenChange: (screens: (keyof TScreens)[]) => void;
  /** styles for screen transition*/
  styles?: ScreenTransitionStyles;
  /** initial size when needed, for sheet and normal appearance */
}

export type ScreenTransitionStyles = Pick<
  PaperDialogStyles,
  "indicatorStyle" | "contentStyle" | "containerStyle"
>;

function ScreenTransition<TScreens extends ScreensMap>({
  screens,
  activeScreens = [],
  onScreenChange,
  styles,
}: ScreenTransitionProps<TScreens>) {
  const dialogRefsRef = useRef<
    Map<number, React.RefObject<PaperDialogRef | null>>
  >(new Map());
  const mountedIndicesRef = useRef<Set<number>>(
    new Set(activeScreens.map((_, i) => i))
  );

  type ScreenKey = keyof TScreens;

  const getSkipInitialAnimation = (index: number) =>
    mountedIndicesRef.current.has(index);

  useEffect(() => {
    activeScreens.forEach((_, index) => {
      mountedIndicesRef.current.add(index);
    });
  }, [activeScreens.length]);

  const getDialogRef = (index: number) => {
    if (!dialogRefsRef.current.has(index)) {
      dialogRefsRef.current.set(index, React.createRef<PaperDialogRef>());
    }
    return dialogRefsRef.current.get(index)!;
  };

  const goToScreen = useCallback(
    (key: ScreenKey) => {
      if (!screens[key]) {
        console.warn(
          `ScreenTransition: screen "${String(key)}" is not registered`
        );
        return;
      }
      onScreenChange([...activeScreens, key]);
    },
    [screens, activeScreens, onScreenChange]
  );

  // Tracks dialog indices currently being closed via goBack(), so that
  // re-entrant onChange("minimized") events fired internally by
  // minimizeDialog()/closeDialog() don't call onClosed -> goBack() again
  // and cause an infinite/duplicate close loop.
  const closingIndicesRef = useRef<Set<number>>(new Set());

  const goBack = useCallback(
    (withTimeout?: boolean) => {
      if (activeScreens.length === 0) return;

      const topIndex = activeScreens.length - 1; // the dialog wrapping the top screen
      const ref = dialogRefsRef.current.get(topIndex);

      // this preventing the condition mobile case for onChanges
      // so we don't use this, because would be re-render minimize state
      // and if closed with drag indicator still enough not trigger ref
      // for minimizing
      closingIndicesRef.current.add(topIndex);
      if (!withTimeout) {
        ref?.current?.closeDialog(true);
      }

      setTimeout(() => {
        onScreenChange(activeScreens.slice(0, -1));
        closingIndicesRef.current!.delete(topIndex);
        mountedIndicesRef.current!.delete(topIndex);
      }, 300);
    },
    [activeScreens, onScreenChange]
  );

  const renderStack = (index: number): ReactNode => {
    const key = activeScreens[index];
    if (!key) return null;
    const screen = screens[key];

    const config = getScreenConfig(screen);

    const ScreenComponent: ScreensComponent = config.component;
    if (!ScreenComponent) {
      console.warn(
        `ScreenTransition: screen "${String(key)}" is not registered`
      );
      return null;
    }

    const screenProps: ScreenProps = {
      goToScreen,
      goBack,
    };

    const skipInitialAnimation = getSkipInitialAnimation(index);

    return (
      <DialogLevel
        key={index}
        styles={styles}
        dialogRef={getDialogRef(index)}
        skipInitialAnimation={skipInitialAnimation}
        onClosed={() => goBack?.(true)}
        sheet={config?.sheet}
        width={config?.width}
        height={config?.height}
      >
        <ScreenComponent {...screenProps} />
        {index < activeScreens.length - 1 && renderStack(index + 1)}
      </DialogLevel>
    );
  };

  if (activeScreens.length === 0) return null;

  return renderStack(0);
}

function getScreenConfig(screen: ScreenEntry): ScreenConfig {
  if (typeof screen === "function") {
    return {
      component: screen,
    };
  }

  return screen;
}

function DialogLevel({
  dialogRef,
  children,
  skipInitialAnimation,
  sheet,
  onClosed,
  styles,
  height,
  width,
}: {
  dialogRef: React.RefObject<PaperDialogRef | null>;
  children: ReactNode;
  skipInitialAnimation?: boolean;
  sheet?: ScreenSheetConfig;
  onClosed?: () => void;
  styles?: ScreenTransitionStyles;
  height?: string;
  width?: string;
}) {
  useEffect(() => {
    // Only animate-open if this dialog wasn't pre-existing/already mounted.
    if (!skipInitialAnimation) {
      dialogRef?.current?.openDialog();
    }
  }, [dialogRef, skipInitialAnimation]);

  const finalWidth = width ? width : "100dvw";
  const finalHeight = height ? height : sheet ? "80dvh" : "100dvh";

  return (
    <PaperDialog
      styles={{
        containerStyle: styles?.containerStyle,
        indicatorStyle: styles?.indicatorStyle,
        contentStyle: css`
          gap: 0px;
          ${styles?.contentStyle}
        `,
      }}
      ref={dialogRef}
      closable={{
        withButton: false,
        withEscape: false,
        withOverlay: true,
      }}
      controls={[]}
      width={finalWidth}
      height={finalHeight}
      mobile={!!sheet}
      resizable={sheet}
      initialDialogState={skipInitialAnimation ? "restored" : "closed"}
      skipInitialAnimation={skipInitialAnimation}
      onChange={(state: PaperDialogState, trigger: PaperDialogTrigger) => {
        if (
          (state === PaperDialogState.Minimized &&
            trigger === PaperDialogTrigger.Overlay) ||
          (state === PaperDialogState.Minimized &&
            trigger === PaperDialogTrigger.Resize)
        )
          onClosed?.();
      }}
    >
      {children}
    </PaperDialog>
  );
}

export { ScreenTransition };
