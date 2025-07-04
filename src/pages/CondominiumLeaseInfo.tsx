import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Shield, Clock, Users, AlertTriangle, CheckCircle, Building } from "lucide-react";

const CondominiumLeaseInfo = () => {
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
            Condominium Lease Agreement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive guide to understanding and creating a Condominium Lease Agreement
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* What is a Condominium Lease Agreement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              What is a Condominium Lease Agreement?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              A Condominium Lease Agreement is a specialized rental contract for condominium units that addresses 
              the unique aspects of condo living, including shared common areas, association rules, and property 
              management considerations. This agreement establishes the legal relationship between the landlord 
              (unit owner) and tenant while ensuring compliance with condominium association regulations.
            </p>
          </CardContent>
        </Card>

        {/* Key Differences from Regular Lease */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Key Differences from Regular Lease Agreements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Condominium-Specific Features</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Common area usage rights and restrictions</li>
                  <li>Condominium association rules compliance</li>
                  <li>Property management contact information</li>
                  <li>Shared amenities access and policies</li>
                  <li>Parking and storage allocations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Additional Considerations</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>HOA fees and assessments</li>
                  <li>Building rules and regulations</li>
                  <li>Noise restrictions and quiet hours</li>
                  <li>Guest policies and limitations</li>
                  <li>Maintenance responsibilities</li>
                </ul>
              </div>
            </div>
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
              <li>Renting out your condominium unit to tenants</li>
              <li>Leasing a condominium unit as a tenant</li>
              <li>Establishing clear rules for condo living arrangements</li>
              <li>Ensuring compliance with condominium association requirements</li>
              <li>Protecting both landlord and tenant rights in a condo setting</li>
              <li>Setting expectations for shared amenities and common areas</li>
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
                <h4 className="font-semibold text-gray-900 mb-2">Basic Lease Terms</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Landlord and tenant information</li>
                  <li>Unit address and description</li>
                  <li>Lease term and renewal options</li>
                  <li>Rent amount and payment terms</li>
                  <li>Security deposit requirements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Condo-Specific Terms</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Property management contact details</li>
                  <li>Common area usage guidelines</li>
                  <li>Guest policies and restrictions</li>
                  <li>Parking and storage assignments</li>
                  <li>Association rules compliance</li>
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
                    <span className="text-gray-700 text-sm">Clear tenant obligations and restrictions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Protection from association violations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Defined maintenance responsibilities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Guest policy enforcement</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">For Tenants</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Clear access rights to amenities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Understanding of building rules</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Management contact information</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Defined occupancy rights</span>
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
              <h4 className="font-semibold text-orange-800 mb-2">Condominium Association Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-orange-700 text-sm">
                <li>Check if association approval is required for tenants</li>
                <li>Ensure lease terms comply with association bylaws</li>
                <li>Understand guest policies and common area rules</li>
                <li>Verify parking and storage allocations</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Legal Recommendations</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                <li>Review association documents before signing</li>
                <li>Clarify maintenance responsibilities between landlord and tenant</li>
                <li>Understand local landlord-tenant laws for condominiums</li>
                <li>Consider consulting with a real estate attorney</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Special Features */}
        <Card>
          <CardHeader>
            <CardTitle>Special Features of Our Condominium Lease Form</CardTitle>
            <CardDescription>
              Our comprehensive form addresses all aspects of condominium leasing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Property management contact integration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Detailed guest policy provisions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Common area usage guidelines</span>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Comprehensive fee structure</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Military termination clauses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">State-compliant legal framework</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Get Started */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to Create Your Condominium Lease Agreement?</CardTitle>
            <CardDescription>
              Our guided form will help you create a comprehensive Condominium Lease Agreement 
              tailored to your specific condominium and rental situation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/documents/condominium-lease')}
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

export default CondominiumLeaseInfo;
