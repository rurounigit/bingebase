import { useEffect } from 'react';

export function useKey(key, action) {
  // react to key stroke / shortcut
  useEffect(() => {
    const callback = (e) => {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action?.();
      }
    };
    document.addEventListener('keydown', callback);

    return () => document.removeEventListener('keydown', callback);
  }, [key, action]);
}
