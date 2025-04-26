
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const HeroBackgroundSlideshow = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  
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
    
    console.log("Carousel API loaded:", api);
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="absolute inset-0 z-0 min-h-[90vh]">
      <Carousel setApi={setApi} className="h-full w-full" opts={{ loop: true }}>
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-[90vh] w-full transition-all duration-700 transform">
                <img 
                  src={image}
                  alt={`Legal background ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out transform scale-105 hover:scale-100 blur-[2px] hover:blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-rocket-blue-600/30 to-rocket-blue-900/30 transition-opacity duration-700 ease-in-out backdrop-blur-sm"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current 
                ? "w-6 bg-bright-orange-500" 
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBackgroundSlideshow;
