import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, FileText, Shield, DollarSign, Calendar, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const OfficeSpaceLeaseInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Building2 className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Office Space Lease Agreement
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a comprehensive lease agreement for commercial office space with professional terms and legal protection
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Legal Protection</h3>
              <p className="text-sm text-gray-600">Comprehensive terms protecting both parties</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Financial Terms</h3>
              <p className="text-sm text-gray-600">Clear rent, deposits, and payment obligations</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Flexible Terms</h3>
              <p className="text-sm text-gray-600">Customizable lease duration and renewal options</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Professional Use</h3>
              <p className="text-sm text-gray-600">Designed specifically for commercial office leasing</p>
            </CardContent>
          </Card>
        </div>

        {/* What's Included */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              What's Included in Your Office Space Lease Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Essential Terms</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Detailed premises description and legal description</li>
                  <li>• Lease term with start and end dates</li>
                  <li>• Monthly rent amount and payment schedule</li>
                  <li>• Security deposit requirements</li>
                  <li>• Possession and occupancy terms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Property Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Furnished vs. unfurnished specifications</li>
                  <li>• Designated parking space allocation</li>
                  <li>• Storage area access and limitations</li>
                  <li>• Common area usage rights</li>
                  <li>• Utility and service responsibilities</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Insurance & Liability</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Property insurance requirements</li>
                  <li>• General liability insurance minimums</li>
                  <li>• Certificate of insurance obligations</li>
                  <li>• Additional insured requirements</li>
                  <li>• Casualty and damage provisions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900">Operational Terms</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Maintenance and repair responsibilities</li>
                  <li>• Pest control and janitorial obligations</li>
                  <li>• Late payment fees and NSF charges</li>
                  <li>• Renewal and termination procedures</li>
                  <li>• Default and remedy provisions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 text-blue-600 mr-2" />
              When to Use an Office Space Lease Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-700">Perfect For:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Leasing commercial office space</li>
                  <li>• Professional service businesses</li>
                  <li>• Co-working space arrangements</li>
                  <li>• Executive suite rentals</li>
                  <li>• Corporate office relocations</li>
                  <li>• Startup office space needs</li>
                  <li>• Professional practice offices</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-blue-700">Key Situations:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Business expansion into new markets</li>
                  <li>• Establishing professional presence</li>
                  <li>• Temporary office space needs</li>
                  <li>• Shared office arrangements</li>
                  <li>• Professional meeting space rental</li>
                  <li>• Administrative headquarters setup</li>
                  <li>• Client-facing business locations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Considerations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              Important Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-amber-800 mb-2">Before Signing:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Inspect the premises thoroughly for any existing damage</li>
                <li>• Verify zoning compliance for your business type</li>
                <li>• Understand all insurance requirements and obtain quotes</li>
                <li>• Review local building codes and ADA compliance</li>
                <li>• Clarify maintenance responsibilities for HVAC, plumbing, etc.</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Legal Requirements:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Some states require specific disclosures in commercial leases</li>
                <li>• Consider having the agreement reviewed by a commercial attorney</li>
                <li>• Ensure compliance with local landlord-tenant laws</li>
                <li>• Verify proper business licensing for the premises</li>
                <li>• Check if notarization is required in your jurisdiction</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Create Your Office Space Lease Agreement?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Generate a professional, legally compliant lease agreement in minutes with our step-by-step process.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This document template is provided for informational purposes only and does not constitute legal advice.
            For complex commercial leasing situations, please consult with a qualified attorney.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficeSpaceLeaseInfo;
