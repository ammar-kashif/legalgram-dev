
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { memo } from "react";

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

  return (
    <NavigationMenu className="hidden md:flex max-w-none">
      <NavigationMenuList className={cn(
        "gap-8 px-6 py-2 rounded-full",
        scrolled ? "bg-white/5 backdrop-blur-md" : "bg-transparent"
      )}>
        {[
          { path: "/", label: "Home" },
          { path: "/start-a-business", label: "Start a Business" },
          { path: "/documents", label: "Make Documents" },
          { path: "/pricing", label: "Pricing" },
          { path: "/ask-legal-advice", label: "Ask Legal Advice" }
        ].map((item) => (
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
                <Link to={item.path}>{item.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </motion.div>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
});

NavLinks.displayName = 'NavLinks';

