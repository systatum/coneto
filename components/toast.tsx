import { HTMLAttributes, ReactNode, useEffect, useState } from "react";
import { Figure, FigureProps } from "./figure";
import styled, { css, CSSProp, keyframes } from "styled-components";
import { createRoot } from "react-dom/client";
import {
  RiInformationLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiAlertLine,
  RiNotification3Line,
  RiCloseLine,
  RiArrowDownSLine,
} from "@remixicon/react";
import {
  getThemeSnapshot,
  subscribeTheme,
  ThemeMode,
  ThemeProvider,
  ToastThemeConfig,
  useTheme,
} from "./../theme";
import { Button } from "./button";
import { AnimatePresence, motion } from "framer-motion";
import { applyClassName } from "./../constants/classname";
import { BaseAction } from "./../constants/action";
import { Progressbar } from "./progressbar";

export const ToastVariant = {
  Primary: "primary",
  Success: "success",
  Danger: "danger",
  Warning: "warning",
  Neutral: "neutral",
} as const;

export type ToastVariant = (typeof ToastVariant)[keyof typeof ToastVariant];

export const ToastPosition = {
  TopLeft: "top-left",
  TopCenter: "top-center",
  TopRight: "top-right",
  BottomLeft: "bottom-left",
  BottomCenter: "bottom-center",
  BottomRight: "bottom-right",
  CenterCenter: "center-center",
} as const;

export type ToastPosition = (typeof ToastPosition)[keyof typeof ToastPosition];

export const ToastIconPosition = {
  LeftCenter: "left-center",
  LeftTop: "left-top",
  RightCenter: "right-center",
  RightTop: "right-top",
  CenterCenter: "center-center",
} as const;

export type ToastIconPosition =
  (typeof ToastIconPosition)[keyof typeof ToastIconPosition];

export interface ToastIconOptions extends FigureProps {
  render?: ReactNode;
  position?: ToastIconPosition;
}

export interface ToastStyles {
  containerStyle?: CSSProp;
  titleStyle?: CSSProp;
  contentStyle?: CSSProp;
  actionWrapperStyle?: CSSProp;
  actionStyle?: CSSProp;
  iconStyle?: CSSProp;
  detailSlotStyle?: CSSProp;
  headerStyle?: CSSProp;
}

export interface ToastAction extends Omit<BaseAction, "icon"> {
  variant?: ToastVariant;
}

export interface ToastProps {
  variant: ToastVariant;
  title?: ReactNode;
  content: ReactNode;
  actions?: ToastAction[];
  icon?: ToastIconOptions;
  closable?: boolean;
  disappearAfterMs?: number;
  styles?: ToastStyles;
  width?: number | string;
  maxWidth?: number | string;
  position?: ToastPosition;
  detailSlot?: ReactNode;
  withLoadingBar?: boolean;
  className?: string;
  id?: string;
}

type ToastWithoutVariant = Omit<ToastProps, "variant">;

export interface ToastAPI {
  alert(options: ToastProps): string;

  primary(options: ToastWithoutVariant): string;
  success(options: ToastWithoutVariant): string;
  danger(options: ToastWithoutVariant): string;
  warning(options: ToastWithoutVariant): string;
  neutral(options: ToastWithoutVariant): string;

  close(id: string): void;
  closeAll(): void;
}

interface ToastItemState extends ToastProps {
  id: string;
  exiting: boolean;
}

interface ToastItemProps {
  item: ToastItemState;
  onClose: (id: string) => void;
}

