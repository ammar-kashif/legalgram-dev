
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface MobileNavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export const MobileNavLink = memo(({ to, children, isActive, onClick }: MobileNavLinkProps) => {
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

