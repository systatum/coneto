import {
  ChangeEvent,
  DragEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { RiAddLine, RiImageLine } from "@remixicon/react";
import styled, { css, CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";

interface BaseImageboxProps {
  onFileSelected?: (file: File | undefined) => void;
  size?: "xs" | "sm" | "md" | "lg";
  name?: string;
  styles?: BaseImageboxStylesProps;
  value?: File | string | null;
  borderless?: boolean;
  editable?: boolean;
  url?: string;
  id?: string;
}
interface BaseImageboxStylesProps {
  self?: CSSProp;
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

function BaseImagebox({
  onFileSelected,
  size = "md",
  name,
  styles,
  value,
  borderless,
  editable = true,
  url,
  id,
}: BaseImageboxProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "imagebox",
    name,
    id,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { dimension, icon } = SIZE_STYLES[size];

  const isControlled = !value && !url;

  useEffect(() => {
    try {
      if (value instanceof File) {
        const objectUrl = URL.createObjectURL(value);
        setSelectedFile(objectUrl);

        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      }

      if (typeof value === "string") {
        setSelectedFile(value);
      }

      if (value === null) {
        setSelectedFile(null);
      }

      if (!value && url) {
        setSelectedFile(url);
      }
    } catch (err) {
      console.error("Imagebox: Failed to render value", err);
      setSelectedFile(null);
    }
  }, [value, isControlled, url]);

  const handleBrowseClick = () => {
    if (editable) fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && editable) {
      const file = e.target.files[0];
      if (onFileSelected) {
        onFileSelected?.(file);
      }

      if (!isControlled) {
        const objectUrl = URL.createObjectURL(file);
        setSelectedFile(objectUrl);
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && onFileSelected) {
      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (onFileSelected) {
        onFileSelected(file);
      }

      if (!isControlled) {
        const objectUrl = URL.createObjectURL(file);
        setSelectedFile(objectUrl);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (editable) {
      e.preventDefault();
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    if (editable) {
      setIsDragging(false);
    }
  };

  return (
    <InputBox
      aria-label="imagebox-input"
      $style={styles?.self}
      $dimension={dimension}
      $isDragging={isDragging}
      $borderless={borderless}
      $editable={editable}
      onClick={handleBrowseClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {selectedFile ? (
        <PreviewImage
          src={selectedFile}
          alt="preview"
          onError={() => {
            console.error("Imagebox: Unable to render image source");
            setSelectedFile(null);
          }}
        />
      ) : (
        <IconPlaceholder>
          <RiImageLine size={icon} />
        </IconPlaceholder>
      )}

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id={inputId}
        name={name}
        aria-label="imagebox"
        onChange={handleFileChange}
      />

      <AddIconWrapper
        aria-label="imagebox-add-icon"
        $isDragging={isDragging}
        $editable={editable}
      >
        <RiAddLine size={icon} />
      </AddIconWrapper>
    </InputBox>
  );
}

export type ImageboxStylesProps = BaseImageboxStylesProps &
  FieldLaneStylesProps;

export interface ImageboxProps
  extends Omit<BaseImageboxProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: ImageboxStylesProps;
}

function Imagebox({
  label,
  showError,
  styles,
  errorMessage,
  actions,
  helper,
  disabled,
  name,
  id,
  ...rest
}: ImageboxProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "imagebox",
    name,
    id,
  });

  const {
    bodyStyle,
    controlStyle,
    containerStyle,
    labelStyle,
    ...ImageboxStyles
  } = styles ?? {};

  return (
    <FieldLane
      id={inputId}
      showError={showError}
      errorMessage={errorMessage}
      actions={actions}
      helper={helper}
      disabled={disabled}
      label={label}
      errorIconPosition="none"
      styles={{
        bodyStyle,
        controlStyle,
        containerStyle,
        labelStyle,
      }}
    >
      <BaseImagebox {...rest} id={inputId} styles={ImageboxStyles} />
    </FieldLane>
  );
}

const InputBox = styled.div<{
  $dimension: string;
  $isDragging: boolean;
  $style?: CSSProp;
  $editable?: boolean;
  $borderless?: boolean;
}>`
  position: relative;
  width: ${({ $dimension }) => $dimension};
  height: ${({ $dimension }) => $dimension};
  min-width: ${({ $dimension }) => $dimension};
  min-height: ${({ $dimension }) => $dimension};
  max-width: ${({ $dimension }) => $dimension};
  max-height: ${({ $dimension }) => $dimension};
  border-radius: 2px;
  ${({ $borderless, $isDragging }) =>
    !$borderless &&
    css`
      border: 1px solid ${$isDragging ? "#3b82f6" : "#d1d5db"};
    `}
  background-color: ${({ $isDragging }) =>
    $isDragging ? "#eff6ff" : "#ffffff"};
  color: ${({ $isDragging }) => ($isDragging ? "#3b82f6" : "#6b7280")};
  ${({ $editable }) =>
    $editable &&
    css`
      cursor: pointer;
    `};

  ${({ $style }) => $style}
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

const AddIconWrapper = styled.div<{
  $isDragging: boolean;
  $editable?: boolean;
}>`
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

  ${({ $editable }) =>
    !$editable &&
    css`
      display: none;
    `}
`;

const HiddenInput = styled.input`
  display: none;
`;

export { Imagebox };
