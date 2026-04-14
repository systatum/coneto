import styled, { css, CSSProp } from "styled-components";
import { CSSProperties, HTMLAttributes, ReactNode, useState } from "react";
import { Checkbox } from "./checkbox";
import { useTheme } from "./../theme/provider";

export interface GridProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  children?: ReactNode;
  height?: number | string;
  width?: number | string;
  gap?: number | string;
  styles?: GridStyles;
  preset?: GridPresetKey;
}

export interface GridCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  styles?: GridCardStyles;
  children?: ReactNode;
  thumbnail?: string;
  isSelected?: boolean;
  onSelected?: () => void;
  selectable?: boolean;
}

export interface GridStyles {
  self?: CSSProp;
}

export type GridCardStyles = GridStyles;

function Grid({
  children,
  gap = 8,
  styles,
  preset = "1-to-4",
  ...props
}: GridProps) {
  const style: CSSProperties = {
    gap: typeof gap === "number" ? `${gap}px` : gap,
  };

  return (
    <GridBase
      {...props}
      style={style}
      aria-label="grid"
      $style={css`
        ${gridPresets[preset]}
        ${styles?.self}
      `}
    >
      {children}
    </GridBase>
  );
}

function GridCard({
  children,
  thumbnail,
  styles,
  onSelected,
  isSelected,
  selectable,
  ...props
}: GridCardProps) {
  const { currentTheme } = useTheme();
  const gridTheme = currentTheme.grid;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <GridCardWrapper
      {...props}
      aria-label="grid-card"
      $style={styles?.self}
      $isSelected={isSelected}
      $selectable={selectable}
      $backgroundColor={gridTheme.cardBackgroundColor}
      $hoverBackgroundColor={gridTheme.cardHoverBackgroundColor}
      $selectedBackgroundColor={gridTheme.cardSelectedBackgroundColor}
      $borderColor={gridTheme.cardBorderColor}
      $shadow={gridTheme.cardShadow}
      onClick={(e) => {
        if (selectable) {
          onSelected?.();
        }
        if (props.onClick) {
          props.onClick(e);
        }
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (props.onMouseEnter) {
          props.onMouseEnter(e);
        }
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        if (props.onMouseLeave) {
          props.onMouseLeave(e);
        }
      }}
    >
      <CheckboxWrapper>
        {selectable && (isSelected || isHovered) && (
          <Checkbox
            checked={isSelected}
            styles={{
              containerStyle: css`
                border-radius: 2px;
              `,
            }}
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
  $style?: CSSProp;
}>`
  display: grid;
  width: 100%;
  ${({ $style }) => $style}
`;

const GridCardWrapper = styled.div.attrs<{
  $isSelected?: boolean;
  $backgroundColor?: string;
  $hoverBackgroundColor?: string;
  $selectedBackgroundColor?: string;
  $borderColor?: string;
  $shadow?: string;
}>(({ $isSelected }) => ({
  "data-selected": $isSelected,
  "aria-label": "grid-card",
}))<{
  $selectable?: boolean;
  $style?: CSSProp;

  $backgroundColor?: string;
  $hoverBackgroundColor?: string;
  $selectedBackgroundColor?: string;
  $borderColor?: string;
  $shadow?: string;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 4px;
  gap: 8px;
  font-size: 12px;
  border-radius: 4px;

  background: ${({ $backgroundColor }) => $backgroundColor};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  box-shadow: ${({ $shadow }) => $shadow};

  ${({ $selectable, $hoverBackgroundColor }) =>
    $selectable &&
    css`
      cursor: pointer;

      &:hover {
        background-color: ${$hoverBackgroundColor};
      }
    `}

  &[data-selected="true"] {
    background: ${({ $selectedBackgroundColor }) => $selectedBackgroundColor};
  }

  ${({ $style }) => $style}
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
