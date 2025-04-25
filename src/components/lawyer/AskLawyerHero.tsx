
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function AskLawyerHero() {
  return (
    <section className="w-full bg-gradient-to-br from-rocket-blue-50 to-white dark:from-rocket-gray-900 dark:to-rocket-gray-800 py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-rocket-gray-900 dark:text-white">
              Get Legal Advice From{" "}
              <span className="text-gradient">Certified Lawyers</span>
            </h1>
            
            <p className="text-lg text-rocket-gray-600 dark:text-rocket-gray-300 max-w-2xl">
              Connect with experienced attorneys who can answer your questions and provide guidance on your legal matters. Choose how you want to communicate.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/ask-legal-advice">
                <Button className="group" size="lg">
                  Start Chat Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/ask-legal-advice">
                <Button variant="outline" size="lg">
                  Schedule Video Call
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-2 text-rocket-blue-500 dark:text-rocket-blue-300 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>23 lawyers online now</span>
            </div>
          </div>
          
          <div className="flex-1 hidden md:flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-rocket-blue-100 dark:bg-rocket-blue-900/30 rounded-lg z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rocket-blue-100 dark:bg-rocket-blue-900/30 rounded-lg z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2369&q=80" 
                alt="Professional lawyer ready to help"
                className="w-full h-auto object-cover rounded-lg shadow-lg z-10 relative"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
