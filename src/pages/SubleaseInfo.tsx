import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Calendar } from "lucide-react";

const SubleaseInfo = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sublease Agreement</h1>
            <p className="text-lg text-gray-600">
              A legal document allowing tenants to sublet their rental property to another party
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Sublease Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Sublease Agreement is a legal contract that allows a current tenant (sublessor) to rent out 
                all or part of their leased property to another person (sublessee/subtenant) for a specified period. 
                This arrangement creates a secondary lease relationship while the original lease remains in effect.
              </p>
              <p className="text-gray-700">
                The sublease agreement establishes terms between the original tenant and the subtenant, while the 
                original tenant remains responsible to the landlord under the prime lease. This document includes 
                property inspection checklists and ensures all parties understand their rights and obligations.
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
                    <li>• Original lease details and dates</li>
                    <li>• Sublease term and rent amount</li>
                    <li>• Property address and description</li>
                    <li>• Security deposit requirements</li>
                    <li>• Property inspection checklist</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal Protections</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Landlord consent requirements</li>
                    <li>• Prime lease incorporation</li>
                    <li>• Dispute resolution procedures</li>
                    <li>• Notice delivery methods</li>
                    <li>• Binding agreement provisions</li>
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
                  <h4 className="font-semibold mb-2">Current Tenants</h4>
                  <p className="text-sm text-gray-700">
                    Renters who need to temporarily sublet their property due to travel, work, or personal reasons
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Students</h4>
                  <p className="text-sm text-gray-700">
                    College students going abroad or taking breaks who want to sublet their apartments
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Professionals</h4>
                  <p className="text-sm text-gray-700">
                    Working professionals on temporary assignments or relocations
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
                  <h4 className="font-semibold">Temporary Relocation</h4>
                  <p className="text-sm text-gray-700">When moving temporarily for work, study abroad, or extended travel</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Financial Relief</h4>
                  <p className="text-sm text-gray-700">When sharing rent costs by subletting a room or portion of the property</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Summer Break</h4>
                  <p className="text-sm text-gray-700">Students subletting during summer or semester breaks</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Early Departure</h4>
                  <p className="text-sm text-gray-700">When leaving before lease expiration but avoiding lease termination fees</p>
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
                  <h4 className="font-semibold text-red-800 mb-2">Landlord Consent Required</h4>
                  <p className="text-red-700 text-sm">
                    Most lease agreements require written consent from the landlord before subletting. 
                    Always obtain this consent before entering into a sublease agreement.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Original Lease Obligations</h4>
                  <p className="text-yellow-700 text-sm">
                    The original tenant remains liable under the prime lease. If the subtenant fails to pay 
                    rent or damages the property, the original tenant is still responsible to the landlord.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Security Deposits</h4>
                  <p className="text-blue-700 text-sm">
                    Determine whether the security deposit will be handled by the landlord or original tenant, 
                    and ensure compliance with local security deposit laws.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Property Inspection</h4>
                  <p className="text-green-700 text-sm">
                    Document the property condition before the subtenant moves in using the included 
                    inspection checklist to avoid disputes later.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Included Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Document Sections</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Complete sublease terms and conditions</li>
                    <li>• Payment schedules and deposit handling</li>
                    <li>• Notice requirements and addresses</li>
                    <li>• Dispute resolution procedures</li>
                    <li>• Landlord consent documentation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Exhibit C - Inspection Checklist</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• 17-item property condition assessment</li>
                    <li>• Bathrooms, kitchen appliances, fixtures</li>
                    <li>• Flooring, walls, windows, and doors</li>
                    <li>• Comments section for each item</li>
                    <li>• Signature and date requirements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Sublease Agreement?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive form includes everything you need, including the property inspection checklist 
                and all necessary legal provisions.
              </p>
              <Button 
                onClick={() => navigate('/make-document/sublease')}
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

export default SubleaseInfo;
