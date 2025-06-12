
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useTaskTracking } from "@/hooks/use-task-tracking";
import { NotificationBadge } from "@/components/ui/notification-badge";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { refreshData, serviceEntries } = useAppContext();
  
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
  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    ...(user ? [
      { name: "Enter Service Hours", path: "/service-entry" },
      { name: "Director Report", path: "/recovery-survey" },
      { name: "Manage Customers", path: "/customers" },
      { name: "Reports", path: "/reports" },
    ] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
  };
  
  // Handler for Dashboard navigation with data refresh
  const handleDashboardClick = () => {
    if (refreshData) {
      console.log("Navbar: Dashboard link clicked, refreshing data");
      refreshData().catch(error => {
        console.error("Error refreshing data from navbar:", error);
      });
    }
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const renderNavLink = (item: { name: string; path: string }, isMobile = false) => {
    const notificationCount = getNotificationCount(item.path);
    
    if (item.path === "/dashboard") {
      return (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={handleDashboardClick}
          className={({ isActive }) =>
            cn(
              isMobile 
                ? "block px-3 py-2 rounded-md text-base font-medium"
                : "px-3 py-2 rounded-md text-sm font-medium relative",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-gray-600 hover:bg-muted hover:text-gray-900"
            )
          }
          end
        >
          {item.name}
          <NotificationBadge count={notificationCount} show={user && notificationCount > 0} />
        </NavLink>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          cn(
            isMobile 
              ? "block px-3 py-2 rounded-md text-base font-medium"
              : "px-3 py-2 rounded-md text-sm font-medium relative",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-gray-600 hover:bg-muted hover:text-gray-900"
          )
        }
        end={item.path === "/dashboard"}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        {item.name}
        <NotificationBadge count={notificationCount} show={user && notificationCount > 0} />
      </NavLink>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">Service Community</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => renderNavLink(item))}
            
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="ml-2"
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            ) : (
              <NavLink to="/auth">
                <Button variant="outline" size="sm" className="ml-2">
                  <User className="h-4 w-4 mr-2" /> Sign In
                </Button>
              </NavLink>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="mr-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign Out</span>
              </Button>
            ) : (
              <NavLink to="/auth" className="mr-2">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Sign In</span>
                </Button>
              </NavLink>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-white border-t`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => renderNavLink(item, true))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
