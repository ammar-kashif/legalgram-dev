import { useState, memo, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock testimonial data
const testimonials = [
  {
    text: "Legal Gram made it easy to create the legal documents I needed for my business. Their customer service team was also very helpful when I had questions.",
    author: "Jennifer M.",
    position: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5
  },
  {
    text: "I needed to create my will but didn't want to spend thousands on an attorney. Legal Gram guided me through the process step by step. Highly recommend!",
    author: "Marcus T.",
    position: "Teacher",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5
  },
  {
    text: "The attorney advice I received through Legal Gram answered all my questions and saved me from making a costly mistake with my rental property.",
    author: "Sarah K.",
    position: "Property Owner",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5
  },
  {
    text: "Setting up my LLC was straightforward and affordable. The detailed instructions helped me understand each step of the process.",
    author: "David L.",
    position: "Entrepreneur",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4
  }
];

const TestimonialCard = memo(({ 
  testimonial, 
  isActive 
}: { 
  testimonial: typeof testimonials[0]; 
  isActive: boolean;
}) => {
  return (
    <div 
      className={`bg-white dark:bg-rocket-gray-800 p-8 rounded-xl shadow-lg border border-rocket-gray-200 dark:border-rocket-gray-700 transform transition-all duration-700 ${
        isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0 absolute'
      }`}
      style={{ display: isActive ? 'block' : 'none' }}
    >
      <Quote className="h-10 w-10 text-black mb-4 transform -scale-x-100" />
      
      <p className="text-lg text-black italic mb-6 leading-relaxed">
        "{testimonial.text}"
      </p>
      
      <div className="flex items-center gap-4">
        <img 
          src={testimonial.image} 
          alt={testimonial.author} 
          className="h-14 w-14 rounded-full object-cover border-2 border-black"
        />
        <div>
          <h4 className="font-semibold text-black">{testimonial.author}</h4>
          <p className="text-black text-sm">{testimonial.position}</p>
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                fill={i < testimonial.rating ? "currentColor" : "none"} 
                className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-500' : 'text-black'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 8000);
    
    return () => clearInterval(timer);
  }, [activeIndex, isAnimating]);

  return (
    <section className="py-16 md:py-24 bg-[#FDE1D3]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-black font-medium mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Trusted by Millions
          </h2>
          <p className="text-lg text-black max-w-3xl mx-auto">
            See what our customers have to say about their experience with Legal Gram.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto relative">
          <div className="relative min-h-[280px]">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index} 
                testimonial={testimonial} 
                isActive={index === activeIndex}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrev}
              className="border-rocket-gray-300 dark:border-rocket-gray-600 hover:bg-rocket-gray-100 dark:hover:bg-rocket-gray-700"
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex ? 'w-8 bg-rocket-blue-500' : 'w-2 bg-rocket-gray-300 dark:bg-rocket-gray-600'
                  }`}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setActiveIndex(index);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              className="border-rocket-gray-300 dark:border-rocket-gray-600 hover:bg-rocket-gray-100 dark:hover:bg-rocket-gray-700"
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} fill="currentColor" className="h-6 w-6 text-yellow-500 mx-0.5" />
            ))}
          </div>
          <p className="text-xl md:text-2xl font-medium text-black mb-8">
            Join over 20 million satisfied customers
          </p>
          <Button variant="orange" className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white">
            Get started today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default memo(Testimonials);
