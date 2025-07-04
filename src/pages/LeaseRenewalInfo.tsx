import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, CheckCircle, Users, Clock, Shield, Home, DollarSign, RefreshCw } from "lucide-react";

const LeaseRenewalInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <div className="mb-8">
      
          <div className="text-center mb-8">
            <RefreshCw className="w-16 h-16 text-bright-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Lease Renewal Agreement Guide</h1>
            <p className="text-xl text-gray-600">Complete guide to understanding and creating your Lease Renewal Agreement</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What Is a Lease Renewal Agreement?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A Lease Renewal Agreement is a legally binding contract that extends the terms of an existing lease agreement between a landlord and tenant. This document allows both parties to continue their rental relationship without creating an entirely new lease, while potentially updating terms such as rent amount, lease duration, or other conditions.
            </p>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Benefits of Using Legal Gram:</h3>
              <ul className="text-green-800 space-y-1">
                <li>• Create lease renewal agreements for free</li>
                <li>• Fast, compliant, and hassle-free process</li>
                <li>• Professional documents that comply with state laws</li>
                <li>• Streamlined renewal process for existing tenancies</li>
              </ul>
            </div>
          </section>

          {/* When to Use Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Clock className="w-6 h-6 text-orange-500 mr-2" />
              When Should You Use a Lease Renewal Agreement?
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Consider using a Lease Renewal Agreement in these situations:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900">For Landlords:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Current lease is expiring</li>
                  <li>• Want to retain good tenants</li>
                  <li>• Need to adjust rent or terms</li>
                  <li>• Avoid vacancy periods</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900">For Tenants:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Happy with current living situation</li>
                  <li>• Want to continue tenancy</li>
                  <li>• Negotiate better terms</li>
                  <li>• Avoid moving costs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Key Components Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <FileText className="w-6 h-6 text-blue-500 mr-2" />
              Key Components of a Lease Renewal Agreement
            </h2>
            
            <div className="grid gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-900">Property Details</h4>
                <p className="text-gray-600">Complete address and description of the rental property being renewed.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-900">Parties Information</h4>
                <p className="text-gray-600">Full names and contact details of landlord(s) and tenant(s).</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-900">Original Lease Reference</h4>
                <p className="text-gray-600">Reference to the original lease agreement being renewed.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-900">Renewal Terms</h4>
                <p className="text-gray-600">New lease period, rent amount, and any updated conditions.</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-900">Signatures and Date</h4>
                <p className="text-gray-600">Legal signatures from all parties and effective date of renewal.</p>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              Our Simple 4-Step Process
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold mb-1">Property & Parties Information</h4>
                  <p className="text-gray-600">Enter property details and information for all landlords and tenants.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold mb-1">Original Lease Details</h4>
                  <p className="text-gray-600">Provide information about the original lease agreement being renewed.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold mb-1">Renewal Terms</h4>
                  <p className="text-gray-600">Set the new lease period, rent amount, and any changes to the original terms.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold mb-1">Review & Generate</h4>
                  <p className="text-gray-600">Review all information and generate your professional lease renewal agreement.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Benefits Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Shield className="w-6 h-6 text-purple-500 mr-2" />
              Legal Benefits & Protection
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">For Landlords:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Maintain legal tenant relationship</li>
                  <li>• Update terms as needed</li>
                  <li>• Ensure continued rental income</li>
                  <li>• Reduce vacancy risks</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">For Tenants:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Secure continued housing</li>
                  <li>• Clear terms and conditions</li>
                  <li>• Legal protection of rights</li>
                  <li>• Avoid relocation costs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Important Considerations */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
              <Users className="w-6 h-6 text-indigo-500 mr-2" />
              Important Considerations
            </h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">Before Creating Your Lease Renewal Agreement:</h4>
              <ul className="text-blue-800 space-y-2">
                <li>• Review your original lease agreement thoroughly</li>
                <li>• Check local and state rental laws for any restrictions</li>
                <li>• Consider current market rates if adjusting rent</li>
                <li>• Ensure all parties agree to the renewal terms</li>
                <li>• Plan for adequate notice period before current lease expires</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6">
              <h4 className="font-semibold text-amber-900 mb-3">Legal Disclaimer:</h4>
              <p className="text-amber-800">
                This lease renewal agreement template is provided for informational purposes. While comprehensive, 
                rental laws vary by jurisdiction. For complex situations or legal questions, consider consulting 
                with a qualified attorney familiar with your local rental regulations.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Ready to Create Your Lease Renewal Agreement?</h2>
            <p className="text-gray-600 mb-6">
              Generate a professional, legally-compliant lease renewal agreement in minutes with our easy-to-use form.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <Button 
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold text-lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Documents
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default LeaseRenewalInfo;
