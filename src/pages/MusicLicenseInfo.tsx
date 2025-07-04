import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Users, Music, Shield, Scale, AlertCircle, ArrowLeft, Play, DollarSign, Gavel } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MusicLicenseInfo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Music className="w-5 h-5" />,
      title: "Music Copyright Licensing",
      description: "Grant non-exclusive rights to use copyrighted music for specific purposes and geographic areas"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Flexible Royalty Structure",
      description: "Define custom payment terms, calculation methods, and reporting requirements"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Copyright Protection",
      description: "Maintain ownership while controlling how your music is used and credited"
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Legal Compliance",
      description: "Comprehensive warranties, indemnification, and dispute resolution clauses"
    },
    {
      icon: <Gavel className="w-5 h-5" />,
      title: "Professional Standards",
      description: "Requirements for lawful usage, proper attribution, and modification controls"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Confidentiality",
      description: "Protect financial and proprietary information related to the licensing agreement"
    }
  ];

  const useCases = [
    "Film and TV Synchronization",
    "Commercial Advertising",
    "Video Game Background Music",
    "Podcast Intro/Outro Music",
    "YouTube Content Creation",
    "Live Performance Rights",
    "Radio Broadcasting",
    "Streaming Platform Usage",
    "Corporate Presentations",
    "Educational Materials"
  ];

  const sections = [
    "Grant of License",
    "Payment of Royalty", 
    "Rights and Obligations",
    "Modifications",
    "Defaults",
    "Arbitration",
    "Warranties",
    "Indemnification",
    "Transfer of Rights",
    "Effect of Termination",
    "Notice",
    "Entire Agreement",
    "Amendment",
    "Severability",
    "Section Headings",
    "Waiver of Contractual Right",
    "Confidentiality",
    "Applicable Law",
    "Signatories"
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
          <Music className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Music License Agreement</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional music licensing agreement for copyright protection, royalty management, and legal compliance
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
              <p className="text-gray-600">Copyright Owner & Licensee</p>
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
                What makes this music license agreement comprehensive and protective
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
                <Music className="w-5 h-5 mr-2" />
                Common Use Cases
              </CardTitle>
              <CardDescription>
                Popular applications for music licensing agreements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {useCases.map((useCase, index) => (
                  <Badge key={index} variant="outline" className="justify-start p-2">
                    {useCase}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="w-5 h-5 mr-2 text-blue-600" />
              Music Licensing Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Copyright Owners (Musicians/Publishers)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Generate revenue from your music catalog</li>
                  <li>• Maintain copyright ownership and control</li>
                  <li>• Expand reach through authorized usage</li>
                  <li>• Ensure proper attribution and credit</li>
                  <li>• Protect against unauthorized modifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Licensees (Content Creators/Businesses)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Legal access to high-quality music</li>
                  <li>• Clear usage rights and limitations</li>
                  <li>• Protection from copyright infringement claims</li>
                  <li>• Professional licensing documentation</li>
                  <li>• Defined geographic and usage scope</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="w-5 h-5 mr-2" />
              Agreement Sections
            </CardTitle>
            <CardDescription>
              Comprehensive clauses included in your music license agreement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sections.map((section, index) => (
                <Badge key={index} variant="outline" className="justify-start p-2 text-xs">
                  {section}
                </Badge>
              ))}
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
                  <li>• Verify ownership of music copyrights</li>
                  <li>• Define specific usage purposes and limitations</li>
                  <li>• Determine appropriate royalty structure</li>
                  <li>• Set geographic boundaries for usage</li>
                  <li>• Choose governing law jurisdiction</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What You'll Need</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete contact information for both parties</li>
                  <li>• Music title and copyright details</li>
                  <li>• Specific usage purposes and project details</li>
                  <li>• Royalty calculation methodology</li>
                  <li>• Authorized signatories for both parties</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              Legal Protection & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Copyright Protection</h4>
                <p className="text-blue-700 text-sm">
                  Maintain full ownership of your music while granting specific usage rights. 
                  Control how your work is used, modified, and credited.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Professional Standards</h4>
                <p className="text-green-700 text-sm">
                  Requires licensees to use music professionally and lawfully, with proper 
                  attribution and adherence to agreed terms.
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Dispute Resolution</h4>
                <p className="text-purple-700 text-sm">
                  Built-in arbitration clauses provide professional dispute resolution through 
                  the American Arbitration Association.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/music-license-form')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Creating Music License Agreement
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Takes 6-10 minutes • Professional PDF output
          </p>
        </div>
      </div>
    </div>
  );
};

export default MusicLicenseInfo;
