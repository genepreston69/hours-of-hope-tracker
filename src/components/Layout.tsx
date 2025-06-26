
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-stone-50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/60 bg-white/60 backdrop-blur-sm px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1" />
            </header>
            <main className="flex-1 overflow-auto">
              <div className={`container mx-auto py-6 px-4 md:px-6 ${isMobile ? 'pb-20' : ''}`}>
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
