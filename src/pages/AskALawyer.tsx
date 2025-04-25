
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AskLawyerHero from "@/components/lawyer/AskLawyerHero";
import CommunicationOptions from "@/components/lawyer/CommunicationOptions";
import FrequentlyAskedQuestions from "@/components/lawyer/FrequentlyAskedQuestions";
import ContactForm from "@/components/lawyer/ContactForm";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AskALawyer() {
  return (
    <Layout>
      <Helmet>
        <title>Ask a Lawyer | Rocket Lawyer</title>
        <meta name="description" content="Get legal advice from our network of certified lawyers through chat, video calls, or our Q&A section." />
      </Helmet>
      
      <AskLawyerHero />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <CommunicationOptions />
        <FrequentlyAskedQuestions />
        
        <div className="my-16 bg-rocket-blue-50 dark:bg-rocket-blue-900/30 rounded-xl p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-rocket-gray-900 dark:text-white">
                Need regular legal help?
              </h2>
              <p className="text-rocket-gray-600 dark:text-rocket-gray-300 mt-2 max-w-xl">
                Check out our membership plans for unlimited access to legal advice and document creation.
              </p>
            </div>
            <Link to="/pricing">
              <Button size="lg" className="group">
                View Pricing Plans
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
        
        <ContactForm />
      </div>
    </Layout>
  );
}
