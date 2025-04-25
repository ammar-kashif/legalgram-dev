
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}

export const NavLink = memo(({ to, children, isActive }: NavLinkProps) => {
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

