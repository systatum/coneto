import { cn } from "./../lib/utils";
import React, { MouseEvent, useState } from "react";

interface RatingProps {
  rating?: number;
  setRating?: (rating: number) => void;
  editable?: boolean;
  withLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Rating({
  rating,
  setRating,
  editable,
  withLabel = false,
  size = "md",
}: RatingProps) {
  const ratingState = rating ?? 0;
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
    if (setRating) {
      setRating(newRating);
    }
  };

  const getStarType = (index: number) => {
    const current = hoverRating || ratingLocal;
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

  return (
    <div className="flex flex-row gap-[2px] items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          onMouseMove={(e) => editable && handleMouseMove(e, i)}
          onMouseLeave={() => editable && setHoverRating(0)}
          onClick={(e) => editable && handleClick(e, i)}
          className={cn(editable && "cursor-pointer")}
        >
          {renderStar(getStarType(i))}
        </span>
      ))}
      {withLabel && (
        <span
          className={cn(
            "ml-2 font-medium",
            size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"
          )}
        >
          {ratingLocal.toFixed(1)} / 5
        </span>
      )}
    </div>
  );
}
