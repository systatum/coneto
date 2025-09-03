import styled, { css, CSSProp } from "styled-components";
import { RemixiconComponentType } from "@remixicon/react";
import { COLOR_STYLE_MAP } from "../constants/color-map";
import { ReactNode } from "react";

export type TipMenuItemVariantType = "sm" | "md";
interface TipMenuProps {
  children?: ReactNode;
  subMenuList?: TipMenuItemProps[];
  style?: CSSProp;
  setIsOpen?: () => void;
  variant?: TipMenuItemVariantType;
}

export interface TipMenuItemProps {
  caption: string;
  icon: RemixiconComponentType;
  onClick?: () => void;
  iconColor?: string;
  isDangerous?: boolean;
  iconUrl?: string | null | undefined;
  variant?: TipMenuItemVariantType;
}

function TipMenu({
  children,
  subMenuList,
  style,
  setIsOpen,
  variant = "md",
}: TipMenuProps) {
  return (
    <StyledTipMenu
      aria-label="tip-menu"
      $style={style}
      onClick={() => {
        setIsOpen?.();
      }}
    >
      {subMenuList?.map((data, index) => (
        <TipMenuItem
          key={index}
          variant={data.variant ?? variant}
          caption={data.caption}
          icon={data.icon}
          iconColor={data.iconColor}
          isDangerous={data.isDangerous}
          onClick={data.onClick}
          iconUrl={data.iconUrl}
        />
      ))}
      {children}
    </StyledTipMenu>
  );
}

function TipMenuItem({
  caption,
  icon: Icon,
  onClick,
  iconColor = "gray",
  isDangerous = false,
  iconUrl,
  variant,
}: TipMenuItemProps) {
  const isIconValid = iconUrl && iconUrl !== "";

  return (
    <StyledTipMenuItem
      $variant={variant}
      aria-label="tip-menu-item"
      $isDangerous={isDangerous}
      onClick={onClick}
    >
      {isIconValid ? (
        <StyledIconImage
          alt={`${caption} icon on the Systatum superapp`}
          src={iconUrl}
        />
      ) : (
        <StyledIcon
          as={Icon}
          $variant={variant}
          $color={isDangerous ? "white" : COLOR_STYLE_MAP[iconColor]}
        />
      )}
      <StyledCaption>{caption}</StyledCaption>
    </StyledTipMenuItem>
  );
}

const StyledTipMenu = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  border: 1px solid #f3f4f6;
  overflow: hidden;
  padding: 4px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  animation-duration: 200ms;

  ${({ $style }) => $style}
`;

const StyledTipMenuItem = styled.div<{
  $isDangerous: boolean;
  $variant?: TipMenuItemVariantType;
}>`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid transparent;
  background-color: ${(props) => (props.$isDangerous ? "#ef4444" : "white")};
  color: ${(props) => (props.$isDangerous ? "white" : "black")};
  transition: background-color 0.2s;
  ${({ $variant }) =>
    $variant === "sm"
      ? css`
          gap: 8px;
          padding: 2px;
        `
      : css`
          gap: 12px;
          padding: 8px;
        `}

  &:hover {
    background-color: ${(props) =>
      props.$isDangerous ? "#e71f29" : "#f2f2f2"};
    border-color: ${(props) =>
      props.$isDangerous ? "#e71f29" : "transparent"};
  }
`;

const StyledIconImage = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  padding-left: 1em;
`;

const StyledIcon = styled.div<{
  $variant?: TipMenuItemVariantType;
  $color?: string;
}>`
  color: ${({ $color }) => $color};

  ${({ $variant }) =>
    $variant === "sm"
      ? css`
          margin-left: 0.5em;
          width: 15px;
          height: 15px;
        `
      : css`
          width: 20px;
          height: 20px;
        `}
`;

const StyledCaption = styled.span`
  font-size: 0.875rem;
`;

TipMenu.Item = TipMenuItem;
export { TipMenu };
