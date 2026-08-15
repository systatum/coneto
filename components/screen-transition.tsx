import React, {
  ComponentType,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
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
  closable?: boolean;
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

export interface ScreenTransitionRef {
  /**
   * Cancels a pending `goBack` removal for `key` and re-opens its dialog.
   *
   * `goBack` applies its removal ~300ms after being triggered, to let the
   * close animation play. If a caller re-pushes the same key while it's
   * still on top (dedup keeps `activeScreens` unchanged), this component
   * gets no signal that the pending close should be aborted. Call
   * `reopen(key)` right after re-asserting that key to cancel the stale
   * removal and restore the dialog's visual state.
   */
  reopen: (key: string) => void;
}

function ScreenTransitionInner<TScreens extends ScreensMap>(
  {
    screens,
    activeScreens = [],
    onScreenChange,
    styles,
  }: ScreenTransitionProps<TScreens>,
  ref: React.Ref<ScreenTransitionRef>
) {
  const dialogRefsRef = useRef<
    Map<number, React.RefObject<PaperDialogRef | null>>
  >(new Map());
  const mountedIndicesRef = useRef<Set<number>>(
    new Set(activeScreens.map((_, i) => i))
  );
  // Indices with a goBack() removal still pending its 300ms delay.
  const pendingCloseRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );
  // Tracks the latest `activeScreens` so a pending goBack() removal (below)
  // applies against the current stack, not a stale snapshot from when it
  // was scheduled.
  const activeScreensRef = useRef(activeScreens);
  activeScreensRef.current = activeScreens;

  type ScreenKey = keyof TScreens;

  const getSkipInitialAnimation = (index: number) =>
    mountedIndicesRef.current.has(index);

  useEffect(() => {
    activeScreens.forEach((_, index) => {
      mountedIndicesRef.current.add(index);
    });
  }, [activeScreens.length]);

  useEffect(() => {
    return () => {
      pendingCloseRef.current.forEach(clearTimeout);
      pendingCloseRef.current.clear();
    };
  }, []);

  const getDialogRef = (index: number) => {
    if (!dialogRefsRef.current.has(index)) {
      dialogRefsRef.current.set(index, React.createRef<PaperDialogRef>());
    }
    return dialogRefsRef.current.get(index)!;
  };

  useImperativeHandle(
    ref,
    () => ({
      reopen: (key) => {
        const index = (activeScreens as string[]).lastIndexOf(key);
        if (index === -1) return;

        const pending = pendingCloseRef.current.get(index);
        if (pending) {
          clearTimeout(pending);
          pendingCloseRef.current.delete(index);
        }

        dialogRefsRef.current.get(index)?.current?.openDialog();
      },
    }),
    [activeScreens]
  );

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

  const goBack = useCallback(
    (skipCloseDialog?: boolean) => {
      if (activeScreens.length === 0) return;

      const topIndex = activeScreens.length - 1; // the dialog wrapping the top screen
      const ref = dialogRefsRef.current.get(topIndex);

      // Prevent triggering `closeDialog` on mobile.
      // Calling it would fire `onChange`, causing an unnecessary re-render
      // and resetting the minimized state. When the dialog is closed via the
      // drag indicator, the required close behavior is already handled.
      if (!skipCloseDialog) {
        ref?.current?.closeDialog({ withMinimize: true, withTimeout: true });
      }

      const timeoutId = setTimeout(() => {
        pendingCloseRef.current.delete(topIndex);
        mountedIndicesRef.current!.delete(topIndex);

        // Splice this index out of the current stack rather than slicing
        // the snapshot from when the close started, so any push that
        // happened in between is preserved.
        const current = activeScreensRef.current;
        onScreenChange([
          ...current.slice(0, topIndex),
          ...current.slice(topIndex + 1),
        ]);
      }, 300);
      pendingCloseRef.current.set(topIndex, timeoutId);
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
        closable={config?.closable}
      >
        <ScreenComponent {...screenProps} />
        {index < activeScreens.length - 1 && renderStack(index + 1)}
      </DialogLevel>
    );
  };

  if (activeScreens.length === 0) return null;

  return renderStack(0);
}

const ScreenTransition = forwardRef(ScreenTransitionInner) as <
  TScreens extends ScreensMap,
>(
  props: ScreenTransitionProps<TScreens> & {
    ref?: React.Ref<ScreenTransitionRef>;
  }
) => ReturnType<typeof ScreenTransitionInner>;

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
  closable,
}: {
  dialogRef: React.RefObject<PaperDialogRef | null>;
  children: ReactNode;
  skipInitialAnimation?: boolean;
  sheet?: ScreenSheetConfig;
  onClosed?: () => void;
  styles?: ScreenTransitionStyles;
  height?: string;
  width?: string;
  closable?: boolean;
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
        withOverlay: closable ?? (sheet ? true : false),
        withIndicator: closable,
      }}
      controls={[]}
      width={finalWidth}
      height={finalHeight}
      mobile={!!sheet}
      resizable={!!sheet}
      initialDialogState={skipInitialAnimation ? "restored" : "closed"}
      skipInitialAnimation={skipInitialAnimation}
      onChange={(state: PaperDialogState, trigger: PaperDialogTrigger) => {
        if (
          (state === PaperDialogState.Minimized &&
            trigger === PaperDialogTrigger.Overlay) ||
          (state === PaperDialogState.Minimized &&
            trigger === PaperDialogTrigger.Drag)
        )
          onClosed?.();
      }}
    >
      {children}
    </PaperDialog>
  );
}

export { ScreenTransition };
