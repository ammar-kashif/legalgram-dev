
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl font-bold mb-4">Simple, Affordable Legal Solutions</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            We make legal matters easy to understand and manage through our streamlined process.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="relative">
                <FileText className="w-8 h-8 text-orange-500" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                  1
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Select Your Document</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose from hundreds of legal documents designed for personal and business needs.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="relative">
                <CheckCircle className="w-8 h-8 text-orange-500" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                  2
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customize It</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Answer simple questions to create your personalized legal document.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="relative">
                <FileText className="w-8 h-8 text-orange-500" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                  3
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sign & Share</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Save, print, download, or share your legal document instantly.
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Button className="bg-orange-500 hover:bg-orange-600 group">
            Learn more about our process
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
