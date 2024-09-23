import React from 'react';
import { useState, CSSProperties } from 'react';

interface StarRatingProps {
  maxRating?: number;
  size?: number;
  color?: string;
  bgColor?: string;
  className?: string;
  messages?: string[];
  defaultRating?: number;
  onSetRating?: (rating: number) => void;
}

interface StarProps {
  onRate: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
  full: boolean;
  size: number;
  color: string;
}

export const StarRating = ({
  maxRating = 10,
  size = 48,
  color = 'DarkOrange',
  bgColor = '#212529',
  className = '',
  messages = [],
  defaultRating = 0,
  onSetRating,
}: StarRatingProps) => {
  const [rating, setRating] = useState<number>(defaultRating);
  const [tempRating, setTempRating] = useState<number>(0);
  const fontSize = `${Math.abs(size / 1.3)}px`;

  const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: bgColor,
  };

  const starContainerStyle: CSSProperties = {
    display: 'flex',
    backgroundColor: bgColor,
  };

  const textStyle: CSSProperties = {
    lineHeight: '1',
    margin: '0',
    color: color,
    fontSize: fontSize,
  };

  const handleRating = (rating: number) => {
    setRating(rating);
    onSetRating && onSetRating(rating);
  };

  const displayMessage =
    messages.length === maxRating
      ? messages[tempRating ? tempRating - 1 : rating - 1]
      : tempRating || rating || '';

  return (
    <div
      style={className ? {} : containerStyle}
      className={className}
    >
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            full={tempRating ? i < tempRating : i < rating}
            key={i}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            size={size}
            color={color}
          />
        ))}
      </div>
      <p style={textStyle}>{displayMessage}</p>
    </div>
  );
};

const Star = ({
  onRate,
  onHoverIn,
  onHoverOut,
  full,
  size,
  color,
}: StarProps) => {
  const starSize = `${size}px`;
  const starStyle: CSSProperties = {
    width: starSize,
    height: starSize,
    display: 'block',
    cursor: 'pointer',
  };

  return (
    <span
      role="button"
      style={starStyle}
      onClick={onRate}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
};
