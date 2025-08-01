import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Mail, Phone, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface NotificationRecipient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  incident_reports_enabled: boolean;
  director_reports_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  critical_only: boolean;
  created_at: string;
}

interface RecipientFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  incident_reports_enabled: boolean;
  director_reports_enabled: boolean;
  email_enabled: boolean;
  sms_enabled: boolean;
  critical_only: boolean;
}

const defaultFormData: RecipientFormData = {
  name: '',
  email: '',
  phone: '',
  role: 'supervisor',
  incident_reports_enabled: true,
  director_reports_enabled: true,
  email_enabled: true,
  sms_enabled: false,
  critical_only: false,
};

export default function NotificationAdmin() {
  const [recipients, setRecipients] = useState<NotificationRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<NotificationRecipient | null>(null);
  const [formData, setFormData] = useState<RecipientFormData>(defaultFormData);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_recipients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipients(data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      toast.error('Failed to load notification recipients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRecipient) {
        // Update existing recipient
        const { error } = await supabase
          .from('notification_recipients')
          .update(formData)
          .eq('id', editingRecipient.id);

        if (error) throw error;
        toast.success('Recipient updated successfully');
      } else {
        // Create new recipient
        const { error } = await supabase
          .from('notification_recipients')
          .insert([formData]);

        if (error) throw error;
        toast.success('Recipient created successfully');
      }

      setIsDialogOpen(false);
      setEditingRecipient(null);
      setFormData(defaultFormData);
      fetchRecipients();
    } catch (error) {
      console.error('Error saving recipient:', error);
      toast.error('Failed to save recipient');
    }
  };

  const handleEdit = (recipient: NotificationRecipient) => {
    setEditingRecipient(recipient);
    setFormData({
      name: recipient.name,
      email: recipient.email,
      phone: recipient.phone || '',
      role: recipient.role,
      incident_reports_enabled: recipient.incident_reports_enabled,
      director_reports_enabled: recipient.director_reports_enabled,
      email_enabled: recipient.email_enabled,
      sms_enabled: recipient.sms_enabled,
      critical_only: recipient.critical_only,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipient?')) return;

    try {
      const { error } = await supabase
        .from('notification_recipients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Recipient deleted successfully');
      fetchRecipients();
    } catch (error) {
      console.error('Error deleting recipient:', error);
      toast.error('Failed to delete recipient');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'director': return 'bg-purple-100 text-purple-700';
      case 'supervisor': return 'bg-blue-100 text-blue-700';
      case 'administrator': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Notification Recipients</h1>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notification Recipients</h1>
            <p className="text-slate-600 mt-2">
              Configure who receives email and SMS notifications for incident and director reports
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2"
                onClick={() => {
                  setEditingRecipient(null);
                  setFormData(defaultFormData);
                }}
              >
                <Plus className="w-4 h-4" />
                Add Recipient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingRecipient ? 'Edit' : 'Add'} Notification Recipient
                </DialogTitle>
                <DialogDescription>
                  Configure notification preferences for this recipient.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Incident Reports</p>
                      <p className="text-sm text-muted-foreground">Receive notifications for incident reports</p>
                    </div>
                    <Switch
                      checked={formData.incident_reports_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, incident_reports_enabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Director Reports</p>
                      <p className="text-sm text-muted-foreground">Receive notifications for director reports</p>
                    </div>
                    <Switch
                      checked={formData.director_reports_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, director_reports_enabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={formData.email_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, email_enabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                    </div>
                    <Switch
                      checked={formData.sms_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, sms_enabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Critical Only</p>
                      <p className="text-sm text-muted-foreground">Only notify for critical incidents</p>
                    </div>
                    <Switch
                      checked={formData.critical_only}
                      onCheckedChange={(checked) => setFormData({ ...formData, critical_only: checked })}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingRecipient ? 'Update' : 'Create'} Recipient
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recipients ({recipients.length})</CardTitle>
            <CardDescription>
              Manage who receives notifications when reports are submitted
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recipients.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipients configured</h3>
                <p className="text-gray-500 mb-4">
                  Add recipients to start sending notifications when reports are submitted
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Recipient
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Report Types</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recipients.map((recipient) => (
                      <TableRow key={recipient.id}>
                        <TableCell className="font-medium">{recipient.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3 h-3" />
                              {recipient.email}
                            </div>
                            {recipient.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-3 h-3" />
                                {recipient.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(recipient.role)}>
                            {recipient.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {recipient.incident_reports_enabled && (
                              <Badge variant="outline" className="text-xs">Incidents</Badge>
                            )}
                            {recipient.director_reports_enabled && (
                              <Badge variant="outline" className="text-xs">Director</Badge>
                            )}
                            {recipient.critical_only && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700">Critical Only</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {recipient.email_enabled && (
                              <Badge variant="outline" className="text-xs">Email</Badge>
                            )}
                            {recipient.sms_enabled && (
                              <Badge variant="outline" className="text-xs">SMS</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(recipient)}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(recipient.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}