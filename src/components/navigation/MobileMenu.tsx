
import { Button } from "@/components/ui/button";
import { MobileNavLink } from "./MobileNavLink";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { memo } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  isActive: (path: string) => boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export const MobileMenu = memo(({ 
  isOpen, 
  isAuthenticated, 
  isActive, 
  onToggle, 
  onLogout 
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      className="md:hidden bg-white border-t border-black/20 shadow-md"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="container-custom py-4 flex flex-col space-y-4">
        <MobileNavLink to="/" isActive={isActive("/")} onClick={onToggle}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/start-a-business" isActive={isActive("/start-a-business")} onClick={onToggle}>
          Start a Business
        </MobileNavLink>
        <MobileNavLink to="/documents" isActive={isActive("/documents")} onClick={onToggle}>
          Make Documents
        </MobileNavLink>
        <MobileNavLink to="/pricing" isActive={isActive("/pricing")} onClick={onToggle}>
          Pricing
        </MobileNavLink>
        <MobileNavLink 
          to="/ask-legal-advice" 
          isActive={isActive("/ask-legal-advice")} 
          onClick={onToggle}
        >
          Ask Legal Advice
        </MobileNavLink>
        <div className="flex flex-col space-y-2 pt-4 border-t border-black/20">
          {isAuthenticated ? (
            <>
              <Link to="/user-dashboard" onClick={onToggle} className="flex items-center space-x-2 text-bright-orange-500">
                <User size={18} />
                <span>Dashboard</span>
              </Link>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 border-red-400/30 hover:bg-red-400/10 hover:text-red-700"
                onClick={onLogout}
              >
                <LogOut size={18} className="mr-2" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={onToggle}>
                <Button variant="outline" className="w-full border-bright-orange-500 text-bright-orange-500 hover:bg-bright-orange-500 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" onClick={onToggle}>
                <Button className="w-full bg-bright-orange-500 text-white hover:bg-bright-orange-500/80">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.div>
  );
});

MobileMenu.displayName = 'MobileMenu';

