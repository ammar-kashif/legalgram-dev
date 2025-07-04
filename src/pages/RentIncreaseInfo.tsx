import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Calendar } from "lucide-react";

const RentIncreaseInfo = () => {
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
            <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent Increase Agreement</h1>
            <p className="text-lg text-gray-600">
              A legal document to formalize rent increases between landlords and tenants
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Rent Increase Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Rent Increase Agreement is a legal document that formalizes an increase in rent between a landlord 
                and tenant. This agreement serves as an amendment to the original lease agreement and establishes the 
                new rental amount, effective date, and payment terms while keeping all other lease terms intact.
              </p>
              <p className="text-gray-700">
                This document provides legal protection for both parties by clearly documenting the agreed-upon rent 
                increase and ensuring compliance with local rent control laws and lease requirements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Key Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Essential Information</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Current lease details and date</li>
                    <li>• Current rent amount and due date</li>
                    <li>• New rent amount</li>
                    <li>• Effective date of increase</li>
                    <li>• Property address</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal Protections</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Binding agreement clause</li>
                    <li>• Governing law specification</li>
                    <li>• Entire agreement provision</li>
                    <li>• No other modifications clause</li>
                    <li>• Signature requirements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Who Should Use This Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Landlords</h4>
                  <p className="text-sm text-gray-700">
                    Property owners who need to increase rent in accordance with lease terms and local laws
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Property Managers</h4>
                  <p className="text-sm text-gray-700">
                    Management companies handling rent adjustments for multiple properties
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Tenants</h4>
                  <p className="text-sm text-gray-700">
                    Renters who want formal documentation of agreed-upon rent increases
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                When to Use This Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Market Rate Adjustments</h4>
                  <p className="text-sm text-gray-700">When increasing rent to match current market rates</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Property Improvements</h4>
                  <p className="text-sm text-gray-700">After making significant improvements or renovations</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Operating Cost Increases</h4>
                  <p className="text-sm text-gray-700">When property taxes, insurance, or maintenance costs rise</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Lease Renewal</h4>
                  <p className="text-sm text-gray-700">During lease renewal negotiations</p>
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
                  <h4 className="font-semibold text-red-800 mb-2">Notice Requirements</h4>
                  <p className="text-red-700 text-sm">
                    Check your local and state laws for required notice periods before implementing rent increases. 
                    Some jurisdictions require 30, 60, or even 90 days notice.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Rent Control Laws</h4>
                  <p className="text-yellow-700 text-sm">
                    Some areas have rent control or rent stabilization laws that limit how much and how often 
                    rent can be increased. Always verify local regulations.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Lease Terms</h4>
                  <p className="text-blue-700 text-sm">
                    Review the original lease agreement to ensure rent increases are permitted and follow 
                    any specified procedures or limitations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Rent Increase Agreement?</h3>
              <p className="text-gray-600 mb-4">
                Our guided form will help you create a comprehensive and legally sound rent increase agreement 
                in just a few minutes.
              </p>
              <Button 
                onClick={() => navigate('/make-document/rent-increase')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                Start Creating Your Agreement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RentIncreaseInfo;
