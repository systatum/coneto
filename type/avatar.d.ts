import { ChangeEvent, HTMLAttributes } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  firstName: string;
  lastName?: string;
  profileImageUrl?: string | null | undefined;
  changeable: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>, file?: File) => void;
}

export interface BackgroundColorProps {
  name: string;
  hex: string;
}
