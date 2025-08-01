import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface IdleWarningDialogProps {
  open: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
  warningDuration: number; // in milliseconds
}

export function IdleWarningDialog({ 
  open, 
  onStayLoggedIn, 
  onLogout, 
  warningDuration 
}: IdleWarningDialogProps) {
  const [countdown, setCountdown] = useState(Math.floor(warningDuration / 1000));

  useEffect(() => {
    if (!open) return;

    setCountdown(Math.floor(warningDuration / 1000));
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, warningDuration, onLogout]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Timeout Warning</DialogTitle>
          <DialogDescription>
            Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')} due to inactivity.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onLogout}>
            Logout Now
          </Button>
          <Button onClick={onStayLoggedIn}>
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}