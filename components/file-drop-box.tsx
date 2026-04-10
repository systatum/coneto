import { RiFile2Line, RiFileUploadLine, RiImageLine } from "@remixicon/react";
import {
  ChangeEvent,
  DragEvent,
  Fragment,
  ReactElement,
  ReactNode,
  useRef,
  useState,
} from "react";
import styled, { css, CSSProp } from "styled-components";
import { LoadingSpinner } from "./loading-spinner";
import { StatefulForm } from "./stateful-form";
import { Figure } from "./figure";
import { FieldLaneProps } from "./field-lane";
import { useTheme } from "./../theme/provider";
import { FileDropBoxThemeConfig } from "./../theme";

export interface OnFileDroppedFunctionProps {
  files: File[];
  succeed: (file: File) => void;
  error: (file: File, errorMessage: string) => void;
  setProgressLabel: (label: string) => void;
  progressPercentage?: number;
}

export interface OnCompleteFunctionProps {
  succeedFiles?: File[];
  failedFiles?: File[];
  setProgressLabel?: (label: string) => void;
  hideProgressLabel?: () => void;
  showUploaderForm?: () => void;
}

export interface FileDropBoxProps {
  placeholder?: string;
  accept?: string;
  label?: string;
  onFileDropped?: (props: OnFileDroppedFunctionProps) => void;
  onComplete?: (props: OnCompleteFunctionProps) => void;
  progressPercentage?: number;
  helper?: string;
  children?: ReactNode;
  styles?: FileDropBoxStylesProps;
  name?: string;
  id?: string;
  labelPosition?: FieldLaneProps["labelPosition"];
  labelGap?: FieldLaneProps["labelGap"];
  labelWidth?: FieldLaneProps["labelWidth"];
  required?: boolean;
  disabled?: boolean;
}

export interface FileDropBoxStylesProps {
  containerStyle?: CSSProp;
  dragOverStyle?: CSSProp;
  successStyle?: CSSProp;
  labelStyle?: CSSProp;
  contentStyle?: CSSProp;
}

type ProgressProps = "idle" | "loading" | "succeed" | null;

