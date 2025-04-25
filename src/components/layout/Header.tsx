
import { useState, useEffect, memo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { NavLinks } from "../navigation/NavLinks";
import { UserMenu } from "../navigation/UserMenu";
import { AuthButtons } from "../navigation/AuthButtons";
import { MobileMenu } from "../navigation/MobileMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userInitial, setUserInitial] = useState("");
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        const email = data.session.user.email || "";
        setUserName(email.split('@')[0] || "User");
        setUserInitial((email.charAt(0) || "U").toUpperCase());
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setIsAuthenticated(true);
          const email = session.user.email || "";
          setUserName(email.split('@')[0] || "User");
          setUserInitial((email.charAt(0) || "U").toUpperCase());
        } else {
          setIsAuthenticated(false);
        }
      }
    );

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navBarVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/15 backdrop-blur-xl border-b border-white/20 shadow-lg"
          : "bg-transparent backdrop-blur-lg"
      )}
      initial="initial"
      animate="animate"
      variants={navBarVariants}
    >
      <div className="container-custom py-4 flex items-center justify-between">
        <motion.div variants={logoVariants}>
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/a17fd11f-8e26-4052-9951-f94d83efbea4.png" 
                alt="Legalgram Logo" 
                className="w-10 h-10 rounded-full shadow-md transition-transform hover:scale-105 duration-300"
              />
              <span className="text-xl font-bold text-bright-orange-500">
                Legalgram
              </span>
            </div>
          </Link>
        </motion.div>

        <NavLinks scrolled={scrolled} isActive={isActive} />

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <motion.div variants={logoVariants}>
              <UserMenu 
                userName={userName} 
                userInitial={userInitial} 
                scrolled={scrolled} 
              />
            </motion.div>
          ) : (
            <AuthButtons scrolled={scrolled} />
          )}
        </div>

        <motion.div variants={logoVariants} className="md:hidden flex items-center">
          <button 
            className="text-bright-orange-500" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        isActive={isActive}
        onToggle={toggleMenu}
        onLogout={handleLogout}
      />
    </motion.header>
  );
};

export default memo(Header);

