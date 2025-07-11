import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield, Scale, Heart } from "lucide-react";

const DivorceSettlementAgreementInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
          
          <div className="text-center mb-8">
            <Scale className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Divorce Settlement Agreement Guide</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your Divorce Settlement Agreement</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Is a Divorce Settlement Agreement?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Divorce Settlement Agreement is a legally binding document that outlines the agreed terms between spouses who are seeking to dissolve their marriage. It is used to formally divide marital property, debts, and—if applicable—set guidelines for child custody, visitation, and child support. This document is often required when filing for an uncontested divorce and is an essential part of ensuring a smooth legal separation.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Also known as a Marital Settlement Agreement, Marital Separation Agreement, or Divorce Settlement Agreement Form, this contract allows both parties to record their mutual decisions in writing, helping prevent confusion, delays, or disputes during the court process.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">⚖️ Important Note:</h3>
              <p className="text-blue-800">
                While this agreement helps outline the divorce terms, it is only one step in the overall divorce process.
              </p>
            </div>
          </section>

          {/* When to Use Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-bright-orange-500" />
              When Should You Use a Divorce Settlement Agreement?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may need a Divorce Settlement Agreement for US courts if:
            </p>
            <ul className="text-gray-700 space-y-2 ml-4">
              <li>• You and your spouse have mutually agreed to divorce and have decided how to divide your property, finances, and debts.</li>
              <li>• You are currently negotiating divorce terms and want a written plan to clarify the division of assets and responsibilities.</li>
              <li>• You plan to meet with a divorce attorney and want to bring a ready-made outline of your agreed terms to the consultation.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              This agreement is especially helpful for couples pursuing uncontested divorces, where there is no dispute over the terms of separation.
            </p>
          </section>

          {/* What's Included Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-bright-orange-500" />
              What's Included in a Divorce Settlement Agreement?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A comprehensive Divorce Settlement Agreement should include the following:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Identification of both spouses</h3>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Division of marital property</h3>
                <p className="text-gray-700">Such as homes, vehicles, and personal possessions</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Distribution of debts and liabilities</h3>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Child custody and visitation schedules</h3>
                <p className="text-gray-700">(if applicable)</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Child support amounts and payment terms</h3>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Spousal support (alimony) provisions</h3>
                <p className="text-gray-700">If agreed upon</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Agreement terms for handling retirement plans</h3>
                <p className="text-gray-700">Investments, and joint accounts</p>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mt-6">
              Each section is designed to make the separation process clear and legally enforceable.
            </p>
          </section>

          {/* How to Create Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-bright-orange-500" />
              How to Create a Divorce Settlement Agreement for Free
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              With Legal Gram, you can easily draft a Divorce Settlement Agreement online by following a few simple steps:
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">1. Make the Document</h3>
                <p className="text-gray-700">
                  Answer basic questions about your assets, children (if any), and support terms. We'll generate a customized Divorce Agreement form based on your input.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">2. Review the Agreement</h3>
                <p className="text-gray-700">
                  Double-check all terms to ensure they reflect your intentions. It's a good idea to go over the agreement with your spouse or a legal professional before signing.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">3. Sign the Document</h3>
                <p className="text-gray-700">
                  This agreement must be signed by both spouses to be valid. You can sign in person or use a secure online signature tool like RocketSign®.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">4. Distribute Copies</h3>
                <p className="text-gray-700">
                  Each spouse should retain a signed copy. If signed online, copies are securely stored in your Legal Gram account and can be downloaded or shared when needed.
                </p>
              </div>
            </div>
          </section>

          {/* Checklist Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-bright-orange-500" />
              Divorce Settlement Agreement Checklist
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here's what you'll need to complete your agreement successfully:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Full names and addresses of both spouses</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">List of marital assets and how they will be divided</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Details of debts and how they will be assigned</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Child custody and visitation terms (if you have children under 18)</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Child support calculations and payment schedule</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Spousal support (if any)</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Signatures of both parties</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-bright-orange-500 pl-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">✅ What is the difference between a Divorce Settlement Agreement and a Divorce Decree?</h3>
                <p className="text-gray-700">
                  A Divorce Settlement Agreement is created and signed by the parties before submitting to the court. It outlines the mutually agreed terms. Once the court reviews and approves it, the agreement may be incorporated into the Divorce Decree, which finalizes the divorce.
                </p>
              </div>

              <div className="border-l-4 border-bright-orange-500 pl-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">✅ Do I need a lawyer to create a Divorce Settlement Agreement?</h3>
                <p className="text-gray-700">
                  Not necessarily. If both parties agree on all terms, you can draft a Divorce Settlement Agreement without a lawyer using a trusted platform like Legal Gram. However, legal advice may be helpful in complex situations, especially where high-value assets or children are involved.
                </p>
              </div>

              <div className="border-l-4 border-bright-orange-500 pl-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">✅ Can I use this agreement for child custody and support?</h3>
                <p className="text-gray-700">
                  Yes. If you and your spouse have children under 18, you can include custody arrangements, parenting schedules, and child support terms in the same Divorce Settlement Agreement.
                </p>
              </div>

              <div className="border-l-4 border-bright-orange-500 pl-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">✅ Is the Divorce Settlement Agreement legally binding?</h3>
                <p className="text-gray-700">
                  Yes. Once both parties sign the document and it is approved by a judge, it becomes part of the court's final divorce order, making it fully enforceable under state law.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Gram Section */}
          <section className="bg-bright-orange-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Scale className="w-6 h-6 mr-2 text-bright-orange-500" />
              Create Your Divorce Settlement Agreement Today
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you're filing for an uncontested divorce or just starting negotiations, Legal Gram makes it simple to create a Divorce Settlement Agreement for free. Our platform ensures your form is state-compliant, easy to edit, and ready to sign when you are.
            </p>
            
            <div className="bg-white p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Why Use Legal Gram?</h3>
              <ul className="text-gray-700 space-y-2 ml-4">
                <li>• Step-by-step guidance for every section</li>
                <li>• Secure online signature tools</li>
                <li>• Save and access your documents anytime</li>
                <li>• Attorney review available if needed</li>
                <li>• 100% free to get started</li>
              </ul>
            </div>
            
    
            
            <p className="text-center text-lg font-semibold text-gray-800 mt-4">
              Start your Divorce Settlement Agreement now and take control of the divorce process with confidence, clarity, and legal protection.
            </p>
          </section>

          {/* Additional Information */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Need More Help?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Legal Advice</h4>
                <p className="text-gray-600 text-sm mb-2">
                  For complex situations or legal questions, consult with a qualified attorney.
                </p>
                <Button variant="outline" onClick={() => navigate('/ask-a-lawyer')}>
                  Ask a Lawyer
                </Button>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Other Forms</h4>
                <p className="text-gray-600 text-sm mb-2">
                  Explore our library of legal document templates.
                </p>
                <Button variant="outline" onClick={() => navigate('/documents')}>
                  Browse Documents
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default DivorceSettlementAgreementInfo;
