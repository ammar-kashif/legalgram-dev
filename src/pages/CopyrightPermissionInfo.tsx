import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Copyright, Mail, Users, Scale, BookOpen, Shield } from "lucide-react";

const CopyrightPermissionInfo = () => {
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
            <Copyright className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Copyright Permission Request</h1>
            <p className="text-lg text-gray-600">
              Formally request permission to use copyrighted material in your projects
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Copyright Permission Request?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Copyright Permission Request is a formal letter that asks a copyright owner for 
                permission to use their protected work. This includes text, images, music, videos, 
                artwork, or any other creative content that is protected by copyright law. Obtaining 
                permission helps you avoid copyright infringement and potential legal issues.
              </p>
              <p className="text-gray-700">
                This request demonstrates respect for intellectual property rights and establishes 
                a legal framework for using someone else's creative work in your own projects, 
                publications, or presentations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2 text-green-600" />
                When Do You Need Permission?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Content Types Requiring Permission:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Written text from books, articles, or papers</li>
                    <li>• Photographs and illustrations</li>
                    <li>• Music lyrics and compositions</li>
                    <li>• Video clips and footage</li>
                    <li>• Artwork and graphic designs</li>
                    <li>• Charts, graphs, and data visualizations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Scenarios:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Academic research and publications</li>
                    <li>• Commercial publications and marketing</li>
                    <li>• Educational materials and courses</li>
                    <li>• Website content and blogs</li>
                    <li>• Presentations and reports</li>
                    <li>• Documentary and media production</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Who Needs Permission Requests?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Researchers & Academics</h4>
                  <p className="text-sm text-gray-700">
                    Scholars citing or reproducing content in academic papers, theses, or research publications
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Content Creators</h4>
                  <p className="text-sm text-gray-700">
                    Bloggers, journalists, and media producers incorporating copyrighted materials
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Business Professionals</h4>
                  <p className="text-sm text-gray-700">
                    Companies using copyrighted content in marketing, training, or commercial materials
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-indigo-600" />
                Key Components of a Permission Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Complete Contact Information</h4>
                  <p className="text-blue-700 text-sm">
                    Include your full name, address, phone, email, and the date to establish 
                    professional communication and provide multiple contact methods.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Specific Work Identification</h4>
                  <p className="text-green-700 text-sm">
                    Clearly identify the work by title, author/creator, and provide a detailed 
                    description of the exact portion you wish to use.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Usage Description</h4>
                  <p className="text-purple-700 text-sm">
                    Explain how you intend to use the material, including context, purpose, 
                    and any planned attribution or acknowledgment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-orange-600" />
                Request Process & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800">Professional Tone</h4>
                  <p className="text-sm text-yellow-700">Use formal, respectful language that acknowledges the value of the copyright owner's work</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Clear Attribution Offer</h4>
                  <p className="text-sm text-blue-700">Offer to include copyright notice or acknowledgment using the owner's preferred wording</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800">Specific Usage Details</h4>
                  <p className="text-sm text-green-700">Be specific about what you want to use, how it will be used, and in what context</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Follow-up Plan</h4>
                  <p className="text-sm text-purple-700">Allow reasonable time for response and have a follow-up plan if needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-teal-600" />
                After Sending Your Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                  <h4 className="font-semibold text-teal-800 mb-2">Documentation:</h4>
                  <ul className="space-y-1 text-teal-700 text-sm">
                    <li>• Keep copies of all correspondence</li>
                    <li>• Save any permission grants received</li>
                    <li>• Document dates and communication details</li>
                    <li>• Store files in accessible location</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Wait for response (allow 2-4 weeks)</li>
                    <li>• Follow up professionally if needed</li>
                    <li>• Honor any conditions in the permission</li>
                    <li>• Include proper attribution as specified</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Legal Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Fair Use vs. Permission</h4>
                  <p className="text-red-700 text-sm">
                    While some uses may qualify as "fair use," requesting permission provides 
                    legal certainty and demonstrates respect for copyright holders.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">No Response Guidelines</h4>
                  <p className="text-yellow-700 text-sm">
                    If you don't receive a response, no permission is granted. Consider 
                    alternative sources or legal consultation for fair use evaluation.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Terms and Conditions</h4>
                  <p className="text-blue-700 text-sm">
                    Any permission granted may include specific terms, limitations, or 
                    requirements that must be followed exactly as specified.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Copyright Duration</h4>
                  <p className="text-red-700 text-sm">
                    Copyright protection generally lasts for the author's lifetime plus 70 years. 
                    Older works may be in the public domain and not require permission.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Multiple Rights Holders</h4>
                  <p className="text-yellow-700 text-sm">
                    Some works may have multiple copyright holders (text, images, etc.). 
                    You may need separate permissions for different elements.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">International Considerations</h4>
                  <p className="text-blue-700 text-sm">
                    Copyright laws vary by country. Consider jurisdiction when requesting 
                    permission for international use or distribution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Request Copyright Permission?</h3>
              <p className="text-gray-600 mb-4">
                Our guided 3-step form will help you create a professional copyright permission 
                request letter with all the essential information.
              </p>
              <Button 
                onClick={() => navigate('/copyright-permission-form')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Start Creating Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CopyrightPermissionInfo;
