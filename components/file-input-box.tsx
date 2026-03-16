import {
  ChangeEvent,
  DragEvent,
  InputHTMLAttributes,
  ReactElement,
  useRef,
  useState,
} from "react";
import { RiCloseLine } from "@remixicon/react";
import styled, { css, CSSProp } from "styled-components";
import { Button } from "./button";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";

interface BaseFileInputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
  styles?: BaseFileInputBoxStylesProps;
  helper?: string;
}

interface BaseFileInputBoxStylesProps {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
  self?: CSSProp;
}

function BaseFileInputBox({
  placeholder = "Drop files here or browse",
  accept = "*",
  multiple = false,
  onFilesSelected,
  label,
  errorMessage,
  showError,
  styles,
  helper,
  name,
  id,
  disabled,
  ...props
}: BaseFileInputBoxProps) {
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

  return (
    <InputBox
      $style={styles?.self}
      $isDragging={isDragging}
      $hasFile={selectedFiles.length > 0}
      onClick={handleBrowseClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      aria-label="fileinputbox"
      $disabled={disabled}
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
                  self: css`
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
        {...props}
        ref={fileInputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        onChange={handleFileChange}
        id={id}
        hidden
      />
    </InputBox>
  );
}

export type FileInputBoxStylesProps = BaseFileInputBoxStylesProps &
  FieldLaneStylesProps;

export interface FileInputBoxProps
  extends Omit<BaseFileInputBoxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: FileInputBoxStylesProps;
}

function FileInputBox({
  label,
  showError,
  styles,
  errorMessage,
  actions,
  helper,
  disabled,
  name,
  id,
  labelGap,
  labelWidth,
  labelPosition,
  ...rest
}: FileInputBoxProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "file-input-box",
    name,
    id,
  });

  const {
    bodyStyle,
    controlStyle,
    containerStyle,
    labelStyle,
    ...baseFileInputBoxtyles
  } = styles ?? {};

  return (
    <FieldLane
      id={inputId}
      showError={showError}
      labelGap={labelGap}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
      errorMessage={errorMessage}
      label={label}
      actions={actions}
      helper={helper}
      disabled={disabled}
      required={rest.required}
      styles={{
        bodyStyle,
        controlStyle,
        containerStyle,
        labelStyle,
      }}
    >
      <BaseFileInputBox
        {...rest}
        disabled={disabled}
        showError={showError}
        id={inputId}
        styles={baseFileInputBoxtyles}
      />
    </FieldLane>
  );
}

const InputBox = styled.div<{
  $isDragging: boolean;
  $hasFile: boolean;
  $isError?: boolean;
  $self?: CSSProp;
  $style?: CSSProp;
  $disabled?: boolean;
}>`
  padding: 12px;
  user-select: none;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;
  border-radius: 4px;
  width: 100%;
  cursor: ${({ $disabled, $hasFile }) =>
    $disabled ? "not-allowed" : $hasFile ? "default" : "pointer"};
  font-size: 14px;
  color: ${({ $isDragging }) => ($isDragging ? "#3b82f6" : "#6b7280")};
  background-color: ${({ $isDragging }) => ($isDragging ? "#eff6ff" : "#fff")};
  border: 1px dotted transparent;
  background-image: ${({ $disabled, $isDragging, $isError }) =>
    $disabled
      ? `
      repeating-linear-gradient(to right, #9ca3af 0, #9ca3af 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to bottom, #9ca3af 0, #9ca3af 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to left, #9ca3af 0, #9ca3af 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to top, #9ca3af 0, #9ca3af 8px, transparent 8px, transparent 12px)
  `
      : $isDragging
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
