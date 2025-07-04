import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Calendar, Building, DollarSign } from "lucide-react";

const CommercialLeaseInfo = () => {
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
            <Building className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Commercial Lease Agreement</h1>
            <p className="text-lg text-gray-600">
              A comprehensive legal document for leasing commercial properties to businesses
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Commercial Lease Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Commercial Lease Agreement is a legally binding contract between a landlord and a business tenant 
                for the rental of commercial property. Unlike residential leases, commercial leases are typically 
                more complex and include specific provisions for business operations, exclusivity rights, insurance 
                requirements, and property maintenance responsibilities.
              </p>
              <p className="text-gray-700">
                These agreements provide legal protection for both parties and establish clear terms for rent, 
                lease duration, renewal options, property use, and termination conditions. Commercial leases 
                often include specialized clauses for business needs such as signage rights, parking allocations, 
                and modification permissions.
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
                  <h4 className="font-semibold mb-2">Essential Terms</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Property description and address</li>
                    <li>• Lease term and renewal options</li>
                    <li>• Monthly rent and payment terms</li>
                    <li>• Security deposit requirements</li>
                    <li>• Permitted business use</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Business Protections</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Exclusivity clauses</li>
                    <li>• Insurance requirements</li>
                    <li>• Maintenance responsibilities</li>
                    <li>• Default and cure provisions</li>
                    <li>• Termination conditions</li>
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
                  <h4 className="font-semibold mb-2">Property Owners</h4>
                  <p className="text-sm text-gray-700">
                    Landlords leasing commercial spaces to businesses, requiring professional lease terms
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Business Owners</h4>
                  <p className="text-sm text-gray-700">
                    Companies and entrepreneurs seeking retail, office, or industrial space for operations
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Real Estate Professionals</h4>
                  <p className="text-sm text-gray-700">
                    Agents and property managers handling commercial leasing transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-orange-600" />
                Types of Commercial Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Retail Spaces</h4>
                  <p className="text-sm text-gray-700">Storefronts, shopping centers, and commercial buildings for customer-facing businesses</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Office Buildings</h4>
                  <p className="text-sm text-gray-700">Professional office spaces, business centers, and corporate headquarters</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Industrial Properties</h4>
                  <p className="text-sm text-gray-700">Warehouses, manufacturing facilities, and distribution centers</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Mixed-Use Properties</h4>
                  <p className="text-sm text-gray-700">Buildings combining commercial, residential, or office spaces</p>
                </div>
                <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400">
                  <h4 className="font-semibold">Special Purpose</h4>
                  <p className="text-sm text-gray-700">Restaurants, medical facilities, and other specialized business properties</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Financial Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Rent Structure</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Base rent amount and escalations</li>
                    <li>• Additional rent (CAM charges)</li>
                    <li>• Percentage rent for retail</li>
                    <li>• Payment terms and late fees</li>
                    <li>• Security deposit requirements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Operating Expenses</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Property taxes and assessments</li>
                    <li>• Insurance premiums</li>
                    <li>• Maintenance and repairs</li>
                    <li>• Utilities and services</li>
                    <li>• Common area maintenance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Lease Terms & Renewal Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Initial Term</h4>
                  <p className="text-blue-700 text-sm">
                    Commercial leases typically range from 3-10 years, with longer terms often preferred 
                    by businesses making significant investments in the space.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Renewal Options</h4>
                  <p className="text-green-700 text-sm">
                    Many commercial leases include automatic renewal clauses or tenant options to extend 
                    the lease for additional terms at predetermined or market rates.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Early Termination</h4>
                  <p className="text-purple-700 text-sm">
                    Provisions for early termination may include penalties, notice requirements, 
                    or specific triggering events such as property sale or major damages.
                  </p>
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
                  <h4 className="font-semibold text-red-800 mb-2">Zoning and Permits</h4>
                  <p className="text-red-700 text-sm">
                    Ensure the property is properly zoned for your business use and that all necessary 
                    permits can be obtained for your intended operations.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Insurance Requirements</h4>
                  <p className="text-yellow-700 text-sm">
                    Commercial leases typically require substantial liability insurance and may include 
                    requirements for property insurance, naming the landlord as additional insured.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Maintenance Responsibilities</h4>
                  <p className="text-blue-700 text-sm">
                    Clearly understand who is responsible for structural repairs, HVAC maintenance, 
                    utilities, and common area upkeep to avoid disputes.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Assignment and Subletting</h4>
                  <p className="text-green-700 text-sm">
                    Review restrictions on transferring the lease, subletting space, or assigning 
                    the lease to another business entity.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Default and Remedies</h4>
                  <p className="text-purple-700 text-sm">
                    Understand the cure periods for different types of defaults and the landlord's 
                    remedies, including potential acceleration of rent and eviction procedures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Special Commercial Provisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Business Protections:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Exclusivity clauses for business type</li>
                    <li>• Signage and advertising rights</li>
                    <li>• Parking space allocations</li>
                    <li>• Property modification permissions</li>
                    <li>• Hours of operation flexibility</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Landlord Protections:</h4>
                  <ul className="space-y-1 text-orange-700 text-sm">
                    <li>• Use restrictions and compliance</li>
                    <li>• Property condition maintenance</li>
                    <li>• Insurance and indemnification</li>
                    <li>• Default cure periods</li>
                    <li>• Property access rights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Commercial Lease Agreement?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive form will guide you through creating a professional commercial lease 
                agreement that protects both landlord and tenant interests.
              </p>
              <Button 
                onClick={() => navigate('/make-document/commercial-lease')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                Start Creating Your Commercial Lease
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommercialLeaseInfo;
