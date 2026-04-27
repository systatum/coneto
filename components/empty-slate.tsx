import { BaseAction } from "@/constants/action";
import { ReactNode } from "react";
import styled, { css, CSSProp } from "styled-components";
import { Button, ButtonVariant } from "./button";
import { Figure, FigureProps } from "./figure";

export interface EmptySlateProps {
  icon: FigureProps;
  title: string;
  subtitle?: string;
  actions?: EmptySlateAction[];
  styles?: EmptySlateStyles;
}

export interface EmptySlateAction extends BaseAction {
  variant?: ButtonVariant;
}

export interface EmptySlateStyles {
  containerStyle?: CSSProp;
  imageStyle?: CSSProp;
  contentStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
}

function EmptySlate({
  icon,
  title,
  subtitle,
  actions,
  styles,
}: EmptySlateProps) {
  return (
    <Container $style={styles?.containerStyle}>
      {icon && (
        <Figure
          size={icon?.size ?? 200}
          styles={{
            self: icon?.styles?.self,
          }}
          {...icon}
        />
      )}
      <Content $style={styles?.contentStyle}>
        <Title $style={styles?.titleStyle}>{title}</Title>
        {subtitle && (
          <Subtitle $style={styles?.titleStyle}>{subtitle}</Subtitle>
        )}
        {actions && (
          <Actions>
            {actions?.map((action) => {
              if (action?.hidden) {
                return;
              }
              return <Button {...action}>{action?.caption}</Button>;
            })}
          </Actions>
        )}
      </Content>
    </Container>
  );
}

const Container = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  padding-top: 5rem;
  padding-bottom: 5rem;
  ${({ $style }) => $style}
`;

const Content = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
  ${({ $style }) => $style}
`;

const Title = styled.h2<{ $style?: CSSProp }>`
  font-size: 1.25rem;
  font-weight: 600;
  ${({ $style }) => $style}
`;

const Subtitle = styled.span<{ $style?: CSSProp }>`
  font-size: 0.875rem;
  ${({ $style }) => $style}
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export { EmptySlate };
