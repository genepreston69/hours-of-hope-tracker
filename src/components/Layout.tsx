
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`container mx-auto py-6 px-4 md:px-6 ${isMobile ? 'pt-20' : 'pt-24'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
