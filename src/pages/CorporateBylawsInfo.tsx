import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Users, Calendar, Building, DollarSign, Scale } from "lucide-react";

const CorporateBylawsInfo = () => {
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
            <Scale className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Corporate Bylaws</h1>
            <p className="text-lg text-gray-600">
              Essential governing documents that establish corporate structure and operational procedures
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What are Corporate Bylaws?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Corporate Bylaws are internal rules and regulations that govern how a corporation operates. 
                They complement the Articles of Incorporation by providing detailed procedures for corporate 
                governance, including how meetings are conducted, how directors and officers are elected, 
                and how major decisions are made.
              </p>
              <p className="text-gray-700">
                While Articles of Incorporation create the corporation, Bylaws provide the framework for 
                day-to-day operations. They are legally binding on all shareholders, directors, and officers, 
                and help ensure the corporation operates in an organized and consistent manner while 
                complying with state corporate laws.
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
                  <h4 className="font-semibold mb-2">Organizational Structure</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Board of Directors composition</li>
                    <li>• Officer roles and responsibilities</li>
                    <li>• Shareholder rights and procedures</li>
                    <li>• Committee structures</li>
                    <li>• Corporate offices and addresses</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Operational Procedures</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Meeting requirements and notice</li>
                    <li>• Voting procedures and quorums</li>
                    <li>• Amendment processes</li>
                    <li>• Record keeping requirements</li>
                    <li>• Indemnification provisions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Who Needs Corporate Bylaws?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">New Corporations</h4>
                  <p className="text-sm text-gray-700">
                    Essential for newly formed corporations to establish governance structure
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Growing Businesses</h4>
                  <p className="text-sm text-gray-700">
                    Companies adding shareholders or seeking investment require formal bylaws
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Established Corporations</h4>
                  <p className="text-sm text-gray-700">
                    Updating bylaws to reflect changes in structure or operations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-orange-600" />
                Shareholders Section
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Annual & Special Meetings</h4>
                  <p className="text-sm text-gray-700">Rules for conducting shareholder meetings, including notice requirements and voting procedures</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Voting Rights & Proxies</h4>
                  <p className="text-sm text-gray-700">Procedures for shareholder voting, proxy authorization, and record date determination</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Quorum Requirements</h4>
                  <p className="text-sm text-gray-700">Minimum attendance requirements for valid shareholder meetings and decisions</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Action Without Meeting</h4>
                  <p className="text-sm text-gray-700">Provisions for shareholders to take action through written consent without formal meetings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Board of Directors Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Board Composition</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Number of directors required</li>
                    <li>• Election procedures and terms</li>
                    <li>• Qualifications and eligibility</li>
                    <li>• Removal and vacancy procedures</li>
                    <li>• Compensation guidelines</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Board Operations</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Regular meeting schedules</li>
                    <li>• Special meeting procedures</li>
                    <li>• Notice requirements</li>
                    <li>• Quorum and voting rules</li>
                    <li>• Action without meeting provisions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Officers & Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Required Officers</h4>
                  <p className="text-blue-700 text-sm">
                    President (CEO), Secretary, and Treasurer roles with defined responsibilities 
                    and authority. Multiple positions may be held by one person if permitted.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Duties & Authority</h4>
                  <p className="text-green-700 text-sm">
                    Clear definition of each officer's responsibilities, decision-making authority, 
                    and accountability to the board of directors.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Terms & Removal</h4>
                  <p className="text-purple-700 text-sm">
                    Election procedures, term lengths, resignation processes, and removal 
                    procedures for corporate officers.
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
                  <h4 className="font-semibold text-red-800 mb-2">State Law Compliance</h4>
                  <p className="text-red-700 text-sm">
                    Bylaws must comply with state corporation laws and cannot conflict with 
                    the Articles of Incorporation. Different states have different requirements.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Amendment Procedures</h4>
                  <p className="text-yellow-700 text-sm">
                    Establish clear procedures for amending bylaws, including who has authority 
                    to make changes and what approval processes are required.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Record Keeping</h4>
                  <p className="text-blue-700 text-sm">
                    Proper documentation and maintenance of corporate records, including 
                    meeting minutes, resolutions, and shareholder information.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Indemnification</h4>
                  <p className="text-green-700 text-sm">
                    Protection for directors and officers acting in good faith on behalf 
                    of the corporation, subject to state law limitations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Additional Provisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Corporate Formalities:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Corporate seal requirements</li>
                    <li>• Document execution procedures</li>
                    <li>• Stock certificate provisions</li>
                    <li>• Distribution policies</li>
                    <li>• Fiscal year designation</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Governance Features:</h4>
                  <ul className="space-y-1 text-orange-700 text-sm">
                    <li>• Conflict of interest policies</li>
                    <li>• Committee establishment rules</li>
                    <li>• Emergency action procedures</li>
                    <li>• Technology use in meetings</li>
                    <li>• Dissolution procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2 text-purple-600" />
                Benefits of Well-Drafted Bylaws
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Operational Benefits:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Clear decision-making processes</li>
                    <li>• Reduced management disputes</li>
                    <li>• Consistent corporate governance</li>
                    <li>• Professional credibility</li>
                    <li>• Investor confidence</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Legal Protections:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Limited liability maintenance</li>
                    <li>• Officer and director protection</li>
                    <li>• Compliance with state laws</li>
                    <li>• Dispute resolution framework</li>
                    <li>• Corporate veil protection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Corporate Bylaws?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive form will guide you through creating professional corporate bylaws 
                that establish proper governance structure and operational procedures.
              </p>
              <Button 
                onClick={() => navigate('/corporate-bylaws-form')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Creating Your Corporate Bylaws
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CorporateBylawsInfo;
