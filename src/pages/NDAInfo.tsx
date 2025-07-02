import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, Users, AlertTriangle, Clock, Gavel, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NDAInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-600 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Non-Disclosure Agreement (NDA)
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Protect your confidential information with a legally binding Non-Disclosure Agreement
          </p>
          <Button 
            onClick={() => navigate('/nda-form')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Create NDA Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* What is an NDA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              What Is a Non-Disclosure Agreement (NDA)?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              A Non-Disclosure Agreement (NDA) is a legally enforceable contract that establishes a confidential relationship between two or more parties. One party—the owner of confidential information—shares proprietary, sensitive, or private data with another party—the recipient—under the condition that it will not be disclosed, misused, copied, or altered without express permission.
            </p>
            <p className="text-gray-700">
              Often referred to as a confidentiality agreement, an NDA clearly outlines the nature of the confidential information, the recipient's responsibilities, the term of the agreement, and legal remedies in case of a breach. Whether you're an individual, consultant, or business owner, having a Non-Disclosure Agreement for US-based businesses can help protect your intellectual property, business plans, trade secrets, and client data.
            </p>
          </CardContent>
        </Card>

        {/* When to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-600" />
              When Should You Use a Non-Disclosure Agreement?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Use an NDA when:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                Your business is sharing proprietary information with another company, freelancer, or consultant.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                You're a contractor or consultant and want to define the boundaries of information sharing.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                You want to protect trade secrets, business operations, financials, or customer lists during a collaboration.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                You're preparing to pitch an idea, product, or invention and want to prevent public disclosure.
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Legal Gram offers the best Non-Disclosure Agreement templates tailored for US law and designed to be used across industries, from startups and agencies to tech companies and freelancers.
            </p>
          </CardContent>
        </Card>

        {/* Key Clauses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Gavel className="w-6 h-6 text-purple-600" />
              Key Clauses in a Standard Non-Disclosure Agreement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Confidential Information Defined</h3>
              <p className="text-gray-700 mb-2">An NDA must define what constitutes "confidential information." This could include:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>Trade secrets</li>
                <li>Pricing models</li>
                <li>Business strategies or financial data</li>
                <li>Customer and vendor lists</li>
                <li>Product designs, software code, or internal operations</li>
                <li>Inventions or business proposals</li>
              </ul>
              <p className="text-gray-700 mt-2">
                The information can be written, verbal, visual, or electronic and might be marked "confidential" or simply described as such within the agreement. Note that information already public or lawfully obtained from another source is not considered confidential under most NDAs.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Obligation to Protect Confidential Information</h3>
              <p className="text-gray-700 mb-2">The recipient agrees to:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>Not disclose or share confidential data with third parties</li>
                <li>Not use the information for unauthorized purposes</li>
                <li>Take reasonable steps (e.g., digital or physical security measures) to protect access to the data</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Some agreements require recipients to notify the owner immediately in the event of a data breach, accidental leak, or security incident.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Unauthorized Disclosure and Legal Remedies</h3>
              <p className="text-gray-700 mb-2">If the recipient violates the NDA, the disclosing party may:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>File a lawsuit to recover damages caused by the breach</li>
                <li>Request an injunction—a court order stopping further disclosure or use</li>
              </ul>
              <p className="text-gray-700 mt-2">
                For example, if a former employee takes confidential client data and uses it to start a competing business, the employer can seek both monetary damages and a court injunction to prevent further harm.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Non-Circumvention Clause</h3>
              <p className="text-gray-700">
                This provision ensures that the recipient does not bypass the disclosing party to deal directly with clients or contacts they were introduced to under the NDA. For example, if a contractor is given access to a company's vendor list to fulfill a project, they cannot approach those vendors for direct business later. Violation of this clause can result in financial penalties or the return of earned commissions.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Return or Destruction of Confidential Information</h3>
              <p className="text-gray-700 mb-2">Once the NDA's term expires or the business relationship ends, the recipient is typically required to:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>Return or destroy all physical and digital copies of confidential information</li>
                <li>Provide a signed statement affirming that no copies have been retained</li>
              </ul>
              <p className="text-gray-700 mt-2">
                This clause ensures that the information doesn't remain in circulation beyond the term of the relationship.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Definitions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Common NDA Terms and Definitions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Term</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Injunction</td>
                    <td className="border border-gray-300 px-4 py-2">A court order preventing further disclosure or misuse of confidential info</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Intellectual Property</td>
                    <td className="border border-gray-300 px-4 py-2">Protected creations such as inventions, software, logos, or content</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Trade Secrets</td>
                    <td className="border border-gray-300 px-4 py-2">Confidential business practices or processes that provide competitive advantage</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Whistleblower</td>
                    <td className="border border-gray-300 px-4 py-2">Someone who lawfully reports wrongdoing to regulatory or law enforcement bodies</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-indigo-600" />
              NDA FAQs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What is the purpose of an NDA?</h3>
              <p className="text-gray-700 mb-2">A Non-Disclosure Agreement protects sensitive business information and provides legal remedies if the data is improperly shared or used. It also helps:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>Safeguard trade secrets</li>
                <li>Prevent public disclosure of confidential inventions</li>
                <li>Define which information is protected and what isn't</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is an NDA legally binding?</h3>
              <p className="text-gray-700 mb-2">Yes, provided it meets legal standards:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>Scope must be reasonable</li>
                <li>Information should not already be public</li>
                <li>Enforcement requires evidence of breach and damage</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Even basic NDAs benefit from legal review. If in doubt, consult an attorney to ensure enforceability in your state.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How long should an NDA last?</h3>
              <p className="text-gray-700 mb-2">The duration depends on the information:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>General business info: 1–5 years</li>
                <li>Trade secrets: Possibly indefinite</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Set a term that reflects how long the data needs to remain private.
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can you legally break an NDA?</h3>
              <p className="text-gray-700 mb-2">In rare cases, yes. NDAs may be broken if:</p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                <li>They attempt to cover illegal activity</li>
                <li>There's a misrepresentation of key facts</li>
                <li>The law permits whistleblower reporting</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Always consult a legal professional before breaching a contract.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">
              Create Your NDA for Free with Legal Gram
            </CardTitle>
            <CardDescription className="text-blue-700">
              At Legal Gram, you can draft a Non-Disclosure Agreement for free using our easy, step-by-step builder. Whether you're hiring a freelancer, pitching an idea, or sharing sensitive data with a third party, our NDA templates for US businesses ensure your information stays secure and your legal bases are covered.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => navigate('/nda-form')}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-blue-600 mt-4">
              Get started today and protect your business's confidential data with the best Non-Disclosure Agreement. Available now—only on Legal Gram.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NDAInfo;