function ToastItem({ item, onClose }: ToastItemProps) {
  const {
    id,
    variant,
    title,
    content,
    actions = [],
    icon,
    closable = true,
    disappearAfterMs = 2000,
    styles = {},
    width,
    maxWidth,
    detailSlot,
    exiting,
    withLoadingBar = true,
    position = "top-right",
    className,
  } = item;

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;

      setProgress(Math.max(0, 100 - (elapsed / disappearAfterMs) * 100));
    }, 16);

    return () => clearInterval(interval);
  }, [disappearAfterMs]);

  const {
    position: iconPosition = ToastIconPosition.LeftTop,
    render: Render,
    ...restIcon
  } = icon ?? {};

  const { currentTheme, mode } = useTheme();
  const toastTheme = currentTheme?.toast?.[variant];

  const [expanded, setExpanded] = useState(false);

  const fromBottom = position.startsWith("bottom");
  const resolvedIcon = defaultIcons[variant];

  const filteredActions = actions?.filter((action) => !action.hidden);

  return (
    <Wrapper
      id={id}
      className={applyClassName("toast", className)}
      $exiting={exiting}
      $fromBottom={fromBottom}
      $width={width}
      $maxWidth={maxWidth}
      role="alert"
      aria-label="toast"
    >
      <Card
        aria-label="toast-wrapper"
        $mode={mode}
        $theme={toastTheme}
        $style={styles.containerStyle}
      >
        <Inner
          aria-label="toast-inner"
          $style={styles?.headerStyle}
          $iconPosition={iconPosition}
        >
          <IconWrap
            aria-label="toast-icon"
            $theme={toastTheme}
            $style={styles.iconStyle}
          >
            {Render ? (
              Render
            ) : restIcon?.image ? (
              <Figure {...restIcon} image={restIcon.image} />
            ) : (
              resolvedIcon
            )}
          </IconWrap>
          <Body>
            {title && (
              <Title aria-label="toast-title" $style={styles.titleStyle}>
                {title}
              </Title>
            )}
            <Content aria-label="toast-content" $style={styles.contentStyle}>
              {content}
            </Content>
          </Body>
        </Inner>

        {filteredActions.length > 0 && (
          <Actions
            aria-label="toast-actions-wrapper"
            $style={styles.actionWrapperStyle}
          >
            {actions.map((action, i) => (
              <ActionBtn
                aria-label="toast-action-button"
                $style={styles.actionStyle}
                key={i}
                $theme={toastTheme}
                disabled={action.disabled}
                onClick={() => {
                  action.onClick?.();
                  onClose(id);
                }}
              >
                {action.caption}
              </ActionBtn>
            ))}
          </Actions>
        )}
        <AnimatePresence initial={false}>
          {detailSlot && (
            <DetailSlot aria-label="toast-detail-slot">
              <DetailContent
                aria-label="toast-detail-slot-content"
                layout
                $style={styles.detailSlotStyle}
                $theme={toastTheme}
                initial={false}
                animate={{
                  height: expanded ? "auto" : 10,
                  opacity: 1,
                }}
                transition={{
                  height: { duration: 0.25, ease: "easeInOut" },
                  opacity: { duration: 0.2 },
                }}
              >
                {detailSlot}
              </DetailContent>

              <ListShowMoreButton
                expanded={expanded}
                setExpanded={setExpanded}
                variant={variant}
              />
            </DetailSlot>
          )}
        </AnimatePresence>

        {withLoadingBar && disappearAfterMs > 0 && (
          <Progressbar
            styles={{
              containerStyle: css`
                height: 2px;
                position: absolute;
                bottom: 0;
                left: 0;
              `,
            }}
            variant={variant}
            value={progress}
          />
        )}
      </Card>

      {closable && (
        <Button
          variant="ghost"
          onClick={() => onClose(id)}
          aria-label="toast-close"
          icon={{
            image: RiCloseLine,
            color: toastTheme?.textColor,
          }}
          styles={{
            containerStyle: css`
              position: absolute;
              left: -6px;
              top: -6px;

              opacity: 0;
              visibility: hidden;
              transform: scale(0.9);

              transition:
                opacity 0.4s ease,
                transform 0.4s ease,
                visibility 0.4s ease;

              ${Wrapper}:hover & {
                opacity: 1;
                visibility: visible;
                transform: scale(1);
              }
            `,
            self: css`
              padding: 0;
              width: 20px;
              height: 20px;
              border-radius: 9999px;

              opacity: 1;
              background-color: ${toastTheme?.backgroundColor};
            `,
          }}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  $exiting: boolean;
  $fromBottom: boolean;
  $width?: number | string;
  $maxWidth?: number | string;
}>`
  pointer-events: all;
  margin-bottom: 10px;
  position: relative;
  width: ${({ $width }) =>
    $width != null
      ? typeof $width === "number"
        ? `${$width}px`
        : $width
      : "360px"};
  max-width: ${({ $maxWidth }) =>
    $maxWidth != null
      ? typeof $maxWidth === "number"
        ? `${$maxWidth}px`
        : $maxWidth
      : "90vw"};
  animation: ${({ $exiting, $fromBottom }) =>
    $exiting
      ? css`
          ${slideOut} 0.22s cubic-bezier(0.4,0,1,1) forwards
        `
      : $fromBottom
        ? css`
            ${slideInBottom} 0.28s cubic-bezier(0.16,1,0.3,1) both
          `
        : css`
            ${slideInTop} 0.28s cubic-bezier(0.16,1,0.3,1) both
          `};
  backdrop-filter: blur(33px);
  -webkit-backdrop-filter: blur(33px);
  border-radius: 16px;
`;

const Card = styled.div<{
  $theme?: ToastThemeConfig;
  $style?: CSSProp;
  $mode?: ThemeMode | string;
}>`
  position: relative;
  overflow: hidden;
  border-radius: 16px;

  width: 100%;

  background-color: ${({ $theme }) => $theme?.backgroundColor ?? "#ffffff7d"};

  box-shadow: 0 10px 15px rgb(0 0 0 / 20%);

  color: ${({ $theme }) => $theme?.textColor};

  display: flex;
  flex-direction: column;

  ${({ $style }) => $style}
`;

const Inner = styled.div<{
  $iconPosition?: ToastIconPosition;
  $style?: CSSProp;
}>`
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 13px 13px 11px;

  ${({ $iconPosition }) => {
    switch ($iconPosition) {
      case "left-center":
        return css`
          align-items: center;
        `;
      case "left-top":
        return css`
          align-items: flex-start;
        `;
      case "right-center":
        return css`
          flex-direction: row-reverse;
          align-items: center;
        `;
      case "right-top":
        return css`
          flex-direction: row-reverse;
          align-items: flex-start;
        `;
      case "center-center":
        return css`
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 4px;
          padding: 20px;

          ${IconWrap} {
            margin-bottom: 4px;
          }
        `;
      default:
        return "";
    }
  }}

  ${({ $style }) => $style}
`;

const IconWrap = styled.div<{
  $theme?: ToastThemeConfig;
  $style?: CSSProp;
}>`
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: ${({ $theme }) => $theme?.iconBackgroundColor};
  color: ${({ $theme }) => $theme?.iconColor};
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $style }) => $style}
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.p<{ $style?: CSSProp }>`
  margin: 0 0 2px;
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.35;

  ${({ $style }) => $style}
`;

const Content = styled.p<{ $style?: CSSProp }>`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.85;

  ${({ $style }) => $style}
`;

const DetailContent = styled(motion.div)<{
  $theme?: ToastThemeConfig;
  $style?: CSSProp;
}>`
  overflow: hidden;
  padding: 0 13px 11px 54px;
  font-size: 12px;

  color: ${({ $theme }) => $theme?.textColor};

  ${({ $style }) => $style}
`;

const DetailSlot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

function ListShowMoreButton({
  expanded,
  setExpanded,
  variant,
}: {
  expanded: boolean;
  setExpanded: (prop: boolean) => void;
  variant?: ToastVariant;
}) {
  const { currentTheme } = useTheme();
  const toastTheme = currentTheme.toast?.[variant];

  return (
    <ShowMoreButton
      $theme={toastTheme}
      aria-label="toast-show-more-button"
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? "Show less" : "Show more"}

      <RiArrowDownSLine
        aria-label="toast-show-more-arrow"
        style={{
          width: 16,
          height: 16,
          marginLeft: 8,
          transition: "transform 0.3s ease",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
        }}
      />
    </ShowMoreButton>
  );
}

const ShowMoreButton = styled.button<{
  $style?: CSSProp;
  $theme?: ToastThemeConfig;
}>`
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  border-radius: 2px;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${({ $theme }) => $theme?.borderColor};
  color: ${({ $theme }) => $theme?.textColor};

  ${({ $style }) => $style}
`;

const Actions = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 13px 11px 54px;

  ${({ $style }) => $style}
`;

const ActionBtn = styled.button<{
  $theme?: ToastThemeConfig;
  $style?: CSSProp;
}>`
  padding: 5px 11px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid ${({ $theme }) => $theme?.borderColor};
  background: transparent;
  color: ${({ $theme }) => $theme?.textColor};
  line-height: 1;
  transition: background 0.12s;

  &:hover:not(:disabled) {
    background: ${({ $theme }) => $theme?.borderColor}33;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  ${({ $style }) => $style}
`;

const defaultIcons: Record<ToastVariant, ReactNode> = {
  primary: <RiInformationLine size={15} />,
  success: <RiCheckboxCircleLine size={15} />,
  danger: <RiCloseCircleLine size={15} />,
  warning: <RiAlertLine size={15} />,
  neutral: <RiNotification3Line size={15} />,
};

const slideInTop = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideInBottom = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const slideOut = keyframes`
  from { opacity: 1; transform: scale(1); max-height: 200px; margin-bottom: 10px; }
  to   { opacity: 0; transform: scale(0.95); max-height: 0; margin-bottom: 0; }
`;

const shrinkProgress = keyframes`
  from { width: 100%; }
  to   { width: 0%; }
`;

// Per-position root renderer
interface PositionStore {
  el: HTMLDivElement;
  root: ReturnType<typeof createRoot>;
  items: ToastItemState[];
  setItems?: (items: ToastItemState[]) => void;
}

const stores = new Map<ToastPosition, PositionStore>();

function getStore(position: ToastPosition): PositionStore {
  if (stores.has(position)) return stores.get(position)!;

  const el = document.createElement("div");
  el.setAttribute("toast-portal", position);
  document.body.appendChild(el);

  const root = createRoot(el);
  const store: PositionStore = { el, root, items: [] };
  stores.set(position, store);
  return store;
}

function ToastBridge({ position }: { position: ToastPosition }) {
  const [theme, setTheme] = useState(getThemeSnapshot());

  useEffect(() => {
    return subscribeTheme(() => {
      setTheme(getThemeSnapshot());
    });
  }, []);

  return (
    <ThemeProvider mode={theme.mode} themes={theme.themes}>
      <ToastContainer position={position} />
    </ThemeProvider>
  );
}

function ToastContainer({ position }: { position: ToastPosition }) {
  const [items, setItems] = useState<ToastItemState[]>([]);

  // Register the setter so the imperative API can push updates in
  useEffect(() => {
    const store = getStore(position);
    store.setItems = setItems;
    // Flush any items that arrived before this component mounted
    setItems([...store.items]);
    return () => {
      store.setItems = undefined;
    };
  }, [position]);

  return (
    <Container $position={position}>
      {items.map((item) => (
        <ToastItem
          key={item.id}
          item={item}
          onClose={(id) => scheduleRemoval(id, position, 0)}
        />
      ))}
    </Container>
  );
}

function renderStore(store: PositionStore, _position: ToastPosition) {
  // If the React tree is already mounted, drive it via state setter
  if (store.setItems) {
    store.setItems([...store.items]);
    return;
  }
  // Fallback: re-render (only happens before the first mount cycle completes)
  store.root.render(<ToastBridge position={_position} />);
}

const TOAST_POSITION_STYLE: Record<ToastPosition, CSSProp> = {
  "top-left": css`
    top: 16px;
    left: 16px;
    align-items: flex-start;
  `,
  "top-center": css`
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
  `,
  "top-right": css`
    top: 16px;
    right: 16px;
    align-items: flex-end;
  `,
  "bottom-left": css`
    bottom: 16px;
    left: 16px;
    align-items: flex-start;
    flex-direction: column-reverse;
  `,
  "bottom-center": css`
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    align-items: center;
    flex-direction: column-reverse;
  `,
  "bottom-right": css`
    bottom: 16px;
    right: 16px;
    align-items: flex-end;
    flex-direction: column-reverse;
  `,
  "center-center": css`
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
  `,
};

const Container = styled.div<{ $position: ToastPosition }>`
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0;
  pointer-events: none;
  ${({ $position }) => TOAST_POSITION_STYLE[$position]}
`;

// Singleton state

let _uid = 0;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleRemoval(id: string, position: ToastPosition, delay: number) {
  // Clear any existing auto-dismiss timer
  const existing = timers.get(id);
  if (existing) clearTimeout(existing);

  if (delay > 0) {
    // Start exit animation after delay
    timers.set(
      id,
      setTimeout(() => scheduleRemoval(id, position, 0), delay)
    );
    return;
  }

  // Mark as exiting → re-render → remove after animation
  const store = stores.get(position);
  if (!store) return;

  store.items = store.items.map((t) =>
    t.id === id ? { ...t, exiting: true } : t
  );
  renderStore(store, position);

  setTimeout(() => {
    const s = stores.get(position);
    if (!s) return;
    s.items = s.items.filter((t) => t.id !== id);
    renderStore(s, position);
    timers.delete(id);
  }, 240);
}

function show(options: ToastProps): string {
  const id = options?.id ?? `toast-${++_uid}`;
  const position = options.position ?? "top-right";
  const item: ToastItemState = { ...options, id, exiting: false };

  const store = getStore(position);
  store.items = [...store.items, item];
  renderStore(store, position);

  const ms = options.disappearAfterMs ?? 2000;
  if (ms > 0) scheduleRemoval(id, position, ms);

  if (ms === 0) {
    return null;
  }

  return id;
}

export const Toast: ToastAPI = {
  alert(options: ToastProps): string {
    return show(options);
  },

  primary(options: ToastWithoutVariant): string {
    return show({ ...options, variant: "primary" });
  },

  success(options: ToastWithoutVariant): string {
    return show({ ...options, variant: "success" });
  },

  danger(options: ToastWithoutVariant): string {
    return show({ ...options, variant: "danger" });
  },

  warning(options: ToastWithoutVariant): string {
    return show({ ...options, variant: "warning" });
  },

  neutral(options: ToastWithoutVariant): string {
    return show({ ...options, variant: "neutral" });
  },

  close(id: string): void {
    stores.forEach((store, position) => {
      if (store.items.some((t) => t.id === id)) {
        scheduleRemoval(id, position, 0);
      }
    });
  },

  closeAll(): void {
    timers.forEach((t) => clearTimeout(t));
    timers.clear();
    stores.forEach((store, position) => {
      store.items = store.items.map((t) => ({ ...t, exiting: true }));
      renderStore(store, position);
    });
    setTimeout(() => {
      stores.forEach((store, position) => {
        store.items = [];
        renderStore(store, position);
      });
    }, 240);
  },
};
