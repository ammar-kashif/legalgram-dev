import { 
  Building2, DollarSign, Shield, CheckCircle, 
  AlertTriangle, Users, FileText, Calculator,
  ArrowLeft, Star, TrendingUp, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const WhatsAnSCorp = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-4 rounded-full">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What's an S-Corporation?
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover how S-Corp tax election can help your business save money and grow more efficiently
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                asChild
              >
                <Link to="/documents/s-corp">Start S-Corp Election</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                asChild
              >
                <Link to="/start-business">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Business Options
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What is an S-Corp Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Understanding S-Corporation Tax Election
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  An S-Corporation isn't actually a business entity type – it's a special tax election that your LLC or Corporation can make with the IRS. This election allows your business to be taxed differently, potentially saving you thousands in self-employment taxes.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  When you elect S-Corp status, your business becomes a "pass-through" entity for tax purposes, meaning the business itself doesn't pay federal income taxes. Instead, profits and losses pass through to your personal tax return.
                </p>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-start">
                    <Calculator className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Tax Savings Example</h3>
                      <p className="text-gray-700">
                        A business owner making $100,000 could potentially save $1,500-$3,000 annually in self-employment taxes with S-Corp election.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-xl text-white">
                <h3 className="text-xl font-bold mb-4">Key S-Corp Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                    Potential self-employment tax savings
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                    Pass-through taxation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                    Salary and distribution flexibility
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                    Maintain business structure
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How S-Corp Election Works */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              How S-Corp Election Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. File Form 2553</h3>
                <p className="text-gray-700">
                  Submit Form 2553 to the IRS to elect S-Corporation tax treatment for your existing LLC or Corporation.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Pay Reasonable Salary</h3>
                <p className="text-gray-700">
                  As an owner-employee, you must pay yourself a reasonable salary subject to payroll taxes.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Take Distributions</h3>
                <p className="text-gray-700">
                  Additional profits can be distributed to owners without self-employment tax.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements and Considerations */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              S-Corp Requirements & Considerations
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Requirements
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li>• Must have 100 or fewer shareholders</li>
                  <li>• Shareholders must be U.S. citizens or residents</li>
                  <li>• Only one class of stock allowed</li>
                  <li>• Must pay reasonable salary to owner-employees</li>
                  <li>• Must file annual tax return (Form 1120S)</li>
                  <li>• Election must be made by March 15th (or within 75 days of formation)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-amber-600 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Considerations
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li>• Increased payroll and bookkeeping complexity</li>
                  <li>• Must determine and pay "reasonable salary"</li>
                  <li>• Additional tax filing requirements</li>
                  <li>• May not be beneficial for lower-income businesses</li>
                  <li>• Certain fringe benefits may be taxable</li>
                  <li>• Built-in gains tax may apply in some cases</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When S-Corp Makes Sense */}
      <section className="py-16 bg-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Is S-Corp Election Right for Your Business?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              S-Corp election typically makes sense when your business profits exceed $60,000-$80,000 annually
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Great For</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Profitable businesses ($60K+ annually)</li>
                  <li>• Service-based companies</li>
                  <li>• Businesses with active owners</li>
                  <li>• Companies wanting tax savings</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Consider Timing</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• New businesses (wait for profitability)</li>
                  <li>• Seasonal businesses</li>
                  <li>• Businesses with irregular income</li>
                  <li>• Companies planning major investments</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">May Not Be Ideal</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Low-profit businesses</li>
                  <li>• Passive investment companies</li>
                  <li>• Businesses with losses</li>
                  <li>• Complex ownership structures</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Help Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Get Expert Help with Your S-Corp Election
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Don't navigate S-Corp election alone. Our experts will help you determine if it's right for your business and handle the paperwork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white"
                asChild
              >
                <Link to="/documents/s-corp">Start S-Corp Election</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900"
                asChild
              >
                <Link to="/contact">Speak with an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold mb-2">
                  Can any business elect S-Corp status?
                </h3>
                <p className="text-gray-700">
                  Most LLCs and C-Corporations can elect S-Corp status, but there are restrictions. You must have 100 or fewer shareholders, only U.S. citizens or residents as shareholders, and only one class of stock.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold mb-2">
                  When should I make the S-Corp election?
                </h3>
                <p className="text-gray-700">
                  For existing businesses, the election must be made by March 15th of the tax year you want it to take effect. For new businesses, you have 75 days from formation to make the election.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold mb-2">
                  How much can I save with S-Corp election?
                </h3>
                <p className="text-gray-700">
                  Savings vary based on your business income and salary. Generally, businesses with profits over $60,000 annually can see significant savings in self-employment taxes, often $1,500-$5,000+ per year.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold mb-2">
                  What's a "reasonable salary" for S-Corp owners?
                </h3>
                <p className="text-gray-700">
                  The IRS requires S-Corp owner-employees to pay themselves a reasonable salary based on their role, experience, and what similar positions pay in their industry and location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WhatsAnSCorp;
