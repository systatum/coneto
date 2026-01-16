import { ChangeEvent, MouseEvent, ReactElement, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import Helper from "./helper";

export interface RatingProps {
  rating?: string;
  onChange?: (rating: ChangeEvent<HTMLInputElement>) => void;
  editable?: boolean;
  withLabel?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  showError?: boolean;
  label?: string;
  name?: string;
  styles?: RatingStylesProps;
  errorMessage?: string;
  helper?: string;
}
export interface RatingStylesProps {
  containerStyle?: CSSProp;
  labelStyle?: CSSProp;
}

function Rating({
  rating,
  onChange,
  editable,
  withLabel = false,
  size = "md",
  label,
  showError,
  errorMessage,
  disabled,
  styles,
  name,
  helper,
}: RatingProps) {
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
    const STAR_COLOR = "gold";
    const EMPTY_COLOR = "white";
    const BORDER_COLOR = "gold";

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

  const inputElement: ReactElement = (
    <RatingWrapper>
      <StarsWrapper>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarSpan
            role="img"
            key={i}
            onMouseMove={(e) => editable && handleMouseMove(e, i)}
            onMouseLeave={() => editable && setHoverRating(0)}
            onClick={(e) => editable && handleClick(e, i)}
            $editable={editable}
          >
            {renderStar(getStarType(i))}
          </StarSpan>
        ))}
      </StarsWrapper>

      {withLabel && (
        <RatingLabel $size={size}>{ratingLocal.toFixed(1)} / 5</RatingLabel>
      )}
    </RatingWrapper>
  );

  return (
    <InputWrapper $disabled={disabled} $containerStyle={styles?.containerStyle}>
      {label && (
        <Label $style={styles?.labelStyle}>
          {label}

          {helper && <Helper value={helper} />}
        </Label>
      )}
      <InputContent>
        {inputElement}
        {showError && errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </InputContent>
    </InputWrapper>
  );
}

const InputWrapper = styled.div<{
  $containerStyle?: CSSProp;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  width: 100%;
  position: relative;

  ${({ $disabled }) => $disabled && `cursor: not-allowed; opacity: 0.5;`}
  ${({ $containerStyle }) => $containerStyle}
`;

const Label = styled.label<{ $style?: CSSProp }>`
  font-size: 0.75rem;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;

  ${({ $style }) => $style}
`;

const InputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
`;

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

const StarSpan = styled.span<{ $editable?: boolean }>`
  ${({ $editable }) =>
    $editable &&
    css`
      cursor: pointer;
    `}
`;

const RatingLabel = styled.span<{ $size: "sm" | "md" | "lg" }>`
  font-weight: 500;
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
