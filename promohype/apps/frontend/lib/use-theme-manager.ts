import { useEffect, useState } from 'react';

/**
 * Custom hook to manage theme state and initialization
 * This helps prevent flash of unstyled content (FOUC) during theme switching
 */
export function useThemeManager() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return mounted state to prevent SSR issues
  return { mounted };
}