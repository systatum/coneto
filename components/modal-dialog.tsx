"use client";

import { ReactNode } from "react";
import { Dialog } from "./dialog";
import { Button, ButtonVariants } from "./button";

export interface ModalButtonProps extends Pick<ButtonVariants, "variant"> {
  id: string;
  caption: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface ModalDialogProps {
  open: boolean;
  onOpenChange: (data: boolean) => void;
  title: string;
  subTitle: string;
  hasCloseButton: boolean;
  buttons: ModalButtonProps[];
  children?: ReactNode;
  onClick?: (args: { id: string; closeDialog: () => void }) => void;
}

function ModalDialog({
  onOpenChange,
  open,
  hasCloseButton,
  subTitle,
  title,
  buttons,
  children,
  onClick,
}: ModalDialogProps) {
  const closeDialog = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        className="flex max-w-[500px] overflow-hidden flex-col justify-center rounded-none p-0 sm:max-w-[500px]"
        hideClose={!hasCloseButton}
      >
        <div className="p-3 px-4">
          <div className="flex flex-col gap-[1px] p-2 pb-4">
            <Dialog.Title className="text-base font-medium">
              {title}
            </Dialog.Title>
            <h3 className="text-[11px] text-gray-500">{subTitle}</h3>
          </div>
          <div className="h-[1px] w-full border border-blue-500"></div>
          <div className="h-full min-h-[250px] text-xs w-full pt-2">
            {children}
          </div>
        </div>
        <div className="flex w-full flex-row justify-end">
          {buttons.map((data, index) => (
            <Button
              isLoading={data.isLoading}
              disabled={data.disabled}
              className="w-[140px] min-w-[100px] items-start pt-4 pr-20 pb-10 pl-4"
              variant={data.variant}
              key={index}
              onClick={() => onClick?.({ id: data.id, closeDialog })}
            >
              {data.caption}
            </Button>
          ))}
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

export { ModalDialog };
