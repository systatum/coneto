import { RiCheckLine, RiCloseLine, RiPencilFill } from "@remixicon/react";
import {
  Children,
  cloneElement,
  InputHTMLAttributes,
  isValidElement,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { CSSProp } from "styled-components";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "./../theme/provider";
import { DormantTextThemeConfig } from "./../theme";

export interface DormantTextProps {
  onActionClick?: () => void;
  icons?: DormantTextIconsProps;
  dormantedFontSize?: number;
  children?: ReactNode;
  content?: string | number;
  fullWidth?: boolean;
  acceptChangeOn?: "enter" | "click" | "all";
  cancelable?: boolean;
  onActive?: () => void;
  onCancelRequested?: () => void;
  dormantedMaxWidth?: string;
  styles?: DormantTextStylesProps;
}

export interface DormantTextIconsProps {
  accept?: FigureProps;
  cancel?: FigureProps;
}

export interface DormantTextStylesProps {
  dormantedStyle?: CSSProp;
  activeStyle?: CSSProp;
  actionStyle?: CSSProp;
}
export interface DormantTextRef {
  doneEditing: () => void;
  cancelEditing: () => void;
}

function DormantText({
  onActionClick,
  styles,
  dormantedFontSize = 17,
  icons,
  children,
  content,
  fullWidth,
  acceptChangeOn,
  cancelable,
  onActive,
  onCancelRequested,
  dormantedMaxWidth,
}: DormantTextProps) {
  const { currentTheme } = useTheme();
  const dormantTextTheme = currentTheme.dormantText;

  const { accept, cancel } = icons ?? {};

  const [dormantedLocal, setDormantedLocal] = useState(true);
  const [labelHeight, setLabelHeight] = useState<number>(0);
  const [labelWidth, setLabelWidth] = useState<number>(0);
  const [inputHeight, setInputHeight] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dormantPencilSize = dormantedFontSize * 1.05;

  useEffect(() => {
    if (!inputRef.current) return;

    const type = String(inputRef.current.dataset.type);

    if (type === "selectbox") {
      setLabelWidth((prev) => prev + 30);
    } else if (type === "timebox-with-second") {
      setLabelWidth((prev) => prev + 53);
    }
  }, [dormantedLocal]);

  const measureLabelSize = (el: HTMLLabelElement | HTMLDivElement | null) => {
    if (el) {
      const height = el.getBoundingClientRect().height;
      const width = el.getBoundingClientRect().width;
      if (el instanceof HTMLLabelElement) {
        setLabelHeight(height);
        setLabelWidth(width);
      } else {
        setInputHeight(height);
      }
    }
  };

  const dormantChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return null;

    const typedChild = child as ReactElement<
      InputHTMLAttributes<HTMLInputElement> & {
        ref?: Ref<HTMLInputElement>;
      }
    >;

    return cloneElement(typedChild, {
      ref: (el: HTMLInputElement | null) => {
        inputRef.current = el;
      },
      onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
        if (
          e.key === "Enter" &&
          (acceptChangeOn === "enter" || acceptChangeOn === "all")
        ) {
          if (onActionClick) onActionClick();
          setDormantedLocal(true);
        } else if (e.key === "Escape" && cancelable) {
          if (onCancelRequested) onCancelRequested();
          setDormantedLocal(true);
        }
      },
      onClick: () => {
        if (acceptChangeOn === "click" || acceptChangeOn === "all") {
          if (onActionClick) {
            onActionClick();
          }
          setDormantedLocal(true);
        }
      },
    });
  });

  return dormantedLocal ? (
    <DormantLabel
      $theme={dormantTextTheme}
      aria-label="dormant-wrapper"
      ref={measureLabelSize}
      onClick={() => {
        if (onActive) {
          onActive();
        }
        setDormantedLocal(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      }}
      $fullWidth={fullWidth}
      $dormantedMaxWidth={dormantedMaxWidth}
      $fontSize={dormantedFontSize}
      $style={styles?.dormantedStyle}
    >
      <DormantLabelText $theme={dormantTextTheme} aria-label="dormant-label">
        {content}
      </DormantLabelText>
      <PencilIcon
        className="pencil-icon"
        style={{
          minWidth: dormantPencilSize,
          minHeight: dormantPencilSize,
          maxWidth: dormantPencilSize,
          maxHeight: dormantPencilSize,
        }}
      />
    </DormantLabel>
  ) : (
    <DormantWrapper
      aria-label="active-wrapper"
      $style={styles?.activeStyle}
      $minHeight={labelHeight}
    >
      <LabelWrapper ref={measureLabelSize} $maxWidth={labelWidth}>
        {dormantChildren}
      </LabelWrapper>

      <ActionButton
        $theme={dormantTextTheme}
        $style={styles?.actionStyle}
        $minHeight={32.5 | inputHeight}
        onClick={(e) => {
          e.preventDefault();
          onActionClick?.();
          setDormantedLocal(true);
        }}
      >
        <IconWrapper>
          <Figure
            {...accept}
            image={accept?.image ?? RiCheckLine}
            color={accept?.color ?? "#666"}
            size={18}
          />
        </IconWrapper>
      </ActionButton>

      {cancelable && (
        <ActionButton
          $theme={dormantTextTheme}
          $style={styles?.actionStyle}
          $minHeight={32.5 | inputHeight}
          onClick={(e) => {
            e.preventDefault();
            setDormantedLocal(true);
            onCancelRequested?.();
          }}
        >
          <IconWrapper>
            <Figure
              {...cancel}
              image={cancel?.image ?? RiCloseLine}
              color={cancel?.color ?? "#666"}
              size={18}
            />
          </IconWrapper>
        </ActionButton>
      )}
    </DormantWrapper>
  );
}

