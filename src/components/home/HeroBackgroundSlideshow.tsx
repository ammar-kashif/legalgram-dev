
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const HeroBackgroundSlideshow = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const isMobile = useIsMobile();
  
  const images = [
    "/lovable-uploads/697f8a63-6e9a-41a0-9995-812ce5ce9381.png",
    "/lovable-uploads/74a69ce1-a6bf-4425-b520-90e996d23567.png",
    "/lovable-uploads/895c7048-27af-4849-a014-fb3c7e9d698c.png",
    "/lovable-uploads/8eb9991b-1c75-4153-bbc1-83cbb5662538.png",
    "/lovable-uploads/cbdc3394-18f6-4530-a367-764e9851d995.png",
    "/lovable-uploads/f5b383f8-da64-467e-904b-2578ce595c8a.png",
    "/lovable-uploads/da854a04-d4c5-4d08-90c5-64874c1fd0e9.png"
  ];

  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [api]);

  // Added console log for debugging
  useEffect(() => {
    console.log("Images array:", images);
    console.log("Mobile status:", isMobile);
  }, [images, isMobile]);

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
      <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="h-full w-full">
              <div className="h-full w-full relative">
                <img 
                  src={image}
                  alt={`Legal background ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Error loading image: ${image}`);
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = "/placeholder.svg"; // Fallback to placeholder
                  }}
                />
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br transition-opacity duration-700 ease-in-out",
                  isMobile ? "from-black/80 to-black/60 backdrop-blur-[2px]" : "from-rocket-blue-600/40 to-rocket-blue-900/40 backdrop-blur-sm"
                )}></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HeroBackgroundSlideshow;
