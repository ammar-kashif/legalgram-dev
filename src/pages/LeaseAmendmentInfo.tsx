import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Calendar } from "lucide-react";

const LeaseAmendmentInfo = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lease Amendment</h1>
            <p className="text-lg text-gray-600">
              A legal document to modify existing lease agreements between landlords and tenants
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Lease Amendment?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Lease Amendment is a legal document that modifies or changes specific terms of an existing 
                lease agreement without replacing the entire contract. This allows landlords and tenants to 
                update lease terms such as rent amount, lease duration, utility responsibilities, or other 
                provisions while keeping the original lease structure intact.
              </p>
              <p className="text-gray-700">
                The amendment becomes part of the original lease and takes precedence over any conflicting 
                terms in the original agreement. It provides a formal, legally binding way to document 
                changes that both parties have agreed upon.
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
                    <li>• Original lease details and date</li>
                    <li>• Property address and description</li>
                    <li>• Specific changes being made</li>
                    <li>• Amendment effective date</li>
                    <li>• Parties' acknowledgment</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal Protections</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Confirmation of lease validity</li>
                    <li>• Conflict resolution clause</li>
                    <li>• Binding effect provisions</li>
                    <li>• Recording options</li>
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
                Who Should Use This Amendment?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Landlords</h4>
                  <p className="text-sm text-gray-700">
                    Property owners who need to modify lease terms for rent changes, policy updates, or maintenance responsibilities
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Property Managers</h4>
                  <p className="text-sm text-gray-700">
                    Management companies updating lease terms across multiple properties or tenant requests
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Tenants</h4>
                  <p className="text-sm text-gray-700">
                    Renters requesting modifications to their lease terms or formalizing agreed-upon changes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                Common Amendment Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Rent Adjustments</h4>
                  <p className="text-sm text-gray-700">Modifying rental amounts due to market changes, improvements, or operating cost increases</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Lease Extension</h4>
                  <p className="text-sm text-gray-700">Extending the lease term without creating an entirely new agreement</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Utility Responsibilities</h4>
                  <p className="text-sm text-gray-700">Changing which party pays for utilities, maintenance, or other services</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Policy Updates</h4>
                  <p className="text-sm text-gray-700">Adding or modifying pet policies, parking arrangements, or occupancy rules</p>
                </div>
                <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400">
                  <h4 className="font-semibold">Property Modifications</h4>
                  <p className="text-sm text-gray-700">Updating terms related to tenant improvements or property modifications</p>
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
                  <h4 className="font-semibold text-red-800 mb-2">Mutual Agreement Required</h4>
                  <p className="text-red-700 text-sm">
                    Both landlord and tenant must agree to all changes. Unilateral modifications are not valid 
                    and may violate the original lease terms.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Written Documentation</h4>
                  <p className="text-yellow-700 text-sm">
                    All amendments should be in writing and signed by both parties. Verbal agreements 
                    may not be enforceable and can lead to disputes.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Original Lease Validity</h4>
                  <p className="text-blue-700 text-sm">
                    Ensure the original lease is valid and neither party is in default before executing 
                    an amendment. Address any outstanding issues first.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Local Law Compliance</h4>
                  <p className="text-green-700 text-sm">
                    Check local and state laws regarding lease modifications, especially for rent control 
                    areas or tenant protection regulations.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Recording Options</h4>
                  <p className="text-purple-700 text-sm">
                    Consider whether the amendment should be recorded with local authorities, especially 
                    for significant changes or long-term modifications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Amendment vs. New Lease
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Use Amendment When:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Making minor modifications</li>
                    <li>• Changing 1-3 specific terms</li>
                    <li>• Original lease is working well overall</li>
                    <li>• Quick updates are needed</li>
                    <li>• Preserving original lease structure</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Consider New Lease When:</h4>
                  <ul className="space-y-1 text-orange-700 text-sm">
                    <li>• Making extensive changes</li>
                    <li>• Modifying multiple sections</li>
                    <li>• Original lease has many problems</li>
                    <li>• Starting a new lease term</li>
                    <li>• Complete restructuring needed</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Lease Amendment?</h3>
              <p className="text-gray-600 mb-4">
                Our guided form will help you create a comprehensive and legally sound lease amendment 
                that properly modifies your existing lease agreement.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeaseAmendmentInfo;
