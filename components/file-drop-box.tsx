import { RiFile2Line, RiFileUploadLine, RiImageLine } from "@remixicon/react";
import { cn } from "../lib/utils";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import LoadingSpinner from "./loading-spinner";

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

interface FileDropBoxProps {
  containerClassName?: string;
  placeholder?: string;
  accept?: string;
  onFileDropped?: (props: OnFileDroppedFunctionProps) => void;
  onComplete?: (props: OnCompleteFunctionProps) => void;
  setProgressPercentage?: (props: number) => void;
  progressPercentage?: number;
}

type ProgressProps = "idle" | "loading" | "succeed";

export default function FileDropBox({
  containerClassName,
  placeholder = "Drag and Drop Your File",
  accept = "*",
  onFileDropped,
  onComplete,
}: FileDropBoxProps) {
  const FILE_ICON = [
    {
      id: 1,
      icon: RiImageLine,
      size: 50,
    },
    {
      id: 2,
      icon: RiFileUploadLine,
      size: 80,
    },
    {
      id: 3,
      icon: RiFile2Line,
      size: 50,
    },
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [progressComponentLabel, setProgressComponentLabel] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progress, setProgress] = useState<ProgressProps>("idle");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleErrorMessage = (data: string) => {
    setErrorMessages((prev) => [...prev, data]);
  };

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

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadFile = async (files: File[]) => {
    if (!onFileDropped) return;

    await setProgress("loading");

    const succeedFiles: File[] = [];
    const failedFiles: File[] = [];
    const total = files.length;

    const setProgressLabel = (data: string) => {
      setProgressComponentLabel(data);
    };

    const succeed = (file: File) => {
      succeedFiles.push(file);
      handleUpdateProgressBar(succeedFiles.length, total);
    };

    const error = (file: File, errorMessage: string) => {
      failedFiles.push(file);
      console.error(errorMessage);
      handleErrorMessage(errorMessage);
      handleUpdateProgressBar(succeedFiles.length, total);
    };

    const handleUpdateProgressBar = (
      succeedCount: number,
      totalCount: number
    ) => {
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
        progressPercentage: progressPercentage,
      });
    }

    await onComplete?.({
      succeedFiles,
      failedFiles,
      setProgressLabel,
    });
    await setProgress("succeed");
  };

  const containerDropBoxClass = cn(
    "p-3 flex flex-col gap-2 relative items-center rounded-xs justify-between text-gray-500",
    progress === "idle"
      ? "border border-gray-400 border-dotted-customize"
      : progress === "succeed"
        ? "border border-gray-100"
        : "",
    isDragging ? "bg-blue-50 border-blue-400 hover:text-[#61A9F9]" : "",
    containerClassName
  );

  return (
    <>
      <div
        className={containerDropBoxClass}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {currentIndex !== null && progress === "loading" ? (
          <div className="w-full text-sm rounded-xs p-4 text-black relative border border-gray-100">
            <div className="flex flex-row">
              <LoadingSpinner iconSize={20} />
              <span>{progressComponentLabel}</span>
            </div>
            <div className="h-[4px] left-0 bottom-0 absolute w-full bg-gray-300">
              <div
                className="h-[4px] left-0 bottom-0 absolute bg-blue-300 rounded-xs transition-all duration-200"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        ) : progress === "idle" ? (
          <div className="text-sm w-full flex flex-col gap-2 items-center p-6">
            <div className="flex flex-row items-end">
              {FILE_ICON.map((data, index) => (
                <data.icon size={data.size} key={index} />
              ))}
            </div>
            <h2 className="text-black font-semibold text-xl">{placeholder}</h2>
            <div>
              <span
                onClick={handleBrowseClick}
                className="text-blue-500 underline cursor-pointer"
              >
                Select some files
              </span>
              &nbsp;from your computer
            </div>
          </div>
        ) : null}

        {progress === "succeed" && (
          <div className="text-xs">{progressComponentLabel}</div>
        )}

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
      </div>
      {errorMessages.length > 0 && (
        <ul className="list-disc text-sm text-gray-600 ml-10">
          {errorMessages.map((data, index) => (
            <li key={index}>{data}</li>
          ))}
        </ul>
      )}
    </>
  );
}
