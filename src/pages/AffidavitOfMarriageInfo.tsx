import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield } from "lucide-react";

const AffidavitOfMarriageInfo = () => {
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
            <FileText className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">What Is an Affidavit of Marriage?</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your Affidavit of Marriage</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              An Affidavit of Marriage is a legally sworn statement used to confirm the existence of a marital relationship when a certified Marriage Certificate is unavailable, lost, or never issued. This document serves as an official alternative to prove that a valid marriage took place and is especially useful in legal or administrative matters that require verification under oath.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Typically, an Affidavit of Marriage includes:</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• The names of both spouses</li>
                <li>• The date and location of the marriage</li>
                <li>• A sworn statement made under penalty of perjury</li>
                <li>• A witness statement (if applicable)</li>
                <li>• The signature of the affiant in front of a notary public</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed">
              This document is commonly used to verify marriage status for immigration processes, insurance applications, banking needs, or other situations where evidence of marriage is legally required but a certificate is missing.
            </p>
          </section>

          {/* When to Use Section */}
          <section>
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-bright-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">When to Use an Affidavit of Marriage</h2>
            </div>
            <p className="text-gray-700 mb-4">You may need to prepare an Affidavit of Marriage for US legal or administrative purposes in the following scenarios:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-gray-700 space-y-2">
                  <li>• You are unable to locate your official Marriage Certificate</li>
                  <li>• You've been asked to verify your marital status under oath</li>
                  <li>• You are applying for a foreign visa, passport, or spousal benefit that requires marriage proof</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-gray-700 space-y-2">
                  <li>• You are divorced but need to confirm a previous marriage for legal purposes</li>
                  <li>• You are opening financial accounts or applying for insurance where proof of marital status is required</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Key Requirements Section */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-bright-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Key Requirements for an Affidavit of Marriage</h2>
            </div>
            <p className="text-gray-700 mb-6">To ensure that your Affidavit of Marriage is legally valid, it must meet these basic requirements:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-bright-orange-600">1. Affiant's Information</h3>
                <p className="text-gray-700 mb-2">The affiant (person swearing to the statement) must provide:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Full name and contact details</li>
                  <li>• Employment status and job title (if requested)</li>
                  <li>• Current marital status</li>
                  <li>• Relationship to the spouse</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-bright-orange-600">2. Marriage Details</h3>
                <p className="text-gray-700 mb-2">Include the:</p>
                <ul className="text-gray-600 space-y-1">
                  <li>• Full names of both spouses</li>
                  <li>• Date and place of the marriage ceremony</li>
                  <li>• City, state, and country where the marriage occurred</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-bright-orange-600">3. Statement of Truth</h3>
                <p className="text-gray-700">The affiant must include a statement affirming the accuracy of the information under penalty of perjury.</p>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-bright-orange-600">4. Notarization</h3>
                <p className="text-gray-700">To be considered a sworn legal document, the Affidavit of Marriage must be signed in front of a notary public. This step verifies the authenticity of the signature and gives the affidavit its legal standing.</p>
              </div>
            </div>
          </section>

          {/* How to Create Section */}
          <section>
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-bright-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">How to Create an Affidavit of Marriage for Free</h2>
            </div>
            <p className="text-gray-700 mb-6">With Legal Gram, it's quick and simple to generate a personalized Affidavit of Marriage online. Here's how:</p>
            
            <div className="bg-gradient-to-r from-bright-orange-50 to-bright-orange-100 p-6 rounded-lg">
              <ol className="text-gray-700 space-y-3">
                <li className="flex items-start">
                  <span className="bg-bright-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                  <span>Choose your state to ensure legal compliance.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-bright-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                  <div>
                    <span>Answer a few questions, such as:</span>
                    <ul className="ml-4 mt-1 text-gray-600">
                      <li>• Your job title or employment status</li>
                      <li>• The marriage date and location</li>
                      <li>• Where the document will be signed and notarized</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-bright-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                  <span>Customize your affidavit—you can save your work and return to finish it later.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-bright-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                  <span>Download and print your document.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-bright-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                  <span>Sign it before a notary public to finalize the affidavit.</span>
                </li>
              </ol>
              <p className="text-gray-700 mt-4 font-medium">This solution is often faster and far more affordable than hiring an attorney for a simple sworn statement.</p>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-bright-orange-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-l-4 border-green-500 bg-green-50 p-4">
                <h3 className="font-semibold text-green-900 mb-2">✅ How is an Affidavit of Marriage used?</h3>
                <p className="text-green-800 mb-2">It can act as official proof of marriage in place of a lost or unavailable Marriage Certificate. Common uses include:</p>
                <ul className="text-green-700 space-y-1">
                  <li>• Visa applications or spousal immigration filings</li>
                  <li>• Insurance or banking procedures</li>
                  <li>• Court proceedings or legal declarations</li>
                  <li>• Proof of prior marriage in divorce or inheritance cases</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
                <h3 className="font-semibold text-blue-900 mb-2">✅ Is notarization required?</h3>
                <p className="text-blue-800">Yes. For an Affidavit of Marriage to be legally valid, it must be signed in front of a notary public. This step confirms the document is a sworn affidavit and provides legal enforceability.</p>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
                <h3 className="font-semibold text-purple-900 mb-2">✅ Who is the affiant?</h3>
                <p className="text-purple-800">The affiant is the individual making the sworn statement—usually one of the spouses. This person is responsible for confirming the facts and signing under oath.</p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-4">
                <h3 className="font-semibold text-orange-900 mb-2">✅ Can I write an Affidavit of Marriage myself?</h3>
                <p className="text-orange-800">Absolutely. With Legal Gram, you can easily draft an Affidavit of Marriage for free and tailor it to your specific situation. Our step-by-step builder ensures you include all legally necessary elements and provides a state-specific format that holds up in legal and administrative settings.</p>
              </div>
            </div>
          </section>

          {/* Final Steps Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Final Steps After Creating Your Affidavit</h2>
            <p className="text-gray-700 mb-4">Once your Affidavit of Marriage form is complete:</p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <ol className="text-gray-700 space-y-2">
                <li>1. Print the document and bring it to a licensed notary.</li>
                <li>2. Sign in front of the notary, who will also sign and stamp the affidavit.</li>
                <li>3. Distribute copies as needed to relevant agencies, immigration offices, or service providers.</li>
                <li>4. Store the original in a secure location with your legal documents.</li>
              </ol>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gradient-to-r from-bright-orange-500 to-bright-orange-600 text-white p-8 rounded-xl">
            <h2 className="text-3xl font-bold mb-4">Create Your Affidavit of Marriage Now</h2>
            <p className="text-xl mb-6">Don't let a lost certificate hold up your legal or administrative processes. Our Affidavit of Marriage template for US residents is clear, customizable, and completely free to use.</p>
            <Button 
              size="lg" 
              onClick={() => navigate('/documents/affidavit-of-marriage')}
              className="bg-white text-bright-orange-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              Start Your Affidavit of Marriage Today
            </Button>
            <p className="text-bright-orange-100 mt-4">Secure, notarized, and ready for any official requirement.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default AffidavitOfMarriageInfo;
