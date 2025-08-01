import { useEffect, useRef, useCallback } from 'react';

interface UseIdleTimerProps {
  timeout: number; // in milliseconds
  onIdle: () => void;
  onActivity?: () => void;
  enabled?: boolean;
}

export function useIdleTimer({ timeout, onIdle, onActivity, enabled = true }: UseIdleTimerProps) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const onIdleRef = useRef(onIdle);
  const onActivityRef = useRef(onActivity);

  // Update refs to avoid stale closures
  onIdleRef.current = onIdle;
  onActivityRef.current = onActivity;

  const resetTimer = useCallback(() => {
    if (!enabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    onActivityRef.current?.();
    
    timeoutRef.current = setTimeout(() => {
      onIdleRef.current();
    }, timeout);
  }, [timeout, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Debounce activity detection
    let debounceTimer: NodeJS.Timeout;
    const debouncedResetTimer = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(resetTimer, 100);
    };

    events.forEach(event => {
      document.addEventListener(event, debouncedResetTimer, true);
    });

    // Start the timer
    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, debouncedResetTimer, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearTimeout(debounceTimer);
    };
  }, [resetTimer, enabled]);

  return { resetTimer };
}