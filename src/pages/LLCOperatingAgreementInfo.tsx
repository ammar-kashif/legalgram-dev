import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield, Building2, Scale } from "lucide-react";

const LLCOperatingAgreementInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          <div className="text-center mb-8">
            <Building2 className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">LLC Operating Agreement Guide</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your LLC Operating Agreement</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Is an LLC Operating Agreement?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              An LLC Operating Agreement is a legal document that outlines the ownership and member duties of your Limited Liability Company. 
              This internal document governs the operations of your LLC according to your specific needs, and it allows you to outline the 
              financial and working relations among business owners and between owners and managers.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Key Functions:</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Establishes the rights and responsibilities of LLC members</li>
                <li>• Defines profit and loss distribution</li>
                <li>• Outlines management structure and decision-making processes</li>
                <li>• Provides procedures for adding or removing members</li>
                <li>• Sets guidelines for dissolution of the LLC</li>
              </ul>
            </div>
          </section>

          {/* Benefits Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              Benefits of Having an Operating Agreement
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Protects Your Limited Liability Status</h4>
                    <p className="text-gray-600 text-sm">Helps maintain the corporate veil and prevents personal liability for business debts.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Clarifies Member Relationships</h4>
                    <p className="text-gray-600 text-sm">Defines roles, responsibilities, and expectations among all LLC members.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Scale className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Overrides State Default Rules</h4>
                    <p className="text-gray-600 text-sm">Allows you to customize your LLC's operations instead of following generic state laws.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Prevents Future Disputes</h4>
                    <p className="text-gray-600 text-sm">Establishes clear procedures for common business situations and conflicts.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Required by Banks and Lenders</h4>
                    <p className="text-gray-600 text-sm">Most financial institutions require an Operating Agreement to open business accounts.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Establishes Business Credibility</h4>
                    <p className="text-gray-600 text-sm">Shows professionalism and legitimacy to partners, investors, and customers.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Components Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Key Components of an Operating Agreement</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">1. LLC Organization and Management</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Company name, principal address, and business purpose</li>
                  <li>• Management structure (member-managed vs. manager-managed)</li>
                  <li>• Voting rights and decision-making procedures</li>
                  <li>• Authority and duties of managers and members</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">2. Membership Interests and Capital Contributions</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Initial capital contributions by each member</li>
                  <li>• Percentage ownership interests</li>
                  <li>• Additional capital contribution requirements</li>
                  <li>• Return of capital contributions upon withdrawal</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">3. Profit and Loss Distribution</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• How profits and losses are allocated among members</li>
                  <li>• Distribution schedules and procedures</li>
                  <li>• Tax allocation and reporting responsibilities</li>
                  <li>• Retained earnings and reinvestment policies</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">4. Member Changes and Transfers</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Procedures for admitting new members</li>
                  <li>• Restrictions on transferring membership interests</li>
                  <li>• Buy-sell provisions for departing members</li>
                  <li>• Right of first refusal for existing members</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">5. Dissolution and Termination</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Events that trigger LLC dissolution</li>
                  <li>• Procedures for winding up business affairs</li>
                  <li>• Asset distribution upon dissolution</li>
                  <li>• Continuation provisions if a member leaves</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Legal Requirements Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Legal Requirements and Considerations</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">Important Note:</h3>
              <p className="text-yellow-800">
                While most states don't legally require an Operating Agreement, having one is highly recommended 
                and often required by banks, investors, and business partners. Some states like California, 
                Delaware, Maine, Missouri, and New York do require multi-member LLCs to have an Operating Agreement.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Single-Member LLCs</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Still benefit from having an Operating Agreement</li>
                  <li>• Helps establish legitimacy of the business entity</li>
                  <li>• Protects limited liability status</li>
                  <li>• Required by most banks for business accounts</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Multi-Member LLCs</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Essential for preventing member disputes</li>
                  <li>• Required by law in some states</li>
                  <li>• Necessary for complex ownership structures</li>
                  <li>• Enables custom profit-sharing arrangements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* When to Update Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">When to Update Your Operating Agreement</h2>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <h3 className="font-semibold text-red-900 mb-2">Regular Review Recommended:</h3>
              <p className="text-red-800">
                Your Operating Agreement should be reviewed and updated whenever there are significant 
                changes to your business structure, membership, or operations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Common Triggers for Updates:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Adding or removing members</li>
                  <li>• Changes in ownership percentages</li>
                  <li>• Significant changes in business operations</li>
                  <li>• Major capital contributions or distributions</li>
                  <li>• Changes in management structure</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Additional Considerations:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Changes in state or federal law</li>
                  <li>• Business expansion or contraction</li>
                  <li>• Changes in tax elections</li>
                  <li>• Marriage, divorce, or death of members</li>
                  <li>• Annual review as best practice</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Getting Started Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Getting Started</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Ready to Create Your Operating Agreement?</h3>
              <p className="text-green-800">
                Our guided form will help you create a comprehensive Operating Agreement tailored to your LLC's 
                specific needs. The process typically takes 15-30 minutes, and you'll have a professional 
                document ready for use.
              </p>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => navigate(-1)}
                className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white px-8 py-3 text-lg"
              >
                Start Creating Your Operating Agreement
              </Button>
              <p className="text-gray-600 mt-2 text-sm">
                Return to the form to begin the guided process
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="border-t pt-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-600 text-sm">
                <strong>Disclaimer:</strong> This information is provided for educational purposes only and does not constitute legal advice. 
                While our Operating Agreement template covers common provisions, every business situation is unique. 
                Consider consulting with a qualified attorney for complex business structures or specific legal questions.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default LLCOperatingAgreementInfo;
