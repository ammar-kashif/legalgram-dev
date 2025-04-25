
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Check, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PlanFeature {
  name: string;
  included: boolean;
  info?: string;
}

interface Plan {
  name: string;
  price: {
    monthly: number;
    annually: number;
  };
  description: string;
  features: PlanFeature[];
  callToAction: string;
  popular?: boolean;
  icon: React.ReactNode;
}

interface PricingCardProps {
  plan: Plan;
  billingCycle: "monthly" | "annually";
  savings: {
    amount: number;
    percentage: number;
  };
}

const PricingCard = ({ plan, billingCycle, savings }: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={cn(
          "relative rounded-2xl transition-all duration-300 h-full flex flex-col hover:shadow-2xl group",
          plan.popular
            ? "bg-gradient-to-br from-bright-orange-50 to-white shadow-[0_8px_40px_-12px_rgba(241,143,1,0.4)] ring-2 ring-bright-orange-500 lg:scale-105"
            : "bg-white shadow-xl hover:bg-gradient-to-br hover:from-bright-orange-50/50 hover:to-white"
        )}
      >
        {plan.popular && (
          <div className="absolute -top-5 left-0 right-0 mx-auto w-36 rounded-full bg-gradient-to-r from-bright-orange-500 to-bright-orange-600 py-2 text-center text-sm font-semibold text-white shadow-lg">
            Most Popular
          </div>
        )}

        <div className="p-8 flex flex-col flex-grow">
          <div className="flex items-center gap-4 mb-6">
            {plan.icon}
            <div>
              <h3 className="text-2xl font-bold text-bright-orange-700">{plan.name}</h3>
              <p className="text-bright-orange-600/80">{plan.description}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline text-bright-orange-700">
              <span className="text-5xl font-bold tracking-tight">
                ${plan.price[billingCycle]}
              </span>
              <span className="ml-2 text-bright-orange-500">/month</span>
            </div>

            {billingCycle === "annually" && plan.price.annually > 0 && (
              <p className="mt-2 text-sm text-bright-orange-600">
                Save ${savings.amount.toFixed(2)} per year ({savings.percentage}%)
              </p>
            )}
          </div>

          <Link to="/signup" className="block mb-8">
            <Button
              className={cn(
                "w-full text-base font-semibold py-6 transition-all duration-300",
                plan.popular
                  ? "bg-gradient-to-r from-bright-orange-500 to-bright-orange-600 hover:from-bright-orange-600 hover:to-bright-orange-700 text-white shadow-lg"
                  : "bg-bright-orange-50 hover:bg-bright-orange-100 text-bright-orange-700"
              )}
            >
              {plan.callToAction}
            </Button>
          </Link>

          <ul className="space-y-4 text-left flex-grow">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                {feature.included ? (
                  <Check className="h-5 w-5 text-bright-orange-500 mt-0.5 shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-gray-300 mt-0.5 shrink-0" />
                )}
                <span className="ml-3 text-bright-orange-600">
                  {feature.name}
                  {feature.info && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="ml-1">
                            <HelpCircle className="inline h-4 w-4 text-bright-orange-400" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm max-w-xs">{feature.info}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.div>
  );
};

export default PricingCard;
