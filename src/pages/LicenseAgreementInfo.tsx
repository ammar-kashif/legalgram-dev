import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Users, DollarSign, Scale, Shield, AlertCircle, ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LicenseAgreementInfo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Intellectual Property Licensing",
      description: "Grant or receive exclusive rights to use, reproduce, and distribute authored works"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Royalty Management",
      description: "Define payment terms, calculation methods, and reporting requirements"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Confidentiality Protection",
      description: "Comprehensive confidential information clauses to protect proprietary data"
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Dispute Resolution",
      description: "Built-in arbitration clauses for efficient conflict resolution"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Clear Party Definitions",
      description: "Detailed identification of licensor and licensee responsibilities"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Termination Terms",
      description: "Specified termination dates and notice periods for agreement closure"
    }
  ];

  const sections = [
    "Grant of License",
    "Payment of Royalty", 
    "Modifications",
    "Defaults",
    "Confidential Information",
    "Protection of Confidential Information",
    "Arbitration",
    "Warranties",
    "No Joint Venture or Partnership",
    "Transfer of Rights",
    "Termination",
    "Entire Agreement",
    "Amendments",
    "Severability",
    "Waiver of Contractual Right",
    "Applicable Law",
    "Acknowledgment"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">License Agreement</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a comprehensive license agreement for intellectual property rights, royalty payments, and confidentiality protection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <CardTitle>Completion Time</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-gray-900">8-12 minutes</p>
              <p className="text-gray-600">Average completion time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <CardTitle>Form Steps</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-gray-900">4 Steps</p>
              <p className="text-gray-600">Easy-to-follow process</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <CardTitle>Parties Involved</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-gray-900">2 Parties</p>
              <p className="text-gray-600">Licensor & Licensee</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Key Features
              </CardTitle>
              <CardDescription>
                What makes this license agreement comprehensive and effective
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="text-blue-600 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2" />
                Agreement Sections
              </CardTitle>
              <CardDescription>
                Comprehensive clauses included in your license agreement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {sections.map((section, index) => (
                  <Badge key={index} variant="outline" className="justify-start p-2">
                    {section}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
              Important Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Before You Start</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Identify the specific work being licensed</li>
                  <li>• Determine royalty rates and payment terms</li>
                  <li>• Define geographic limitations</li>
                  <li>• Set termination conditions</li>
                  <li>• Choose governing law jurisdiction</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What You'll Need</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete contact information for both parties</li>
                  <li>• Detailed description of the authored work</li>
                  <li>• Royalty calculation methodology</li>
                  <li>• Preferred arbitration location</li>
                  <li>• Signature authority for both parties</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/license-agreement-form')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Creating License Agreement
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Takes 8-12 minutes • Professional PDF output
          </p>
        </div>
      </div>
    </div>
  );
};

export default LicenseAgreementInfo;
