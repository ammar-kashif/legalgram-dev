import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, TrendingUp, Target, DollarSign, Shield, Users, Code } from "lucide-react";

const SoftwareLicenseInfo = () => {
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
            <Code className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Software License Agreement</h1>
            <p className="text-lg text-gray-600">
              Legally protect your software and define usage rights with comprehensive licensing terms
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Software License Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Software License Agreement is a legal contract between a software licensor (owner) 
                and licensee (user) that defines the terms and conditions under which the software 
                may be used. It establishes the rights, restrictions, and obligations of both parties 
                regarding the use, distribution, and modification of software.
              </p>
              <p className="text-gray-700">
                This agreement protects the intellectual property rights of the software owner while 
                providing clear guidelines for lawful use by the licensee. It covers installation 
                rights, usage limitations, warranty disclaimers, and liability protections.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Key Components of Our Software License Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">License Grant & Restrictions</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Non-exclusive, non-transferable rights</li>
                    <li>• Single device installation license</li>
                    <li>• Internal business use authorization</li>
                    <li>• Modification and reverse engineering prohibitions</li>
                    <li>• Assignment restrictions and transfer fees</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Legal Protections</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Warranty limitations and disclaimers</li>
                    <li>• Liability caps and damage limitations</li>
                    <li>• Confidentiality and trade secret protection</li>
                    <li>• Termination and software return clauses</li>
                    <li>• Arbitration and dispute resolution</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Who Needs a Software License Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Software Developers</h4>
                  <p className="text-sm text-gray-700">
                    Companies or individuals licensing their software to customers or businesses
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Technology Companies</h4>
                  <p className="text-sm text-gray-700">
                    Businesses providing software solutions, SaaS platforms, or enterprise applications
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Independent Contractors</h4>
                  <p className="text-sm text-gray-700">
                    Freelance developers licensing custom software or proprietary tools
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                License Terms & Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Usage Rights</h4>
                  <p className="text-sm text-gray-700">Defines authorized installation, execution, and operational use of the software</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Modification Restrictions</h4>
                  <p className="text-sm text-gray-700">Prohibits reverse engineering, decompilation, and unauthorized modifications</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Distribution Limitations</h4>
                  <p className="text-sm text-gray-700">Controls copying, distribution, and assignment of software rights</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Termination Conditions</h4>
                  <p className="text-sm text-gray-700">Specifies breach conditions and software return requirements upon termination</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                License Fees & Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Fee Structure:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• One-time license fee payment</li>
                    <li>• Detailed payment schedule (Schedule B)</li>
                    <li>• Late payment penalties and interest</li>
                    <li>• Transfer fees for license assignment</li>
                    <li>• Refund conditions for non-performance</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Protection:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Termination for non-payment clauses</li>
                    <li>• Attorney fees for collection actions</li>
                    <li>• Currency and payment method specifications</li>
                    <li>• Tax responsibility allocation</li>
                    <li>• Insolvency and bankruptcy protections</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2 text-indigo-600" />
                Software Specifications & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Software Description (Schedule A)</h4>
                  <p className="text-blue-700 text-sm">
                    Comprehensive specification of computer programs, documentation, 
                    user manuals, and associated materials included in the license.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Installation Requirements</h4>
                  <p className="text-green-700 text-sm">
                    Technical specifications for hardware compatibility, operating system 
                    requirements, and installation procedures.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Support & Updates</h4>
                  <p className="text-purple-700 text-sm">
                    Maintenance obligations, update provision terms, and technical 
                    support availability and limitations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-pink-600" />
                Confidentiality & Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Trade Secret Protection</h4>
                  <p className="text-sm text-gray-700">Comprehensive confidentiality obligations for proprietary algorithms and source code</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Title Retention</h4>
                  <p className="text-sm text-gray-700">Licensor maintains all intellectual property rights, including copyrights and patents</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Non-Competition</h4>
                  <p className="text-sm text-gray-700">Restrictions on developing competing software or reverse engineering</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Survival Clauses</h4>
                  <p className="text-sm text-gray-700">Confidentiality obligations continue beyond agreement termination</p>
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
                  <h4 className="font-semibold text-red-800 mb-2">Warranty Disclaimers</h4>
                  <p className="text-red-700 text-sm">
                    Software provided "as is" with no warranties of merchantability, 
                    fitness for purpose, or non-infringement of third-party rights.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Liability Limitations</h4>
                  <p className="text-yellow-700 text-sm">
                    Caps on damages exclude indirect, consequential, and special damages 
                    including lost profits and business interruption.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Compliance Requirements</h4>
                  <p className="text-blue-700 text-sm">
                    Ensure compliance with export control laws, data protection regulations, 
                    and industry-specific software licensing requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                Benefits of a Professional Software License Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Legal Protection:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Intellectual property rights preservation</li>
                    <li>• Liability limitation and risk mitigation</li>
                    <li>• Clear termination and remedy procedures</li>
                    <li>• Dispute resolution through arbitration</li>
                    <li>• Attorney fee recovery provisions</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Business Benefits:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Revenue protection through license fees</li>
                    <li>• Controlled software distribution</li>
                    <li>• Professional customer relationships</li>
                    <li>• Compliance with industry standards</li>
                    <li>• Scalable licensing framework</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Software License Agreement?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive 5-step form will guide you through creating a professional 
                software license agreement with all necessary legal protections.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Takes 10-15 minutes • Professional PDF output
              </p>
              <Button 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/software-license-form')}
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

export default SoftwareLicenseInfo;
