import { useEffect, useRef, useState } from "react";

export function useActivityDetection(timeoutDuration = 60000) {
  const [isActive, setIsActive] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsActive(true);
      timeoutRef.current = setTimeout(() => {
        setIsActive(false);
      }, timeoutDuration);
    };

    // Events to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => document.addEventListener(event, resetTimeout));

    // Initial timeout
    resetTimeout();

    // Visibility change handler
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) =>
        document.removeEventListener(event, resetTimeout)
      );
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [timeoutDuration]);

  return isActive;
}
