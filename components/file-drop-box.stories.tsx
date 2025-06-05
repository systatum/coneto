import { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import FileDropBox, {
  OnCompleteFunctionProps,
  OnFileDroppedFunctionProps,
} from "./file-drop-box";

const meta: Meta<typeof FileDropBox> = {
  title: "Input Elements/FileDropbox",
  component: FileDropBox,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof FileDropBox>;

export const Default: Story = {
  render: () => {
    const onFileDropped = async ({
      error,
      files,
      setProgressLabel,
      succeed,
    }: OnFileDroppedFunctionProps) => {
      const file = files[0];
      setProgressLabel(`Uploading ${file.name}`);

      return new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;

          if (progress >= 100) {
            clearInterval(interval);
            if (file === null) {
              error(file, `file ${file.name} is not uploaded`);
            } else {
              succeed(file);
            }
            setProgressLabel(`Uploaded ${files[0].name}`);
            resolve();
          }
        }, 300);
      });
    };

    const onComplete = ({
      failedFiles,
      setProgressLabel,
      succeedFiles,
    }: OnCompleteFunctionProps) => {
      console.log(succeedFiles, "This is succeedFiles");
      console.log(failedFiles, "This is failedFiles");
      setProgressLabel(
        `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
      );
    };

    return (
      <FileDropBox onFileDropped={onFileDropped} onComplete={onComplete} />
    );
  },
};

export const Error: Story = {
  render: () => {
    const allFilesRef = useRef<File[]>([]);

    const onFileDropped = async ({
      error,
      files,
      setProgressLabel,
      succeed,
    }: OnFileDroppedFunctionProps) => {
      const file = files[0];

      if (allFilesRef.current.length === 0) {
        allFilesRef.current = [...files];
      }

      setProgressLabel(`Uploading ${file.name}`);

      return new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;

          if (progress >= 100) {
            clearInterval(interval);

            const isLastFile =
              file === allFilesRef.current[allFilesRef.current.length - 1];

            if (isLastFile) {
              error(file, `file ${file.name} is not uploaded`);
            } else {
              succeed(file);
            }

            resolve();
          }
        }, 300);
      });
    };

    const onComplete = ({
      failedFiles,
      setProgressLabel,
      succeedFiles,
    }: OnCompleteFunctionProps) => {
      console.log(succeedFiles, "This is succeedFiles");
      console.log(failedFiles, "This is failedFiles");

      setProgressLabel(
        `Upload complete! Succeed: ${succeedFiles.length}, Failed: ${failedFiles.length}`
      );

      allFilesRef.current = [];
    };

    return (
      <FileDropBox onComplete={onComplete} onFileDropped={onFileDropped} />
    );
  },
};
