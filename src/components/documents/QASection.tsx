
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const QASection = () => {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Interactive Q&A Preview */}
          <div className="relative">
            <Card className="bg-blue-50/50 border-none shadow-xl transform -rotate-1">
              <CardContent className="p-6">
                <div className="bg-white rounded-lg p-4 shadow-md mb-4">
                  <span className="text-sm text-gray-500">Legal Question</span>
                  <p className="text-lg font-medium mt-1">How can I get a divorce if I live in a different state from my spouse?</p>
                </div>

                {/* First lawyer response */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <img
                        src="/lovable-uploads/b3918aee-3ecc-49eb-8a78-b7ee8bef850b.png"
                        alt="Lawyer avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">David Marks</h4>
                      <span className="text-sm text-gray-500">Divorce Lawyer</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Each state has different residency requirements, so it is important to...
                    </p>
                  </div>
                </div>

                {/* Second lawyer response */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <img
                        src="/lovable-uploads/b3918aee-3ecc-49eb-8a78-b7ee8bef850b.png"
                        alt="Lawyer avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Lucy Owens</h4>
                      <span className="text-sm text-gray-500">Divorce Lawyer</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      If you have children together, you will need...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-center w-full">
              <p className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full inline-block shadow-md">
                Every 5 seconds someone gets free legal help on our platform
              </p>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="relative">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Got Legal Questions?
                <span className="block mt-2">We Have Answers!</span>
              </h2>
              
              <p className="text-lg text-gray-600">
                Lawyers across the country have answered over 17 million user questions. Get answers today in our Q&A forum.
              </p>

              <div className="space-y-8 mt-8">
                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="text-bright-orange-500">1.</span> Ask a Question – It's Free
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Post your legal question anonymously, and experienced lawyers will respond within hours.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="text-bright-orange-500">2.</span> Browse Our Library of Existing Q&As
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Find answers to previously asked questions from people experiencing similar legal issues.
                  </p>
                </div>

                <Link to="/ask-lawyer">
                  <Button size="lg" className="bg-[#0077CC] hover:bg-[#0066B2] text-white px-8">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Ask a Question
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QASection;
