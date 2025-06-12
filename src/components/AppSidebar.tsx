
import { 
  Calendar, 
  Home, 
  Users, 
  FileBarChart, 
  ClipboardList, 
  LogOut, 
  User,
  Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useAppContext } from "@/context/AppContext";
import { useTaskTracking } from "@/hooks/use-task-tracking";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { NotificationSettings } from "@/components/dashboard/NotificationSettings";

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const { refreshData, serviceEntries } = useAppContext();
  const location = useLocation();
  
  // Get task tracking status for notification badges
  const taskStatus = useTaskTracking(serviceEntries);

  // Calculate notification counts
  const getNotificationCount = (path: string) => {
    if (!user) return 0;
    
    switch (path) {
      case "/service-entry":
        return taskStatus.serviceHoursCompleted ? 0 : 1;
      case "/recovery-survey":
        return taskStatus.directorReportCompleted ? 0 : 1;
      default:
        return 0;
    }
  };

  // Define navigation items based on authentication status
  const mainNavItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: Home,
      requireAuth: false 
    },
  ];

  const userNavItems = user ? [
    { 
      name: "Enter Service Hours", 
      path: "/service-entry", 
      icon: ClipboardList,
      requireAuth: true 
    },
    { 
      name: "Director Report", 
      path: "/recovery-survey", 
      icon: FileBarChart,
      requireAuth: true 
    },
    { 
      name: "Manage Customers", 
      path: "/customers", 
      icon: Users,
      requireAuth: true 
    },
    { 
      name: "Reports", 
      path: "/reports", 
      icon: FileBarChart,
      requireAuth: true 
    },
  ] : [];

  const handleSignOut = async () => {
    await signOut();
  };
  
  // Handler for Dashboard navigation with data refresh
  const handleDashboardClick = () => {
    if (refreshData) {
      console.log("Sidebar: Dashboard link clicked, refreshing data");
      refreshData().catch(error => {
        console.error("Error refreshing data from sidebar:", error);
      });
    }
  };

  const renderNavItem = (item: { name: string; path: string; icon: any; requireAuth?: boolean }) => {
    const isActive = location.pathname === item.path;
    const notificationCount = getNotificationCount(item.path);
    const Icon = item.icon;

    const menuButton = (
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        className="relative"
      >
        <Link 
          to={item.path}
          onClick={item.path === "/dashboard" ? handleDashboardClick : undefined}
        >
          <Icon className="h-4 w-4" />
          <span>{item.name}</span>
          <NotificationBadge 
            count={notificationCount} 
            show={user && notificationCount > 0}
            className="ml-auto" 
          />
        </Link>
      </SidebarMenuButton>
    );

    return (
      <SidebarMenuItem key={item.path}>
        {menuButton}
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-center px-2 py-1">
          <img 
            src="/lovable-uploads/f4dd29f5-c1ea-4bf3-88c3-f13573496fe7.png" 
            alt="Recovery Point Logo" 
            className="h-12 w-auto"
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => renderNavItem(item))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && userNavItems.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>My Tasks</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userNavItems.map((item) => renderNavItem(item))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {user ? (
                <>
                  <SidebarMenuItem>
                    <NotificationSettings user={user} />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/auth">
                      <User className="h-4 w-4" />
                      <span>Sign In</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
