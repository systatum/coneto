import { ChangeEvent, MouseEvent, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { FieldLane, FieldLaneProps, FieldLaneStylesProps } from "./field-lane";
import { useTheme } from "./../theme/provider";
import { RatingThemeConfig } from "./../theme";

interface BaseRatingProps {
  rating?: string;
  onChange?: (rating: ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  withLabel?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  name?: string;
  styles?: BaseRatingStylesProps;
  id?: string;
}
interface BaseRatingStylesProps {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
}

function BaseRating({
  id,
  rating,
  onChange,
  editable,
  withLabel = false,
  size = "md",
  name,
  disabled,
}: BaseRatingProps) {
  const { currentTheme } = useTheme();
  const ratingTheme = currentTheme?.rating;

  const ratingState = Number(rating || 0);
  const [ratingLocal, setRatingLocal] = useState(ratingState);
  const [hoverRating, setHoverRating] = useState(0);

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
    setRatingLocal(newRating);
    const inputRatingEvent = {
      target: {
        name: name ?? "rating",
        value: String(newRating),
      },
    } as ChangeEvent<HTMLInputElement>;
    onChange(inputRatingEvent);
  };

  const getStarType = (index: number) => {
    const current = Number(hoverRating) || Number(ratingLocal);
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

  return (
    <RatingWrapper aria-label="rating-wrapper">
      <StarsWrapper>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarSpan
            role="img"
            key={i}
            onMouseMove={(e) => !disabled && editable && handleMouseMove(e, i)}
            onMouseLeave={() => !disabled && editable && setHoverRating(0)}
            onClick={(e) => !disabled && editable && handleClick(e, i)}
            $editable={editable}
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
        value={ratingLocal}
        id={id}
      />

      {withLabel && (
        <RatingLabel $disabled={disabled} $theme={ratingTheme} $size={size}>
          {ratingLocal.toFixed(1)} / 5
        </RatingLabel>
      )}
    </RatingWrapper>
  );
}

export type RatingStylesProps = BaseRatingStylesProps & FieldLaneStylesProps;

export interface RatingProps
  extends Omit<BaseRatingProps, "styles">,
    Omit<FieldLaneProps, "styles" | "type" | "dropdowns"> {
  styles?: RatingStylesProps;
}

function Rating({
  label,
  showError,
  styles,
  errorMessage,
  actions,
  helper,
  disabled,
  name,
  id,
  labelGap,
  labelWidth,
  labelPosition,
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
    ...RatingStyles
  } = styles ?? {};

  return (
    <FieldLane
      id={inputId}
      labelGap={labelGap}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
      showError={showError}
      errorMessage={errorMessage}
      actions={actions}
      helper={helper}
      disabled={disabled}
      label={label}
      errorIconPosition="none"
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
        styles={RatingStyles}
      />
    </FieldLane>
  );
}

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StarsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2px;
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
`;

export { Rating };
