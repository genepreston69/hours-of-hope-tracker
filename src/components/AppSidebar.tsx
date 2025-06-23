
import { Calendar, Home, Inbox, Search, Settings, Users, FileText, ClipboardList, BarChart3, AlertTriangle, LogOut, ChevronRight } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useNavigate } from "react-router-dom"
import { toast } from "@/components/ui/sonner"
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    submenu: [
      {
        title: "Director Dashboard",
        url: "/director-dashboard",
        icon: BarChart3,
      }
    ]
  },
  {
    title: "Service Entry",
    url: "/service-entry",
    icon: Calendar,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Recovery Survey",
    url: "/recovery-survey",
    icon: ClipboardList,
  },
  {
    title: "Incident Report",
    url: "/incident-report",
    icon: AlertTriangle,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
]

export function AppSidebar() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [openMenus, setOpenMenus] = useState<string[]>([])

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

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center px-2 py-2">
          <img 
            src="/lovable-uploads/f4dd29f5-c1ea-4bf3-88c3-f13573496fe7.png" 
            alt="Recovery Point Logo" 
            className="h-16 w-auto" 
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recovery Service Tracker</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <>
                      <SidebarMenuButton 
                        onClick={() => toggleMenu(item.title)}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${
                            openMenus.includes(item.title) ? 'rotate-90' : ''
                          }`}
                        />
                      </SidebarMenuButton>
                      {openMenus.includes(item.title) && (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                              <a href={item.url}>
                                <item.icon />
                                <span>Main Dashboard</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <subItem.icon />
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
