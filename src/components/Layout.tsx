
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`container mx-auto py-6 px-4 md:px-6 ${isMobile ? 'pt-24' : 'pt-28'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
