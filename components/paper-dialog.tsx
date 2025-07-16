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

export type DialogState = "restored" | "closed" | "minimized";

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
  setIsOpen?: (isOpen: DialogState) => void;
  icon?: RemixiconComponentType;
}

interface PaperDialogContentProps {
  children?: ReactNode;
  className?: string;
}

export interface PaperDialogRef {
  setDialogState: (isOpen: DialogState) => void;
}

const PaperDialogBase = forwardRef<PaperDialogRef, PaperDialogProps>(
  (
    { className, position = "right", tabClassName, children, closable },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<DialogState>("closed");
    const controls = useAnimation();
    const isLeft = position === "left";

    const handleToggleDrawer = (open: DialogState) => {
      setIsOpen(open);

      controls.start({
        x:
          open === "restored"
            ? 0
            : isLeft && isOpen === "minimized"
              ? "-100%"
              : "+100%",
        transition: { type: "spring", stiffness: 300, damping: 30 },
      });
    };

    useImperativeHandle(ref, () => ({
      setDialogState: async (isOpen: DialogState) => {
        await setIsOpen(isOpen);
        await handleToggleDrawer(isOpen);
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
            setIsOpen: async () => {
              await setIsOpen("restored");
              await handleToggleDrawer("restored");
            },
          })}

        {isOpen !== "closed" && (
          <div className={cn("fixed z-40", isOpen === "restored" && "inset-0")}>
            {isOpen === "restored" && (
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
                    aria-label="Button Close"
                    onClick={() => setIsOpen(null)}
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
                      isOpen === "minimized" ? "restored" : "minimized"
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
                        isOpen === "restored" ? "rotate-180" : "rotate-0"
                      )}
                      size={20}
                    />
                  ) : (
                    <RiArrowLeftSLine
                      className={cn(
                        "transition-transform duration-500 ease-in-out",
                        isOpen === "restored" ? "rotate-180" : "rotate-0"
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
  setIsOpen,
}: PaperDialogTriggerProps) {
  return (
    <Button
      onClick={() => {
        setIsOpen("restored");
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
