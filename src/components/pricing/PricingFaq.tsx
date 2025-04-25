
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface FaqItem {
  question: string;
  answer: string;
}

const PricingFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqItems: FaqItem[] = [
    {
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade, downgrade or cancel your plan at any time. When you upgrade, you'll immediately gain access to all the new features. If you downgrade or cancel, you'll continue to have access to your current plan until the end of your billing period."
    },
    {
      question: "Is there a refund policy?",
      answer: "We offer a 7-day money-back guarantee for all new subscribers. If you're not satisfied with our service, you can request a full refund within the first week of your subscription."
    },
    {
      question: "How does the \"Ask a Lawyer\" feature work?",
      answer: "The \"Ask a Lawyer\" feature allows you to chat with a qualified attorney through our platform. Depending on your plan, you'll have a set amount of consultation time per month. You can use this time to ask legal questions, get document reviews, or receive general legal guidance."
    },
    {
      question: "What happens when my document credits run out?",
      answer: "If you use all your monthly document credits, you can purchase additional credits or wait until your next billing cycle when your credits will refresh. We'll always notify you before you run out of credits."
    },
    {
      question: "Can I share my account with others?",
      answer: "Personal plans are intended for individual use only. For teams or businesses, we offer specialized Business plans that allow multiple users and centralized billing. Please contact our sales team for more information."
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-[#fff6eb] to-[#fef1de] py-16">
      <div className="container mx-auto px-4 relative overflow-hidden">
        <div className="absolute -left-20 top-20 w-60 h-60 bg-bright-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -right-20 bottom-20 w-60 h-60 bg-bright-orange-500/5 rounded-full blur-3xl animate-pulse delay-300" />

        <motion.div 
          className="text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-bright-orange-700 via-bright-orange-600 to-bright-orange-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-bright-orange-600">
            Get answers to common questions about our membership plans
          </p>
        </motion.div>

        <div className="mt-12 space-y-4 text-left max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full px-6 py-4 flex justify-between items-center text-left"
                onClick={() => toggleQuestion(index)}
              >
                <h3 className="text-xl font-semibold text-bright-orange-700">
                  {item.question}
                </h3>
                {openIndex === index ? (
                  <MinusCircle className="h-5 w-5 text-bright-orange-500 flex-shrink-0 transition-transform" />
                ) : (
                  <PlusCircle className="h-5 w-5 text-bright-orange-500 flex-shrink-0 transition-transform" />
                )}
              </button>
              
              <div className={`px-6 overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 pb-6" : "max-h-0"
              }`}>
                <p className="text-bright-orange-600">{item.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-12 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link to="/contact">
            <Button variant="orange" size="lg" className="min-w-[200px] text-white shadow-lg hover:scale-105 transition-transform bg-gradient-to-r from-bright-orange-500 to-bright-orange-600 hover:from-bright-orange-600 hover:to-bright-orange-700">
              Contact Support
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingFaq;
