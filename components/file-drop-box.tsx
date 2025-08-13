import { RiFile2Line, RiFileUploadLine, RiImageLine } from "@remixicon/react";
import { ChangeEvent, DragEvent, ReactElement, useRef, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { LoadingSpinner } from "./loading-spinner";

export interface OnFileDroppedFunctionProps {
  files: File[];
  succeed: (file: File) => void;
  error: (file: File, errorMessage: string) => void;
  setProgressLabel: (label: string) => void;
  progressPercentage?: number;
}

export interface OnCompleteFunctionProps {
  succeedFiles: File[];
  failedFiles: File[];
  setProgressLabel: (label: string) => void;
}

export interface FileDropBoxProps {
  containerStyle?: CSSProp;
  placeholder?: string;
  accept?: string;
  label?: string;
  onFileDropped?: (props: OnFileDroppedFunctionProps) => void;
  onComplete?: (props: OnCompleteFunctionProps) => void;
  progressPercentage?: number;
}

type ProgressProps = "idle" | "loading" | "succeed";

function FileDropBox({
  containerStyle,
  placeholder = "Drag and Drop Your File",
  accept = "*",
  onFileDropped,
  onComplete,
  label,
}: FileDropBoxProps) {
  const FILE_ICON = [
    { id: 1, icon: RiImageLine, size: 50 },
    { id: 2, icon: RiFileUploadLine, size: 80 },
    { id: 3, icon: RiFile2Line, size: 50 },
  ];

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

    await onComplete?.({ succeedFiles, failedFiles, setProgressLabel });
    setProgress("succeed");
  };

  const inputElement: ReactElement = (
    <DropArea
      $isDragging={isDragging}
      $progress={progress}
      aria-label="filedropbox"
      onClick={handleBrowseClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {progress === "loading" && currentIndex !== null ? (
        <ProgressContainer>
          <LoadingSpinner iconSize={20} />
          <span>{progressLabel}</span>
          <ProgressBarWrapper>
            <ProgressBar width={progressPercentage} />
          </ProgressBarWrapper>
        </ProgressContainer>
      ) : progress === "idle" ? (
        <UploadContent>
          <IconsRow>
            {FILE_ICON.map(({ id, icon: Icon, size }) => (
              <Icon key={id} size={size} />
            ))}
          </IconsRow>
          <PlaceholderText $isDragging={isDragging}>
            {placeholder}
          </PlaceholderText>
          <div>
            <LinkText>Select some files</LinkText> from your computer
          </div>
        </UploadContent>
      ) : progress === "succeed" ? (
        <div>{progressLabel}</div>
      ) : null}

      {progress === "idle" && (
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          multiple
          hidden
        />
      )}
    </DropArea>
  );

  return (
    <InputWrapper $containerStyle={containerStyle}>
      {label && <Label>{label}</Label>}
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
}>`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  position: relative;

  ${({ $containerStyle }) => $containerStyle}
`;

const Label = styled.label`
  font-size: 0.75rem;
`;

const DropArea = styled.div<{
  $isDragging: boolean;
  $progress: ProgressProps;
}>`
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
  position: relative;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-radius: 4px;
  color: #6b7280;

  ${({ $progress }) =>
    $progress === "idle" &&
    css`
      border: 1px dotted transparent;
      background-image:
        repeating-linear-gradient(
          to right,
          #9ca3af 0,
          #9ca3af 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to bottom,
          #9ca3af 0,
          #9ca3af 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to left,
          #9ca3af 0,
          #9ca3af 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to top,
          #9ca3af 0,
          #9ca3af 8px,
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
    `}

  ${({ $isDragging }) =>
    $isDragging &&
    css`
      background-color: #eff6ff;
      color: #61a9f9;
      background-image:
        repeating-linear-gradient(
          to right,
          #60a5fa 0,
          #60a5fa 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to bottom,
          #60a5fa 0,
          #60a5fa 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to left,
          #60a5fa 0,
          #60a5fa 8px,
          transparent 8px,
          transparent 12px
        ),
        repeating-linear-gradient(
          to top,
          #60a5fa 0,
          #60a5fa 8px,
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
    `}

  ${({ $progress }) =>
    $progress === "succeed" &&
    css`
      border: 1px solid #f3f4f6;
    `}
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

const PlaceholderText = styled.span<{ $isDragging: boolean }>`
  font-weight: 600;
  font-size: 1.25rem;
  color: ${(props) => (props.$isDragging ? "#3b82f6" : "#000")};
`;

const LinkText = styled.span`
  color: #3b82f6;
  text-decoration: underline;
`;

const ProgressContainer = styled.div`
  width: 100%;
  font-size: 0.875rem;
  color: black;
  padding: 1rem;
  border-radius: 2px;
  position: relative;
  border: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressBarWrapper = styled.div`
  height: 4px;
  width: 100%;
  background-color: #d1d5db;
  position: absolute;
  left: 0;
  bottom: 0;
`;

const ProgressBar = styled.div<{ width: number }>`
  height: 4px;
  background-color: #93c5fd;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 2px;
  transition: all 0.2s ease;
  width: ${(props) => props.width}%;
`;

const ErrorList = styled.ul`
  list-style-type: disc;
  font-size: 0.875rem;
  color: #4b5563;
  margin-left: 2.5rem;
`;

export { FileDropBox };
