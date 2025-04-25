
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Scale, Gavel, StarIcon } from 'lucide-react';

const PricingShowcase = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-bright-orange-500" />,
      title: "Expert Legal Consultation",
      description: "Get personalized advice from experienced attorneys",
      image: "/lovable-uploads/1f8a96c9-355f-497b-920e-316d33ebd70f.png"
    },
    {
      icon: <Users className="w-12 h-12 text-bright-orange-500" />,
      title: "Professional Document Review",
      description: "Have your legal documents reviewed by experts",
      image: "/lovable-uploads/a15560ff-00a1-40c0-a5de-5cafe5b99ddf.png"
    },
    {
      icon: <StarIcon className="w-12 h-12 text-bright-orange-500" />,
      title: "Personalized Legal Advice",
      description: "Tailored solutions for your specific needs",
      image: "/lovable-uploads/f496de89-a48d-4b46-9988-c8eceaf8c789.png"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-soft-peach-50 py-20">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-bright-orange-700 to-bright-orange-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Choose Our Legal Services?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="relative rounded-2xl overflow-hidden h-[400px] shadow-xl group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <img 
                src={feature.image}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bright-orange-50 text-bright-orange-700">
            <StarIcon className="w-5 h-5" />
            <span className="font-semibold">Trusted by thousands of clients nationwide</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingShowcase;
