import React from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Sparkle, Wand, Stars } from "lucide-react";
import { motion } from "framer-motion";

interface PricingHeroProps {
  billingCycle: "monthly" | "annually";
  setBillingCycle: (billingCycle: "monthly" | "annually") => void;
}

const PricingHero = ({ billingCycle, setBillingCycle }: PricingHeroProps) => {
  return (
    <div className="relative min-h-[80vh] overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/32617276-d4d0-4419-bffd-02f96a981caf.png"
          alt="Legal office at night"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      <div className="absolute -left-20 top-20 w-60 h-60 bg-deep-blue-900/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -right-20 bottom-20 w-60 h-60 bg-deep-blue-900/30 rounded-full blur-3xl animate-pulse delay-300" />
      <div className="absolute left-1/4 top-1/3 w-40 h-40 bg-deep-blue-900/30 rounded-full blur-2xl animate-pulse delay-200" />
      
      <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-4xl text-center relative backdrop-blur-sm p-8 rounded-3xl">
          <motion.div 
            className="mb-8 flex justify-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Wand className="h-12 w-12 text-white animate-bounce-slow" />
            <Stars className="h-12 w-12 text-white/90 animate-bounce-slow delay-200" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Simple, Transparent Pricing
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-xl text-white/90 font-medium drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Choose the plan that best fits your legal needs. All plans include access to our core features.
          </motion.p>

          <motion.div 
            className="mt-10 flex items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className={cn(
              "text-lg font-semibold transition-colors duration-200",
              billingCycle === "monthly" 
                ? "text-bright-orange-400" 
                : "text-white/80 hover:text-white"
            )}>Monthly</span>
            
            <div className="relative">
              <div className={cn(
                "absolute -inset-3 rounded-lg bg-bright-orange-500/30 blur-lg transition-opacity duration-500",
                billingCycle === "annually" ? "opacity-100" : "opacity-0"
              )} />
              <Switch
                checked={billingCycle === "annually"}
                onCheckedChange={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
                className="relative data-[state=checked]:bg-bright-orange-500 data-[state=unchecked]:bg-white/30"
              />
            </div>
            
            <span className={cn(
              "text-lg font-semibold transition-colors duration-200",
              billingCycle === "annually" 
                ? "text-bright-orange-400" 
                : "text-white/80 hover:text-white"
            )}>Annual</span>
          </motion.div>

          {billingCycle === "annually" && (
            <motion.div 
              className="mt-8 inline-flex animate-float items-center rounded-full bg-bright-orange-500/20 backdrop-blur-md px-8 py-4 transition-all duration-500 hover:scale-105 shadow-lg border border-bright-orange-400/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkle className="mr-3 h-5 w-5 text-bright-orange-400 animate-pulse" />
              <span className="relative font-semibold text-white">
                Save up to <span className="font-bold text-bright-orange-400 animate-pulse">33%</span> with annual billing
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingHero;
