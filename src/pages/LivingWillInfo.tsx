import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Heart, Shield, AlertTriangle } from "lucide-react";

const LivingWillInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">


        <Card className="mb-8">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Living Will Information
            </CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              Understanding Your Living Will and Healthcare Directives
            </p>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          {/* What is a Living Will */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-600">
                <Heart className="w-6 h-6 mr-2" />
                What is a Living Will?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                A Living Will, also known as an Advance Healthcare Directive, is a legal document that allows you to express your wishes regarding medical treatment in situations where you are unable to communicate your decisions. This document ensures that your healthcare preferences are honored when you cannot speak for yourself.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Unlike a traditional will that takes effect after death, a Living Will is active while you are alive but incapacitated. It provides clear guidance to healthcare providers and family members about your treatment preferences during critical medical situations.
              </p>
            </CardContent>
          </Card>

          {/* Key Components */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-blue-600">
                <Shield className="w-6 h-6 mr-2" />
                Key Components of a Living Will
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Healthcare Agent Designation</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Primary healthcare agent/proxy</li>
                    <li>• Alternate agents as backups</li>
                    <li>• Contact information and relationships</li>
                    <li>• Specific powers and limitations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Treatment Preferences</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Life-sustaining treatment decisions</li>
                    <li>• Artificial nutrition and hydration</li>
                    <li>• Pain management preferences</li>
                    <li>• Specific medical interventions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* When It Takes Effect */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">When Does a Living Will Take Effect?</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                A Living Will becomes effective when you are unable to make healthcare decisions for yourself. This typically occurs when:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>You are unconscious or in a coma</li>
                <li>You have a terminal illness and cannot communicate</li>
                <li>You have severe dementia or cognitive impairment</li>
                <li>You are in a persistent vegetative state</li>
                <li>A physician determines you lack decision-making capacity</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                The document typically requires confirmation from one or more physicians that you are unable to make informed healthcare decisions before it becomes active.
              </p>
            </CardContent>
          </Card>

          {/* Legal Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Legal Requirements and Validity</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Signing Requirements</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Must be signed by you (the declarant)</li>
                    <li>• Requires two qualified witnesses</li>
                    <li>• Witnesses cannot be relatives or heirs</li>
                    <li>• Notarization may be required in some states</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Mental Capacity</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• You must be of sound mind when signing</li>
                    <li>• Age requirement (usually 18 or older)</li>
                    <li>• Free from coercion or undue influence</li>
                    <li>• Understanding of the document's purpose</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-600">Benefits of Having a Living Will</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">For You</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Ensures your wishes are respected</li>
                    <li>• Provides peace of mind</li>
                    <li>• Maintains personal autonomy</li>
                    <li>• Prevents unwanted medical treatment</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">For Your Family</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Reduces family conflict and stress</li>
                    <li>• Provides clear guidance for decisions</li>
                    <li>• Relieves burden of difficult choices</li>
                    <li>• Prevents legal disputes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Considerations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl text-amber-600">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Important Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-amber-800 mb-2">Review and Update Regularly</h3>
                <p className="text-amber-700">
                  Your Living Will should be reviewed and updated periodically, especially after major life events, changes in health status, or changes in your healthcare preferences.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Distribution of Copies</h3>
                  <p className="text-gray-700">
                    Provide copies to your healthcare agent, family members, primary physician, and keep the original in a safe but accessible location. Consider registering with your state's advance directive registry if available.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Communication is Key</h3>
                  <p className="text-gray-700">
                    Discuss your wishes with your healthcare agent and family members before a crisis occurs. Ensure they understand your values and preferences regarding medical care.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Consultation</h3>
                  <p className="text-gray-700">
                    While this form provides a comprehensive template, consider consulting with an attorney familiar with healthcare law in your state to ensure your Living Will meets all legal requirements and addresses your specific needs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                Ready to Create Your Living Will?
              </h3>
              <p className="text-blue-700 mb-6">
                Take control of your healthcare decisions and provide peace of mind for yourself and your loved ones.
              </p>
              <Button
                onClick={() => navigate('/living-will')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                Start Your Living Will
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LivingWillInfo;
