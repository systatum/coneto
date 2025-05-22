export interface ProfileFrameProps {
  firstName: string;
  lastName?: string;
  profileImageUrl?: string | null | undefined;
  changeable: boolean;
  onChange?: () => void;
}

export interface BackgroundColorProps {
  name: string;
  hex: string;
}
