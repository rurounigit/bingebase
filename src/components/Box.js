import { useState } from 'react';

export const Box = ({ hasToggle = false, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className="box"
      style={
        hasToggle
          ? isOpen
            ? { width: '100%' }
            : { width: '10%' }
          : {}
      }
    >
      {hasToggle ? (
        <button
          className="btn-toggle-box"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? '–' : '+'}
        </button>
      ) : null}
      {isOpen && children}
    </div>
  );
};
