import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield, Scale, Gavel } from "lucide-react";

const GeneralPowerOfAttorneyInfo = () => {
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
            <Scale className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">General Power of Attorney Guide</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your General Power of Attorney</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What is a General Power of Attorney?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A General Power of Attorney (PoA) is a legal document that allows an individual or organization (called the "agent" or "attorney-in-fact") to act on behalf of another person (the "principal") in legal or financial matters. These powers may include managing bank accounts, buying or selling property, signing contracts, or handling legal decisions.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Key Benefits:</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Provides formal proof to financial institutions and legal authorities</li>
                <li>• Grants agent permission to act in the principal's interest</li>
                <li>• Essential for emergency situations, illness, or travel</li>
                <li>• State-compliant and customizable for use anywhere in the United States</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed">
              This document is often used when someone becomes unavailable, travels abroad, or is medically incapacitated. All General Power of Attorney forms available on Legal Gram are state-compliant and customizable for use anywhere in the United States.
            </p>
          </section>

          {/* When to Use Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Clock className="w-6 h-6 text-orange-500 mr-2" />
              When to Use a General Power of Attorney
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              You may need to create a General PoA if you find yourself in any of these situations:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Broad Authority</h4>
                    <p className="text-gray-600 text-sm">You want to grant someone broad authority to act on your behalf while you're absent.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Future Incapacity</h4>
                    <p className="text-gray-600 text-sm">You wish to authorize someone to handle your affairs in case of future incapacity.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Specific Transactions</h4>
                    <p className="text-gray-600 text-sm">You want to give someone legal power over specific transactions or ongoing responsibilities.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Gavel className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Emergency Preparation</h4>
                    <p className="text-gray-600 text-sm">Essential for protecting your affairs in times of emergency, illness, or travel.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What It Includes Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Does a General Power of Attorney Include?</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              A comprehensive General Power of Attorney typically outlines the following essential elements:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Complete Identification</h4>
                <p className="text-gray-700">Full legal names and addresses of both the principal and agent</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Detailed Powers</h4>
                <p className="text-gray-700">A detailed list of powers being granted (e.g., financial, legal, real estate-related)</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Effective Date</h4>
                <p className="text-gray-700">The effective date of the document—either immediate upon signing, or at a future event</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Termination Conditions</h4>
                <p className="text-gray-700">The termination date or condition under which the powers end</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Legal Requirements</h4>
                <p className="text-gray-700">Required signatures, witnesses, and notarization, depending on state law</p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
              <h4 className="font-semibold text-yellow-900 mb-2">Special Note for Real Estate:</h4>
              <p className="text-yellow-800 text-sm">
                If the document authorizes the agent to handle real estate matters, it may need to be filed with the local recorder's office.
              </p>
            </div>
          </section>

          {/* How to Create Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">How to Create a General Power of Attorney for Free</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Simple 4-Step Process:</h3>
              <p className="text-green-800">
                With Legal Gram, it's easy and affordable to draft a legally binding General Power of Attorney.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Create the Document</h4>
                  <p className="text-gray-700">Answer a few questions, and we'll generate a personalized, legally valid Power of Attorney form.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Review and Share</h4>
                  <p className="text-gray-700">Review your customized PoA with your agent and legal advisor, and make any final adjustments.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Sign and Legalize</h4>
                  <p className="text-gray-700">While not always required, having the PoA notarized and witnessed is strongly recommended for enforcement.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Distribute Copies</h4>
                  <p className="text-gray-700">Share final, signed versions with your agent, legal advisor, financial institutions, or other relevant parties.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Types of Power of Attorney Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Types of Power of Attorney</h2>
            
            <p className="text-gray-700 leading-relaxed mb-6">
              It's important to know the differences between Power of Attorney types so you can choose the right document for your needs:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-bright-orange-600">General Power of Attorney</h4>
                <p className="text-gray-700 text-sm mb-2">Grants wide-ranging legal and financial authority.</p>
                <p className="text-gray-600 text-xs">Best for: Comprehensive management of affairs while absent or incapacitated</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Special (Limited) Power of Attorney</h4>
                <p className="text-gray-700 text-sm mb-2">Limits the powers to specific tasks or actions.</p>
                <p className="text-gray-600 text-xs">Best for: Specific transactions or limited responsibilities</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Durable Power of Attorney</h4>
                <p className="text-gray-700 text-sm mb-2">Remains effective even if the principal becomes mentally incapacitated.</p>
                <p className="text-gray-600 text-xs">Best for: Long-term protection and incapacity planning</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Springing Power of Attorney</h4>
                <p className="text-gray-700 text-sm mb-2">Becomes active only upon the occurrence of a specific event, like incapacity.</p>
                <p className="text-gray-600 text-xs">Best for: Emergency planning with conditional activation</p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
              <h4 className="font-semibold text-blue-900 mb-2">Customization Available:</h4>
              <p className="text-blue-800 text-sm">
                Legal Gram's free templates allow you to define the scope, timing, and duration of your PoA according to your unique situation.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Do I need an attorney to draft a General Power of Attorney?</h4>
                <p className="text-gray-700 mb-2">
                  In most cases, no. You can create a General Power of Attorney online for free with Legal Gram.
                </p>
                <p className="text-gray-600 text-sm">
                  If you need personalized legal advice, Legal Gram also offers discounted access to licensed attorneys across the United States.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Who should consider having a General PoA?</h4>
                <p className="text-gray-700 mb-2">Every adult over 18 should consider creating a PoA. Common reasons include:</p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• You plan to travel or live abroad</li>
                  <li>• You're aging or dealing with a health issue</li>
                  <li>• You want to prepare for emergencies or sudden incapacity</li>
                  <li>• You want to appoint someone to handle your affairs during military service or extended leave</li>
                </ul>
                <p className="text-gray-600 text-sm mt-2">
                  Preparing a Power of Attorney in advance gives you control over who manages your life's critical decisions.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">How much does a General Power of Attorney cost?</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded p-3">
                    <p className="text-red-800 text-sm mb-1"><strong>Traditional Lawyer:</strong></p>
                    <p className="text-red-700 text-sm">$200 to $500 or more</p>
                  </div>
                  <div className="bg-green-50 rounded p-3">
                    <p className="text-green-800 text-sm mb-1"><strong>Legal Gram:</strong></p>
                    <p className="text-green-700 text-sm">Free + discounted legal support</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  Members can also access legal support at up to 40% discounted rates.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Does a General Power of Attorney need to be notarized or witnessed?</h4>
                <p className="text-gray-700 mb-2">
                  Laws vary by state. However, witnessing and notarization are strongly recommended to avoid future disputes.
                </p>
                <div className="bg-yellow-50 border-l-2 border-yellow-400 p-3 mt-3">
                  <p className="text-yellow-800 text-sm mb-1"><strong>Important Notes:</strong></p>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• If your PoA covers real estate transactions, it must often be notarized and officially recorded with the county</li>
                    <li>• Witnesses must usually be adults over 18 and not named as agents in the document</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* After Creation Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Happens After You Create the Document?</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              After creating and signing your General Power of Attorney, follow these important steps:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">1. Secure Storage</h4>
                <p className="text-gray-700">Save the final version in a secure place where it can be easily accessed when needed.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">2. Distribution</h4>
                <p className="text-gray-700">Share it with your appointed agent(s) and any involved parties who will need to recognize the authority.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">3. Official Recording (If Applicable)</h4>
                <p className="text-gray-700">If applicable, record it with your county's property office for real estate authority.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">4. Maintain and Update</h4>
                <p className="text-gray-700">Always keep a backup copy available and update the document if your personal circumstances change.</p>
              </div>
            </div>
          </section>

          {/* Getting Started Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Start Your General Power of Attorney with Legal Gram</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Ready to give someone legal authority to manage your affairs?</h3>
              <p className="text-green-800">
                Legal Gram helps you draft a General Power of Attorney for the US, completely free. With our simple step-by-step form builder, you can:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Customize your document in minutes</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Save and edit it anytime</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Get optional legal help from trusted attorneys</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Finalize with notarization or witness support</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => navigate(-1)}
                className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white px-8 py-3 text-lg"
              >
                Start Creating Your General Power of Attorney
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
                While our General Power of Attorney template covers common provisions, every situation is unique. 
                Consider consulting with a qualified attorney for complex legal situations or specific questions about your state's requirements.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default GeneralPowerOfAttorneyInfo;
