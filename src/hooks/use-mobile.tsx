
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Log for debugging
    console.info("Mobile status:", window.innerWidth < MOBILE_BREAKPOINT)
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return !!isMobile
}
