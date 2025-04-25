
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageSquare, ChevronRight, Send, ShieldCheck, GraduationCap, Scale, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Advice = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container-custom">
        {/* Hero Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-rocket-gray-900 dark:text-white mb-6">
              Get Expert <span className="text-gradient-blue">Legal Advice</span>
            </h1>
            <p className="text-lg md:text-xl text-rocket-gray-600 dark:text-rocket-gray-300 mb-8">
              Navigate complex legal matters with confidence. Our network of qualified attorneys provides personalized guidance for your unique situation.
            </p>
            <div className="flex justify-center">
              <Link to="/signup">
                <Button 
                  size="lg"
                  className="bg-rocket-blue hover:bg-rocket-blue-600"
                >
                  Sign Up for Immediate Assistance
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 bg-rocket-gray-50 dark:bg-rocket-gray-800 rounded-xl mb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits of Professional Legal Advice</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-rocket-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center text-center animate-hover-float">
                <div className="bg-rocket-blue-50 dark:bg-rocket-blue-900/30 p-4 rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-rocket-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Protection of Rights</h3>
                <p className="text-rocket-gray-600 dark:text-rocket-gray-300 mb-6">
                  Ensure your legal rights are protected with expert guidance tailored to your specific situation.
                </p>
                <Link to="/signup" className="mt-auto">
                  <Button variant="outline" className="border-rocket-blue text-rocket-blue hover:bg-rocket-blue-50">
                    Get Protected
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white dark:bg-rocket-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center text-center animate-hover-float">
                <div className="bg-rocket-blue-50 dark:bg-rocket-blue-900/30 p-4 rounded-full mb-4">
                  <Scale className="h-8 w-8 text-rocket-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Risk Mitigation</h3>
                <p className="text-rocket-gray-600 dark:text-rocket-gray-300 mb-6">
                  Identify potential legal pitfalls before they become problems and develop strategies to minimize risk.
                </p>
                <Link to="/signup" className="mt-auto">
                  <Button variant="outline" className="border-rocket-blue text-rocket-blue hover:bg-rocket-blue-50">
                    Reduce Risks
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white dark:bg-rocket-gray-700 p-6 rounded-lg shadow-md flex flex-col items-center text-center animate-hover-float">
                <div className="bg-rocket-blue-50 dark:bg-rocket-blue-900/30 p-4 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-rocket-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Time & Cost Savings</h3>
                <p className="text-rocket-gray-600 dark:text-rocket-gray-300 mb-6">
                  Resolve legal matters efficiently and avoid costly mistakes with professional legal counsel.
                </p>
                <Link to="/signup" className="mt-auto">
                  <Button variant="outline" className="border-rocket-blue text-rocket-blue hover:bg-rocket-blue-50">
                    Save Time & Money
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Lawyers Section */}
        <section className="py-12 mb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Our Legal Experts</h2>
            <p className="text-center text-rocket-gray-600 dark:text-rocket-gray-300 max-w-2xl mx-auto mb-12">
              Connect with experienced attorneys specialized in various practice areas, ready to provide personalized guidance for your case.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-rocket-gray-800 rounded-lg overflow-hidden shadow-lg border border-rocket-gray-100 dark:border-rocket-gray-700">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80" 
                    alt="Corporate Lawyer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-rocket-blue-500" />
                    <span className="text-sm text-rocket-blue-500 font-medium">Corporate Law</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Business & Corporate Experts</h3>
                  <p className="text-rocket-gray-600 dark:text-rocket-gray-300 mb-4">
                    Specialized in business formation, contracts, mergers & acquisitions, and corporate compliance matters.
                  </p>
                  <Link to="/signup">
                    <Button className="w-full bg-rocket-blue hover:bg-rocket-blue-600">
                      Consult a Corporate Lawyer
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white dark:bg-rocket-gray-800 rounded-lg overflow-hidden shadow-lg border border-rocket-gray-100 dark:border-rocket-gray-700">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80" 
                    alt="Family Lawyer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-rocket-blue-500" />
                    <span className="text-sm text-rocket-blue-500 font-medium">Family Law</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Family Law Specialists</h3>
                  <p className="text-rocket-gray-600 dark:text-rocket-gray-300 mb-4">
                    Expert guidance for divorce, child custody, adoption, estate planning, and other family matters.
                  </p>
                  <Link to="/signup">
                    <Button className="w-full bg-rocket-blue hover:bg-rocket-blue-600">
                      Consult a Family Lawyer
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white dark:bg-rocket-gray-800 rounded-lg overflow-hidden shadow-lg border border-rocket-gray-100 dark:border-rocket-gray-700">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80" 
                    alt="Criminal Lawyer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="h-5 w-5 text-rocket-blue-500" />
                    <span className="text-sm text-rocket-blue-500 font-medium">Criminal Defense</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Criminal Defense Attorneys</h3>
                  <p className="text-rocket-gray-600 dark:text-rocket-gray-300 mb-4">
                    Protecting your rights in criminal cases with aggressive defense strategies and expert legal representation.
                  </p>
                  <Link to="/signup">
                    <Button className="w-full bg-rocket-blue hover:bg-rocket-blue-600">
                      Consult a Defense Attorney
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/signup">
                <Button size="lg" className="bg-rocket-blue hover:bg-rocket-blue-600">
                  Sign Up to Connect with Our Legal Team
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Advice;
