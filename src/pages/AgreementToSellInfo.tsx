import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Shield, CheckCircle, ArrowRight, AlertTriangle, Scale, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const AgreementToSellInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Agreement to Sell
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create legally binding agreements for future transfers of property, goods, or assets with clear terms and conditions
          </p>
        </div>

        {/* What Is Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">What Is an Agreement to Sell?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              An Agreement to Sell is a legally binding document that outlines the intention of a seller to transfer ownership of goods, property, or assets to a buyer at a future date under agreed conditions. Unlike a Sale Agreement, where the transfer is immediate, an Agreement to Sell sets the terms for a future sale — making it especially useful in real estate, vehicle transactions, business asset transfers, and installment-based deals.
            </p>
            <p className="text-gray-600">
              This document safeguards the interests of both parties by clarifying expectations, payment timelines, and contingencies before the final transfer of ownership. Whether you're a business owner, property seller, or individual entering a conditional sale, creating a properly drafted Agreement to Sell helps prevent misunderstandings and serves as legal evidence in case of disputes.
            </p>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Future Transfer Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Secure terms for future ownership transfer while maintaining legal clarity and protection for both parties
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Payment Flexibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Structure installment payments, deposits, and milestone-based transactions with clear financial terms
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Scale className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Legal Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Serves as strong legal evidence in disputes with comprehensive terms and court-ready documentation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* When to Use */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">When to Use an Agreement to Sell</CardTitle>
            <CardDescription>
              Use an Agreement to Sell for US-based transactions in the following scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">You intend to transfer property or goods at a future date</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">You require a legally recognized document outlining sale conditions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">You want legal clarity in court-related matters regarding the pending sale</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">You wish to secure a down payment while finalizing delivery or title transfer</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600">You are selling real estate, vehicles, or goods in installments or after conditions are met</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">What to Include in the Best Agreement to Sell</CardTitle>
            <CardDescription>
              A well-structured and legally enforceable Agreement to Sell should contain the following clauses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Details of Buyer and Seller</h4>
                    <p className="text-sm text-gray-600">Full legal names, contact addresses, and identification of both parties</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Description of Goods or Property</h4>
                    <p className="text-sm text-gray-600">Clear definition of what's being sold with specifications and unique identifiers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Purchase Price and Payment Terms</h4>
                    <p className="text-sm text-gray-600">Total sale price, payment schedule, deposits, and settlement dates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Delivery and Possession Date</h4>
                    <p className="text-sm text-gray-600">When the buyer will receive possession or ownership</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Conditions Precedent to Sale</h4>
                    <p className="text-sm text-gray-600">Conditions that must be fulfilled before the final sale</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Default and Cancellation Terms</h4>
                    <p className="text-sm text-gray-600">Consequences if either party fails to meet their obligations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Risk and Liability</h4>
                    <p className="text-sm text-gray-600">Who bears the risk of damage or loss before sale completion</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Representations and Warranties</h4>
                    <p className="text-sm text-gray-600">Seller declarations regarding ownership and condition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Dispute Resolution & Governing Law</h4>
                    <p className="text-sm text-gray-600">How disputes will be handled and applicable state laws</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Execution and Signatures</h4>
                    <p className="text-sm text-gray-600">Proper signatures and notarization if required</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Types Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Types of Agreement to Sell You Can Draft</CardTitle>
            <CardDescription>
              Depending on the nature of your transaction, you can tailor the Agreement to Sell for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Real Estate</h4>
                  <p className="text-blue-700 text-sm">Land, plots, houses, or commercial properties with delayed title transfer</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Vehicles</h4>
                  <p className="text-green-700 text-sm">Conditional sale of cars, motorcycles, or trucks with installment payments</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Business Assets</h4>
                  <p className="text-purple-700 text-sm">Transfer of company equipment, stock, or goodwill</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Installment-Based Deals</h4>
                  <p className="text-orange-700 text-sm">Transactions where payment or transfer is scheduled over time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Legal Terms Commonly Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Seller</h4>
                  <p className="text-sm text-gray-600">The party agreeing to sell the property or goods</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Buyer</h4>
                  <p className="text-sm text-gray-600">The party agreeing to purchase the item under specified terms</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Consideration</h4>
                  <p className="text-sm text-gray-600">The payment to be made by the buyer in exchange for ownership</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Possession Date</h4>
                  <p className="text-sm text-gray-600">The date on which the buyer is entitled to take control</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Earnest Money</h4>
                  <p className="text-sm text-gray-600">A deposit paid to secure the transaction</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Condition Precedent</h4>
                  <p className="text-sm text-gray-600">Legal or financial requirements that must be satisfied before the sale completes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-xl text-amber-800 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Agreement to Sell for Court Use
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p className="mb-4">
              When you need an Agreement to Sell for court proceedings, it must:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Clearly define all parties and terms</li>
              <li>Include evidence of payment or deposit made</li>
              <li>Be signed and, if required by law, notarized or witnessed</li>
              <li>Be accompanied by supporting documents such as property records, proof of negotiations, or communication between parties</li>
            </ul>
            <p>
              <strong>Properly drafted, this document can be submitted as strong evidence in legal disputes.</strong>
            </p>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Can I create my own Agreement to Sell without hiring a lawyer?</h4>
              <p className="text-gray-600">Yes, using platforms like Legal Gram, you can draft an Agreement to Sell that complies with state laws and meets the specific needs of your transaction.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is notarization mandatory?</h4>
              <p className="text-gray-600">Not always, but it is highly recommended—especially for real estate or high-value transactions that may be used in court or recorded with government offices.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What's the difference between a Sale Agreement and Agreement to Sell?</h4>
              <p className="text-gray-600">A Sale Agreement usually confirms an immediate sale, while an Agreement to Sell outlines future sale terms. The former transfers ownership right away; the latter delays it until conditions are met.</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Ready to Create Your Agreement to Sell?</CardTitle>
            <CardDescription className="text-lg">
              Generate a professional Agreement to Sell in minutes with our guided process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Multi-step guided process
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Court-ready documentation
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Professional formatting
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                onClick={() => navigate('/documents/agreement-to-sell')}
              >
                Create Agreement to Sell Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Complete the form and generate your professional Agreement to Sell document
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AgreementToSellInfo;
