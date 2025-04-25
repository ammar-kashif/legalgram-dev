
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface AuthButtonsProps {
  scrolled: boolean;
}

export const AuthButtons = memo(({ scrolled }: AuthButtonsProps) => {
  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
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
  );
});

AuthButtons.displayName = 'AuthButtons';

