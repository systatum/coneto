import { ChangeEvent, DragEvent, ReactElement, useRef, useState } from "react";
import { RiAddLine, RiImageLine } from "@remixicon/react";
import styled, { CSSProp } from "styled-components";

export interface ImageboxProps {
  containerStyle?: CSSProp;
  style?: CSSProp;
  onFilesSelected?: (files: FileList) => void;
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  name?: string;
}

const SIZE_STYLES = {
  xs: {
    dimension: "80px",
    icon: 16,
  },
  sm: {
    dimension: "100px",
    icon: 20,
  },
  md: {
    dimension: "120px",
    icon: 24,
  },
  lg: {
    dimension: "160px",
    icon: 28,
  },
};

function Imagebox({
  containerStyle,
  onFilesSelected,
  size = "md",
  label,
  errorMessage,
  showError,
  name,
  style,
}: ImageboxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { dimension, icon } = SIZE_STYLES[size];

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files;
      if (onFilesSelected) {
        onFilesSelected?.(file);
      }
      setSelectedFile(URL.createObjectURL(file[0]));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && onFilesSelected) {
      const file = e.dataTransfer.files;
      if (onFilesSelected) {
        onFilesSelected(file);
      }
      setSelectedFile(URL.createObjectURL(file[0]));
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
      $style={style}
      $dimension={dimension}
      $isDragging={isDragging}
      onClick={handleBrowseClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {selectedFile ? (
        <PreviewImage src={selectedFile} alt="preview" />
      ) : (
        <IconPlaceholder>
          <RiImageLine size={icon} />
        </IconPlaceholder>
      )}

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        name={name}
        onChange={handleFileChange}
      />

      <AddIconWrapper $isDragging={isDragging}>
        <RiAddLine size={icon} />
      </AddIconWrapper>
    </InputBox>
  );

  return (
    <InputWrapper $containerStyle={containerStyle}>
      {label && <label>{label}</label>}
      <InputContent>
        {inputElement}
        {showError && <ErrorText>{errorMessage}</ErrorText>}
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

  ${({ $disabled }) => $disabled && `cursor: not-allowed; opacity: 0.5;`}
  ${({ $containerStyle }) => $containerStyle}
`;

const InputBox = styled.div<{
  $dimension: string;
  $isDragging: boolean;
  $style?: CSSProp;
}>`
  position: relative;
  width: ${({ $dimension }) => $dimension};
  height: ${({ $dimension }) => $dimension};
  min-width: ${({ $dimension }) => $dimension};
  min-height: ${({ $dimension }) => $dimension};
  max-width: ${({ $dimension }) => $dimension};
  max-height: ${({ $dimension }) => $dimension};
  border-radius: 2px;
  border: 1px solid
    ${({ $isDragging }) => ($isDragging ? "#3b82f6" : "#d1d5db")};
  background-color: ${({ $isDragging }) =>
    $isDragging ? "#eff6ff" : "#ffffff"};
  color: ${({ $isDragging }) => ($isDragging ? "#3b82f6" : "#6b7280")};
  cursor: pointer;
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

const IconPlaceholder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  color: #c3c3c3;
  transform: translate(-50%, -50%);
`;

const PreviewImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AddIconWrapper = styled.div<{ $isDragging: boolean }>`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background-color: ${({ $isDragging }) =>
    $isDragging ? "#60a5fa" : "#ffffff"};
  border: 1px solid #d1d5db;
  border-radius: 2px;
  width: fit-content;
  height: fit-content;
  color: #c3c3c3;
`;

const HiddenInput = styled.input`
  display: none;
`;

export { Imagebox };
