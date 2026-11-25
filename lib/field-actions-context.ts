import { createContext, type ReactNode } from "react";

/** Actions rendered beside the label of the current stateful-form field. */
export const FieldActionsContext = createContext<ReactNode>(null);
