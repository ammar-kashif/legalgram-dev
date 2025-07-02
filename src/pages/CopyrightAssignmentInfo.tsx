import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Shield, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const CopyrightAssignmentInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Copyright Assignment Agreement
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transfer intellectual property rights professionally with our comprehensive copyright assignment templates
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Complete Rights Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ensures full transfer of all copyright ownership and associated rights from assignor to assignee
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Clear Party Identification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Properly identifies both the assignor (transferring party) and assignee (receiving party)
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Legal Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Includes warranties, representations, and moral rights waivers for comprehensive protection
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What's Included */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">What's Included in Your Copyright Assignment</CardTitle>
            <CardDescription>
              Our comprehensive template covers all essential elements of copyright transfer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Complete Rights Assignment</h4>
                    <p className="text-sm text-gray-600">Transfer of all copyrights and associated intellectual property rights</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Work Description & Identification</h4>
                    <p className="text-sm text-gray-600">Detailed description and title of the copyrighted work being assigned</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Ownership Warranties</h4>
                    <p className="text-sm text-gray-600">Representations that the assignor is the sole creator and owner</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Scope of Assigned Rights</h4>
                    <p className="text-sm text-gray-600">Full exploitation rights including reproduction, distribution, and licensing</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Registration & Renewal Rights</h4>
                    <p className="text-sm text-gray-600">Authority to obtain and maintain copyright registrations and renewals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Moral Rights Waiver</h4>
                    <p className="text-sm text-gray-600">Waiver of attribution, integrity, and other moral rights</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Legal Protections</h4>
                    <p className="text-sm text-gray-600">Warranties against third-party claims and infringement</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Governing Law Clause</h4>
                    <p className="text-sm text-gray-600">Clear jurisdiction and applicable law specification</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">When to Use a Copyright Assignment</CardTitle>
            <CardDescription>
              Copyright assignments are essential in various professional and creative scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">Creative Industries</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Transferring book, article, or manuscript rights to publishers</li>
                  <li>• Assigning music composition or recording rights</li>
                  <li>• Transferring artwork, photography, or design rights</li>
                  <li>• Software code assignment from developers to companies</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-lg text-gray-900">Business Contexts</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Work-for-hire arrangements and employee assignments</li>
                  <li>• Freelancer and contractor copyright transfers</li>
                  <li>• Business acquisition intellectual property transfers</li>
                  <li>• Educational institution research assignments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-xl text-amber-800 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Important Legal Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p className="mb-4">
              <strong>Copyright assignments are permanent and irreversible transfers.</strong> Once executed, the assignor typically cannot reclaim the rights unless specifically provided for in the agreement.
            </p>
            <p className="mb-4">
              Consider consulting with an intellectual property attorney for:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>High-value intellectual property transfers</li>
              <li>Complex multi-party assignments</li>
              <li>International copyright considerations</li>
              <li>Assignments involving existing licenses or encumbrances</li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900">Ready to Create Your Copyright Assignment?</CardTitle>
            <CardDescription className="text-lg">
              Generate a professional copyright assignment in minutes with our guided process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Multi-step guided process
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Instant PDF generation
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Professional formatting
                </div>
              </div>
              <Button 
                size="lg" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                onClick={() => navigate('/documents/copyright-assignment')}
              >
                Create Copyright Assignment Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Complete the form and generate your professional copyright assignment document
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CopyrightAssignmentInfo;
