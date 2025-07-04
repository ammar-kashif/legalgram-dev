import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Shield, Lock, Eye, Users, Scale, Clock } from "lucide-react";

const ConfidentialInformationInfo = () => {
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
            <Shield className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Confidential Information Agreement</h1>
            <p className="text-lg text-gray-600">
              Protect sensitive business information with legally binding confidentiality terms
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Confidential Information Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Confidential Information Agreement (CIA) is a legal contract that establishes 
                obligations for parties to protect sensitive, proprietary, or confidential 
                information shared during business discussions, evaluations, or potential 
                partnerships. This agreement ensures that confidential information remains 
                protected and is used only for its intended purpose.
              </p>
              <p className="text-gray-700">
                Unlike mutual NDAs, this agreement typically involves one party (the Disclosing Party) 
                sharing confidential information with another party (the Receiving Party), with specific 
                obligations placed on the receiver to maintain confidentiality and proper use of the 
                information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-600" />
                What Information is Protected?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Business Information:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Business strategies and plans</li>
                    <li>• Financial data and projections</li>
                    <li>• Customer and supplier lists</li>
                    <li>• Marketing strategies and plans</li>
                    <li>• Operational procedures</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Information:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Software and technical data</li>
                    <li>• Formulas and inventions</li>
                    <li>• Research and development</li>
                    <li>• Trade secrets and processes</li>
                    <li>• Proprietary methodologies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                When Do You Need This Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Business Partnerships</h4>
                  <p className="text-sm text-gray-700">
                    When exploring potential partnerships or joint ventures requiring information sharing
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Investment Discussions</h4>
                  <p className="text-sm text-gray-700">
                    During due diligence processes with potential investors or acquirers
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Vendor Relations</h4>
                  <p className="text-sm text-gray-700">
                    When sharing sensitive information with contractors, consultants, or service providers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
                Key Obligations & Protections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Confidentiality Obligations</h4>
                  <p className="text-blue-700 text-sm">
                    The receiving party must maintain confidentiality using the same degree of care 
                    they use for their own confidential information and cannot disclose to third parties 
                    without written consent.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Limited Use Authorization</h4>
                  <p className="text-green-700 text-sm">
                    Confidential information may only be used for the specific purpose stated in the 
                    agreement, typically evaluating potential business relationships.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Return or Destruction Rights</h4>
                  <p className="text-purple-700 text-sm">
                    The disclosing party can request return or destruction of all confidential materials 
                    at any time, including any materials prepared based on the information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-orange-600" />
                Information Exclusions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">
                The confidentiality obligations do not apply to information that:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Public Information</h4>
                  <p className="text-sm text-gray-700">Information that is or becomes publicly available without breach of the agreement</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Prior Knowledge</h4>
                  <p className="text-sm text-gray-700">Information that was lawfully known to the receiving party before disclosure</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Third-Party Disclosure</h4>
                  <p className="text-sm text-gray-700">Information disclosed by a third party legally entitled to do so</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Independent Development</h4>
                  <p className="text-sm text-gray-700">Information independently developed without reference to the confidential information</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2 text-red-600" />
                Legal Protections & Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">No License Grant</h4>
                  <p className="text-red-700 text-sm">
                    The agreement clarifies that no ownership rights or licenses are granted 
                    to the receiving party regarding the confidential information.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">No Disclosure Obligation</h4>
                  <p className="text-yellow-700 text-sm">
                    Neither party is required to disclose information or enter into any 
                    business relationship as a result of this agreement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-teal-600" />
                Agreement Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                  <h4 className="font-semibold text-teal-800">Information Provided "As Is"</h4>
                  <p className="text-sm text-teal-700">The disclosing party makes no warranties regarding accuracy or completeness of information</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Written Waiver Requirement</h4>
                  <p className="text-sm text-blue-700">Any waiver of agreement provisions must be in writing and signed by both parties</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Governing Law Selection</h4>
                  <p className="text-sm text-purple-700">The agreement allows specification of which state's laws will govern the contract</p>
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
                  <h4 className="font-semibold text-red-800 mb-2">Clear Purpose Definition</h4>
                  <p className="text-red-700 text-sm">
                    Clearly define the specific purpose for information sharing to ensure appropriate 
                    use and prevent misunderstandings about permitted activities.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Information Marking</h4>
                  <p className="text-yellow-700 text-sm">
                    Consider marking confidential documents appropriately and maintaining records 
                    of what information has been shared and when.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Term and Duration</h4>
                  <p className="text-blue-700 text-sm">
                    While this template doesn't specify a duration, consider whether you need 
                    time limits on confidentiality obligations for your specific situation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Confidential Information Agreement?</h3>
              <p className="text-gray-600 mb-4">
                Our streamlined 3-step form will guide you through creating a comprehensive 
                confidential information agreement tailored to your specific needs.
              </p>
              <Button 
                onClick={() => navigate('/confidential-information-form')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Start Creating Agreement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConfidentialInformationInfo;
