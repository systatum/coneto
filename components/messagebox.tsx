import styled, { css, CSSProp } from "styled-components";
import { RiCloseLine, RiInformation2Fill } from "@remixicon/react";
import { ReactNode } from "react";
import { Button } from "./button";
import { Figure, FigureProps } from "./figure";
import { useTheme } from "./../theme/provider";
import { MessageboxThemeConfig } from "./../theme";

export type MessageboxVariantState =
  | "primary"
  | "success"
  | "danger"
  | "warning";

export interface MessageboxProps {
  variant?: MessageboxVariantState;
  title: string;
  icon?: FigureProps;
  children: ReactNode;
  actionLinks?: ActionLinkProps[];
  closable?: boolean;
  onCloseRequest?: () => void;
  styles?: MessageboxStylesProps;
}

export interface MessageboxStylesProps {
  containerStyle?: CSSProp;
  titleStyle?: CSSProp;
  contentWrapperStyle?: CSSProp;
  contentStyle?: CSSProp;
}
export interface ActionLinkProps {
  caption: string;
  onClick?: () => void;
  href?: string;
  type: "button" | "link";
}

function Messagebox({
  variant = "primary",
  title,
  icon,
  children,
  actionLinks,
  onCloseRequest,
  closable = false,
  styles,
}: MessageboxProps) {
  const { currentTheme } = useTheme();
  const messageboxTheme = currentTheme.messagebox;
  const variantStyle = messageboxTheme[variant];

  return (
    <Wrapper
      $theme={messageboxTheme}
      $variant={variant}
      $style={styles?.containerStyle}
    >
      <BorderAccent $theme={messageboxTheme} $variant={variant} />
      <Figure
        {...icon}
        styles={{
          self: css`
            padding-top: 4px;
            ${icon?.styles?.self}
          `,
        }}
        image={icon?.image ?? RiInformation2Fill}
        color={icon?.color ?? variantStyle.text}
      />

      <Content $style={styles?.contentWrapperStyle}>
        <Title $style={styles?.titleStyle}>{title}</Title>
        <Children $style={styles?.contentStyle}>{children}</Children>
        {actionLinks && (
          <ActionList>
            {actionLinks.map((action, index) =>
              action.type === "button" ? (
                <ActionItem
                  key={index}
                  $variant={variant}
                  $theme={messageboxTheme}
                  onClick={action.onClick}
                >
                  {action.caption}
                </ActionItem>
              ) : (
                <ActionLink
                  key={index}
                  $variant={variant}
                  $theme={messageboxTheme}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {action.caption}
                </ActionLink>
              )
            )}
          </ActionList>
        )}
      </Content>
      {closable && (
        <Button
          variant="transparent"
          styles={{
            containerStyle: css`
              position: absolute;
              top: 13px;
              right: 0.5rem;
              cursor: pointer;
              transition: all 0.3s;
              border-radius: 2px;
              padding: 2px;
              width: fit-content;
              height: fit-content;
            `,
            self: css`
              width: fit-content;
              height: fit-content;
              padding: 2px;
              color: ${variantStyle.text};
            `,
          }}
        >
          <RiCloseLine
            role="button"
            aria-label="closable-request"
            size={14}
            onClick={(e) => {
              e.stopPropagation();
              onCloseRequest?.();
            }}
          />
        </Button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  $style?: CSSProp;
  $variant: MessageboxVariantState;
  $theme: MessageboxThemeConfig;
}>`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  padding: 11px 12px 20px;
  border-top-width: 1px;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  height: 100%;

  background-color: ${({ $variant, $theme }) => $theme[$variant].container};

  color: ${({ $variant, $theme }) => $theme[$variant].text};

  ${({ $style }) => $style};
`;

const Content = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${({ $style }) => $style};
`;

const Title = styled.span<{ $style?: CSSProp }>`
  font-weight: 600;
  font-size: 1rem;
  ${({ $style }) => $style};
`;

const Children = styled.span<{ $style?: CSSProp }>`
  font-size: 0.875rem;
  line-height: 1.4;
  color: inherit;
  ${({ $style }) => $style};
`;

const BorderAccent = styled.div<{
  $variant: MessageboxVariantState;
  $theme: MessageboxThemeConfig;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-top: 2px solid ${({ $variant, $theme }) => $theme[$variant].text};
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const ActionItem = styled.button<{
  $variant: MessageboxVariantState;
  $theme: MessageboxThemeConfig;
}>`
  cursor: pointer;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $variant, $theme }) => $theme[$variant].text};
  transition: all 0.3s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    color: ${({ $variant, $theme }) => $theme[$variant].active};
  }
`;

const ActionLink = styled.a<{
  $variant: MessageboxVariantState;
  $theme: MessageboxThemeConfig;
}>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $variant, $theme }) => $theme[$variant].text};

  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    color: ${({ $variant, $theme }) => $theme[$variant].active};
  }
`;

export { Messagebox };
