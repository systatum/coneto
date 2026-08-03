import { ChangeEvent, MouseEvent, ReactNode, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStyles } from "./field-lane";
import { useTheme } from "./../theme/provider";
import { RatingThemeConfig } from "./../theme";
import { applyClassName } from "./../constants/classname";

export const RatingSize = {
  Small: "sm",
  Medium: "md",
  Large: "lg",
} as const;

export type RatingSize = (typeof RatingSize)[keyof typeof RatingSize];

export type RatingScoreLabelRender =
  | ReactNode
  | ((props?: { value?: number; maxValue?: number }) => ReactNode);

export interface RatingScoreLabel {
  text?: RatingScoreLabelRender;
  position?: RatingScoreLabelPosition;
}

export const RatingScoreLabelPosition = {
  Top: "top",
  Right: "right",
  Bottom: "bottom",
  Left: "left",
} as const;

export type RatingScoreLabelPosition =
  (typeof RatingScoreLabelPosition)[keyof typeof RatingScoreLabelPosition];

interface BaseRatingProps {
  rating?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  scoreLabel?: RatingScoreLabel;
  size?: RatingSize;
  disabled?: boolean;
  name?: string;
  styles?: BaseRatingStyles;
  id?: string;
}
interface BaseRatingStyles {
  ratingWrapperStyle?: CSSProp;
  starsWrapperStyle?: CSSProp;
  ratingLabelStyle?: CSSProp;
}

function BaseRating({
  id,
  rating,
  onChange,
  scoreLabel,
  size = "md",
  name,
  disabled,
  styles,
}: BaseRatingProps) {
  const { currentTheme } = useTheme();
  const ratingTheme = currentTheme?.rating;

  const { position = RatingScoreLabelPosition.Right, text: scoreText } =
    scoreLabel ?? {};

  const [hoverRating, setHoverRating] = useState(0);

  const maxValue = 5;
  const rawValue = Number(rating || 0);

  const value = rawValue > maxValue ? (rawValue / 10) * maxValue : rawValue;

  const handleMouseMove = (e: MouseEvent<HTMLSpanElement>, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const isHalf = x < width / 2;
    setHoverRating(isHalf ? index + 0.5 : index + 1);
  };

  const handleClick = (e: MouseEvent<HTMLSpanElement>, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const isHalf = x < width / 2;
    const newRating = isHalf ? index + 0.5 : index + 1;
    const inputRatingEvent = {
      target: {
        name: name ?? "rating",
        value: String(newRating),
      },
    } as ChangeEvent<HTMLInputElement>;
    onChange?.(inputRatingEvent);
  };

  const getStarType = (index: number) => {
    const current = hoverRating || value;
    if (current >= index + 1) return "full";
    if (current >= index + 0.5) return "half";
    return "empty";
  };

  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const starSize = sizeMap[size];

  const renderStar = (type: "full" | "half" | "empty") => {
    const STAR_COLOR = ratingTheme?.starFullColor;
    const EMPTY_COLOR = ratingTheme?.starEmptyColor;
    const BORDER_COLOR = ratingTheme?.starBorderColor;

    const pathD =
      "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

    const fullStar = (
      <svg
        viewBox="0 0 24 24"
        fill={STAR_COLOR}
        width={starSize}
        height={starSize}
      >
        <path d={pathD} stroke={BORDER_COLOR} strokeWidth={1} />
      </svg>
    );

    const halfStar = (
      <svg viewBox="0 0 24 24" width={starSize} height={starSize}>
        <defs>
          <linearGradient id="half-grad">
            <stop offset="50%" stopColor={STAR_COLOR} />
            <stop offset="50%" stopColor={EMPTY_COLOR} />
          </linearGradient>
        </defs>
        <path
          d={pathD}
          fill="url(#half-grad)"
          stroke={BORDER_COLOR}
          strokeWidth={1}
        />
      </svg>
    );

    const emptyStar = (
      <svg
        viewBox="0 0 24 24"
        fill={EMPTY_COLOR}
        width={starSize}
        height={starSize}
      >
        <path d={pathD} stroke={BORDER_COLOR} strokeWidth={1} />
      </svg>
    );

    if (type === "full") return fullStar;
    if (type === "half") return halfStar;
    return emptyStar;
  };

  const editable = !disabled && !!onChange;

  const scoreTextNode =
    typeof scoreText === "function"
      ? scoreText({ value, maxValue })
      : scoreText;

  return (
    <RatingWrapper
      aria-label="rating-wrapper"
      $style={css`
        ${getPositionStyle(position)}

        ${styles?.ratingWrapperStyle}
      `}
    >
      <StarsWrapper
        aria-label="rating-stars-wrapper"
        $style={styles?.starsWrapperStyle}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <StarSpan
            role="img"
            key={i}
            onMouseMove={(e) => editable && handleMouseMove(e, i)}
            onMouseLeave={() => editable && setHoverRating(0)}
            onClick={(e) => editable && handleClick(e, i)}
            $editable={!!onChange}
            $disabled={disabled}
          >
            {renderStar(getStarType(i))}
          </StarSpan>
        ))}
      </StarsWrapper>
      <input
        disabled={disabled}
        type="hidden"
        name={name}
        value={value}
        id={id}
      />

      {scoreTextNode && (
        <RatingLabel
          aria-label="rating-label"
          $disabled={disabled}
          $theme={ratingTheme}
          $size={size}
          $style={styles?.ratingLabelStyle}
        >
          {scoreTextNode}
        </RatingLabel>
      )}
    </RatingWrapper>
  );
}

