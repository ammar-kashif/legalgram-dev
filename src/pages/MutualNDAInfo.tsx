import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Handshake, Shield, Building } from "lucide-react";

const MutualNDAInfo = () => {
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
            <Handshake className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mutual Non-Disclosure Agreement</h1>
            <p className="text-lg text-gray-600">
              Bilateral confidentiality protection for businesses sharing sensitive information
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Mutual NDA?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Mutual Non-Disclosure Agreement (Mutual NDA) is a bilateral contract where both parties 
                agree to protect each other's confidential information. Unlike a one-way NDA, both parties 
                are simultaneously the "Disclosing Party" and the "Receiving Party," making it ideal for 
                business partnerships, joint ventures, or collaborations where sensitive information flows 
                in both directions.
              </p>
              <p className="text-gray-700">
                This type of agreement ensures that proprietary information, trade secrets, business plans, 
                and other confidential materials shared during negotiations or partnerships remain protected, 
                creating a foundation of trust for successful business relationships.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Key Features of Mutual NDAs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Bilateral Protection</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Both parties protect shared information</li>
                    <li>• Equal confidentiality obligations</li>
                    <li>• Reciprocal non-disclosure duties</li>
                    <li>• Mutual enforcement rights</li>
                    <li>• Balanced legal protections</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Comprehensive Coverage</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Trade secrets and proprietary data</li>
                    <li>• Financial and operational information</li>
                    <li>• Customer lists and pricing data</li>
                    <li>• Technical specifications and processes</li>
                    <li>• Business strategies and plans</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                When to Use a Mutual NDA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Business Partnerships</h4>
                  <p className="text-sm text-gray-700">
                    Strategic alliances, joint ventures, and collaborative projects requiring mutual information sharing
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Merger & Acquisition</h4>
                  <p className="text-sm text-gray-700">
                    Due diligence processes where both companies exchange sensitive financial and operational data
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Technology Licensing</h4>
                  <p className="text-sm text-gray-700">
                    Technology transfers, licensing agreements, and R&D collaborations between companies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Confidentiality Obligations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Strict Confidentiality</h4>
                  <p className="text-sm text-gray-700">Both parties must maintain all shared information in strict confidence using reasonable care</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Limited Use Authorization</h4>
                  <p className="text-sm text-gray-700">Information may only be used for the specific purpose outlined in the agreement</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Third-Party Restrictions</h4>
                  <p className="text-sm text-gray-700">No disclosure to third parties without prior written consent from the disclosing party</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Employee Compliance</h4>
                  <p className="text-sm text-gray-700">Responsibility for ensuring employees and agents comply with confidentiality obligations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-indigo-600" />
                Scope of Protected Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Business Information:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Internal operational data and processes</li>
                    <li>• Financial and operational plans</li>
                    <li>• Marketing strategies and customer data</li>
                    <li>• Employee information and organization charts</li>
                    <li>• Pricing models and cost structures</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Information:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Product information and prototypes</li>
                    <li>• Trade secrets and proprietary methods</li>
                    <li>• Technical data and research findings</li>
                    <li>• Inventions, designs, and processes</li>
                    <li>• Software code and algorithms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Legal Protections & Remedies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Injunctive Relief</h4>
                  <p className="text-red-700 text-sm">
                    Parties can seek immediate court intervention to prevent disclosure or misuse of 
                    confidential information without posting bond.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Damages & Legal Fees</h4>
                  <p className="text-yellow-700 text-sm">
                    Breaching parties may be liable for all damages, including attorney fees and 
                    costs arising from the breach of confidentiality.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Return of Materials</h4>
                  <p className="text-blue-700 text-sm">
                    Parties must return or destroy all physical and digital materials containing 
                    confidential information upon request, with written certification.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Exclusions from Confidentiality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Pre-existing Knowledge</h4>
                  <p className="text-sm text-gray-700">Information already in the receiving party's possession before disclosure</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Public Information</h4>
                  <p className="text-sm text-gray-700">Information that becomes publicly known through no fault of the receiving party</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Independent Development</h4>
                  <p className="text-sm text-gray-700">Information independently developed without reference to the disclosed information</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Third-Party Disclosure</h4>
                  <p className="text-sm text-gray-700">Information disclosed by a third party legally entitled to share it</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                Benefits of Mutual NDAs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Business Benefits:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Enables open communication in partnerships</li>
                    <li>• Protects competitive advantages</li>
                    <li>• Facilitates due diligence processes</li>
                    <li>• Builds trust between organizations</li>
                    <li>• Supports strategic collaborations</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Legal Benefits:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Balanced legal protections for both parties</li>
                    <li>• Clear enforcement mechanisms</li>
                    <li>• Defined scope of confidential information</li>
                    <li>• Established dispute resolution framework</li>
                    <li>• Protection against misappropriation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Mutual NDA?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive form will guide you through creating a professional mutual 
                non-disclosure agreement that protects both parties' confidential information.
              </p>
              <Button 
                onClick={() => navigate('/mutual-nda-form')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Creating Your Mutual NDA
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MutualNDAInfo;
