import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Users, Shield, Clock, DollarSign, AlertTriangle, CheckCircle, UserCheck, Briefcase } from "lucide-react";

const IndependentContractorInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        <Card className="mb-8">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Independent Contractor Agreement Guide
            </CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              Complete guide to understanding and creating your Independent Contractor Agreement
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          {/* What is an Independent Contractor Agreement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-600">
                <FileText className="w-6 h-6 mr-2" />
                What is an Independent Contractor Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                An Independent Contractor Agreement is a legally binding contract that defines the professional relationship between a hiring party (the "Recipient") and a service provider (the "Contractor"). Whether you're a freelancer offering your services or a business hiring on a project basis, a well-drafted Independent Contractor Agreement sets the foundation for a smooth, legally compliant engagement.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                This document lays out key terms, including the scope of services, payment structure, confidentiality, and ownership of work, while ensuring the contractor is not mistakenly treated as an employee.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
                <p className="text-blue-800">
                  <strong>Key Benefit:</strong> Legal Gram offers easy-to-use templates designed to comply with U.S. laws and contractor classification rules, helping you create the best Independent Contractor Agreement for your needs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* When to Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-600">
                <Clock className="w-6 h-6 mr-2" />
                When Should You Use an Independent Contractor Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">Use this contract when:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">You are hiring or working as an independent contractor or freelancer on a per-project basis.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">You need a written record to protect both parties in terms of scope, deadlines, and payments.</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">You want to safeguard your confidential business information.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">You are looking for the Best Independent Contractor Agreement for US businesses.</span>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-800 font-medium">Important Note:</p>
                    <p className="text-amber-700">If you are hiring someone as a full-time employee, use a formal Employment Agreement instead.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Provisions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-600">
                <Shield className="w-6 h-6 mr-2" />
                Key Provisions in an Independent Contractor Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-6">
                Creating a strong, legally valid Independent Contractor Agreement is essential. Legal Gram makes Independent Contractor Agreement drafting for free easy and legally sound. Below are the major provisions you should include:
              </p>
              
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">1. Recipient of Services</h3>
                  <p className="text-gray-700">
                    This section identifies the business or person hiring the contractor, including name and authorized representative (e.g., "ABC Tech Solutions, signed by John Smith, CEO").
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2. Contractor Information</h3>
                  <p className="text-gray-700">
                    Includes the contractor's full name and physical address. This confirms the identity of the service provider.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">3. Description of Services</h3>
                  <p className="text-gray-700">
                    Outlines the specific services to be rendered. If lengthy, a separate exhibit can be referenced (e.g., "as listed in Exhibit A").
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">4. Payment Terms</h3>
                  <p className="text-gray-700 mb-2">Covers how and when the contractor will be paid:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Lump sum upon project completion</li>
                    <li>Milestone-based installment payments</li>
                    <li>Hourly or fixed-rate for ongoing work</li>
                  </ul>
                  <div className="bg-blue-50 border-l-2 border-blue-400 p-3 mt-3">
                    <p className="text-blue-800 text-sm">
                      <strong>Tip:</strong> For IRS compliance, lump sum or milestone payments are preferred to avoid misclassification as an employee.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Define the Relationship */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-600">
                <UserCheck className="w-6 h-6 mr-2" />
                Define the Relationship Clearly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                One of the most important sections in a US Independent Contractor Agreement is defining that the contractor is not an employee. Your contract should include clauses that:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Clarify the contractor's independence</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">State that the recipient does not control work methods</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Specify that contractors may hire assistants</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Confirm that no company equipment or desk is provided</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Declare that the contractor sets their own hours</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Note that contractors are responsible for their own business expenses</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confidentiality and IP */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Confidentiality and Intellectual Property Clauses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                A well-drafted Independent Contractor Agreement for US companies should protect business-sensitive data. Include clauses that:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Confidentiality Requirements</h4>
                  <p className="text-gray-700">Require the contractor to maintain confidentiality of all proprietary information</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Intellectual Property Rights</h4>
                  <p className="text-gray-700">Ensure that all intellectual property created during the contract becomes the recipient's legal property</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Ownership Clarification</h4>
                  <p className="text-gray-700">Specify who owns social media accounts or client lists built during the engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance and Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Insurance and Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">To further protect your business:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Insurance Requirements</h4>
                  <p className="text-red-700">Require the contractor to carry liability insurance</p>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Indemnification</h4>
                  <p className="text-red-700">Include clauses to hold the contractor responsible for any damages, claims, or lawsuits caused by their work</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Definitions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Legal Definitions for Clarity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your Independent Contractor Agreement should define key terms such as:
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Term</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">Independent Contractor</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">A non-employee offering professional services.</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">Confidential Information</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Proprietary data like client lists or business plans.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">Indemnification</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">The contractor's agreement to cover the recipient's legal liabilities.</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">Severability</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">If one part of the contract is unenforceable, the rest remains valid.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">Waiver of Breach</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Forgiving a breach once doesn't waive future enforcement rights.</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium text-gray-800">Proprietary Information</td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-700">Trade secrets or inventions developed under the agreement.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Why Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-600">
                <Shield className="w-6 h-6 mr-2" />
                Why Businesses Use Independent Contractor Agreements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">Using an Independent Contractor Agreement:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Clarifies expectations around the scope of work and payment</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Legally defines the independent nature of the working relationship</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Protects your business interests, including intellectual property</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Helps comply with IRS and labor law guidelines</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Reduces the likelihood of misclassification lawsuits</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Protects both contractor and hiring party rights</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Why is an Independent Contractor Agreement important?</h4>
                  <p className="text-gray-700">
                    It sets expectations, outlines ownership of work, defines the relationship, and provides legal protection for both parties.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">What should be included in the agreement?</h4>
                  <p className="text-gray-700">
                    Include service description, payment terms, confidentiality clauses, termination rules, intellectual property rights, and state-specific legal requirements.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Can I draft an Independent Contractor Agreement for free?</h4>
                  <p className="text-gray-700">
                    Yes. Legal Gram offers Independent Contractor Agreement drafting for free with customizable templates tailored for U.S. businesses.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Is there a difference between an independent contractor and an employee?</h4>
                  <p className="text-gray-700">
                    Yes. Independent contractors operate under their own terms, pay their own taxes, and are not entitled to employee benefits like health insurance or paid leave.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Draft Your Independent Contractor Agreement for Free Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-6">
                Legal Gram simplifies the legal process. Here's how to get started:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Make the Document</h4>
                    <p className="text-gray-700">Use our intuitive tool to create your free Independent Contractor Agreement by answering simple questions.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Review the Agreement</h4>
                    <p className="text-gray-700">Make sure all terms match your intentions. You can have other parties review before signing.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Sign Securely</h4>
                    <p className="text-gray-700">Use electronic signature platforms to complete the contract remotely.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Distribute and Store</h4>
                    <p className="text-gray-700">Each party should keep a signed copy. If signed online, your copy is stored securely.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                <h4 className="font-semibold text-blue-900 mb-2">Why Legal Gram?</h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• Fully customizable Independent Contractor Agreement templates</li>
                  <li>• Free to start and easy to use</li>
                  <li>• Built to meet U.S. legal requirements</li>
                  <li>• Great for freelancers, startups, agencies, and corporations</li>
                  <li>• Backed by legal expertise and real-world usage</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Ready to Create Your Independent Contractor Agreement?
              </h3>
              <p className="text-blue-700 mb-6">
                Protect your business relationships and ensure compliance with our comprehensive agreement templates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IndependentContractorInfo;
