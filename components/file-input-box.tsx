import { ChangeEvent, DragEvent, ReactElement, useRef, useState } from "react";
import { RiCloseLine } from "@remixicon/react";
import styled, { css, CSSProp } from "styled-components";
import { Button } from "./button";

export interface FileInputBoxProps {
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  styles?: FileInputBoxStylesProps;
}

export interface FileInputBoxStylesProps {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  inputStyle?: CSSProp;
}

function FileInputBox({
  placeholder = "Drop files here or browse",
  accept = "*",
  multiple = false,
  onFilesSelected,
  label,
  errorMessage,
  showError,
  styles,
}: FileInputBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    if (onFilesSelected) {
      onFilesSelected(updatedFiles);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const updatedFiles = multiple ? [...selectedFiles, ...files] : files;
      setSelectedFiles(updatedFiles);
      if (onFilesSelected) {
        onFilesSelected(updatedFiles);
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const updatedFiles = multiple ? [...selectedFiles, ...files] : files;
      setSelectedFiles(updatedFiles);
      if (onFilesSelected) {
        onFilesSelected(updatedFiles);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const inputElement: ReactElement = (
    <InputBox
      $style={styles?.inputStyle}
      $isDragging={isDragging}
      $hasFile={selectedFiles.length > 0}
      onClick={handleBrowseClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      aria-label="fileinputbox"
      $isError={showError}
    >
      {selectedFiles.length > 0 ? (
        <FileList>
          {selectedFiles.map((file, index) => (
            <FileItem key={index}>
              <Button
                aria-label="delete-button"
                styles={{
                  containerStyle: css`
                    cursor: pointer;
                    width: fit-content;
                    height: fit-content;
                  `,
                  buttonStyle: css`
                    padding: 2px;
                    width: fit-content;
                    height: fit-content;
                    background-color: white;
                    &:hover {
                      background-color: #e5e7eb;
                    }
                  `,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(index);
                }}
              >
                <RiCloseLine size={14} />
              </Button>
              <FileName>{file.name}</FileName>
            </FileItem>
          ))}
        </FileList>
      ) : (
        <Placeholder>{placeholder}</Placeholder>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        hidden
      />
    </InputBox>
  );

  return (
    <InputWrapper $containerStyle={styles?.containerStyle}>
      {label && <Label $style={styles?.labelStyle}>{label}</Label>}
      <InputContent>
        {inputElement}
        {showError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </InputContent>
    </InputWrapper>
  );
}

const InputWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;
  position: relative;

  ${({ $disabled }) => $disabled && `cursor: not-allowed; opacity: 0.5;`}
  ${({ $containerStyle }) => $containerStyle}
`;

const InputBox = styled.div<{
  $isDragging: boolean;
  $hasFile: boolean;
  $isError?: boolean;
  $inputStyle?: CSSProp;
  $style?: CSSProp;
}>`
  padding: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  border-radius: 4px;
  cursor: ${({ $hasFile }) => ($hasFile ? "default" : "pointer")};
  font-size: 14px;
  color: ${({ $isDragging }) => ($isDragging ? "#3b82f6" : "#6b7280")};
  background-color: ${({ $isDragging }) => ($isDragging ? "#eff6ff" : "#fff")};
  border: 1px dotted transparent;
  background-image: ${({ $isDragging, $isError }) =>
    $isDragging
      ? `
      repeating-linear-gradient(to right, #60a5fa 0, #60a5fa 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to bottom, #60a5fa 0, #60a5fa 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to left, #60a5fa 0, #60a5fa 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to top, #60a5fa 0, #60a5fa 8px, transparent 8px, transparent 12px)
    `
      : $isError
        ? `
      repeating-linear-gradient(to right, #dc2626 0, #dc2626 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to bottom, #dc2626 0, #dc2626 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to left, #dc2626 0, #dc2626 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to top, #dc2626 0, #dc2626 8px, transparent 8px, transparent 12px)
    `
        : `
      repeating-linear-gradient(to right, #9ca3af 0, #9ca3af 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to bottom, #9ca3af 0, #9ca3af 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to left, #9ca3af 0, #9ca3af 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to top, #9ca3af 0, #9ca3af 8px, transparent 8px, transparent 12px)
    `};
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

  ${({ $style }) => $style}
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const Label = styled.label<{ $style?: CSSProp }>`
  ${({ $style }) => $style}
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  gap: 6px;
`;

const FileName = styled.div`
  font-size: 14px;
  color: #374151;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Placeholder = styled.span`
  font-size: 14px;
  width: 100%;
`;

export { FileInputBox };
