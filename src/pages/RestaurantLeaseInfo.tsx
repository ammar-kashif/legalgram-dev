import React from 'react';
import { ArrowLeft, FileText, UtensilsCrossed, Shield, Clock, DollarSign, AlertTriangle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const RestaurantLeaseInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="outline" 
          onClick={() => navigate('/documents')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Documents
        </Button>

        <div className="text-center mb-8">
          <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Restaurant Lease Agreement</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create a comprehensive lease agreement for restaurant and food service businesses with specialized terms for commercial food operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <UtensilsCrossed className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Food Service Specific</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Specialized terms for restaurant operations including grease management, pest control, and food safety compliance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Flexible Renewal</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Automatic renewal options with customizable terms and notice periods to protect business continuity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Comprehensive Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete protection including liability insurance, signage rights, parking allocation, and equipment provisions.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Who Should Use This Agreement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Restaurant Owners:</strong> Independent restaurants, cafes, coffee shops, and food service businesses</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Food Truck Operators:</strong> Mobile food vendors seeking permanent commissary or kitchen space</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Franchise Operators:</strong> Fast food and restaurant franchise operators leasing commercial space</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Commercial Property Owners:</strong> Landlords leasing space to food service businesses</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Key Agreement Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Use Restrictions:</strong> Restaurant and coffee shop operations, limited alcohol sales</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Operational Requirements:</strong> Pest control, grease management, janitorial services</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Signage Rights:</strong> Awning and signage installation with landlord approval</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Parking Allocation:</strong> Customer parking and exclusive carry-out spaces</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
              Important Legal Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Food Service Licensing</h4>
              <p className="text-amber-700 text-sm">
                Restaurant operations require specific health department permits, food handler licenses, and potentially liquor licenses. Ensure all regulatory requirements are met before lease commencement.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Insurance Requirements</h4>
              <p className="text-blue-700 text-sm">
                Commercial general liability insurance is mandatory with landlord named as additional insured. Consider food contamination coverage and business interruption insurance for comprehensive protection.
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Operational Compliance</h4>
              <p className="text-purple-700 text-sm">
                Tenant responsibilities include pest control in food areas, professional grease removal, waste management, and maintaining sanitary conditions per health department standards.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Lease Terms & Flexibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Automatic Renewal:</strong> Built-in renewal provisions to protect business continuity</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Sale Protection:</strong> Termination notice requirements if property is sold</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Damage Coverage:</strong> Repair procedures and cost limits for property damage</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Holdover Terms:</strong> Clear procedures if tenant remains after lease expiration</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Financial Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Security Deposit:</strong> Customizable deposit amounts for performance assurance</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Late Fee Structure:</strong> Grace periods and penalty amounts for late payments</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Returned Check Fees:</strong> Charges for insufficient fund situations</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Tax Allocation:</strong> Clear division of real estate and personal property taxes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What You'll Need</CardTitle>
            <CardDescription>Gather this information before starting the form</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Party Information:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Full legal names of landlord and tenant</li>
                  <li>• Complete addresses for both parties</li>
                  <li>• Restaurant name and location address</li>
                  <li>• Legal property description</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Financial Terms:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Monthly rent and security deposit amounts</li>
                  <li>• Liability insurance coverage requirements</li>
                  <li>• Late fees and returned check charges</li>
                  <li>• Renewal terms and pricing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Operational Details:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Number of parking spaces allocated</li>
                  <li>• Storage area descriptions</li>
                  <li>• Furnished equipment and fixtures list</li>
                  <li>• Repair cost limits and procedures</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Governing state for legal jurisdiction</li>
                  <li>• Notary public information</li>
                  <li>• Notice periods for termination/renewal</li>
                  <li>• Sale termination provisions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/restaurant-lease-form')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Start Creating Your Restaurant Lease Agreement
            <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantLeaseInfo;
