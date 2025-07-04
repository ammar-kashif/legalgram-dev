import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Users, Factory, Shield, Scale, AlertCircle, ArrowLeft, Play, DollarSign, Gavel } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ManufacturingLicenseInfo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Factory className="w-5 h-5" />,
      title: "Exclusive Manufacturing Rights",
      description: "Grant exclusive rights to manufacture, sell, and distribute your product within specified regions"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Royalty Structure",
      description: "Define clear payment terms, royalty calculations, and reporting requirements"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Quality Control",
      description: "Built-in quality standards, sample approval processes, and modification controls"
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Legal Protection",
      description: "Comprehensive indemnification, IP protection, and dispute resolution clauses"
    },
    {
      icon: <Gavel className="w-5 h-5" />,
      title: "Binding Arbitration",
      description: "Professional dispute resolution through American Arbitration Association"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Confidentiality",
      description: "Protect sensitive business information and financial details"
    }
  ];

  const sections = [
    "Grant of License",
    "Payment of Royalty", 
    "Modifications",
    "Quality Control and Approval",
    "Defaults",
    "Arbitration",
    "Relationship of the Parties",
    "Warranties",
    "Transfer of Rights",
    "Indemnification",
    "Termination",
    "Confidentiality",
    "Entire Agreement",
    "Amendment",
    "Severability",
    "Waiver of Contractual Right",
    "Applicable Law",
    "Signatures"
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
          <Factory className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Manufacturing License Agreement</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a comprehensive manufacturing license agreement with quality control, royalty management, and legal protection
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <CardTitle>Completion Time</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-gray-900">6-10 minutes</p>
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
              <p className="text-gray-600">Licensor & Manufacturer</p>
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
                What makes this manufacturing license agreement comprehensive and protective
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
                Comprehensive clauses included in your manufacturing license agreement
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
              <Factory className="w-5 h-5 mr-2 text-blue-600" />
              Manufacturing License Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Licensors (Product Owners)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Generate revenue without manufacturing investment</li>
                  <li>• Maintain quality control over your product</li>
                  <li>• Retain intellectual property ownership</li>
                  <li>• Expand market reach through partners</li>
                  <li>• Receive regular royalty payments</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Manufacturers</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Access to proven products and designs</li>
                  <li>• Exclusive manufacturing rights in territory</li>
                  <li>• Leverage existing IP without development costs</li>
                  <li>• Clear legal framework for operations</li>
                  <li>• Protected business relationship</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <li>• Clearly define the product being licensed</li>
                  <li>• Determine fair royalty rates and calculation methods</li>
                  <li>• Set geographic boundaries for manufacturing rights</li>
                  <li>• Establish quality standards and approval processes</li>
                  <li>• Choose governing law jurisdiction</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What You'll Need</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete contact information for both parties</li>
                  <li>• Detailed product description and specifications</li>
                  <li>• Royalty structure and calculation methodology</li>
                  <li>• Geographic region for manufacturing rights</li>
                  <li>• Authorized signatories for both organizations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              Quality Control & Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Sample Approval Process</h4>
                <p className="text-blue-700 text-sm">
                  Manufacturers must submit product samples for approval before full-scale production, 
                  ensuring quality standards are met from the start.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Modification Controls</h4>
                <p className="text-green-700 text-sm">
                  All product changes require written approval from the licensor, protecting the 
                  integrity of your intellectual property and brand.
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Indemnification Protection</h4>
                <p className="text-purple-700 text-sm">
                  Manufacturers agree to indemnify licensors against claims arising from product 
                  use or sale, providing additional legal protection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/manufacturing-license-form')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Creating Manufacturing License Agreement
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Takes 6-10 minutes • Professional PDF output
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingLicenseInfo;
