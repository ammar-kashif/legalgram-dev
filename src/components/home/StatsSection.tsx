import { memo, useState, useEffect, useRef } from "react";
import { Users, FileText, MessageSquare, Clock } from "lucide-react";

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const startTime = performance.now();
    let animationFrame: number;
    
    const updateCount = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      countRef.current = Math.floor(progress * end);
      setCount(countRef.current);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);
  
  return { count, elementRef };
};

const StatsSection = () => {
  const stats = [
    { 
      icon: Users, 
      value: 20, 
      suffix: "M+", 
      label: "Customers", 
      description: "People who trust our services"
    },
    { 
      icon: FileText, 
      value: 10, 
      suffix: "M+", 
      label: "Documents", 
      description: "Legal documents created" 
    },
    { 
      icon: MessageSquare, 
      value: 500, 
      suffix: "K+", 
      label: "Consultations", 
      description: "Legal advice sessions provided" 
    },
    { 
      icon: Clock, 
      value: 15, 
      suffix: "+", 
      label: "Years", 
      description: "Of legal service experience" 
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-primary to-rocket-blue-800 text-black relative overflow-hidden">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHptMC0zMGMwLTIuMi0xLjgtNC00LTRzLTQgMS44LTQgNCAxLjggNCA0IDQgNC0xLjggNC00em0wIDYwYzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>
      
      {/* Animated light beam effects */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-bright-orange-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-bright-orange-300/20 rounded-full blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block bg-white/10 backdrop-blur-sm text-black font-medium px-4 py-1 rounded-full text-sm mb-3">Our Impact</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black">
            Trusted by Millions Nationwide
          </h2>
          <p className="text-lg text-black/80 max-w-3xl mx-auto">
            Our track record speaks for itself - millions of satisfied customers and counting.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const { count, elementRef } = useCountUp(stat.value, 2000 + (index * 200));
            
            return (
              <div 
                key={index} 
                ref={elementRef}
                className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mx-auto bg-gradient-to-br from-bright-orange-400 to-bright-orange-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-bright-orange-500/20">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-2 text-black">
                  {count}{stat.suffix}
                </h3>
                <p className="text-xl font-medium mb-2 text-black">{stat.label}</p>
                <p className="text-sm text-black/70">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(StatsSection);
