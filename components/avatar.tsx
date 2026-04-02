"use client";

import { strToColor } from "./../lib/code-color";
import { ChangeEvent, HTMLAttributes, useRef } from "react";
import styled, { CSSProp } from "styled-components";
import { useTheme } from "./../theme/provider";

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "style" | "onChange"> {
  firstName: string;
  lastName?: string;
  profileImageUrl?: string | null | undefined;
  changeable?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>, file?: File) => void;
  frameSize?: number;
  fontSize?: number;
  styles?: AvatarStylesProps;
}

export interface AvatarStylesProps {
  self?: CSSProp;
}

const AVATAR_BACKGROUND_COLORS: string[] = [
  "#F4C2C2",
  "#FFD8B1",
  "#FFF3B0",
  "#D0F0C0",
  "#B2DFDB",
  "#B3E5FC",
  "#E3E4FA",
  "#DCC6E0",
  "#FADADD",
  "#FFDAB9",
  "#F08080",
  "#E0FFFF",
  "#D8BFD8",
  "#B0E0E6",
  "#C1E1C1",
  "#FFE4E1",
];

function Avatar({
  firstName,
  lastName,
  profileImageUrl,
  changeable,
  frameSize = 70,
  fontSize = 23,
  styles,
  onChange,
  onClick,
  ...props
}: AvatarProps) {
  const { currentTheme } = useTheme();
  const avatarTheme = currentTheme.avatar;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isClickable = changeable || !!onChange || !!onClick;

  const fullName = `${firstName} ${lastName}`;
  const backgroundColor = strToColor(fullName, AVATAR_BACKGROUND_COLORS);
  const initials = getInitials(firstName, lastName);

  const isImageValid = profileImageUrl && profileImageUrl !== "";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (onChange) {
      onChange(e, file);
    }
  };

  const handleClick = () => {
    if (changeable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <AvatarContainer
      {...props}
      onClick={changeable ? handleClick : onClick}
      onChange={changeable ? handleFileChange : onChange}
      aria-label="avatar-content"
      role="button"
      tabIndex={0}
      $clickable={isClickable}
      $backgroundColor={!isImageValid ? backgroundColor : undefined}
      $fontSize={fontSize}
      $frameSize={frameSize}
      $borderColor={avatarTheme.borderColor}
      $textColor={avatarTheme.textColor}
      $style={styles?.self}
    >
      {isImageValid ? (
        <AvatarImage
          width={30}
          height={30}
          alt={`${fullName} profile image on the Systatum superapp`}
          src={profileImageUrl}
        />
      ) : (
        <div>{initials}</div>
      )}
      {changeable ? (
        <AvatarChange $overlayBg={avatarTheme.overlayBackground}>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="profile-file-input"
          />
          <AvatarChangeIcon $color={avatarTheme.overlayIconColor}>
            📷
          </AvatarChangeIcon>
        </AvatarChange>
      ) : null}
    </AvatarContainer>
  );
}

const AvatarContainer = styled.div<{
  $clickable: boolean;
  $backgroundColor?: string;
  $frameSize: number;
  $fontSize: number;
  $borderColor: string;
  $textColor: string;
  $style?: CSSProp;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  font-weight: bold;

  border: 1px solid ${({ $borderColor }) => $borderColor};
  color: ${({ $textColor }) => $textColor};

  background-color: ${({ $backgroundColor }) => $backgroundColor};
  font-size: ${({ $fontSize }) => $fontSize}px;
  width: ${({ $frameSize }) => $frameSize}px;
  height: ${({ $frameSize }) => $frameSize}px;

  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  ${({ $style }) => $style}
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const AvatarChange = styled.div<{
  $overlayBg: string;
}>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $overlayBg }) => $overlayBg};
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  ${AvatarContainer}:hover & {
    opacity: 0.8;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const AvatarChangeIcon = styled.span<{
  $color: string;
}>`
  color: ${({ $color }) => $color};
  font-size: 0.875rem;
`;

export function getInitials(
  firstName: string,
  lastName?: string | null | undefined
): string {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const firstOptionInitial = firstName.slice(0, 2).toUpperCase();
  const lastInitial = lastName?.charAt(0).toUpperCase() ?? "";
  return lastName !== "" && lastName
    ? `${firstInitial}${lastInitial}`
    : `${firstOptionInitial}`;
}

export { Avatar };
