import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield, Scale, Gavel } from "lucide-react";

const SpecialPowerOfAttorneyInfo = () => {
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
            <Gavel className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Special Power of Attorney Guide</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your Special Power of Attorney</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What is a Special Power of Attorney?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Special Power of Attorney (PoA) is a legally binding document that authorizes a specific individual—referred to as the "agent" or "attorney-in-fact"—to act on behalf of another person—the "principal"—in handling clearly defined legal and financial responsibilities. These responsibilities may include signing contracts, managing bank transactions, or selling real estate.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Key Differences:</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• <strong>Special PoA:</strong> Focuses only on particular matters outlined in the document</li>
                <li>• <strong>General PoA:</strong> Grants broad powers across multiple areas</li>
                <li>• Acts as evidence to third parties (banks, government offices) of legal authority</li>
                <li>• Can be customized to fit your specific situation and needs</li>
              </ul>
            </div>
          </section>

          {/* When to Use Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Clock className="w-6 h-6 text-orange-500 mr-2" />
              When to Use a Special Power of Attorney
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              You may consider creating a Special PoA in various situations where you need someone to handle specific tasks on your behalf:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Business Matters</h4>
                    <p className="text-gray-600 text-sm">When you need someone to manage specific legal or financial tasks on your behalf.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Travel or Military Service</h4>
                    <p className="text-gray-600 text-sm">When you'll be unavailable due to travel, active military service, or hospitalization.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Health-Related Absence</h4>
                    <p className="text-gray-600 text-sm">When you want someone to temporarily act for you during a health-related absence.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Scale className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Trusted Representative</h4>
                    <p className="text-gray-600 text-sm">When managing tasks through a trusted representative while unavailable.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What It Includes Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What a Special Power of Attorney Includes</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              A valid Special Power of Attorney form typically contains the following essential elements:
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Complete Identification</h4>
                <p className="text-gray-700">Full legal names and contact information for both the principal and the agent</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Defined Powers</h4>
                <p className="text-gray-700">A clearly defined list of the specific powers being granted to the agent</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Time Frame</h4>
                <p className="text-gray-700">Start date and termination date (or specific triggering event for activation/termination)</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Proper Execution</h4>
                <p className="text-gray-700">Signatures of the principal, and in most states, at least one witness</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">✓ Notarization</h4>
                <p className="text-gray-700">Professional notarization, especially important for real estate transactions</p>
              </div>
            </div>
          </section>

          {/* Types of Power of Attorney Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Types of Power of Attorney</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              PoA documents vary based on their scope and conditions. Understanding these types helps you choose the right document for your needs:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-bright-orange-600">Special (Limited) Power of Attorney</h4>
                <p className="text-gray-700 text-sm mb-2">Restricts authority to specific tasks or decisions.</p>
                <p className="text-gray-600 text-xs">Best for: Specific transactions, real estate deals, business matters</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">General Power of Attorney</h4>
                <p className="text-gray-700 text-sm mb-2">Grants broad legal and financial control.</p>
                <p className="text-gray-600 text-xs">Best for: Comprehensive management of affairs</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Durable Power of Attorney</h4>
                <p className="text-gray-700 text-sm mb-2">Stays effective even if the principal becomes mentally incapacitated.</p>
                <p className="text-gray-600 text-xs">Best for: Long-term planning, health considerations</p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Springing Power of Attorney</h4>
                <p className="text-gray-700 text-sm mb-2">Becomes active only when a specified event occurs.</p>
                <p className="text-gray-600 text-xs">Best for: Emergency planning, conditional activation</p>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">How to Get a Special Power of Attorney Online</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Simple 4-Step Process:</h3>
              <p className="text-green-800">
                With Legal Gram, creating your Special Power of Attorney is simple, cost-effective, and can be completed entirely online.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Create the Document</h4>
                  <p className="text-gray-700">Answer a few guided questions based on your specific needs and situation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Review and Share</h4>
                  <p className="text-gray-700">Consult with your agent or a legal expert if needed before finalizing.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Sign and Legalize</h4>
                  <p className="text-gray-700">Complete notarization and witnessing as required by your state's laws.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-bright-orange-100 text-bright-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Distribute Copies</h4>
                  <p className="text-gray-700">Provide signed copies to your agent(s) and relevant financial or legal institutions.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Requirements Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Legal Requirements and Execution</h2>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">Important Legal Notes:</h3>
              <p className="text-yellow-800">
                Most states require notarization and/or at least one witness. Notarization is often mandatory for Powers of Attorney involving real estate transactions, which may also need to be recorded with the county.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Witness Requirements</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Witnesses must be at least 18 years old</li>
                  <li>• Witnesses cannot also serve as the appointed agent</li>
                  <li>• Most states require 1-2 witnesses</li>
                  <li>• Witnesses must be mentally competent</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Notarization Guidelines</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Required in most states for validity</li>
                  <li>• Mandatory for real estate transactions</li>
                  <li>• Principal must appear before notary in person</li>
                  <li>• Valid identification required</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Who Should Have Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Who Should Have a Special Power of Attorney?</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Every adult should consider having a PoA, especially when preparing for various life situations that may require trusted representation:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Common Scenarios:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Temporary relocation or international travel</li>
                  <li>• Medical treatment or health decline</li>
                  <li>• Living in a care facility</li>
                  <li>• Managing business affairs remotely</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Benefits:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Peace of mind for unexpected situations</li>
                  <li>• Ensures affairs are managed without legal obstacles</li>
                  <li>• Avoids court-appointed guardianship</li>
                  <li>• Maintains control over who represents you</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cost and Legal Advice Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Cost and Professional Support</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">Traditional Attorney Costs</h4>
                <p className="text-red-800 text-sm mb-2">$200 to $500 or more</p>
                <p className="text-red-700 text-xs">Plus additional fees for consultations and revisions</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Legal Gram Solution</h4>
                <p className="text-green-800 text-sm mb-2">Create documents for free</p>
                <p className="text-green-700 text-xs">Premium members get up to 40% off legal fees if attorney services are needed</p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Do I Need a Lawyer?</h4>
              <p className="text-blue-800 text-sm">
                While Special PoAs are generally easy to draft, legal advice may be beneficial for complex circumstances. 
                With Legal Gram Premium, you get access to experienced attorneys who can review, answer questions, or help customize your PoA.
              </p>
            </div>
          </section>

          {/* After Creation Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What to Do After Creating Your Special Power of Attorney</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">1. Finalize the Document</h4>
                <p className="text-gray-700">Sign in front of a notary and/or witnesses (depending on state law requirements).</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">2. Distribute Copies</h4>
                <p className="text-gray-700">Provide copies to your agent(s), financial institutions, or real estate professionals if relevant.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">3. Secure Storage</h4>
                <p className="text-gray-700">Keep a securely stored copy for your records and inform trusted parties of its location.</p>
              </div>
            </div>
          </section>

          {/* Getting Started Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Start Your Special Power of Attorney with Legal Gram</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Why Choose Legal Gram?</h3>
              <div className="grid md:grid-cols-2 gap-4 text-green-800">
                <ul className="space-y-1">
                  <li>• Draft custom documents for free</li>
                  <li>• Edit and download as PDF or Word</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Optional legal advice from experienced attorneys</li>
                  <li>• Ensure legal validity with proper execution guidance</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => navigate(-1)}
                className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white px-8 py-3 text-lg"
              >
                Start Creating Your Special Power of Attorney
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
                While our Special Power of Attorney template covers common provisions, every situation is unique. 
                Consider consulting with a qualified attorney for complex legal situations or specific questions about your state's requirements.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default SpecialPowerOfAttorneyInfo;
