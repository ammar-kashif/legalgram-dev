import { useState, useEffect, memo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const NavLink = memo(({ 
  to, 
  children, 
  isActive
}: { 
  to: string; 
  children: React.ReactNode; 
  isActive: boolean;
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "font-medium transition-colors relative group drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]",
        isActive 
          ? "text-black font-semibold" 
          : "text-black/90 hover:text-black"
      )}
    >
      {children}
      <span className={cn(
        "absolute bottom-[-4px] left-0 w-full h-0.5 bg-bright-orange-500 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
        isActive ? "scale-x-100" : ""
      )}></span>
    </Link>
  );
});

NavLink.displayName = 'NavLink';

const MobileNavLink = memo(({ 
  to, 
  children, 
  isActive, 
  onClick 
}: { 
  to: string; 
  children: React.ReactNode; 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "font-medium transition-colors",
        isActive 
          ? "text-black font-semibold" 
          : "text-black/90 hover:text-black"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
});

MobileNavLink.displayName = 'MobileNavLink';

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
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
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

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
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

        <NavigationMenu className="hidden md:flex max-w-none">
          <NavigationMenuList className={cn(
            "gap-8 px-6 py-2 rounded-full",
            scrolled ? "bg-white/5 backdrop-blur-md" : "bg-transparent"
          )}>
            <motion.div variants={navItemVariants}>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={cn(
                    "font-medium transition-all duration-300 relative group px-4 py-2 rounded-full",
                    isActive("/") 
                      ? "text-bright-orange-500" 
                      : "text-bright-orange-500/90 hover:text-bright-orange-500"
                  )}
                  asChild
                >
                  <Link to="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </motion.div>
            
            <motion.div variants={navItemVariants}>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={cn(
                    "font-medium transition-all duration-300 relative group px-4 py-2 rounded-full",
                    isActive("/start-a-business") 
                      ? "text-bright-orange-500" 
                      : "text-bright-orange-500/90 hover:text-bright-orange-500"
                  )}
                  asChild
                >
                  <Link to="/start-a-business">Start a Business</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </motion.div>
            
            <motion.div variants={navItemVariants}>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={cn(
                    "font-medium transition-all duration-300 relative group px-4 py-2 rounded-full",
                    isActive("/documents") 
                      ? "text-bright-orange-500" 
                      : "text-bright-orange-500/90 hover:text-bright-orange-500"
                  )}
                  asChild
                >
                  <Link to="/documents">Make Documents</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </motion.div>
            
            <motion.div variants={navItemVariants}>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={cn(
                    "font-medium transition-all duration-300 relative group px-4 py-2 rounded-full",
                    isActive("/pricing") 
                      ? "text-bright-orange-500" 
                      : "text-bright-orange-500/90 hover:text-bright-orange-500"
                  )}
                  asChild
                >
                  <Link to="/pricing">Pricing</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </motion.div>
            
            <motion.div variants={navItemVariants}>
              <NavigationMenuItem>
                <NavigationMenuLink 
                  className={cn(
                    "font-medium transition-all duration-300 relative group px-4 py-2 rounded-full",
                    isActive("/ask-legal-advice") 
                      ? "text-bright-orange-500" 
                      : "text-bright-orange-500/90 hover:text-bright-orange-500"
                  )}
                  asChild
                >
                  <Link to="/ask-legal-advice">Ask Legal Advice</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </motion.div>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <motion.div variants={navItemVariants}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "rounded-full w-10 h-10 p-0 transition-all duration-300",
                      scrolled 
                        ? "bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    )}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-bright-orange-500 text-white">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 mt-2 bg-white/10 backdrop-blur-md border border-white/10"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-bright-orange-500">
                      {userName}
                    </p>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer text-bright-orange-500 hover:bg-white/10">
                    <Link to="/user-dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 hover:bg-red-500/10 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ) : (
            <>
              <motion.div variants={navItemVariants}>
                <Link to="/login">
                  <Button variant="outline" 
                    className={cn(
                      "border-bright-orange-500/20 text-bright-orange-500 transition-all duration-300",
                      scrolled
                        ? "hover:bg-white/10 backdrop-blur-md"
                        : "hover:bg-white/5"
                    )}
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants}>
                <Link to="/signup">
                  <Button 
                    className={cn(
                      "text-white transition-all duration-300",
                      scrolled
                        ? "bg-bright-orange-500/90 hover:bg-bright-orange-500/80"
                        : "bg-bright-orange-500/80 hover:bg-bright-orange-500/70"
                    )}
                  >
                    Sign Up
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
        </div>

        <motion.div variants={navItemVariants} className="md:hidden flex items-center">
          <button 
            className="text-bright-orange-500" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>
      </div>

      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-white border-t border-black/20 shadow-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="container-custom py-4 flex flex-col space-y-4">
            <MobileNavLink to="/" isActive={isActive("/")} onClick={toggleMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/start-a-business" isActive={isActive("/start-a-business")} onClick={toggleMenu}>
              Start a Business
            </MobileNavLink>
            <MobileNavLink to="/documents" isActive={isActive("/documents")} onClick={toggleMenu}>
              Make Documents
            </MobileNavLink>
            <MobileNavLink to="/pricing" isActive={isActive("/pricing")} onClick={toggleMenu}>
              Pricing
            </MobileNavLink>
            <MobileNavLink 
              to="/ask-legal-advice" 
              isActive={isActive("/ask-legal-advice")} 
              onClick={toggleMenu}
            >
              Ask Legal Advice
            </MobileNavLink>
            <div className="flex flex-col space-y-2 pt-4 border-t border-black/20">
              {isAuthenticated ? (
                <>
                  <Link to="/user-dashboard" onClick={toggleMenu} className="flex items-center space-x-2 text-bright-orange-500">
                    <User size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 border-red-400/30 hover:bg-red-400/10 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} className="mr-2" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full border-bright-orange-500 text-bright-orange-500 hover:bg-bright-orange-500 hover:text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={toggleMenu}>
                    <Button className="w-full bg-bright-orange-500 text-white hover:bg-bright-orange-500/80">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default memo(Header);
