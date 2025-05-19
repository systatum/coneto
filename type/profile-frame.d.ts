import { StaticImageData } from "next/image";

export interface ProfileFrameProps {
  firstName: string;
  lastName?: string;
  profileImageUrl?: string | null | undefined | StaticImageData;
}

export interface BackgroundColorProps {
  name: string;
  hex: string;
}
