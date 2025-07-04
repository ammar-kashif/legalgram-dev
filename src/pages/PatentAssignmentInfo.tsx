import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Lightbulb, Scale, Shield, Building } from "lucide-react";

const PatentAssignmentInfo = () => {
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
            <Lightbulb className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patent Assignment Agreement</h1>
            <p className="text-lg text-gray-600">
              Legal transfer of patent rights and ownership between parties
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Patent Assignment Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Patent Assignment Agreement is a legal document that transfers ownership of patent rights 
                from one party (the assignor) to another party (the assignee). This comprehensive transfer 
                includes all rights, title, and interest in the specified patents, including the right to 
                enforce, license, and commercialize the patents.
              </p>
              <p className="text-gray-700">
                Unlike licensing agreements that grant limited usage rights, a patent assignment represents 
                a complete transfer of ownership, similar to selling real estate. Once executed, the assignee 
                becomes the new legal owner of the patents with full control over their use and enforcement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Key Components of Our Patent Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Rights Transfer</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Complete ownership transfer</li>
                    <li>• Right to file and prosecute patents</li>
                    <li>• Enforcement and litigation rights</li>
                    <li>• Licensing and commercialization rights</li>
                    <li>• Rights to collect damages</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal Protections</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Warranty of clear ownership</li>
                    <li>• No liens or encumbrances</li>
                    <li>• Cooperation in transfer process</li>
                    <li>• Assistance with maintenance</li>
                    <li>• Governing law provisions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-purple-600" />
                Who Needs a Patent Assignment Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Companies</h4>
                  <p className="text-sm text-gray-700">
                    Acquiring patent portfolios, mergers and acquisitions, or purchasing competitor patents
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Inventors</h4>
                  <p className="text-sm text-gray-700">
                    Selling patents to companies, transferring employee inventions, or monetizing IP assets
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Investors</h4>
                  <p className="text-sm text-gray-700">
                    Patent investment funds, technology transfer, or strategic IP acquisitions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2 text-orange-600" />
                Assignment vs. Licensing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Patent Assignment</h4>
                  <p className="text-sm text-gray-700">Complete transfer of ownership rights - like selling a house</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Patent License</h4>
                  <p className="text-sm text-gray-700">Permission to use the patent while owner retains ownership - like renting a house</p>
                </div>
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Key Difference</h4>
                  <p className="text-sm text-gray-700">Assignment = permanent ownership change; License = temporary usage rights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Legal Requirements & Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Recording with USPTO</h4>
                  <p className="text-red-700 text-sm">
                    Patent assignments should be recorded with the USPTO within 3 months to maintain 
                    priority and provide public notice of the ownership change.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Due Diligence</h4>
                  <p className="text-yellow-700 text-sm">
                    Verify patent validity, conduct freedom-to-operate analysis, and ensure 
                    the assignor has clear title before executing the assignment.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">International Considerations</h4>
                  <p className="text-blue-700 text-sm">
                    For international patent families, separate assignments may be required 
                    for patents in different jurisdictions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                What's Included in the Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold">Patent Rights</h4>
                    <p className="text-sm text-gray-700">All rights in issued patents, pending applications, and related intellectual property</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold">Enforcement Rights</h4>
                    <p className="text-sm text-gray-700">Right to sue for infringement and collect past, present, and future damages</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold">Prosecution Rights</h4>
                    <p className="text-sm text-gray-700">Authority to file continuations, divisionals, and maintain patent validity</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold">Commercial Rights</h4>
                    <p className="text-sm text-gray-700">Freedom to license, sell, or commercialize the patented technology</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Important Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Irreversible Transfer</h4>
                  <p className="text-red-700 text-sm">
                    Unlike licenses, patent assignments are typically permanent. The assignor 
                    gives up all rights and cannot reclaim ownership without a new agreement.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Valuation Complexity</h4>
                  <p className="text-yellow-700 text-sm">
                    Patent valuation can be complex. Consider hiring IP valuation experts 
                    for high-value patents or large portfolios.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Tax Implications</h4>
                  <p className="text-blue-700 text-sm">
                    Patent sales may have significant tax consequences. Consult with tax 
                    professionals regarding capital gains and other tax considerations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Patent Assignment Agreement?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive 4-step form will guide you through creating a professional 
                patent assignment agreement that properly transfers patent ownership.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Takes 10-15 minutes • Professional PDF output
              </p>
              <Button 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/patent-assignment-form')}
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

export default PatentAssignmentInfo;
