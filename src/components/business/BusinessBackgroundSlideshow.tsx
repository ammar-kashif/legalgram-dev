
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const BusinessBackgroundSlideshow = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  
  const images = [
    "/lovable-uploads/4f33a491-e7a5-4fa5-8cf6-003a30fd6666.png",
    "/lovable-uploads/bb418390-6c76-41ac-8973-029e9e6242a6.png",
    "/lovable-uploads/70c33eef-2fc4-4b55-9135-15fba418fff8.png",
    "/lovable-uploads/5ee6561b-7745-480d-a253-de66f747d0a5.png"
  ];

  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="absolute inset-0 z-0">
      <Carousel setApi={setApi} className="h-full w-full" opts={{ loop: true }}>
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-full w-full transition-all duration-700 transform">
                <img 
                  src={image}
                  alt={`Business presentation ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out transform scale-105 hover:scale-100 blur-[4px] hover:blur-[3px]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-rocket-blue-900/70 to-rocket-blue-600/70 transition-opacity duration-700 ease-in-out backdrop-blur-lg"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default BusinessBackgroundSlideshow;

