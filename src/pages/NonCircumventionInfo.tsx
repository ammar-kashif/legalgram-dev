import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Shield, Users, Handshake, Scale, DollarSign, Clock } from "lucide-react";

const NonCircumventionInfo = () => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Non-Circumvention Agreement</h1>
            <p className="text-lg text-gray-600">
              Protect your business relationships and prevent contact circumvention
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Non-Circumvention Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Non-Circumvention Agreement (NCA) is a legal contract that prevents parties from 
                bypassing each other to deal directly with contacts, clients, or business opportunities 
                that were introduced through the relationship. This agreement protects valuable business 
                relationships and ensures that parties honor introductions and referrals.
              </p>
              <p className="text-gray-700">
                This type of agreement is essential in business partnerships, joint ventures, and 
                networking relationships where one party introduces contacts, clients, or opportunities 
                to another party. It ensures that the introducing party receives appropriate recognition 
                and compensation for their contribution to the business relationship.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Key Protections Provided
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Contact Protection:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Client and customer relationships</li>
                    <li>• Supplier and vendor contacts</li>
                    <li>• Strategic business partners</li>
                    <li>• Investment opportunities</li>
                    <li>• Professional networks</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Business Interests:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Commission and fee protection</li>
                    <li>• Profit sharing agreements</li>
                    <li>• Future business opportunities</li>
                    <li>• Referral relationships</li>
                    <li>• Strategic positioning</li>
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
                  <h4 className="font-semibold mb-2">Business Introductions</h4>
                  <p className="text-sm text-gray-700">
                    When introducing valuable contacts, clients, or business opportunities to partners
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Joint Ventures</h4>
                  <p className="text-sm text-gray-700">
                    During partnerships where each party contributes valuable business relationships
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Investment Deals</h4>
                  <p className="text-sm text-gray-700">
                    When facilitating investment opportunities or real estate transactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
                Core Agreement Provisions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Non-Circumvention Clause</h4>
                  <p className="text-blue-700 text-sm">
                    Prevents the recipient from directly contacting, negotiating with, or contracting 
                    any contacts introduced by the disclosing party without prior written consent.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Commission Protection</h4>
                  <p className="text-green-700 text-sm">
                    Ensures the disclosing party receives agreed-upon commissions, profits, or benefits 
                    from any transactions completed with their introduced contacts.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Confidentiality Requirements</h4>
                  <p className="text-purple-700 text-sm">
                    Protects confidential information including client lists, contact details, business 
                    strategies, and proprietary information shared during the relationship.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Financial Protections & Penalties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Commission Recovery</h4>
                  <p className="text-sm text-gray-700">Entitlement to commissions and profits from transactions completed in violation of the agreement</p>
                </div>
                <div className="p-3 bg-red-50 border-l-4 border-red-400">
                  <h4 className="font-semibold">Monetary Penalties</h4>
                  <p className="text-sm text-gray-700">Specified percentage penalties for agreement violations and unauthorized transactions</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Injunctive Relief</h4>
                  <p className="text-sm text-gray-700">Right to seek court orders preventing unauthorized disclosure or circumvention</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Legal Fees Recovery</h4>
                  <p className="text-sm text-gray-700">Prevailing party entitled to recover attorney's fees and court costs in legal proceedings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2 text-red-600" />
                Legal Framework & Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Binding Arbitration</h4>
                  <p className="text-red-700 text-sm">
                    Disputes resolved through binding arbitration in a specified city, providing 
                    efficient and final resolution of conflicts.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Broad Applicability</h4>
                  <p className="text-blue-700 text-sm">
                    Agreement applies to all owners, partners, employees, contractors, and 
                    representatives of both parties, including successors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Agreement Duration & Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800">Indefinite Term</h4>
                  <p className="text-sm text-orange-700">The agreement remains in effect indefinitely, providing ongoing protection for business relationships</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800">30-Day Notice Termination</h4>
                  <p className="text-sm text-blue-700">Either party may terminate the agreement with thirty days' prior written notice</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Survival of Obligations</h4>
                  <p className="text-sm text-purple-700">Confidentiality and protection obligations continue even after termination for pre-existing information</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-teal-600" />
                Confidential Information Protection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">
                The agreement provides comprehensive protection for various types of confidential information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="p-2 bg-teal-50 border border-teal-200 rounded">
                    <strong>Client Information:</strong> Customer lists and contact details
                  </div>
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                    <strong>Business Strategy:</strong> Plans, strategies, and methodologies
                  </div>
                  <div className="p-2 bg-green-50 border border-green-200 rounded">
                    <strong>Financial Data:</strong> Records, projections, and transaction details
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-purple-50 border border-purple-200 rounded">
                    <strong>Acquisition Details:</strong> Investment and purchase opportunities
                  </div>
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <strong>Marketing Plans:</strong> Campaigns, strategies, and target markets
                  </div>
                  <div className="p-2 bg-red-50 border border-red-200 rounded">
                    <strong>Contract Terms:</strong> Agreements, negotiations, and deal structures
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
                  <h4 className="font-semibold text-red-800 mb-2">Clear Contact Definition</h4>
                  <p className="text-red-700 text-sm">
                    Ensure all parties understand exactly which contacts and relationships are 
                    protected under the agreement to prevent disputes.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Commission Percentage</h4>
                  <p className="text-yellow-700 text-sm">
                    Carefully consider the penalty percentage for violations - it should be fair 
                    but sufficient to deter circumvention attempts.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Force Majeure Provisions</h4>
                  <p className="text-blue-700 text-sm">
                    The agreement includes protection for events beyond parties' control, such as 
                    natural disasters, pandemics, or governmental restrictions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Non-Circumvention Agreement?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive 4-step form will guide you through creating a professional 
                non-circumvention agreement to protect your valuable business relationships.
              </p>
              <Button 
                onClick={() => navigate('/non-circumvention-form')}
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

export default NonCircumventionInfo;
