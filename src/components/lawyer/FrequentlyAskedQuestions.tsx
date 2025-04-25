
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How quickly can I connect with a lawyer?",
    answer: "For live chat, you can typically connect with a lawyer within 2-5 minutes during business hours. For video calls and phone consultations, you can schedule a time that works for you, with some slots available same-day."
  },
  {
    question: "What types of legal issues can I get help with?",
    answer: "Our network of lawyers covers a wide range of practice areas including family law, business law, real estate, intellectual property, estate planning, immigration, and more. During the initial intake, we'll match you with a lawyer specialized in your specific legal matter."
  },
  {
    question: "How are the lawyers vetted?",
    answer: "All lawyers on our platform are licensed attorneys who have passed our rigorous vetting process. We verify their credentials, years of experience, practice areas, and professional standing. We also collect and monitor client feedback to ensure quality service."
  },
  {
    question: "What if I need ongoing legal help?",
    answer: "If you need ongoing assistance, your consulting lawyer can discuss retainer options or package deals for continued representation. Many of our lawyers offer special rates for clients who found them through our platform."
  },
  {
    question: "Is my conversation with the lawyer confidential?",
    answer: "Yes, all communications with lawyers through our platform are protected by attorney-client privilege. Our technology uses end-to-end encryption for chats and video calls to ensure your information stays private and secure."
  },
  {
    question: "What if I'm not satisfied with the consultation?",
    answer: "We stand behind our service with a satisfaction guarantee. If you're not satisfied with your consultation, please contact our customer support team within 24 hours, and we'll provide a refund or arrange a consultation with a different lawyer."
  },
  {
    question: "Can I share documents with the lawyer during consultation?",
    answer: "Yes, our platform allows secure document sharing during chat and video consultations. For phone consultations, you can upload documents beforehand that the lawyer will review prior to your call."
  },
  {
    question: "Do you offer legal advice for international matters?",
    answer: "Yes, we have lawyers who specialize in international law and cross-border legal issues. Please specify your needs during the intake process so we can match you with an appropriate specialist."
  }
];

export default function FrequentlyAskedQuestions() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-rocket-gray-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-rocket-gray-600 dark:text-rocket-gray-300 max-w-3xl mx-auto">
          Find answers to common questions about our lawyer consultation services
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-rocket-gray-800 dark:text-white hover:text-rocket-blue-600 dark:hover:text-rocket-blue-300">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-rocket-gray-600 dark:text-rocket-gray-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="text-center mt-10">
        <p className="text-rocket-gray-600 dark:text-rocket-gray-300">
          Don't see your question? <a href="#contact-form" className="text-rocket-blue-600 dark:text-rocket-blue-300 hover:underline">Contact us</a> or call <span className="font-semibold">1-800-123-4567</span>
        </p>
      </div>
    </section>
  );
}
