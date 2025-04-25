
import React from 'react';
import HeroBackgroundSlideshow from './HeroBackgroundSlideshow';

const ConfidenceSlider = () => {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden">
      <HeroBackgroundSlideshow />
      
      <div className="absolute inset-0 z-10 flex items-center justify-start">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-[-5vh]">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 text-sm bg-black/20 text-white rounded-full backdrop-blur-sm mb-6">
              Legal Solutions
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              CONFIDENTLY LEGAL™
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
              Affordable and simple legal services personalized for you and your business
            </p>
            
            <button className="bg-bright-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-bright-orange-600 transition-colors">
              Save with Rocket Legal+
            </button>
            
            <p className="text-sm text-white/80 mt-6">
              Trusted legal help at your fingertips
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfidenceSlider;