function getPositionStyle(position: RatingScoreLabelPosition) {
  if (position === RatingScoreLabelPosition.Right) {
    return css`
      flex-direction: row;
    `;
  } else if (position === RatingScoreLabelPosition.Left) {
    return css`
      flex-direction: row-reverse;
    `;
  } else if (position === RatingScoreLabelPosition.Bottom) {
    return css`
      flex-direction: column;
    `;
  } else {
    return css`
      flex-direction: column-reverse;
    `;
  }
}

export type RatingStyles = BaseRatingStyles & FieldLaneStyles;

export interface RatingProps
  extends Omit<BaseRatingProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns" | "actions"> {
  styles?: RatingStyles;
}

function Rating({
  label,
  showError,
  styles,
  errorMessage,
  helper,
  disabled,
  name,
  id,
  labelGap,
  labelWidth,
  labelPosition,
  className,
  icon,
  mobile,
  ...rest
}: RatingProps) {
  const inputId = StatefulForm.sanitizeId({
    prefix: "rating",
    name,
    id,
  });

  const {
    bodyStyle,
    controlStyle,
    containerStyle,
    labelStyle,
    ...ratingStyles
  } = styles ?? {};

  return (
    <FieldLane
      id={inputId}
      icon={icon}
      mobile={mobile}
      labelGap={labelGap}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
      showError={showError}
      errorMessage={errorMessage}
      helper={helper}
      disabled={disabled}
      label={label}
      errorIconPosition="none"
      className={applyClassName("rating", className)}
      required={rest.required}
      styles={{
        bodyStyle,
        controlStyle,
        containerStyle,
        labelStyle,
      }}
    >
      <BaseRating
        {...rest}
        disabled={disabled}
        name={name}
        id={inputId}
        styles={ratingStyles}
      />
    </FieldLane>
  );
}

const RatingWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ $style }) => $style}
`;

const StarsWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 2px;
  ${({ $style }) => $style}
`;

const StarSpan = styled.span<{ $editable?: boolean; $disabled?: boolean }>`
  ${({ $editable, $disabled }) =>
    $disabled
      ? css`
          cursor: not-allowed;
          user-select: none;
          pointer-events: none;
        `
      : $editable &&
        css`
          cursor: pointer;
        `}
`;

const RatingLabel = styled.span<{
  $size: "sm" | "md" | "lg";
  $theme: RatingThemeConfig;
  $disabled?: boolean;
  $style?: CSSProp;
}>`
  font-weight: 500;
  color: ${({ $disabled, $theme }) =>
    $disabled ? $theme.disabledLabelColor : $theme.labelTextColor};
  ${({ $size }) => {
    switch ($size) {
      case "sm":
        return css`
          font-size: 0.875rem;
        `;
      case "lg":
        return css`
          font-size: 1.25rem;
        `;
      default:
        return css`
          font-size: 1rem;
        `;
    }
  }}

  ${({ $style }) => $style}
`;

export { Rating };
