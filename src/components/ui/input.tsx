
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-black ring-offset-background transition-all duration-150",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-black/60 placeholder:font-medium", // Updated placeholder color to black
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rocket-blue-300 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 hover:border-rocket-blue-300",
          "md:text-sm text-foreground dark:text-black",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