const DormantLabel = styled.label<{
  $fullWidth?: boolean;
  $fontSize?: string | number;
  $style?: CSSProp;
  $dormantedMaxWidth?: string;
  $theme?: DormantTextThemeConfig;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${({ $fullWidth, $dormantedMaxWidth }) =>
    $dormantedMaxWidth
      ? $dormantedMaxWidth
      : $fullWidth
        ? "100%"
        : "fit-content"};
  max-width: 100%;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 2px;
  cursor: text;
  transition: all 0.1s ease;
  transform: translateZ(0);
  border: 1px solid transparent;

  ${({ $fontSize }) =>
    $fontSize &&
    `font-size: ${typeof $fontSize === "number" ? `${$fontSize}px` : $fontSize};`}

  &:hover {
    background-color: ${({ $theme }) => $theme?.hoverBackgroundColor};
    border-color: ${({ $theme }) => $theme?.borderColor};

    .pencil-icon {
      opacity: 1;
    }
  }

  ${({ $style }) => $style}
`;

const DormantLabelText = styled.span<{
  $theme?: DormantTextThemeConfig;
}>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
  color: ${({ $theme }) => $theme?.textColor};
`;

const PencilIcon = styled(RiPencilFill)`
  opacity: 0;
  transition: all 0.1s ease;
  transform: translateZ(0);
`;

const DormantWrapper = styled.div<{
  $style?: CSSProp;
  $minHeight?: number | string;
}>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: relative;
  align-items: center;
  gap: 2px;
  min-height: ${({ $minHeight }) =>
    typeof $minHeight === "number" ? `${$minHeight}px` : $minHeight};

  ${({ $style }) => $style}
`;

const LabelWrapper = styled.div<{ $maxWidth?: number | string }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  max-width: ${({ $maxWidth }) =>
    typeof $maxWidth === "number" ? `${$maxWidth}px` : $maxWidth};
`;

const ActionButton = styled.button<{
  $style?: CSSProp;
  $minHeight?: number | string;
  $theme?: DormantTextThemeConfig;
}>`
  display: flex;
  min-width: 30px;
  padding: 2px;
  position: relative;
  border-radius: 2px;
  transition: all 0.2s ease;
  cursor: pointer;
  color: ${({ $theme }) => $theme?.actionButtonColor};

  height: ${({ $minHeight }) =>
    typeof $minHeight === "number" ? `${$minHeight}px` : $minHeight};

  &:hover {
    background-color: ${({ $theme }) => $theme?.actionButtonHoverBackground};
  }

  ${({ $style }) => $style}
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 6px;
  transform: translateY(-50%);
`;

export { DormantText };
