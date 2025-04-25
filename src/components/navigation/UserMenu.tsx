
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface UserMenuProps {
  userName: string;
  userInitial: string;
  scrolled: boolean;
}

export const UserMenu = memo(({ userName, userInitial, scrolled }: UserMenuProps) => {
  const navigate = useNavigate();

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

  return (
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
  );
});

UserMenu.displayName = 'UserMenu';

