
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TaskStatus } from '@/hooks/use-task-tracking';
import { cn } from '@/lib/utils';

interface TaskNotificationsProps {
  taskStatus: TaskStatus;
  user: any;
}

export const TaskNotifications = ({ taskStatus, user }: TaskNotificationsProps) => {
  const {
    serviceHoursCompleted,
    directorReportCompleted,
    daysUntilFriday,
    isOverdue
  } = taskStatus;

  // Don't show notifications if user is not authenticated
  if (!user) return null;

  const pendingTasks = [];
  if (!serviceHoursCompleted) pendingTasks.push('Service Hours');
  if (!directorReportCompleted) pendingTasks.push('Director Report');

  // If all tasks completed, show success message
  if (pendingTasks.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">All Weekly Tasks Completed!</h3>
              <p className="text-sm text-green-700">
                Great job! You've completed both your service hours and director report for this week.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine urgency level and styling
  const getUrgencyInfo = () => {
    if (isOverdue) {
      return {
        icon: AlertTriangle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        titleColor: 'text-red-900',
        textColor: 'text-red-700',
        title: 'Overdue Tasks',
        message: 'These weekly tasks are past due. Please complete them as soon as possible.'
      };
    } else if (daysUntilFriday <= 1) {
      return {
        icon: AlertTriangle,
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        iconColor: 'text-orange-600',
        titleColor: 'text-orange-900',
        textColor: 'text-orange-700',
        title: 'Urgent: Due Soon',
        message: `${daysUntilFriday === 0 ? 'Due today' : 'Due tomorrow'} by 5 PM`
      };
    } else {
      return {
        icon: Clock,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-900',
        textColor: 'text-blue-700',
        title: 'Weekly Tasks Pending',
        message: `Due Friday (${daysUntilFriday} day${daysUntilFriday !== 1 ? 's' : ''} remaining)`
      };
    }
  };

  const urgencyInfo = getUrgencyInfo();
  const Icon = urgencyInfo.icon;

  return (
    <Card className={cn(urgencyInfo.borderColor, urgencyInfo.bgColor)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={cn('h-5 w-5 mt-0.5', urgencyInfo.iconColor)} />
          <div className="flex-1">
            <h3 className={cn('font-medium', urgencyInfo.titleColor)}>
              {urgencyInfo.title}
            </h3>
            <p className={cn('text-sm mb-3', urgencyInfo.textColor)}>
              {urgencyInfo.message}
            </p>
            
            <div className="space-y-2">
              {!serviceHoursCompleted && (
                <div className="flex items-center justify-between p-2 rounded border bg-white/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Service Hours Entry</span>
                  </div>
                  <Button asChild size="sm">
                    <Link to="/service-entry">Enter Now</Link>
                  </Button>
                </div>
              )}
              
              {!directorReportCompleted && (
                <div className="flex items-center justify-between p-2 rounded border bg-white/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">Director Report</span>
                  </div>
                  <Button asChild size="sm">
                    <Link to="/recovery-survey">Complete Now</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
