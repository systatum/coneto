import { getBackground, getCode, getInitials } from "./../constants/GetName";
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
