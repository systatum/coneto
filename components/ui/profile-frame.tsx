import { getBackground, getCode, getInitials } from "@/constants/GetProfileColor";
import clsx from "clsx";
import Image, { StaticImageData } from "next/image";

interface ProfileFrameProps {
  firstName: string;
  lastName?: string;
  profileImageUrl?: string | null | undefined | StaticImageData;
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
        "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-100 font-bold",
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
    </div>
  );
}
