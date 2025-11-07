import { ChangeEvent, DragEvent, ReactElement, useRef, useState } from "react";
import { RiCloseLine } from "@remixicon/react";
import styled, { CSSProp } from "styled-components";

export interface FileInputBoxProps {
  containerStyle?: CSSProp;
  placeholder?: string;
  accept?: string;
  onFileSelected?: (file: File | undefined) => void;
  label?: string;
  labelStyle?: CSSProp;
  showError?: boolean;
  errorMessage?: string;
}

function FileInputBox({
  containerStyle,
  placeholder = "Drop a file here or browse",
  accept = "*",
  onFileSelected,
  label,
  labelStyle,
  errorMessage,
  showError,
}: FileInputBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = () => {
    if (selectedFile !== "") {
      onFileSelected(undefined);
      setSelectedFile("");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files;
      if (onFileSelected) {
        onFileSelected(file[0]);
      }
      setSelectedFile(file[0].name);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && onFileSelected) {
      const file = e.dataTransfer.files;
      if (onFileSelected) {
        onFileSelected(file[0]);
      }
      setSelectedFile(file[0].name);
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
      $isDragging={isDragging}
      $hasFile={!!selectedFile}
      onClick={handleBrowseClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      aria-label="fileinputbox"
    >
      {selectedFile !== "" ? (
        <>
          <FileName>{selectedFile}</FileName>
          <DeleteButton
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteFile();
            }}
          >
            <RiCloseLine size={16} />
          </DeleteButton>
        </>
      ) : (
        <Placeholder>{placeholder}</Placeholder>
      )}
      {selectedFile === "" && (
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          hidden
        />
      )}
    </InputBox>
  );

  return (
    <InputWrapper $containerStyle={containerStyle}>
      {label && <Label $style={labelStyle}>{label}</Label>}
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
}>`
  padding: 12px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  cursor: ${({ $hasFile }) => ($hasFile ? "default" : "pointer")};
  font-size: 14px;
  color: ${({ $isDragging }) => ($isDragging ? "#3b82f6" : "#6b7280")};
  background-color: ${({ $isDragging }) => ($isDragging ? "#eff6ff" : "#fff")};
  border: 1px dotted transparent;
  background-image: ${({ $isDragging }) =>
    $isDragging
      ? `
      repeating-linear-gradient(to right, #60a5fa 0, #60a5fa 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to bottom, #60a5fa 0, #60a5fa 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to left, #60a5fa 0, #60a5fa 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to top, #60a5fa 0, #60a5fa 8px, transparent 8px, transparent 12px)
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

const DeleteButton = styled.div`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #e5e7eb;
  }
`;

export { FileInputBox };
