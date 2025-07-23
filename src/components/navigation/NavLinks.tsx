import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NavLinksProps {
  scrolled: boolean;
  isActive: (path: string) => boolean;
}

export const NavLinks = memo(({ scrolled, isActive }: NavLinksProps) => {
  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  const navigate = useNavigate();

  const handleProtectedNavigation = (path: string) => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate(path);
      } else {
        navigate("/login");
      }
    });
  };

  const navItems = [
    { path: "/", label: "Home", protected: false },
    { path: "/start-a-business", label: "Start a Business", protected: false },
    { path: "/documents", label: "Make Documents", protected: false },
    { path: "/pricing", label: "Pricing", protected: false },
    { path: "/ask-legal-advice", label: "Ask Legal Advice", protected: false}
  ];

  return (
    <NavigationMenu className="hidden md:flex max-w-none">
      <NavigationMenuList className={cn(
        "gap-8 px-6 py-2 rounded-full",
        scrolled ? "bg-white/5 backdrop-blur-md" : "bg-transparent"
      )}>
        {navItems.map((item) => (
          <motion.div key={item.path} variants={navItemVariants}>
            <NavigationMenuItem>
              <NavigationMenuLink 
                className={cn(
                  "font-medium transition-all duration-300 relative group px-4 py-2 rounded-full",
                  isActive(item.path) 
                    ? "text-bright-orange-500" 
                    : "text-bright-orange-500/90 hover:text-bright-orange-500"
                )}
                asChild
              >
                {item.protected ? (
                  <button
                    type="button"
                    className={cn(
                      "bg-transparent border-none outline-none p-0 m-0 font-inherit text-bright-orange-500 transition-colors duration-300 hover:text-bright-orange-600",
                      isActive(item.path)
                        ? "text-bright-orange-500"
                        : "text-bright-orange-500/90 hover:text-bright-orange-500"
                    )}
                    onClick={() => handleProtectedNavigation(item.path)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link to={item.path}>{item.label}</Link>
                )}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </motion.div>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
});

NavLinks.displayName = 'NavLinks';

