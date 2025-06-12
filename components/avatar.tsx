"use client";

import { getBackground, getCode } from "./../lib/code-color";
import clsx from "clsx";
import { ChangeEvent, HTMLAttributes, useRef } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  firstName: string;
  lastName?: string;
  profileImageUrl?: string | null | undefined;
  changeable?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>, file?: File) => void;
  frameSize: number;
  fontSize: number;
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

export default function Avatar({
  firstName,
  lastName,
  profileImageUrl,
  changeable,
  onChange,
  frameSize,
  fontSize,
  ...props
}: AvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isClickable = changeable || !!onChange || !!props.onClick;

  const fullName = `${firstName} ${lastName}`;
  const code = getCode(fullName);
  const backgroundColor = getBackground(code, AVATAR_BACKGROUND_COLORS);
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
    <div
      {...props}
      onClick={changeable ? handleClick : props.onClick}
      onChange={changeable ? handleFileChange : onChange}
      className={clsx(
        "group relative flex items-center justify-center overflow-hidden rounded-full border border-gray-100 font-bold",

        isClickable ? "cursor-pointer" : "cursor-default"
      )}
      style={{
        backgroundColor: !isImageValid ? backgroundColor : undefined,
        fontSize: `${fontSize}px`,
        width: `${frameSize}px`,
        height: `${frameSize}px`,
      }}
    >
      {isImageValid ? (
        <img
          width={30}
          height={30}
          className="h-full w-full object-contain"
          alt={`${fullName} profile image on the Systatum superapp`}
          src={profileImageUrl}
        />
      ) : (
        <div>{initials}</div>
      )}
      {changeable ? (
        <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity group-hover:opacity-80">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            data-testid="profile-file-input"
          />
          <span className="text-sm text-white">📷</span>
        </div>
      ) : null}
    </div>
  );
}

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
