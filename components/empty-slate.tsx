import { ReactNode } from "react";
import styled, { CSSProp } from "styled-components";

export interface EmptySlateProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  containerStyle?: CSSProp;
  imageStyle?: CSSProp;
  childStyle?: CSSProp;
  actions?: ReactNode;
}

function EmptySlate({
  imageUrl,
  title,
  subtitle,
  actions,
  containerStyle,
  imageStyle,
  childStyle,
}: EmptySlateProps) {
  return (
    <Container $container_style={containerStyle}>
      {imageUrl && (
        <ImageWrapper $image_style={imageStyle}>
          <StyledImage
            src={imageUrl}
            alt="Image for Empty Slate Coneto Product from Systatum."
          />
        </ImageWrapper>
      )}
      <Content $content_style={childStyle}>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {actions && <Actions>{actions}</Actions>}
      </Content>
    </Container>
  );
}

const Container = styled.div<{ $container_style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  padding-top: 5rem;
  padding-bottom: 5rem;
  ${({ $container_style }) => $container_style}
`;

const ImageWrapper = styled.div<{ $image_style?: CSSProp }>`
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

  ${({ $image_style }) => $image_style}
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div<{ $content_style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;
  ${({ $content_style }) => $content_style}
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Subtitle = styled.span`
  font-size: 0.875rem;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

export { EmptySlate };
