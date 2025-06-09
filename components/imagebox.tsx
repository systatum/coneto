import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { RiAddLine, RiImageLine } from "@remixicon/react";

interface ImageboxProps {
  containerClassName?: string;
  onFilesSelected?: (files: FileList) => void;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  xs: "min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px]",
  sm: "min-w-[100px] min-h-[100px] max-w-[100px] max-h-[100px]",
  md: "min-w-[120px] min-h-[120px] max-w-[120px] max-h-[120px]",
  lg: "min-w-[160px] min-h-[160px] max-w-[160px] max-h-[160px]",
};

const SIZE_ICON = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
};

export default function Imagebox({
  containerClassName,
  onFilesSelected,
  size = "md",
}: ImageboxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files;
      if (onFilesSelected) {
        onFilesSelected(file);
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

  const classInputBox = cn(
    "border rounded-xs border-gray-300 cursor-pointer text-gray-600 relative w-full h-full",
    SIZE_CLASSES[size],
    isDragging ? "bg-blue-50 border border-blue-500 text-blue-500" : "",
    containerClassName
  );

  return (
    <div
      className={classInputBox}
      onClick={handleBrowseClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {selectedFile === null ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <RiImageLine size={SIZE_ICON[size]} />
        </div>
      ) : (
        <img
          src={selectedFile}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />
      <div
        className={cn(
          "border-gray-300 w-fit h-fit border rounded-xs absolute -bottom-1 -right-1",
          isDragging ? "bg-[#60a5fa]" : "bg-gray-200"
        )}
      >
        <RiAddLine size={SIZE_ICON[size]} />
      </div>
    </div>
  );
}
