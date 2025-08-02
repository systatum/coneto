import {
  RemixiconComponentType,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
} from "@remixicon/react";
import { cn } from "./../lib/utils";
import { useAnimation, motion } from "framer-motion";
import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Button } from "./button";

type DialogState = "restored" | "closed" | "minimized";

export interface PaperDialogProps {
  className?: string;
  tabClassName?: string;
  paperDialogClassName?: string;
  position?: "left" | "right";
  children: ReactNode;
  closable?: boolean;
}

interface PaperDialogTriggerProps {
  children?: ReactNode;
  setDialogState?: (dialogState: DialogState) => void;
  icon?: RemixiconComponentType;
}

interface PaperDialogContentProps {
  children?: ReactNode;
  className?: string;
}

export interface PaperDialogRef {
  openDialog: () => void;
  closeDialog: () => void;
  minimizedDialog: () => void;
}

const PaperDialogBase = forwardRef<PaperDialogRef, PaperDialogProps>(
  (
    { className, position = "right", tabClassName, children, closable },
    ref
  ) => {
    const [dialogState, setDialogState] = useState<DialogState>("closed");
    const controls = useAnimation();
    const isLeft = position === "left";

    const handleToggleDrawer = (open: DialogState) => {
      setDialogState(open);
      controls.start({
        x: open === "minimized" ? (isLeft ? "-100%" : "100%") : 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    };

    useImperativeHandle(ref, () => ({
      openDialog: async () => {
        await setDialogState("restored");
        await handleToggleDrawer("restored");
      },
      closeDialog: async () => {
        await setDialogState("closed");
        await handleToggleDrawer("closed");
      },
      minimizedDialog: async () => {
        await setDialogState("minimized");
        await handleToggleDrawer("minimized");
      },
    }));

    const childArray = Children.toArray(children);

    const trigger = childArray.find(
      (child): child is ReactElement<PaperDialogTriggerProps> =>
        isValidElement(child) && child.type === PaperDialog.Trigger
    );

    const content = childArray.find(
      (child): child is ReactElement<PaperDialogContentProps> =>
        isValidElement(child) && child.type === PaperDialog.Content
    );

    return (
      <Fragment>
        {trigger &&
          cloneElement(trigger, {
            setDialogState: async () => {
              await setDialogState("restored");
              await handleToggleDrawer("restored");
            },
          })}

        {dialogState !== "closed" && (
          <div
            className={cn(
              "fixed z-40",
              dialogState === "restored" && "inset-0"
            )}
          >
            {dialogState === "restored" && (
              <div
                className="absolute inset-0 bg-gray-100 opacity-70 transition-all duration-500 transform backdrop-blur-xs"
                aria-hidden="true"
              />
            )}

            <motion.div
              initial={{ x: isLeft ? "-100%" : "100%" }}
              animate={controls}
              className={cn(
                `fixed top-0 flex w-64 min-w-[92vw] flex-col gap-3 border border-[#ebebeb] shadow-sm  bg-white pb-4 md:translate-x-0 md:shadow-none`,
                isLeft ? "left-0" : "right-0",
                className
              )}
            >
              {closable && (
                <div
                  className={cn(
                    "absolute top-1 z-10 flex h-fit flex-col",
                    isLeft ? "left-[92vw]" : "right-[92vw]",
                    tabClassName
                  )}
                >
                  <button
                    aria-label="button-close"
                    onClick={() => setDialogState("closed")}
                    className={cn(
                      "relative w-fit cursor-pointer bg-white border-[#ebebeb] shadow-sm hover:bg-gray-100",
                      isLeft
                        ? "border-y border-r p-2 rounded-r-xl right-1"
                        : "border-y border-l p-2 rounded-l-xl left-1"
                    )}
                  >
                    <RiCloseLine size={20} />
                  </button>
                </div>
              )}

              <div
                className={cn(
                  "absolute top-11 z-10 flex h-fit flex-col",
                  isLeft ? "left-[92vw]" : "right-[92vw]",
                  tabClassName
                )}
              >
                <button
                  aria-label="Toggle Expanded/Collapsed PaperDialog"
                  onClick={() =>
                    handleToggleDrawer(
                      dialogState === "minimized" ? "restored" : "minimized"
                    )
                  }
                  className={cn(
                    "relative cursor-pointer bg-white border-[#ebebeb] shadow-sm hover:bg-gray-100",
                    isLeft
                      ? "border-y border-r p-2 rounded-r-xl right-1"
                      : "border-y border-l p-2 rounded-l-xl left-1"
                  )}
                >
                  {isLeft ? (
                    <RiArrowRightSLine
                      className={cn(
                        "transition-transform duration-500 ease-in-out",
                        dialogState === "restored" ? "rotate-180" : "rotate-0"
                      )}
                      size={20}
                    />
                  ) : (
                    <RiArrowLeftSLine
                      className={cn(
                        "transition-transform duration-500 ease-in-out",
                        dialogState === "restored" ? "rotate-180" : "rotate-0"
                      )}
                      size={20}
                    />
                  )}
                </button>
              </div>

              <Fragment>{content}</Fragment>
            </motion.div>
          </div>
        )}
      </Fragment>
    );
  }
);

function PaperDialogTrigger({
  children,
  icon: Icon,
  setDialogState,
}: PaperDialogTriggerProps) {
  return (
    <Button
      aria-label="paper-dialog-trigger"
      onClick={() => {
        setDialogState("restored");
      }}
    >
      {Icon && <Icon size={20} />}
      {children}
    </Button>
  );
}

function PaperDialogContent({ children, className }: PaperDialogContentProps) {
  return (
    <div className={cn("flex flex-col gap-3 relative z-30 bg-white")}>
      <div className={cn("min-h-screen flex flex-col", className)}>
        {children}
      </div>
    </div>
  );
}

const PaperDialog = Object.assign(PaperDialogBase, {
  Trigger: PaperDialogTrigger,
  Content: PaperDialogContent,
});

export { PaperDialog };
