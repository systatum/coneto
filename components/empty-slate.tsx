import { ReactNode } from "react";
import styled, { CSSProp } from "styled-components";

export interface EmptySlateProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  styles?: EmptySlateStylesProps;
}

export interface EmptySlateStylesProps {
  containerStyle?: CSSProp;
  imageStyle?: CSSProp;
  contentStyle?: CSSProp;
  titleStyle?: CSSProp;
  subtitleStyle?: CSSProp;
}

function EmptySlate({
  imageUrl,
  title,
  subtitle,
  actions,
  styles,
}: EmptySlateProps) {
  return (
    <Container $style={styles?.containerStyle}>
      {imageUrl && (
        <ImageWrapper $style={styles?.imageStyle}>
          <StyledImage
            src={imageUrl}
            alt="Image for Empty Slate Coneto Product from Systatum."
          />
        </ImageWrapper>
      )}
      <Content $style={styles?.contentStyle}>
        <Title $style={styles?.titleStyle}>{title}</Title>
        {subtitle && (
          <Subtitle $style={styles?.titleStyle}>{subtitle}</Subtitle>
        )}
        {actions && <Actions>{actions}</Actions>}
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

const ImageWrapper = styled.div<{ $style?: CSSProp }>`
  width: 250px;
  height: 150px;

  @media (min-width: 640px) {
    width: 350px;
    height: 180px;
  }

  @media (min-width: 768px) {
    width: 400px;
    height: 200px;
  }

  ${({ $style }) => $style}
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
