import { useState } from 'react';

export const ErrorMessage = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);

  setTimeout(() => setIsVisible(true), 800);

  return (
    isVisible && (
      <p className="error">
        <span>⛔️</span> {message}
      </p>
    )
  );
};
