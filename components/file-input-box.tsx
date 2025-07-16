import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { cn } from "./../lib/utils";
import { RiCloseLine } from "@remixicon/react";

interface FileInputBoxProps {
  containerClassName?: string;
  placeholder?: string;
  accept?: string;
  onFilesSelected?: (files: FileList) => void;
  label?: string;
  showError?: boolean;
  errorMessage?: string;
}

function FileInputBox({
  containerClassName,
  placeholder = "Drop a file here or browse",
  accept = "*",
  onFilesSelected,
  label,
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
      onFilesSelected(null);
      setSelectedFile("");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files;
      if (onFilesSelected) {
        onFilesSelected(file);
      }
      setSelectedFile(file[0].name);
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

  const containerInputBoxClass = cn(
    "p-3 border border-dotted-customize  flex flex-row relative items-center rounded-xs justify-between text-gray-500",
    selectedFile === "" && "cursor-pointer",
    isDragging
      ? "bg-blue-50 border border-dotted-customize-blue text-blue-500"
      : "",
    containerClassName
  );

  const inputElement = (
    <div
      className={containerInputBoxClass}
      onClick={handleBrowseClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {selectedFile !== "" ? (
        <>
          <div className="text-sm text-gray-700 w-[90%]">{selectedFile}</div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteFile();
            }}
            className="absolute p-1 rounded-xs hover:bg-gray-200 top-1/2  -translate-y-1/2 cursor-pointer right-4"
          >
            <RiCloseLine size={16} />
          </div>
        </>
      ) : (
        <span className="text-sm w-full">{placeholder}</span>
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
    </div>
  );

  return (
    <div className={cn(`flex w-full flex-col gap-2 text-xs`)}>
      {label && <label>{label}</label>}
      <div className="flex flex-col gap-1 text-xs">
        {inputElement}
        {showError && <span className="text-red-600">{errorMessage}</span>}
      </div>
    </div>
  );
}

export { FileInputBox };
