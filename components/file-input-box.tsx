import {
  ChangeEvent,
  DragEvent,
  InputHTMLAttributes,
  useRef,
  useState,
} from "react";
import { RiCloseLine } from "@remixicon/react";
import styled, { css, CSSProp } from "styled-components";
import { Button } from "./button";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";
import { useTheme } from "./../theme/provider";
import { FileInputBoxThemeConfiguration } from "./../theme";

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
  showError,
  styles,
  id,
  disabled,
  ...props
}: BaseFileInputBoxProps) {
  const { currentTheme } = useTheme();
  const fileInputBoxTheme = currentTheme.fileInputBox;

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
      $theme={fileInputBoxTheme}
      $style={styles?.self}
      $isDragging={!disabled && isDragging}
      $hasFile={selectedFiles.length > 0}
      onClick={!disabled && handleBrowseClick}
      onDrop={!disabled && handleDrop}
      onDragOver={!disabled && handleDragOver}
      onDragLeave={!disabled && handleDragLeave}
      aria-label="file-input-box-wrapper"
      $disabled={disabled}
      $isError={showError}
    >
      {selectedFiles.length > 0 ? (
        <FileList>
          {selectedFiles.map((file, index) => (
            <FileItem key={index}>
              <Button
                aria-label="delete-button"
                variant="transparent"
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
                  `,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(index);
                }}
              >
                <RiCloseLine size={14} />
              </Button>
              <FileName $theme={fileInputBoxTheme}>{file.name}</FileName>
            </FileItem>
          ))}
        </FileList>
      ) : (
        <Placeholder $theme={fileInputBoxTheme}>{placeholder}</Placeholder>
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
  $theme: FileInputBoxThemeConfiguration;
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
  color: ${({ $theme, $disabled }) =>
    $disabled ? $theme.disabledTextColor : $theme.textColor};
  border: 1px dotted transparent;
  background-color: ${({ $isDragging, $theme }) =>
    $isDragging ? $theme.dragActiveBackgroundColor : $theme.backgroundColor};
  background-image: ${({ $theme, $disabled, $isDragging, $isError }) =>
    $disabled
      ? `
      repeating-linear-gradient(to right, ${$theme.disabledGradientColor} 0, ${$theme.disabledGradientColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to bottom, ${$theme.disabledGradientColor} 0, ${$theme.disabledGradientColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to left, ${$theme.disabledGradientColor} 0, ${$theme.disabledGradientColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to top, ${$theme.disabledGradientColor} 0, ${$theme.disabledGradientColor} 8px, transparent 8px, transparent 12px)
    `
      : $isDragging
        ? `
      repeating-linear-gradient(to right, ${$theme.dragActiveColor} 0, ${$theme.dragActiveColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to bottom, ${$theme.dragActiveColor} 0, ${$theme.dragActiveColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to left, ${$theme.dragActiveColor} 0, ${$theme.dragActiveColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to top, ${$theme.dragActiveColor} 0, ${$theme.dragActiveColor} 8px, transparent 8px, transparent 12px)
    `
        : $isError
          ? `
      repeating-linear-gradient(to right, ${$theme.errorGradientColor} 0, ${$theme.errorGradientColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to bottom, ${$theme.errorGradientColor} 0, ${$theme.errorGradientColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to left, ${$theme.errorGradientColor} 0, ${$theme.errorGradientColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to top, ${$theme.errorGradientColor} 0, ${$theme.errorGradientColor} 8px, transparent 8px, transparent 12px)
    `
          : `
      repeating-linear-gradient(to right, ${$theme.defaultGradientColor} 0, ${$theme.defaultGradientColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to bottom, ${$theme.defaultGradientColor} 0, ${$theme.defaultGradientColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to left, ${$theme.defaultGradientColor} 0, ${$theme.defaultGradientColor} 8px, transparent 8px, transparent 12px),
      repeating-linear-gradient(to top, ${$theme.defaultGradientColor} 0, ${$theme.defaultGradientColor} 8px, transparent 8px, transparent 12px)
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

  ${({ $disabled }) =>
    $disabled &&
    css`
      user-select: none;
    `};

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

const FileName = styled.div<{ $theme: FileInputBoxThemeConfiguration }>`
  font-size: 14px;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ $theme }) => css`
    color: ${$theme.placeholderColor};
  `}
`;

const Placeholder = styled.span<{ $theme: FileInputBoxThemeConfiguration }>`
  font-size: 14px;
  width: 100%;

  ${({ $theme }) => css`
    color: ${$theme.placeholderColor};
  `}
`;

export { FileInputBox };
