
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSlider = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  
  const slides = [
    {
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the plan that best fits your legal needs. All plans include access to our core features.",
      cta: "Get Started",
      image: "/lovable-uploads/7386c995-bf25-47e2-a3bb-095150b52e65.png"
    },
    {
      title: "Expert Legal Support",
      subtitle: "Professional legal advice and document review services tailored to your needs.",
      cta: "View Plans",
      image: "/lovable-uploads/1f8a96c9-355f-497b-920e-316d33ebd70f.png"
    },
    {
      title: "Comprehensive Coverage",
      subtitle: "From basic legal documents to full legal representation, we've got you covered.",
      cta: "Choose Your Plan",
      image: "/lovable-uploads/f496de89-a48d-4b46-9988-c8eceaf8c789.png"
    }
  ];

  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
    
    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="relative w-full h-[75vh] overflow-hidden pb-16">
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
                      <h1 className="text-5xl md:text-6xl font-bold text-white">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl text-white/90">
                        {slide.subtitle}
                      </p>
                      <Link to="/signup">
                        <Button 
                          size="lg"
                          className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white px-8 py-6 text-lg h-auto"
                        >
                          {slide.cta}
                          <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
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

export default PricingSlider;
