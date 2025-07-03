import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, HandshakeIcon, Shield, AlertTriangle, CheckCircle } from "lucide-react";

const SaleAgreementInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
 

        <Card className="mb-8">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <HandshakeIcon className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Sale Agreement Information
            </CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              Understanding Sales Agreements and Contract Terms
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          {/* What is a Sales Agreement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-600">
                <FileText className="w-6 h-6 mr-2" />
                What is a Sales Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                A Sales Agreement is a legally binding contract that outlines the terms and conditions for the sale of goods or services. Whether your business is selling to or buying from another company—or you're an individual purchasing services from a business—a properly drafted Sales Agreement helps avoid misunderstandings and ensures both parties are clear on their responsibilities.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This document defines essential elements such as delivery terms, pricing, payment details, service scope, and the effective date of the sale. If you're looking to create the best Sales Agreement for US transactions, Legal Gram offers customizable, easy-to-use templates designed to meet professional and legal standards.
              </p>
            </CardContent>
          </Card>

          {/* When to Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-600">
                <Shield className="w-6 h-6 mr-2" />
                When to Use a Sales Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Use a Sales Agreement when:
              </p>
              <div className="grid md:grid-cols-1 gap-4">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Your business is selling goods or services to another company</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Your business is purchasing products or services from a vendor or supplier</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>You are an individual purchasing services from a business provider</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                In all these cases, a written agreement offers clarity, legal protection, and a reference point in case of disputes.
              </p>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">What's Included in a Sales Agreement?</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                A well-prepared Sales Agreement should cover the following key points:
              </p>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">1. Effective Date</h3>
                  <p className="text-gray-700">
                    The contract should specify when the agreement becomes legally binding, which could be upon signing or at a future date agreed upon by the parties.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">2. Order Number (if applicable)</h3>
                  <p className="text-gray-700">
                    An order or invoice number may be included to reference the specific transaction being covered.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">3. Payment Details</h3>
                  <p className="text-gray-700 mb-2">This section defines:</p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Where payment should be sent</li>
                    <li>Payment schedule (e.g., deposit, full payment, installments)</li>
                    <li>Accepted methods of payment (e.g., bank transfer, credit card, check)</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">4. Payment to Seller or Service Provider</h3>
                  <p className="text-gray-700">
                    Clarifies how the seller will be paid, whether as a lump sum, in milestones, or through recurring payments.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-blue-700">
                  <strong>Note:</strong> If you're still collecting details like pricing or delivery deadlines, you can begin drafting the contract and return to complete it later.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Creating Online */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Creating a Sales Agreement Online</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Using Legal Gram, you can create a Sales Agreement for free by answering simple questions. The contract updates in real time based on your responses, allowing you to:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Customize it for goods or services</li>
                  <li>• Input buyer and seller information</li>
                </ul>
                <ul className="space-y-2 text-gray-700">
                  <li>• Add terms such as delivery dates, location, or warranties</li>
                  <li>• Save your draft and complete it later</li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Even if you're missing a few details, you can save your draft and complete it later—perfect for businesses needing flexibility.
              </p>
            </CardContent>
          </Card>

          {/* Special Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-amber-600">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Special Cases: Real Estate Sales Agreements
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800">
                  If you're selling or buying real property, you'll need a different document—such as a Real Estate Purchase Agreement. This contract outlines the terms, conditions, and legal process for transferring ownership of land, a home, or commercial space.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Registration Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Is Registration of a Sales Agreement Required?</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                In most cases, registering a Sales Agreement is not mandatory. However, keeping signed copies on file is strongly recommended for both legal and recordkeeping purposes.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">When Registration May Apply:</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Real estate transactions</li>
                  <li>International transactions</li>
                  <li>High-value commercial sales</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3">
                  Standard business-to-business or business-to-consumer service agreements typically do not require registration.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Why Use */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Why Use a Sales Agreement?</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                A written Sales Agreement helps:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Define the scope of the transaction</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Clarify payment and delivery expectations</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Reduce the risk of disputes</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Provide a clear legal remedy if one party fails to perform</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4">
                Whether you're a buyer, seller, or service recipient, a clear and enforceable contract is a vital business tool.
              </p>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Create Your Sales Agreement for Free with Legal Gram
              </h3>
              <p className="text-blue-700 mb-6">
                Legal Gram offers a simple way to draft a Sales Agreement for US businesses or individuals. Our intuitive builder creates a legally sound document customized for your needs—without the hassle of hiring a lawyer for basic terms.
              </p>
              <Button 
                onClick={() => navigate('/documents/sale-agreement')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Create Now
              </Button>
              <p className="text-blue-600 mt-3 text-sm">
                Protect your next transaction with confidence
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SaleAgreementInfo;
