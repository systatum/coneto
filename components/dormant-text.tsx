import {
  RemixiconComponentType,
  RiCheckLine,
  RiCloseLine,
  RiPencilFill,
} from "@remixicon/react";
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
import styled, { css, CSSProp } from "styled-components";

export interface DormantTextProps {
  style?: CSSProp;
  onActionClick?: () => void;
  icon?: RemixiconComponentType;
  dormantedFontSize?: number;
  children?: ReactNode;
  content?: string | number;
  fullWidth?: boolean;
  acceptChangeOn?: "enter" | "click" | "all";
  cancelable?: boolean;
  onActive?: () => void;
  onCancelRequested?: () => void;
  dormantedMaxWidth?: string;
}

export interface DormantTextRef {
  doneEditing: () => void;
  cancelEditing: () => void;
}

function DormantText({
  onActionClick,
  style,
  dormantedFontSize = 17,
  icon: Icon = RiCheckLine,
  children,
  content,
  fullWidth,
  acceptChangeOn,
  cancelable,
  onActive,
  onCancelRequested,
  dormantedMaxWidth,
}: DormantTextProps) {
  const [dormantedLocal, setDormantedLocal] = useState(true);

  const [labelHeight, setLabelHeight] = useState<number>(0);
  const [labelWidth, setLabelWidth] = useState<number>(0);
  const [inputHeight, setInputHeight] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const dormantPencilSize = dormantedFontSize * 1.05;

  const combinedRef = useRef<{
    input: HTMLInputElement | null;
    doneEditing: () => void;
    cancelEditing: () => void;
  }>({
    input: null,
    doneEditing: () => {
      if (onActionClick) onActionClick();
      setDormantedLocal(true);
    },
    cancelEditing: () => {
      setDormantedLocal(true);
      if (onCancelRequested) {
        onCancelRequested();
      }
    },
  });

  useEffect(() => {
    combinedRef.current.input = inputRef.current;
  }, [inputRef.current]);

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
        combinedRef.current.input = el;
      },
      onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
        if (
          e.key === "Enter" &&
          (acceptChangeOn === "enter" || acceptChangeOn === "all")
        ) {
          combinedRef.current.doneEditing();
        } else if (e.key === "Escape" && cancelable) {
          combinedRef.current.cancelEditing();
          if (onCancelRequested) {
            onCancelRequested();
          }
        }
      },

      onClick: () => {
        if (acceptChangeOn === "click" || acceptChangeOn === "all") {
          combinedRef.current.doneEditing();
        }
      },
    });
  });

  return dormantedLocal ? (
    <DormantLabel
      ref={measureLabelSize}
      onClick={() => {
        setDormantedLocal(false);
        if (onActive) onActive();
        setTimeout(() => inputRef.current?.focus(), 0);
      }}
      $fullWidth={fullWidth}
      $dormantedMaxWidth={dormantedMaxWidth}
      $fontSize={dormantedFontSize}
      $style={style}
    >
      <DormantLabelText>{content}</DormantLabelText>
      <PencilIcon className="pencil-icon" size={dormantPencilSize} />
    </DormantLabel>
  ) : (
    <DormantWrapper $style={style} $minHeight={labelHeight}>
      <LabelWrapper ref={measureLabelSize} $maxWidth={labelWidth}>
        {dormantChildren}
      </LabelWrapper>

      <ActionButton
        $minHeight={32.5 | inputHeight}
        onClick={(e) => {
          e.preventDefault();
          onActionClick?.();
          setDormantedLocal(true);
        }}
      >
        <IconWrapper>
          <Icon size={18} />
        </IconWrapper>
      </ActionButton>

      {cancelable && (
        <ActionButton
          $minHeight={32.5 | inputHeight}
          onClick={(e) => {
            e.preventDefault();
            setDormantedLocal(true);
            onCancelRequested?.();
          }}
        >
          <IconWrapper>
            <RiCloseLine size={18} />
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
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  position: relative;
  gap: 0.25rem;

  padding: 0.5rem;
  border-radius: 2px;
  cursor: pointer;

  border: 1px solid transparent;
  transition: all 0.1s ease;
  transform: translateZ(0);

  ${({ $fullWidth }) => $fullWidth && `min-width: 100%;`}

  ${({ $dormantedMaxWidth }) =>
    $dormantedMaxWidth &&
    css`
      width: ${$dormantedMaxWidth};
      overflow: hidden;
      min-width: 0;

      & > :first-child {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
      }
    `}
  ${({ $fontSize }) =>
    $fontSize &&
    `font-size: ${typeof $fontSize === "number" ? `${$fontSize}px` : $fontSize};`}

  &:hover {
    background-color: #e9e9e9;
    border-color: #e9e9e9;

    .pencil-icon {
      opacity: 1;
    }
  }
  ${({ $style }) => $style}
`;

const DormantLabelText = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
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
  height: 100%;
  min-height: ${({ $minHeight }) =>
    typeof $minHeight === "number" ? `${$minHeight}px` : $minHeight};
  ${({ $style }) => $style}
`;

const LabelWrapper = styled.div<{ $maxWidth?: number | string }>`
  width: 100%;
  height: 100%;
  max-width: ${({ $maxWidth }) =>
    typeof $maxWidth === "number" ? `${$maxWidth}px` : $maxWidth};
`;

const ActionButton = styled.button<{
  $style?: CSSProp;
  $minHeight?: number | string;
}>`
  display: flex;
  min-width: 30px;
  padding: 2px;
  position: relative;
  border-radius: 2px;
  transition: all 0.2s ease;
  cursor: pointer;
  color: var(--muted-foreground, #666);

  min-height: ${({ $minHeight }) =>
    typeof $minHeight === "number" ? `${$minHeight}px` : $minHeight};

  &:hover {
    background-color: #d1d5db;
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
