import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ComponentType,
  ReactElement,
  cloneElement,
  Children,
} from "react";
import styled from "styled-components";

export interface ScreenProps {
  gotoNextScreen: (() => void) | null;
  gotoPrevScreen: (() => void) | null;
}

export type ScreenComponent = ComponentType<any>;

export interface ScreenTransitionProps {
  /** The child element (your page component). It will receive `ScreenProps` injected automatically. */
  children: ReactElement | ((props: ScreenProps) => ReactElement);
  /**
   * A **function** that returns the JSX of the next screen.
   * Pass the exported `*Screen` wrapper, not the raw page component.
   */
  nextScreen?: ScreenComponent | null;
  /**
   * A **function** that returns the JSX of the previous screen.
   * Pass the exported `*Screen` wrapper, not the raw page component.
   */
  prevScreen?: ScreenComponent | null;
  /** Extra props forwarded to the child page component. */
  pageProps?: Record<string, unknown>;
}

type Direction = "forward" | "backward" | "none";

interface NavEntry {
  Screen: ScreenComponent;
  props?: Record<string, unknown>;
}

interface NavContextValue {
  push: (Screen: ScreenComponent, props?: Record<string, unknown>) => void;
  pop: () => void;
  canPop: boolean;
}

const NavContext = createContext<NavContextValue | null>(null);

export function ScreenNavigator({
  initial,
  initialProps,
}: {
  initial: ScreenComponent;
  initialProps?: Record<string, unknown>;
}) {
  const [stack, setStack] = useState<NavEntry[]>([
    { Screen: initial, props: initialProps },
  ]);
  const [direction, setDirection] = useState<Direction>("none");
  const [transitioning, setTransitioning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");

  const current = stack[stack.length - 1];
  const [incoming, setIncoming] = useState<NavEntry | null>(null);

  const DURATION = 320;

  const push = useCallback(
    (Screen: ScreenComponent, props?: Record<string, unknown>) => {
      if (transitioning) return;
      setIncoming({ Screen, props });
      setDirection("forward");
      setPhase("exit");
      setTransitioning(true);

      setTimeout(() => {
        setStack((s) => [...s, { Screen, props }]);
        setIncoming(null);
        setPhase("enter");
        setTimeout(() => {
          setPhase("idle");
          setTransitioning(false);
        }, DURATION);
      }, DURATION);
    },
    [transitioning]
  );

  const pop = useCallback(() => {
    if (transitioning || stack.length <= 1) return;
    const prev = stack[stack.length - 2];
    setIncoming(prev);
    setDirection("backward");
    setPhase("exit");
    setTransitioning(true);

    setTimeout(() => {
      setStack((s) => s.slice(0, -1));
      setIncoming(null);
      setPhase("enter");
      setTimeout(() => {
        setPhase("idle");
        setTransitioning(false);
      }, DURATION);
    }, DURATION);
  }, [transitioning, stack]);

  const canPop = stack.length > 1;

  const ctx: NavContextValue = { push, pop, canPop };

  const currentTransform = (() => {
    if (phase === "idle") return "translateX(0)";
    if (phase === "exit")
      return direction === "forward" ? "translateX(-100%)" : "translateX(100%)";
    if (phase === "enter") return "translateX(0)";
    return "translateX(0)";
  })();

  const incomingTransform = (() => {
    if (phase === "exit")
      return direction === "forward" ? "translateX(100%)" : "translateX(-100%)";
    if (phase === "enter") return "translateX(0)";
    return "translateX(100%)";
  })();

  const { Screen: CurrentScreen, props: currentProps } = current;

  return (
    <NavContext.Provider value={ctx}>
      <Root>
        <ScreenSlot
          key={stack.length}
          style={{
            transform: currentTransform,
            transition:
              phase !== "idle"
                ? `transform ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
            zIndex: direction === "forward" ? 1 : 2,
          }}
        >
          <CurrentScreen {...(currentProps ?? {})} />
        </ScreenSlot>

        {incoming && (
          <ScreenSlot
            key={`incoming-${stack.length}`}
            style={{
              transform: incomingTransform,
              transition: `transform ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
              zIndex: direction === "forward" ? 2 : 1,
            }}
          >
            <incoming.Screen {...(incoming.props ?? {})} />
          </ScreenSlot>
        )}
      </Root>
    </NavContext.Provider>
  );
}

function ScreenTransition({
  children,
  nextScreen = null,
  prevScreen = null,
  pageProps = {},
}: ScreenTransitionProps) {
  const nav = useContext(NavContext);

  if (!nav) {
    const RootScreen: ScreenComponent = () => (
      <ScreenTransitionInner
        nextScreen={nextScreen}
        prevScreen={prevScreen}
        pageProps={pageProps}
      >
        {children}
      </ScreenTransitionInner>
    );

    return <ScreenNavigator initial={RootScreen} />;
  }

  return (
    <ScreenTransitionInner
      nextScreen={nextScreen}
      prevScreen={prevScreen}
      pageProps={pageProps}
    >
      {children}
    </ScreenTransitionInner>
  );
}

function ScreenTransitionInner({
  children,
  nextScreen,
  prevScreen,
  pageProps = {},
}: Omit<ScreenTransitionProps, "children"> & {
  children:
    | ReactElement<Record<string, any>>
    | ((props: ScreenProps) => ReactElement);
}) {
  const nav = useContext(NavContext)!;

  const gotoNextScreen = nextScreen ? () => nav.push(nextScreen) : null;

  const gotoPrevScreen = prevScreen
    ? () => nav.push(prevScreen)
    : nav.canPop
      ? () => nav.pop()
      : null;

  const injected: ScreenProps = { gotoNextScreen, gotoPrevScreen };

  const rendered =
    typeof children === "function"
      ? children(injected)
      : cloneElement(children, {
          ...injected,
          ...pageProps,
          ...children.props,
        });

  return <Page>{rendered}</Page>;
}

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  isolation: isolate;
`;

const ScreenSlot = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  will-change: transform;
  backface-visibility: hidden;
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
`;

export { ScreenTransition };
