import { Building2, Shield, DollarSign, Users, CheckCircle, ArrowRight, FileText, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const WhatsAnLLC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-bright-orange-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What's an LLC? Everything You Need to Know
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover why Limited Liability Companies are the most popular business structure for entrepreneurs and small business owners.
            </p>
            <Button 
              size="lg" 
              className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white"
              asChild
            >
              <Link to="/documents/llc">Start Your LLC Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What is an LLC Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What is a Limited Liability Company (LLC)?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                A Limited Liability Company (LLC) is a business structure in the United States that combines the limited liability protection of a corporation with the tax benefits and operational flexibility of a partnership or sole proprietorship. Think of it as the best of both worlds for small business owners.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                When you form an LLC, you create a separate legal entity from yourself. This means your personal assets (like your home, car, and personal bank accounts) are generally protected from business debts and legal claims. At the same time, you avoid the complex corporate formalities and potential double taxation that come with traditional corporations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Why Choose an LLC? Key Benefits
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Personal Asset Protection
                </h3>
                <p className="text-gray-600">
                  Your personal assets are generally protected from business debts and lawsuits. This "liability shield" is one of the biggest advantages of forming an LLC.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <DollarSign className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tax Flexibility
                </h3>
                <p className="text-gray-600">
                  LLCs offer "pass-through" taxation by default, meaning profits and losses pass through to your personal tax return. You can also elect different tax treatments as your business grows.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Users className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Operational Flexibility
                </h3>
                <p className="text-gray-600">
                  Unlike corporations, LLCs have fewer formalities. No required board meetings, shareholder meetings, or extensive record-keeping requirements.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Building2 className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Professional Credibility
                </h3>
                <p className="text-gray-600">
                  Having "LLC" after your business name adds legitimacy and professionalism, which can help with customers, vendors, and lenders.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Clock className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Perpetual Existence
                </h3>
                <p className="text-gray-600">
                  An LLC can continue to exist even if members leave or pass away, providing continuity for your business operations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Award className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Easy to Maintain
                </h3>
                <p className="text-gray-600">
                  Most states have minimal ongoing requirements for LLCs, typically just filing an annual report and paying a small fee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How LLC Works Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How Does an LLC Work?
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Members Own the LLC
                  </h3>
                  <p className="text-gray-600">
                    The owners of an LLC are called "members." You can have one member (single-member LLC) or multiple members. Members can be individuals, other LLCs, corporations, or even foreign entities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Management Structure
                  </h3>
                  <p className="text-gray-600">
                    LLCs can be managed by members (member-managed) or by appointed managers (manager-managed). This flexibility allows you to structure your business however works best for your situation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Operating Agreement
                  </h3>
                  <p className="text-gray-600">
                    While not always required by law, an operating agreement is crucial. It outlines how the LLC will operate, including member roles, profit distribution, and decision-making processes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Separate Legal Entity
                  </h3>
                  <p className="text-gray-600">
                    Once formed, your LLC becomes a separate legal entity that can enter contracts, own property, and conduct business in its own name, separate from its members.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LLC vs Other Structures */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              LLC vs. Other Business Structures
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">LLC</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Sole Proprietorship</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Corporation</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Partnership</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Personal Liability Protection</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Pass-through Taxation</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Operational Flexibility</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Easy Setup</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Professional Credibility</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-yellow-500">~</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose LLC */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              When Should You Choose an LLC?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  LLCs Are Great For:
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Small business owners and entrepreneurs</li>
                  <li>• Freelancers and consultants</li>
                  <li>• Real estate investors</li>
                  <li>• Online businesses and e-commerce</li>
                  <li>• Service-based businesses</li>
                  <li>• Businesses with 1-50 employees</li>
                  <li>• Companies wanting liability protection without corporate complexity</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-6 w-6 text-bright-orange-500 mr-2" />
                  Consider Other Options If:
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• You plan to go public or raise significant capital</li>
                  <li>• You want to issue different classes of stock</li>
                  <li>• You have complex ownership structures</li>
                  <li>• You're in a highly regulated industry</li>
                  <li>• You want to maximize certain tax benefits</li>
                  <li>• You have international business operations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formation Process */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              How to Form an LLC: The Process
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Choose Your LLC Name
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Select a unique name that complies with your state's requirements. It must include "LLC" or "Limited Liability Company" and not conflict with existing business names.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Check name availability through your state's business registry
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Choose a Registered Agent
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Every LLC needs a registered agent - someone who can receive legal documents on your company's behalf during business hours.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: You can serve as your own registered agent or hire a service
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    File Articles of Organization
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Submit the required formation documents (called Articles of Organization or Certificate of Formation) to your state's Secretary of State office.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Filing fees typically range from $50-$500 depending on your state
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Create an Operating Agreement
                  </h3>
                  <p className="text-gray-600 mb-2">
                    While not always legally required, an operating agreement outlines how your LLC will operate, including member responsibilities and profit distribution.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Even single-member LLCs benefit from having an operating agreement
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Get Required Licenses and Permits
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Depending on your business type and location, you may need various licenses and permits to operate legally.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Check federal, state, and local requirements for your industry
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-bright-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    6
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Open a Business Bank Account
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Keep your business and personal finances separate by opening a dedicated business bank account for your LLC.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: You'll need your Articles of Organization and EIN to open an account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-bright-orange-500">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Your LLC?
            </h2>
            <p className="text-xl text-white mb-8">
              Let Legal Gram handle the paperwork while you focus on building your business. Our expert team will guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-bright-orange-500 hover:bg-gray-100"
                asChild
              >
                <Link to="/documents/llc">
                  Start Your LLC Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-bright-orange-500"
                asChild
              >
                <Link to="/contact">Get Expert Help</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WhatsAnLLC;
