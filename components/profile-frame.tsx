import { BackgroundColorProps, ProfileFrameProps } from "@/type/profile-frame";
import clsx from "clsx";
import Image from "next/image";

const BACKGROUND_COLORS: BackgroundColorProps[] = [
  { name: "Soft Red", hex: "#F4C2C2" },
  { name: "Warm Orange", hex: "#FFD8B1" },
  { name: "Pastel Yellow", hex: "#FFF3B0" },
  { name: "Mint Green", hex: "#D0F0C0" },
  { name: "Soft Teal", hex: "#B2DFDB" },
  { name: "Sky Blue", hex: "#B3E5FC" },
  { name: "Lavender", hex: "#E3E4FA" },
  { name: "Pale Purple", hex: "#DCC6E0" },
  { name: "Blush Pink", hex: "#FADADD" },
  { name: "Peach", hex: "#FFDAB9" },
  { name: "Light Coral", hex: "#F08080" },
  { name: "Light Cyan", hex: "#E0FFFF" },
  { name: "Lilac Mist", hex: "#D8BFD8" },
  { name: "Powder Blue", hex: "#B0E0E6" },
  { name: "Spring Green", hex: "#C1E1C1" },
  { name: "Misty Rose", hex: "#FFE4E1" },
];

export function getCode(fullname: string): number {
  let code = 0;
  for (const char of fullname) {
    code += char.codePointAt(0) ?? 0;
  }
  return code;
}

export function getBackground(code: number): string {
  const pos = code % BACKGROUND_COLORS.length;
  return BACKGROUND_COLORS[pos].hex;
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

export default function ProfileFrame({
  firstName,
  lastName,
  profileImageUrl,
}: ProfileFrameProps) {
  const fullName = `${firstName} ${lastName}`;
  const code = getCode(fullName);
  const backgroundColor = getBackground(code);
  const initials = getInitials(firstName, lastName);

  const isImageValid = profileImageUrl && profileImageUrl !== "";

  return (
    <div
      className={clsx(
        "group relative flex h-[70px] w-[70px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-gray-100 font-bold"
      )}
      style={!isImageValid ? { backgroundColor: backgroundColor } : {}}
    >
      {isImageValid ? (
        <Image
          className="h-full w-full object-contain"
          alt={`Image profile for account ${fullName} on superapp Workaty`}
          src={profileImageUrl}
        />
      ) : (
        <div>{initials}</div>
      )}
      <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-opacity group-hover:opacity-80">
        <span className="text-sm text-white">📷</span>
      </div>
    </div>
  );
}
