"use client";

import { strToColor } from "./../lib/code-color";
import { ChangeEvent, HTMLAttributes, useRef } from "react";
import styled, { css, CSSProp } from "styled-components";
import { useTheme } from "./../theme/provider";
import { applyClassName } from "./../constants/classname";
import { Tooltip } from "./tooltip";
import { BaseAction } from "./../constants/action";
import { Button } from "./button";
import { RiAddLine } from "@remixicon/react";

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "style" | "onChange"> {
  firstName: string;
  lastName?: string;
  profileImageUrl?: string | null | undefined;
  changeable?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>, file?: File) => void;
  frameSize?: number;
  fontSize?: number;
  hoverCaption?: string;
  hoverCaptionPosition?: AvatarHoverCaptionPosition;
  styles?: AvatarStyles;
}

export const AvatarHoverCaptionPosition = {
  TopCenter: "top-center",
  BottomCenter: "bottom-center",
} as const;

export type AvatarHoverCaptionPosition =
  (typeof AvatarHoverCaptionPosition)[keyof typeof AvatarHoverCaptionPosition];

export interface AvatarStyles {
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
  className,
  id,
  hoverCaption,
  hoverCaptionPosition = AvatarHoverCaptionPosition.TopCenter,
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

  const baseAvatar = (
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
      id={id}
      className={applyClassName("avatar", className)}
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
        <AvatarChange $overlayBg={avatarTheme.overlayBackgroundColor}>
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

  if (hoverCaption) {
    return (
      <Tooltip
        styles={{
          triggerStyle: css`
            flex-shrink: 1;
            border-radius: 9999px;
            overflow: hidden;
          `,
          containerStyle: css`
            border-radius: 9999px;
          `,
        }}
        dialogPlacement={hoverCaptionPosition}
        dialog={hoverCaption}
      >
        {baseAvatar}
      </Tooltip>
    );
  }

  return baseAvatar;
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
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

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

export interface AvatarStackProps {
  avatars?: AvatarStackAvatar[];
  styles?: AvatarStackStyles;
  actions?: AvatarStackAction[];
  frameSize?: number;
  fontSize?: number;
}

export type AvatarStackAvatar = AvatarProps;

export interface AvatarStackStyles {
  containerStyle?: CSSProp;
  actionButtonStyle?: CSSProp;
  avatarStyle?: CSSProp;
}

export interface AvatarStackAction extends Omit<BaseAction, "caption"> {
  styles?: AvatarStackActionStyles;
  hoverCaption?: string;
  hoverCaptionPosition?: AvatarHoverCaptionPosition;
}

export interface AvatarStackActionStyles {
  self: CSSProp;
}

function AvatarStack({
  avatars = [],
  styles,
  actions = [],
  fontSize = 18,
  frameSize = 50,
}: AvatarStackProps) {
  const { currentTheme } = useTheme();
  const bodyTheme = currentTheme?.body;

  const avatarLength = avatars?.length;

  return (
    <ContainerAvatarStack $style={styles?.containerStyle}>
      {avatars.map((avatar, index) => {
        const avatarProps = {
          ...avatar,
          styles: {
            ...avatar.styles,
            self: css`
              border: 2px solid ${bodyTheme?.backgroundColor};
              z-index: ${index};
              ${styles?.avatarStyle}
              ${avatar?.styles?.self}
            `,
          },
          frameSize: avatar?.frameSize ?? frameSize,
          fontSize: avatar?.fontSize ?? fontSize,
        };

        return <Avatar key={index} {...avatarProps} />;
      })}

      {actions
        ?.filter((action) => !action?.hidden)
        .map((action, index) => {
          const key = avatarLength + index;
          const { hoverCaption, hoverCaptionPosition, ...restAction } = action;

          const finalAction = {
            ...restAction,
            styles: {
              ...restAction?.styles,
              containerStyle: css`
                border-radius: 9999px;
              `,
              self: css`
                z-index: ${key};

                padding: 0px;
                height: ${`${frameSize}px`};
                width: ${`${frameSize}px`};
                border-radius: 9999px;

                ${styles?.actionButtonStyle}
                ${restAction?.styles?.self}
              `,
            },
            icon: {
              ...restAction?.icon,
              image: restAction?.icon?.image ?? RiAddLine,
              size: restAction?.icon?.size ?? fontSize * 1.4,
            },
          };

          const baseAction = <Button key={key} {...finalAction} />;

          if (hoverCaption) {
            return (
              <Tooltip
                key={index}
                styles={{
                  triggerStyle: css`
                    flex-shrink: 1;
                    border-radius: 9999px;
                    overflow: hidden;
                  `,
                  containerStyle: css`
                    border-radius: 9999px;
                  `,
                }}
                dialogPlacement={hoverCaptionPosition ?? "top-center"}
                dialog={hoverCaption}
              >
                {baseAction}
              </Tooltip>
            );
          }

          return baseAction;
        })}
    </ContainerAvatarStack>
  );
}

const ContainerAvatarStack = styled.div<{ $style?: CSSProp }>`
  position: relative;
  display: flex;
  flex-direction: row;

  > *:not(:first-child) {
    margin-left: -6px;
  }

  ${({ $style }) => $style}
`;

Avatar.Stack = AvatarStack;

export { Avatar };
