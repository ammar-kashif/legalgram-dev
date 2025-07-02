import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield, Scale, Package } from "lucide-react";

const GeneralContractInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
          
          <div className="text-center mb-8">
            <Package className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">General Contract for Products Guide</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your General Contract for Products</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Is a General Contract for Products?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A General Contract for Products is a legally binding agreement used when two businesses agree to buy or sell physical goods. This type of contract clearly sets out the terms of sale, including quantity, price, delivery schedule, location, warranties, and payment arrangements. By formalizing your transaction in writing, you reduce the risk of miscommunication and protect both parties' interests.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Whether you're purchasing goods from a supplier or selling products to a customer, a General Contract for Products for US businesses helps establish mutual expectations and keeps your business relationships professional and compliant.
            </p>
          </section>

          {/* When to Use Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-bright-orange-500" />
              When to Use a General Contract for Products
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You should use a General Contract for Products when:
            </p>
            <ul className="text-gray-700 space-y-2 ml-4">
              <li>• You are a business purchasing goods from another business.</li>
              <li>• You are a business selling products to another company.</li>
              <li>• You want to document the transaction formally to avoid disputes.</li>
              <li>• You want to clarify details such as quantity, delivery timeline, payment terms, and liability.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              This agreement is ideal for one-time or recurring sales of goods between businesses. It is not intended for real estate, software, intellectual property, or financial instruments such as stocks and securities.
            </p>
          </section>

          {/* What It Includes Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-bright-orange-500" />
              What Does a General Contract for Products Include?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A well-drafted Product Sales Agreement or Contract for Goods should include the following essential provisions:
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">1. Identification of the Parties</h3>
                <p className="text-gray-700">
                  The full legal names and contact details of the buyer and seller are listed. This ensures the agreement applies only to the specified parties, both of whom must be business entities.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">2. Description of the Goods</h3>
                <p className="text-gray-700 mb-2">
                  This section defines the products being sold, including:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Quantity</li>
                  <li>• Product specifications</li>
                  <li>• Unit price or total price</li>
                  <li>• Product codes or descriptions (if applicable)</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">3. Order and Delivery Dates</h3>
                <p className="text-gray-700 mb-2">
                  Clearly states:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• The date of the order</li>
                  <li>• The expected delivery date(s)</li>
                  <li>• Whether the goods will be delivered in a single shipment or in parts</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">4. Place of Delivery</h3>
                <p className="text-gray-700">
                  Identifies the delivery location, including any transfer of title or risk of loss. For example, whether the seller is responsible for shipping or if delivery is to occur at the buyer's warehouse.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">5. Warranties and Disclaimers</h3>
                <p className="text-gray-700 mb-2">
                  This clause may include:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• A limited warranty from the seller confirming the goods are free of defects</li>
                  <li>• A disclaimer of warranties such as merchantability or fitness for a particular purpose</li>
                  <li>• Remedies available in the event of defective goods</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">6. Payment Terms</h3>
                <p className="text-gray-700 mb-2">
                  Outlines the financial terms, including:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Total amount due</li>
                  <li>• Deposit requirements (if any)</li>
                  <li>• Payment schedule (e.g., upon delivery, net 30)</li>
                  <li>• Accepted payment methods (bank transfer, credit, check)</li>
                  <li>• Late payment penalties or interest charges</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">7. Legal Scope</h3>
                <p className="text-gray-700 mb-2">
                  The agreement is governed by the Uniform Commercial Code (UCC), which regulates the sale of goods in the United States. The contract:
                </p>
                <ul className="text-gray-700 space-y-1 ml-4">
                  <li>• Covers only tangible goods (also known as "goods" under UCC)</li>
                  <li>• Does not apply to services, software, or real estate</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Signing Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-bright-orange-500" />
              Signing the General Contract for Products
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Both the buyer and seller must sign the agreement.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">The contract becomes legally effective as of the date listed in the document.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Each party should retain a signed copy for their business records.</p>
              </div>
            </div>
          </section>

          {/* Sample Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-bright-orange-500" />
              Sample General Contract for Products
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Legal Gram makes it easy to draft your General Contract for Products. Just answer a few guided questions about your transaction, and the contract will be customized accordingly. As you fill in your details—such as product types, quantities, delivery terms, and payment conditions—the agreement dynamically updates to reflect your input.
            </p>
          </section>

          {/* Why Use Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-bright-orange-500" />
              Why Use a General Contract for Products?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A written contract for the sale of goods provides legal clarity and avoids disputes by:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Outlining the terms of sale and delivery</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Establishing what happens if one party breaches the agreement</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700">Protecting your business under commercial contract laws</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              Whether you're a seller protecting your cash flow or a buyer securing delivery of promised goods, this agreement gives both sides legal peace of mind.
            </p>
          </section>

          {/* Legal Gram Section */}
          <section className="bg-bright-orange-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Scale className="w-6 h-6 mr-2 text-bright-orange-500" />
              Get Started with Legal Gram
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Looking to create the best General Contract for Products? Legal Gram offers professional templates tailored for US businesses that are easy to customize, sign, and share.
            </p>
            
            
            <p className="text-center text-lg font-semibold text-gray-800 mt-4">
              Draft your General Contract for Products for free and keep your business dealings smooth, secure, and legally sound.
            </p>
          </section>

          {/* Additional Information */}
          <section className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Need More Help?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Legal Advice</h4>
                <p className="text-gray-600 text-sm mb-2">
                  For complex business transactions or legal questions, consult with a qualified attorney.
                </p>
                <Button variant="outline" onClick={() => navigate('/ask-a-lawyer')}>
                  Ask a Lawyer
                </Button>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Other Forms</h4>
                <p className="text-gray-600 text-sm mb-2">
                  Explore our library of business and legal document templates.
                </p>
                <Button variant="outline" onClick={() => navigate('/documents')}>
                  Browse Documents
                </Button>
              </div>
            </div>
          </section>
        </div>
    </Layout>
);
};

export default GeneralContractInfo;
