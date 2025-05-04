
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "What's the main difference between an LLC and a Corporation?",
      answer: "An LLC offers flexible management and pass-through taxation, meaning profits go directly to owners without corporate tax. A Corporation is more structured, better for raising investment, and may be taxed at both corporate and personal levels (double taxation)."
    },
    {
      question: "How long does it take to officially start a business?",
      answer: "It usually takes anywhere from a few days to a few weeks, depending on your state's processing times and whether you file online or by mail. Using a filing service can speed up the process."
    },
    {
      question: "Are there any tax advantages to different business types?",
      answer: "Yes. LLCs and S-Corps can offer pass-through taxation, which avoids double tax. S-Corps may also reduce self-employment tax on some income. C-Corps, while subject to corporate tax, can deduct a wide range of business expenses."
    },
    {
      question: "Do I need to appoint a registered agent for my business?",
      answer: "Yes. Almost all states require a registered agent—a person or service that can receive legal and official documents on behalf of your business during business hours."
    },
    {
      question: "What's the best structure if I want investors or plan to go public?",
      answer: "A C-Corporation is typically the best choice. It allows you to issue multiple classes of stock, attract venture capital, and is the only structure suitable for going public."
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
