
import { ReactNode, memo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "../chat/ChatWidget";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = memo(({ children }: LayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  
  // Check if the current route is the dashboard
  const isDashboard = location.pathname.includes("/dashboard");
  const isDocumentsPage = location.pathname === "/documents";

  useEffect(() => {
    setMounted(true);
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Fix for mobile height issues - set a min-height based on viewport
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
      window.removeEventListener('resize', setVh);
    };
  }, []);

  return (
    <div className={cn(
      `flex flex-col min-h-screen w-full transition-colors duration-500`,
      // Use the custom viewport height unit for mobile
      "h-[calc(var(--vh,1vh)*100)]",
      mounted ? 'animate-fade-in' : 'opacity-0',
      isDocumentsPage ? 'bg-gray-50' : 'bg-clean-white'
    )}>
      {!isDashboard && <Header />}
      <main className="flex-grow w-full transition-all duration-300 text-deep-blue">
        {children}
      </main>
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <Footer />
      </div>
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
