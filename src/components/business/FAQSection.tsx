
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "What's the difference between an LLC and a Corporation?",
      answer: "An LLC offers flexibility in management and taxation with less paperwork, while a Corporation provides a more structured environment better suited for raising capital and going public."
    },
    {
      question: "How long does it take to form a business?",
      answer: "Most businesses can be formed within 24-48 hours after submitting required information. Processing times may vary by state and business type."
    },
    {
      question: "What are the tax benefits of different business structures?",
      answer: "LLCs offer pass-through taxation, Corporations can optimize tax through salaries and dividends, and S-Corps may reduce self-employment tax. Each structure has unique advantages."
    },
    {
      question: "Do I need a registered agent?",
      answer: "Yes, all formal business entities are required to have a registered agent in their state of formation to receive legal documents and official correspondence."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
