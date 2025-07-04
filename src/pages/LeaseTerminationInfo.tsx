import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, Clock, Users, AlertTriangle, CheckCircle } from "lucide-react";

const LeaseTerminationInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Agreement to Terminate Lease
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive guide to understanding and creating an Agreement to Terminate Lease
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* What is an Agreement to Terminate Lease */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              What is an Agreement to Terminate Lease?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              An Agreement to Terminate Lease is a legal document that allows both landlord and tenant 
              to mutually agree to end a lease agreement before its natural expiration date. This document 
              formally releases both parties from their ongoing obligations under the original lease, 
              provided all agreed-upon conditions are met.
            </p>
          </CardContent>
        </Card>

        {/* When You Need This Document */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              When You Need This Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Tenant needs to move before lease expiration due to job relocation</li>
              <li>Landlord wants to sell the property or renovate extensively</li>
              <li>Both parties agree to end the lease early for mutual benefit</li>
              <li>Financial circumstances change for either party</li>
              <li>Property becomes unsuitable for continued occupancy</li>
              <li>Family circumstances require relocation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Key Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Key Components of the Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Essential Information</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Full names of landlord and tenant</li>
                  <li>Property address and description</li>
                  <li>Original lease date and terms</li>
                  <li>Agreed termination date</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Additional Terms</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Tenant's forwarding address</li>
                  <li>Survival of certain lease provisions</li>
                  <li>Security deposit arrangements</li>
                  <li>Final obligations and responsibilities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Protections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-indigo-600" />
              Legal Protections and Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">For Landlords</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Avoid lengthy eviction processes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Clear documentation of lease termination</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Ability to re-rent property quickly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Protection from future liability claims</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">For Tenants</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Avoid breaking lease penalties</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Clear end date with no further obligations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Formal documentation for future rentals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Security deposit return clarity</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Considerations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Important Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-orange-800 mb-2">Before Signing</h4>
              <ul className="list-disc list-inside space-y-1 text-orange-700 text-sm">
                <li>Ensure all parties agree to the termination voluntarily</li>
                <li>Clarify any financial obligations or settlements</li>
                <li>Agree on property condition and inspection requirements</li>
                <li>Determine security deposit return timeline and conditions</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Legal Recommendations</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Both parties should keep signed copies of the agreement</li>
                <li>Consider consulting with a legal professional for complex situations</li>
                <li>Ensure compliance with local and state landlord-tenant laws</li>
                <li>Document the property condition at termination</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Get Started */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to Create Your Agreement to Terminate Lease?</CardTitle>
            <CardDescription>
              Our guided form will help you create a comprehensive Agreement to Terminate Lease 
              tailored to your specific situation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/lease-termination-form')}
              className="w-full md:w-auto"
            >
              <FileText className="w-4 h-4 mr-2" />
              Start Creating Your Agreement
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaseTerminationInfo;
