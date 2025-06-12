
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface NotificationSettingsProps {
  user: any;
}

export const NotificationSettings = ({ user }: NotificationSettingsProps) => {
  const [emailReminders, setEmailReminders] = useState(true);
  const [dashboardNotifications, setDashboardNotifications] = useState(true);
  const [fridayDeadline, setFridayDeadline] = useState(true);
  const [overdueAlerts, setOverdueAlerts] = useState(true);

  const handleSaveSettings = () => {
    // TODO: Save settings to user profile
    console.log('Saving notification settings:', {
      emailReminders,
      dashboardNotifications,
      fridayDeadline,
      overdueAlerts
    });
  };

  if (!user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Notification Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dashboard Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Show task reminders on the dashboard
                </p>
              </div>
              <Switch
                checked={dashboardNotifications}
                onCheckedChange={setDashboardNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Friday Deadline Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Weekly reminders about Friday deadlines
                </p>
              </div>
              <Switch
                checked={fridayDeadline}
                onCheckedChange={setFridayDeadline}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Overdue Task Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Urgent notifications for overdue tasks
                </p>
              </div>
              <Switch
                checked={overdueAlerts}
                onCheckedChange={setOverdueAlerts}
              />
            </div>

            <div className="flex items-center justify-between opacity-50">
              <div>
                <p className="font-medium">Email Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Email notifications (coming soon)
                </p>
              </div>
              <Switch
                checked={emailReminders}
                onCheckedChange={setEmailReminders}
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={handleSaveSettings}>
              Save Preferences
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