function FileDropBox({
  placeholder = "Drag and Drop Your File",
  accept = "*",
  onFileDropped,
  onComplete,
  label,
  children,
  styles,
  helper,
  name,
  id,
  labelPosition = "top",
  labelGap,
  labelWidth,
  required,
  disabled,
}: FileDropBoxProps) {
  const { currentTheme } = useTheme();
  const fileDropBoxTheme = currentTheme.fileDropBox;

  const FILE_ICON = [
    { id: 1, icon: RiImageLine, size: 50 },
    { id: 2, icon: RiFileUploadLine, size: 80 },
    { id: 3, icon: RiFile2Line, size: 50 },
  ];

  const inputId = StatefulForm.sanitizeId({
    prefix: "file-drop-box",
    name,
    id,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [progressLabel, setProgressLabel] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progress, setProgress] = useState<ProgressProps>("idle");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleBrowseClick = () => fileInputRef.current?.click();
  const handleErrorMessage = (msg: string) =>
    setErrorMessages((prev) => [...prev, msg]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleUploadFile(files);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      handleUploadFile(files);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const hideProgressLabel = () => {
    setProgress(null);
  };

  const showUploaderForm = () => {
    setProgress("idle");
  };

  const handleUploadFile = async (files: File[]) => {
    if (!onFileDropped) return;

    await setProgress("loading");

    const succeedFiles: File[] = [];
    const failedFiles: File[] = [];
    const total = files.length;

    const succeed = (file: File) => {
      succeedFiles.push(file);
      updateProgressBar(succeedFiles.length, total);
    };

    const error = (file: File, message: string) => {
      failedFiles.push(file);
      handleErrorMessage(message);
      updateProgressBar(succeedFiles.length, total);
    };

    const updateProgressBar = (succeedCount: number, totalCount: number) => {
      const percentage = Math.round((succeedCount / totalCount) * 100);
      setProgressPercentage(percentage);
    };

    for (let i = 0; i < files.length; i++) {
      setCurrentIndex(i);
      await onFileDropped({
        files: [files[i]],
        succeed,
        error,
        setProgressLabel,
        progressPercentage,
      });
    }
    await setProgress("succeed");

    await onComplete?.({
      succeedFiles,
      failedFiles,
      setProgressLabel,
      hideProgressLabel,
      showUploaderForm,
    });
  };

  const inputElement: ReactElement = (
    <DropArea
      $theme={fileDropBoxTheme}
      $dragOverStyle={styles?.dragOverStyle}
      $successStyle={styles?.successStyle}
      $isDragging={isDragging}
      $progress={progress}
      aria-label="file-drop-box-area"
      onClick={!disabled && handleBrowseClick}
      onDrop={!disabled && handleDrop}
      onDragOver={!disabled && handleDragOver}
      onDragLeave={!disabled && handleDragLeave}
    >
      {progress === "loading" && currentIndex !== null ? (
        <ProgressContainer $theme={fileDropBoxTheme}>
          <LoadingSpinner iconSize={20} />
          <span>{progressLabel}</span>
          <ProgressBarWrapper $theme={fileDropBoxTheme}>
            <ProgressBar
              $width={progressPercentage}
              $theme={fileDropBoxTheme}
            />
          </ProgressBarWrapper>
        </ProgressContainer>
      ) : progress === "idle" ? (
        <Fragment>
          <UploadContent>
            <IconsRow>
              {FILE_ICON.map(({ id, icon, size }) => (
                <Figure
                  key={id}
                  color={
                    isDragging
                      ? fileDropBoxTheme.dragActiveTextColor
                      : fileDropBoxTheme.iconColor
                  }
                  image={icon}
                  size={size}
                />
              ))}
            </IconsRow>
            <PlaceholderText $theme={fileDropBoxTheme} $isDragging={isDragging}>
              {placeholder}
            </PlaceholderText>
            <div>
              <LinkText $theme={fileDropBoxTheme}>Select some files</LinkText>{" "}
              from your computer
            </div>
          </UploadContent>
          {children && (
            <ContentWrapper
              $style={styles?.contentStyle}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </ContentWrapper>
          )}
        </Fragment>
      ) : progress === "succeed" ? (
        <Fragment>{progressLabel}</Fragment>
      ) : null}

      {progress === "idle" && (
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={accept}
          required={required}
          onChange={handleFileChange}
          disabled={disabled}
          multiple
          hidden
        />
      )}
    </DropArea>
  );

  return (
    <InputWrapper
      $disabled={disabled}
      $labelPosition={labelPosition}
      aria-label="file-drop-box-container"
      $hide={progress === null}
      $containerStyle={styles?.containerStyle}
      $labelGap={labelGap}
    >
      {label && (
        <StatefulForm.Label
          htmlFor={disabled ? null : inputId}
          labelWidth={labelWidth}
          labelPosition={labelPosition}
          required={required}
          styles={{ self: styles?.labelStyle }}
          helper={helper}
          label={label}
        />
      )}
      {inputElement}

      {errorMessages.length > 0 && (
        <ErrorList>
          {errorMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ErrorList>
      )}
    </InputWrapper>
  );
}

const InputWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $hide?: boolean;
  $labelPosition?: FieldLaneProps["labelPosition"];
  $labelGap?: FieldLaneProps["labelGap"];
  $disabled?: boolean;
}>`
  display: flex;
  width: 100%;
  flex-direction: ${({ $labelPosition }) =>
    $labelPosition === "top" ? "column" : "row"};
  gap: ${({ $labelGap }) => `${$labelGap ? `${$labelGap}px` : "0.5rem"}`};
  font-size: 0.75rem;
  position: relative;

  ${({ $hide }) =>
    $hide &&
    css`
      display: none;
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.5;
      user-select: none;
      cursor: not-allowed;
    `};

  ${({ $containerStyle }) => $containerStyle}
`;

const ContentWrapper = styled.div<{
  $style?: CSSProp;
}>`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: start;
  text-align: start;
  cursor: default;

  ${({ $style }) => $style}
`;

const DropArea = styled.div<{
  $isDragging: boolean;
  $progress: ProgressProps;
  $dragOverStyle?: CSSProp;
  $successStyle?: CSSProp;
  $theme: FileDropBoxThemeConfig;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  position: relative;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  width: 100%;

  color: ${({ $theme }) => $theme.textColor};
  background-color: ${({ $theme }) => $theme.backgroundColor};

  ${({ $progress, $dragOverStyle, $theme }) =>
    $progress === "idle" &&
    css`
      padding: 0.75rem;
      border: 1px dotted transparent;
      background-image:
        repeating-linear-gradient(
          to right,
          ${$theme.defaultGradientColor} 0,
          ${$theme.defaultGradientColor} 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to bottom,
          ${$theme.defaultGradientColor} 0,
          ${$theme.defaultGradientColor} 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to left,
          ${$theme.defaultGradientColor} 0,
          ${$theme.defaultGradientColor} 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to top,
          ${$theme.defaultGradientColor} 0,
          ${$theme.defaultGradientColor} 8px,
          transparent 8px,
          transparent 12px
        );
      background-size:
        100% 1px,
        1px 100%,
        100% 1px,
        1px 100%;
      background-position:
        top left,
        top right,
        bottom right,
        bottom left;
      background-repeat: no-repeat;

      ${$dragOverStyle}
    `};

  ${({ $isDragging, $theme }) =>
    $isDragging &&
    css`
      background-color: ${$theme.dragActiveBackgroundColor};
      color: ${$theme.dragActiveTextColor};

      background-image:
        repeating-linear-gradient(
          to right,
          ${$theme.dragActiveGradientColor} 0,
          ${$theme.dragActiveGradientColor} 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to bottom,
          ${$theme.dragActiveGradientColor} 0,
          ${$theme.dragActiveGradientColor} 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to left,
          ${$theme.dragActiveGradientColor} 0,
          ${$theme.dragActiveGradientColor} 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to top,
          ${$theme.dragActiveGradientColor} 0,
          ${$theme.dragActiveGradientColor} 8px,
          transparent 8px,
          transparent 12px
        );
      background-size:
        100% 1px,
        1px 100%,
        100% 1px,
        1px 100%;
      background-position:
        top left,
        top right,
        bottom right,
        bottom left;
      background-repeat: no-repeat;
    `};

  ${({ $progress, $successStyle, $theme }) =>
    $progress === "succeed" &&
    css`
      border: 1px solid ${$theme.borderColor};
      ${$successStyle}
    `};
`;

const UploadContent = styled.div`
  font-size: 0.875rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  padding: 1.5rem;
`;

const IconsRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 0.5rem;
`;

const PlaceholderText = styled.span<{
  $isDragging: boolean;
  $theme: FileDropBoxThemeConfig;
}>`
  font-size: 1.25rem;
  color: ${({ $theme, $isDragging }) =>
    $isDragging ? $theme.dragActiveTextColor : $theme.textColor};
`;

const LinkText = styled.span<{ $theme: FileDropBoxThemeConfig }>`
  color: ${({ $theme }) => $theme.dragActiveTextColor || "#3b82f6"};
  text-decoration: underline;
`;

const ProgressContainer = styled.div<{
  $theme: FileDropBoxThemeConfig;
}>`
  width: 100%;
  font-size: 0.875rem;
  padding: 1rem;
  border-radius: 2px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid ${({ $theme }) => $theme.borderColor};
`;

const ProgressBarWrapper = styled.div<{
  $theme: FileDropBoxThemeConfig;
}>`
  height: 4px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: ${({ $theme }) => $theme.backgroundColor || "#e5e7eb"};
`;

const ProgressBar = styled.div<{
  $width: number;
  $theme: FileDropBoxThemeConfig;
}>`
  height: 4px;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 2px;
  transition: all 0.2s ease;
  width: ${({ $width }) => $width}%;
  background-color: ${({ $theme }) => $theme.progressBarColor};
`;

const ErrorList = styled.ul`
  list-style-type: disc;
  font-size: 0.875rem;
  margin-left: 2.5rem;
`;

export { FileDropBox };
