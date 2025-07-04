import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, TrendingUp, Target, DollarSign, Shield, Users, Copyright } from "lucide-react";

const CopyrightRequestInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/documents')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Button>
          
          <div className="text-center mb-8">
            <Copyright className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Copyright Permission Request</h1>
            <p className="text-lg text-gray-600">
              Formally request permission to use copyrighted material in your projects
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Copyright Permission Request?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Copyright Permission Request is a formal letter requesting authorization to use 
                copyrighted material owned by another party. This document establishes proper 
                legal permission before using someone else's intellectual property, protecting 
                you from copyright infringement claims.
              </p>
              <p className="text-gray-700">
                The request includes specific details about the work you want to use, how you 
                plan to use it, and provides the copyright owner with all necessary information 
                to make an informed decision about granting permission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Key Components of Our Copyright Permission Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Your complete name and address</li>
                    <li>• Phone, fax, and email contact details</li>
                    <li>• Recipient's name and organization</li>
                    <li>• Recipient's complete mailing address</li>
                    <li>• Professional business letterhead format</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Work Identification</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Title of the copyrighted work</li>
                    <li>• Author or creator identification</li>
                    <li>• Specific excerpt or material description</li>
                    <li>• Intended use and distribution plans</li>
                    <li>• Attribution and acknowledgment offers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Who Needs a Copyright Permission Request?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Content Creators</h4>
                  <p className="text-sm text-gray-700">
                    Bloggers, authors, and media producers using copyrighted material in their work
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Educational Institutions</h4>
                  <p className="text-sm text-gray-700">
                    Schools, universities, and educators using copyrighted content for teaching
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Businesses</h4>
                  <p className="text-sm text-gray-700">
                    Companies using copyrighted images, text, or media in marketing materials
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Legal Protection & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Copyright Infringement Prevention</h4>
                  <p className="text-sm text-gray-700">Protects against legal claims and potential damages from unauthorized use</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Proper Attribution</h4>
                  <p className="text-sm text-gray-700">Establishes agreement on how to credit the original creator or copyright owner</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Usage Limitations</h4>
                  <p className="text-sm text-gray-700">Clarifies scope, duration, and restrictions on how the material may be used</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Documentation</h4>
                  <p className="text-sm text-gray-700">Creates written record of permission for future reference and legal protection</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Copyright className="w-5 h-5 mr-2 text-green-600" />
                Types of Copyrighted Material
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Written Content:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Books, articles, and publications</li>
                    <li>• Blog posts and online content</li>
                    <li>• Academic papers and research</li>
                    <li>• Poetry, lyrics, and creative writing</li>
                    <li>• News articles and journalism</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Visual & Audio Content:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Photographs and artwork</li>
                    <li>• Music and sound recordings</li>
                    <li>• Videos and documentaries</li>
                    <li>• Graphics, charts, and illustrations</li>
                    <li>• Software and digital media</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-indigo-600" />
                Request Process & Follow-Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Initial Contact</h4>
                  <p className="text-blue-700 text-sm">
                    Send formal request letter with complete details about intended use, 
                    duration, and distribution plans for the copyrighted material.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Response Timeline</h4>
                  <p className="text-green-700 text-sm">
                    Allow adequate time for response (typically 2-4 weeks). Copyright 
                    owners may need time to review and make decisions about permissions.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Documentation</h4>
                  <p className="text-purple-700 text-sm">
                    Keep copies of all correspondence and any granted permissions for 
                    your records and potential future legal requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-pink-600" />
                Best Practices & Professional Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Clear Purpose Statement</h4>
                  <p className="text-sm text-gray-700">Specifically describe how and why you need to use the copyrighted material</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Professional Presentation</h4>
                  <p className="text-sm text-gray-700">Use formal business letter format with complete contact information</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Attribution Offer</h4>
                  <p className="text-sm text-gray-700">Demonstrate willingness to provide proper credit and acknowledgment</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Follow-Up Protocol</h4>
                  <p className="text-sm text-gray-700">Maintain professional communication and respect response timelines</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Important Legal Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Fair Use Limitations</h4>
                  <p className="text-red-700 text-sm">
                    Fair use has specific limitations. When in doubt, always request 
                    permission rather than assuming fair use applies to your situation.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Commercial vs. Non-Commercial Use</h4>
                  <p className="text-yellow-700 text-sm">
                    Clearly specify whether your use is commercial or non-commercial, 
                    as this significantly impacts permission requirements and fees.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">International Copyright Laws</h4>
                  <p className="text-blue-700 text-sm">
                    Be aware that copyright laws vary by country, and international 
                    use may require additional permissions or considerations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                Benefits of Professional Copyright Permission Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Legal Protection:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Prevents copyright infringement claims</li>
                    <li>• Establishes authorized usage rights</li>
                    <li>• Creates documented permission trail</li>
                    <li>• Reduces legal risk and liability</li>
                    <li>• Demonstrates due diligence compliance</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Professional Benefits:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Maintains ethical content practices</li>
                    <li>• Builds positive creator relationships</li>
                    <li>• Supports original content creators</li>
                    <li>• Enhances professional reputation</li>
                    <li>• Enables legitimate content usage</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Copyright Permission Request?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive 4-step form will guide you through creating a professional 
                copyright permission request with all necessary details and legal formatting.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Takes 8-12 minutes • Professional PDF output • Includes checklist
              </p>
              <Button 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/copyright-request-form')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CopyrightRequestInfo;
