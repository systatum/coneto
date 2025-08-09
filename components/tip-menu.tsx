import styled, { CSSProp } from "styled-components";
import { RemixiconComponentType } from "@remixicon/react";
import { COLOR_STYLE_MAP } from "../constants/color-map";
import { ReactNode } from "react";

interface TipMenuProps {
  children?: ReactNode;
  subMenuList?: TipMenuItemProps[];
  style?: CSSProp;
  setIsOpen?: () => void;
}

export interface TipMenuItemProps {
  caption: string;
  icon: RemixiconComponentType;
  onClick?: () => void;
  iconColor?: string;
  isDangerous?: boolean;
  iconUrl?: string | null | undefined;
}

function TipMenu({ children, subMenuList, style, setIsOpen }: TipMenuProps) {
  return (
    <StyledTipMenu
      $style={style}
      onClick={() => {
        setIsOpen?.();
      }}
    >
      {subMenuList?.map((data, index) => (
        <TipMenuItem
          key={index}
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
}: TipMenuItemProps) {
  const isIconValid = iconUrl && iconUrl !== "";

  return (
    <StyledTipMenuItem $isDangerous={isDangerous} onClick={onClick}>
      {isIconValid ? (
        <StyledIconImage
          alt={`${caption} icon on the Systatum superapp`}
          src={iconUrl}
        />
      ) : (
        <Icon
          size={20}
          style={
            isDangerous
              ? {
                  color: "white",
                }
              : {
                  color: COLOR_STYLE_MAP[iconColor],
                }
          }
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
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  border: 2px solid transparent;
  background-color: ${(props) =>
    props.$isDangerous ? "#ef4444" : "white"}; /* red-500 */
  color: ${(props) => (props.$isDangerous ? "white" : "black")};
  transition: background-color 0.2s;

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
`;

const StyledCaption = styled.span`
  font-size: 0.875rem;
`;

TipMenu.Item = TipMenuItem;
export { TipMenu };
