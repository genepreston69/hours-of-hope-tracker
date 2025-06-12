
import { useMemo } from 'react';
import { ServiceEntry } from '@/models/types';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';

export interface TaskStatus {
  serviceHoursCompleted: boolean;
  directorReportCompleted: boolean;
  weekStart: Date;
  weekEnd: Date;
  daysUntilFriday: number;
  isOverdue: boolean;
}

export const useTaskTracking = (serviceEntries: ServiceEntry[]) => {
  const { user } = useAuth();
  
  // Get current week boundaries (Monday to Friday)
  const weekBoundaries = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, Monday = 1
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + daysUntilMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4); // Friday
    weekEnd.setHours(23, 59, 59, 999);
    
    const friday = new Date(weekStart);
    friday.setDate(weekStart.getDate() + 4);
    friday.setHours(17, 0, 0, 0); // 5 PM Friday deadline
    
    const daysUntilFriday = Math.ceil((friday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = now > friday;
    
    return { weekStart, weekEnd, daysUntilFriday, isOverdue };
  }, []);

  // Check if service hours completed this week
  const serviceHoursCompleted = useMemo(() => {
    return serviceEntries.some(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekBoundaries.weekStart && entryDate <= weekBoundaries.weekEnd;
    });
  }, [serviceEntries, weekBoundaries]);

  // Check if director report completed this week
  const { data: directorReportCompleted = false } = useQuery({
    queryKey: ['director-report-status', user?.id, weekBoundaries.weekStart],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('recovery_surveys')
        .select('id')
        .eq('user_id', user.id)
        .gte('report_date', weekBoundaries.weekStart.toISOString().split('T')[0])
        .lte('report_date', weekBoundaries.weekEnd.toISOString().split('T')[0])
        .limit(1);

      if (error) {
        console.error('Error checking director report status:', error);
        return false;
      }

      return (data?.length || 0) > 0;
    },
    enabled: !!user,
  });

  const taskStatus: TaskStatus = {
    serviceHoursCompleted,
    directorReportCompleted,
    weekStart: weekBoundaries.weekStart,
    weekEnd: weekBoundaries.weekEnd,
    daysUntilFriday: weekBoundaries.daysUntilFriday,
    isOverdue: weekBoundaries.isOverdue
  };

  return taskStatus;
};
