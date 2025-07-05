import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Building, DollarSign, Shield, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BillboardLeaseInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button
          variant="outline"
          onClick={() => navigate('/documents')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Button>

        <div className="text-center mb-8">
          <Building className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Billboard Lease Agreement</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive lease agreement for billboard advertising space on private property
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                What is a Billboard Lease Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Billboard Lease Agreement is a legal contract between a property owner (landlord) and a billboard 
                company or advertiser (billboard owner) that grants permission to erect, operate, and maintain billboard 
                advertising structures on the landlord's property.
              </p>
              <p className="text-gray-700">
                This agreement establishes the terms and conditions for the use of designated property space, including 
                rental payments, maintenance responsibilities, insurance requirements, and termination procedures. It 
                protects both parties' interests while ensuring compliance with local advertising regulations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Key Components of Our Billboard Lease
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Property & Location:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Detailed property description</li>
                    <li>• Physical and legal address</li>
                    <li>• Designated billboard area boundaries</li>
                    <li>• Access rights and restrictions</li>
                    <li>• Exclusive use provisions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Financial Terms:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Annual and monthly rent amounts</li>
                    <li>• Payment schedule and methods</li>
                    <li>• Tax and fee responsibilities</li>
                    <li>• Utility cost allocation</li>
                    <li>• Late payment provisions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Protection:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Comprehensive indemnification clauses</li>
                    <li>• Insurance requirements and coverage</li>
                    <li>• Compliance with laws and regulations</li>
                    <li>• Dispute resolution procedures</li>
                    <li>• Governing law specifications</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Operational Terms:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Billboard construction specifications</li>
                    <li>• Maintenance and repair obligations</li>
                    <li>• Termination and renewal options</li>
                    <li>• Property restoration requirements</li>
                    <li>• Notice and communication procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                Who Needs a Billboard Lease Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Property Owners</h4>
                  <p className="text-sm text-gray-700">
                    Landowners seeking additional income from billboard advertising on their property
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Billboard Companies</h4>
                  <p className="text-sm text-gray-700">
                    Advertising companies needing strategic locations for billboard installations
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Marketing Agencies</h4>
                  <p className="text-sm text-gray-700">
                    Agencies securing outdoor advertising space for client marketing campaigns
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Local Businesses</h4>
                  <p className="text-sm text-gray-700">
                    Small businesses wanting to place advertising on nearby properties
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Essential Lease Provisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1">Exclusive Use Rights</h4>
                  <p className="text-blue-800 text-sm">
                    Billboard owner gets exclusive use of designated area while landlord retains rights to other property areas.
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-1">Access and Maintenance</h4>
                  <p className="text-green-800 text-sm">
                    Reasonable access granted for billboard construction, maintenance, repair, and inspection activities.
                  </p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-1">Insurance Requirements</h4>
                  <p className="text-purple-800 text-sm">
                    Commercial general liability and property damage insurance with landlord named as additional insured.
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-1">Property Restoration</h4>
                  <p className="text-orange-800 text-sm">
                    Billboard removal and property restoration to original condition required upon lease termination.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Lease Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Duration & Renewal:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Specific start and end dates</li>
                    <li>• Renewal option with 6-month notice</li>
                    <li>• Early termination provisions</li>
                    <li>• Regulatory compliance termination rights</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Maintenance & Compliance:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Billboard owner maintenance responsibility</li>
                    <li>• Compliance with all applicable laws</li>
                    <li>• Weather and vandalism damage repair</li>
                    <li>• Clean and attractive condition requirements</li>
                  </ul>
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
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Notarization Required</h4>
                <p className="text-yellow-700 text-sm">
                  This agreement must be signed in front of a notary public and may need to be filed 
                  with the local court or clerk's office.
                </p>
              </div>
              
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>Local Regulations:</strong> Billboard installations must comply with local zoning laws, 
                  building codes, and advertising regulations that vary by jurisdiction.
                </p>
                <p>
                  <strong>Permit Requirements:</strong> Most jurisdictions require permits for billboard construction 
                  and operation. Check local requirements before proceeding.
                </p>
                <p>
                  <strong>Environmental Impact:</strong> Consider visual impact, traffic safety, and community 
                  standards when selecting billboard locations.
                </p>
                <p>
                  <strong>Property Rights:</strong> Ensure the landlord has clear title and authority to grant 
                  billboard rights on the property.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Benefits of a Professional Billboard Lease
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">For Property Owners:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Additional passive income stream</li>
                    <li>• Clear liability protection</li>
                    <li>• Property value enhancement potential</li>
                    <li>• Professional relationship management</li>
                    <li>• Defined termination procedures</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">For Billboard Owners:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Secure long-term advertising location</li>
                    <li>• Clear usage rights and boundaries</li>
                    <li>• Predictable cost structure</li>
                    <li>• Renewal option protection</li>
                    <li>• Legal compliance framework</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">

        </div>
      </div>
    </div>
  );
};

export default BillboardLeaseInfo;
