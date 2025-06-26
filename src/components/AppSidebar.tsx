
import { Calendar, Home, Inbox, Search, Settings, Users, FileText, ClipboardList, BarChart3, AlertTriangle, LogOut, FolderOpen, Activity, ChevronRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "@/components/ui/sonner"
import { useAppContext } from "@/context/AppContext"
import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar"

// First group - Service items
const serviceItems = [
  {
    title: "Service Entry",
    url: "/service-entry",
    icon: Calendar,
  },
  {
    title: "Director Report",
    url: "/recovery-survey",
    icon: ClipboardList,
  },
  {
    title: "Incident Report",
    url: "/incident-report",
    icon: AlertTriangle,
    hasNotification: true,
  },
]

// Second group - Dashboard items
const dashboardItems = [
  {
    title: "Director Dashboard",
    url: "/director-dashboard",
    icon: BarChart3,
  },
  {
    title: "Service Dashboard",
    url: "/dashboard",
    icon: Home,
  },
]

// Third group - Administrative items
const adminItems = [
  {
    title: "My Reports",
    url: "/my-reports",
    icon: FolderOpen,
    badgeCount: "12",
    badgeColor: "emerald",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
    badgeCount: "247",
    badgeColor: "blue",
  },
]

// Mock recent activity data
const recentActivity = [
  {
    id: "RS-2024-001",
    type: "Service",
    status: "completed",
    description: "Recovery completed successfully",
    time: "2 hrs ago",
    color: "emerald",
  },
  {
    id: "IN-2024-003",
    type: "Incident",
    status: "pending",
    description: "Awaiting director review",
    time: "5 hrs ago",
    color: "amber",
  },
  {
    id: "report-monthly",
    type: "Report Generated",
    status: "completed",
    description: "Monthly summary report",
    time: "1 day ago",
    color: "blue",
  },
]

export function AppSidebar() {
  const { signOut, user } = useAuth()
  const { customers } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [activityExpanded, setActivityExpanded] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      navigate("/auth")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Failed to sign out")
    }
  }

  const isActive = (url: string) => location.pathname === url

  return (
    <Sidebar className="bg-white/80 backdrop-blur-xl border-slate-200/60 shadow-sm">
      <SidebarHeader>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/45548bce-0301-4ed9-9bd7-a9ce7484458f.png" 
                alt="Point Recovery" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-semibold text-slate-900 tracking-tight">Recovery Point</div>
              <div className="text-sm text-slate-500">Management System</div>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4 space-y-1 overflow-y-auto">
        {/* Service Management */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 mb-6">
              {serviceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isActive(item.url) 
                        ? 'bg-gradient-to-r from-[#0077be] to-[#005a8f] text-white shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <a href={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                      {item.hasNotification && (
                        <div className="ml-auto w-2 h-2 bg-red-400 rounded-full"></div>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="border-t border-slate-200 my-6"></div>

        {/* Dashboard Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 mb-6">
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.url) 
                        ? 'bg-gradient-to-r from-[#0077be] to-[#005a8f] text-white shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <a href={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Divider */}
        <div className="border-t border-slate-200 my-6"></div>

        {/* Reports & Management */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 mb-6">
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.url) 
                        ? 'bg-gradient-to-r from-[#0077be] to-[#005a8f] text-white shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <a href={item.url} className="flex items-center gap-3 w-full">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                      {item.badgeCount && (
                        <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${
                          item.badgeColor === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                          item.badgeColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.title === 'Customers' ? customers.length : item.badgeCount}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Activity */}
        <div className="mb-6">
          <button 
            onClick={() => setActivityExpanded(!activityExpanded)}
            className="flex items-center gap-2 w-full px-4 py-2 text-slate-500 hover:text-slate-700 transition-colors mb-4"
          >
            <ChevronRight 
              className={`w-4 h-4 transition-transform duration-200 ${
                activityExpanded ? 'rotate-90' : 'rotate-0'
              }`} 
            />
            <span className="text-xs font-semibold uppercase tracking-wider">Recent Activity</span>
          </button>
          
          {activityExpanded && (
            <div className="space-y-3 animate-fade-in">
              {recentActivity.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className={`rounded-xl p-4 border ${
                    activity.color === 'emerald' ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/60' :
                    activity.color === 'amber' ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/60' :
                    'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.color === 'emerald' ? 'bg-emerald-500' :
                      activity.color === 'amber' ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`}></div>
                    <span className="font-medium text-slate-900 text-sm">
                      {activity.type} {activity.id !== 'report-monthly' ? `#${activity.id}` : ''}
                    </span>
                    <span className="ml-auto text-xs text-slate-500">{activity.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-5">{activity.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              className="sidebar-item flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
