
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  show?: boolean;
}

export const NotificationBadge = ({ count, className, show = true }: NotificationBadgeProps) => {
  if (!show || count === 0) return null;

  return (
    <span className={cn(
      'h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium',
      className
    )}>
      {count > 9 ? '9+' : count}
    </span>
  );
};
