import React from 'react';
import { ArrowLeft, FileText, Shield, Clock, DollarSign, AlertTriangle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const StorageSpaceLeaseInfo = () => {
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
          <FileText className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Storage Space Lease Agreement</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create a comprehensive month-to-month storage space lease agreement for personal property storage with clear terms and liability protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <Clock className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Month-to-Month Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Flexible lease arrangement that continues monthly until terminated by either party with proper notice.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Payment Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Clear payment terms with security deposits and receipt requirements for cash payments.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>Liability Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Defines responsibility and risk allocation, protecting lessor from liability while encouraging lessee insurance.
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
                <p><strong>Storage Facility Owners:</strong> Self-storage businesses, mini-storage operators, warehouse owners</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Individual Property Owners:</strong> Those renting out garage space, basement storage, or shed space</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Commercial Property Managers:</strong> Managing storage units in commercial buildings</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p><strong>Renters:</strong> Individuals seeking personal storage space for belongings</p>
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
                <p><strong>Usage Restrictions:</strong> Personal property only, no electrical appliances</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Prohibited Items:</strong> No hazardous, illegal, or dangerous materials</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Maintenance Requirements:</strong> Clean, orderly condition requirements</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <p><strong>Assignment Restrictions:</strong> No subletting without written consent</p>
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
              <h4 className="font-semibold text-amber-800 mb-2">Risk and Insurance</h4>
              <p className="text-amber-700 text-sm">
                This agreement clearly states that the lessee stores property at their own risk and the lessor provides no insurance coverage. Lessees are strongly encouraged to obtain their own storage insurance to protect their belongings.
              </p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Security Considerations</h4>
              <p className="text-blue-700 text-sm">
                The agreement acknowledges that storage premises may not have security systems. Both parties should understand the security limitations and take appropriate precautions.
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">State Law Compliance</h4>
              <p className="text-purple-700 text-sm">
                Storage lease agreements are subject to state-specific regulations. Ensure compliance with local laws regarding storage facilities, lien rights, and termination procedures in your jurisdiction.
              </p>
            </div>
          </CardContent>
        </Card>

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
                  <li>• Full legal names of lessor and lessee</li>
                  <li>• Complete addresses for both parties</li>
                  <li>• Storage unit specific address</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Financial Terms:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Monthly rental amount</li>
                  <li>• Security deposit amount</li>
                  <li>• Payment due date (day of month)</li>
                  <li>• Termination notice period</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">

        </div>
      </div>
    </Layout>
  );
};

export default StorageSpaceLeaseInfo;
