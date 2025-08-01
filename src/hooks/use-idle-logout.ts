import { useState, useCallback } from 'react';
import { useIdleTimer } from './use-idle-timer';
import { toast } from '@/hooks/use-toast';

interface UseIdleLogoutProps {
  onLogout: () => void;
  enabled: boolean;
  idleTimeout?: number; // in milliseconds, default 30 minutes
  warningTimeout?: number; // in milliseconds, default 5 minutes
}

export function useIdleLogout({ 
  onLogout, 
  enabled,
  idleTimeout = 30 * 60 * 1000, // 30 minutes
  warningTimeout = 5 * 60 * 1000 // 5 minutes
}: UseIdleLogoutProps) {
  const [showWarning, setShowWarning] = useState(false);
  
  const handleLogout = useCallback(() => {
    setShowWarning(false);
    onLogout();
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity.",
      variant: "destructive",
    });
  }, [onLogout]);

  const handleWarning = useCallback(() => {
    if (enabled) {
      setShowWarning(true);
    }
  }, [enabled]);

  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    resetWarningTimer();
    resetIdleTimer();
  }, []);

  const { resetTimer: resetIdleTimer } = useIdleTimer({
    timeout: idleTimeout - warningTimeout,
    onIdle: handleWarning,
    enabled: enabled && !showWarning,
  });

  const { resetTimer: resetWarningTimer } = useIdleTimer({
    timeout: warningTimeout,
    onIdle: handleLogout,
    enabled: enabled && showWarning,
  });

  return {
    showWarning,
    handleStayLoggedIn,
    handleLogout,
    warningDuration: warningTimeout,
  };
}