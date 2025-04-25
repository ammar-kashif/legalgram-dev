
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
      {/* Hero background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/7386c995-bf25-47e2-a3bb-095150b52e65.png"
          alt="Professional legal consultation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-bright-orange-500/90 via-bright-orange-400/80 to-soft-peach-50/90 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute -left-20 top-20 w-60 h-60 bg-soft-peach-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -right-20 bottom-20 w-60 h-60 bg-soft-peach-200/30 rounded-full blur-3xl animate-pulse delay-300" />
      <div className="absolute left-1/4 top-1/3 w-40 h-40 bg-soft-peach-200/30 rounded-full blur-2xl animate-pulse delay-200" />
      
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
            className="mt-6 text-xl text-black drop-shadow-lg"
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
              billingCycle === "monthly" ? "text-white" : "text-white/80 hover:text-white"
            )}>Monthly</span>
            
            <div className="relative">
              <div className={cn(
                "absolute -inset-3 rounded-lg bg-white/20 blur-lg transition-opacity duration-500 animate-pulse",
                billingCycle === "annually" ? "opacity-100" : "opacity-0"
              )} />
              <Switch
                checked={billingCycle === "annually"}
                onCheckedChange={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
                className="relative bg-white/20 data-[state=checked]:bg-white"
              />
            </div>
            
            <span className={cn(
              "text-lg font-semibold transition-colors duration-200",
              billingCycle === "annually" ? "text-white" : "text-white/80 hover:text-white"
            )}>Annual</span>
          </motion.div>

          {billingCycle === "annually" && (
            <motion.div 
              className="mt-8 inline-flex animate-float items-center rounded-full bg-white/10 backdrop-blur-md px-8 py-4 transition-all duration-500 hover:scale-105 shadow-lg border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkle className="mr-3 h-5 w-5 text-white animate-pulse" />
              <span className="relative font-semibold text-white">
                Save up to <span className="font-bold animate-pulse">33%</span> with annual billing
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingHero;
