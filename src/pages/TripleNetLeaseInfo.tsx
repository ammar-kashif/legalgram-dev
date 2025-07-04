import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Calendar, Building, DollarSign, TrendingUp } from "lucide-react";

const TripleNetLeaseInfo = () => {
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
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Triple Net Lease Agreement</h1>
            <p className="text-lg text-gray-600">
              A specialized commercial lease where tenants pay all property expenses beyond base rent
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Triple Net Lease Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Triple Net Lease (NNN) is a commercial lease agreement where the tenant assumes responsibility 
                for all property expenses in addition to the base rent. This includes property taxes, insurance, 
                and maintenance costs. The "triple" refers to the three main expense categories that tenants 
                must pay: taxes, insurance, and common area maintenance (CAM).
              </p>
              <p className="text-gray-700">
                This lease structure shifts the financial burden and responsibility for property operations 
                from the landlord to the tenant, providing landlords with predictable income while giving 
                tenants greater control over property management decisions. Triple net leases are commonly 
                used for retail, industrial, and single-tenant commercial properties.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                The "Triple Net" Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Property Taxes</h4>
                  <p className="text-sm text-gray-700">
                    Real estate taxes, assessments, and any government-imposed fees on the property
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Insurance</h4>
                  <p className="text-sm text-gray-700">
                    Property casualty insurance, liability coverage, and any required commercial insurance
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Maintenance (CAM)</h4>
                  <p className="text-sm text-gray-700">
                    All repairs, maintenance, utilities, landscaping, and common area upkeep costs
                  </p>
                </div>
              </div>
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
                    <li>• Base rent amount</li>
                    <li>• Property description and address</li>
                    <li>• Lease term and renewal options</li>
                    <li>• Expense allocation details</li>
                    <li>• Termination provisions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tenant Responsibilities</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• All operating expenses</li>
                    <li>• Property maintenance and repairs</li>
                    <li>• Insurance coverage requirements</li>
                    <li>• Tax payments and assessments</li>
                    <li>• Compliance with regulations</li>
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3">Ideal for Landlords:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Seeking predictable, stable income</li>
                    <li>• Want to minimize management responsibilities</li>
                    <li>• Prefer long-term, single-tenant leases</li>
                    <li>• Looking to reduce operational risks</li>
                    <li>• Investment property owners</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Ideal for Tenants:</h4>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Want control over property operations</li>
                    <li>• Prefer lower base rent payments</li>
                    <li>• Long-term business commitments</li>
                    <li>• Established businesses with stable income</li>
                    <li>• Companies wanting property customization</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-orange-600" />
                Common Property Types for Triple Net Leases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Single-Tenant Retail</h4>
                  <p className="text-sm text-gray-700">Standalone stores, restaurants, banks, and other single-occupancy commercial buildings</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Industrial Properties</h4>
                  <p className="text-sm text-gray-700">Warehouses, manufacturing facilities, distribution centers, and logistics properties</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Medical Buildings</h4>
                  <p className="text-sm text-gray-700">Medical offices, clinics, urgent care centers, and specialized healthcare facilities</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Corporate Headquarters</h4>
                  <p className="text-sm text-gray-700">Single-tenant office buildings and corporate facilities with long-term commitments</p>
                </div>
                <div className="p-3 bg-indigo-50 border-l-4 border-indigo-400">
                  <h4 className="font-semibold">Automotive Properties</h4>
                  <p className="text-sm text-gray-700">Car dealerships, service centers, tire shops, and automotive retail locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Advantages & Disadvantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Landlord Benefits:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Predictable, stable income stream</li>
                    <li>• Reduced management responsibilities</li>
                    <li>• Protection from expense increases</li>
                    <li>• Lower operational involvement</li>
                    <li>• Attractive to investors</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Tenant Benefits:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Lower base rent amounts</li>
                    <li>• Control over maintenance quality</li>
                    <li>• Ability to customize property</li>
                    <li>• Direct vendor relationships</li>
                    <li>• Operational decision control</li>
                  </ul>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Potential Drawbacks for Landlords:</h4>
                  <ul className="space-y-1 text-orange-700 text-sm">
                    <li>• Lower overall rent receipts</li>
                    <li>• Limited expense recovery control</li>
                    <li>• Dependency on tenant's financial stability</li>
                    <li>• Reduced property oversight</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Potential Drawbacks for Tenants:</h4>
                  <ul className="space-y-1 text-red-700 text-sm">
                    <li>• Unpredictable operating expenses</li>
                    <li>• Full responsibility for major repairs</li>
                    <li>• Property tax increase exposure</li>
                    <li>• Higher overall occupancy costs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Lease Structure & Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Base Rent</h4>
                  <p className="text-blue-700 text-sm">
                    Typically lower than gross lease rates since tenants pay additional expenses. 
                    Often includes built-in escalations or rent reviews.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Expense Reconciliation</h4>
                  <p className="text-green-700 text-sm">
                    Tenants may pay estimated monthly charges with annual reconciliation, 
                    or pay actual expenses as they're incurred.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Lease Terms</h4>
                  <p className="text-purple-700 text-sm">
                    Typically longer terms (5-20 years) to justify tenant's investment in 
                    property improvements and operational setup.
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
                  <h4 className="font-semibold text-red-800 mb-2">Expense Verification</h4>
                  <p className="text-red-700 text-sm">
                    Tenants should have rights to audit and verify all operating expenses. 
                    Establish clear procedures for expense documentation and review.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Insurance Requirements</h4>
                  <p className="text-yellow-700 text-sm">
                    Clearly define minimum coverage amounts, types of insurance required, 
                    and who must be named as additional insured parties.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Maintenance Standards</h4>
                  <p className="text-blue-700 text-sm">
                    Establish clear standards for property maintenance and repair obligations 
                    to avoid disputes over condition and quality.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Tax Obligations</h4>
                  <p className="text-green-700 text-sm">
                    Understand local property tax laws and tenant's rights to contest 
                    assessments while protecting against liens and penalties.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Environmental Liability</h4>
                  <p className="text-purple-700 text-sm">
                    Address environmental compliance responsibilities and remediation 
                    obligations for any hazardous materials or contamination issues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Key Provisions to Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Financial Protections:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Expense cap provisions</li>
                    <li>• Audit rights for operating costs</li>
                    <li>• Security deposit requirements</li>
                    <li>• Termination fee structures</li>
                    <li>• Default cure periods</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Operational Controls:</h4>
                  <ul className="space-y-1 text-orange-700 text-sm">
                    <li>• Alteration and improvement rights</li>
                    <li>• Vendor selection criteria</li>
                    <li>• Emergency repair procedures</li>
                    <li>• Property access provisions</li>
                    <li>• Assignment and subletting rules</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Triple Net Lease Agreement?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive form will guide you through creating a professional triple net lease 
                agreement that clearly defines all responsibilities and protections for both parties.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripleNetLeaseInfo;
