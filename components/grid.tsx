import styled, { css, CSSProp } from "styled-components";
import { CSSProperties, ReactNode, useState } from "react";
import { Checkbox } from "./checkbox";
import { cn } from "./../lib/utils";

interface GridProps {
  children?: ReactNode;
  height?: number | string;
  width?: number | string;
  gap?: number | string;
  containerStyle?: CSSProp;
  preset?: GridPresetKey;
}

interface GridCardProps {
  children?: ReactNode;
  thumbnail?: string;
  isSelected?: boolean;
  containerStyle?: CSSProp;
  onSelected?: () => void;
  selectable?: boolean;
}

function Grid({
  children,
  gap = 8,
  containerStyle,
  preset = "1-to-4",
}: GridProps) {
  const style: CSSProperties = {
    gap: typeof gap === "number" ? `${gap}px` : gap,
  };

  const PresetGrid = styled(GridBase)`
    ${gridPresets[preset]}
  `;

  return (
    <PresetGrid style={style} $container_style={containerStyle}>
      {children}
    </PresetGrid>
  );
}

function GridCard({
  children,
  thumbnail,
  containerStyle,
  onSelected,
  isSelected,
  selectable,
  ...props
}: GridCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GridCardWrapper
      {...props}
      aria-label="grid-card"
      $container_style={containerStyle}
      isSelected={isSelected}
      selectable={selectable}
      onClick={() => selectable && onSelected?.()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CheckboxWrapper>
        {selectable && (isSelected || isHovered) && (
          <Checkbox
            checked={isSelected}
            containerStyle={css`
              border-radius: 2px;
            `}
            style={css`
              width: 16px;
              height: 16px;
            `}
            readOnly
          />
        )}
      </CheckboxWrapper>
      <ThumbnailWrapper>
        {thumbnail && (
          <img
            src={thumbnail}
            alt={`This is ${thumbnail} Image from Systatum Corp`}
          />
        )}
      </ThumbnailWrapper>
      <ContentWrapper>{children}</ContentWrapper>
    </GridCardWrapper>
  );
}

const GridBase = styled.div<{
  $container_style?: CSSProp;
}>`
  display: grid;
  width: 100%;
  ${({ $container_style }) => $container_style}
`;

const GridCardWrapper = styled.div.attrs<{
  isSelected?: boolean;
}>(({ isSelected }) => ({
  "aria-label": "grid-card",
  "data-selected": isSelected,
}))<{
  selectable?: boolean;
  $container_style?: CSSProp;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 4px;
  gap: 8px;
  font-size: 0.875rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  ${({ selectable }) =>
    selectable &&
    css`
      cursor: pointer;
      &:hover {
        background-color: #f3f3f3;
      }
    `}
  ${({ $container_style }) => $container_style}
`;

const CheckboxWrapper = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
`;

const ThumbnailWrapper = styled.div`
  width: 100%;
  background-color: #e5e5e5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const gridPresets = {
  "1-col": css`
    grid-template-columns: repeat(1, 1fr);
  `,
  "2-col": css`
    grid-template-columns: repeat(2, 1fr);
  `,
  "3-col": css`
    grid-template-columns: repeat(3, 1fr);
  `,
  "4-col": css`
    grid-template-columns: repeat(4, 1fr);
  `,
  "5-col": css`
    grid-template-columns: repeat(5, 1fr);
  `,
  "6-col": css`
    grid-template-columns: repeat(6, 1fr);
  `,
  "13-col": css`
    grid-template-columns: repeat(13, 1fr);
  `,
  "16-col": css`
    grid-template-columns: repeat(16, 1fr);
  `,
  "1-to-3": css`
    grid-template-columns: repeat(1, 1fr);
    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  `,
  "1-to-4": css`
    grid-template-columns: repeat(1, 1fr);
    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  `,
  "2-to-4": css`
    grid-template-columns: repeat(2, 1fr);
    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  `,
  "3-to-5": css`
    grid-template-columns: repeat(3, 1fr);
    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(5, 1fr);
    }
  `,
  "1-to-6": css`
    grid-template-columns: repeat(1, 1fr);
    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
    @media (min-width: 1280px) {
      grid-template-columns: repeat(6, 1fr);
    }
  `,
  "auto-fit-400": css`
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  `,
  "auto-fit-350": css`
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  `,
  "auto-fit-300": css`
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  `,
  "auto-fit-250": css`
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  `,
  "auto-fit-200": css`
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  `,
} satisfies Record<string, CSSProp>;

export type GridPresetKey = keyof typeof gridPresets;

Grid.Card = GridCard;
export { Grid };
