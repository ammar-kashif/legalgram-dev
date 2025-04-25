
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ConfidenceSlider = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  
  const slides = [
    {
      title: "CONFIDENTLY LEGAL™",
      subtitle: "Affordable and simple legal services personalized for you and your business",
      cta: "Save with Rocket Legal+",
      image: "/lovable-uploads/697f8a63-6e9a-41a0-9995-812ce5ce9381.png"
    },
    {
      title: "LEGAL CONFIDENCE",
      subtitle: "Expert legal solutions tailored to your unique needs",
      cta: "Get Started Today",
      image: "/lovable-uploads/74a69ce1-a6bf-4425-b520-90e996d23567.png"
    },
    {
      title: "TRUSTED LEGAL PARTNER",
      subtitle: "Professional legal support when you need it most",
      cta: "Learn More",
      image: "/lovable-uploads/895c7048-27af-4849-a014-fb3c7e9d698c.png"
    }
  ];

  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Reduced from 5000ms to 3000ms for faster transitions
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative w-full h-[50vh] overflow-hidden pb-16">
      <Carousel setApi={setApi} className="h-full" opts={{ loop: true }}>
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-full w-full">
                <img 
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent">
                  <div className="container mx-auto h-full flex items-center">
                    <div className="max-w-2xl space-y-6 px-4">
                      <Badge 
                        variant="outline" 
                        className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                      >
                        Legal Solutions
                      </Badge>
                      <h1 className="text-5xl md:text-6xl font-bold text-white">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl text-white/90">
                        {slide.subtitle}
                      </p>
                      <div className="space-y-4">
                        <Button 
                          size="lg"
                          className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white px-8 py-6 text-lg h-auto"
                        >
                          {slide.cta}
                        </Button>
                        <p className="text-white/80 text-sm">
                          Trusted legal help at your fingertips
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current 
                ? "bg-white w-4" 
                : "bg-white/50"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default ConfidenceSlider;

