import { Building2, Shield, DollarSign, Users, CheckCircle, ArrowRight, FileText, Clock, Award, TrendingUp, Scale, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const WhatsACorporation = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-bright-orange-50 to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What's a Corporation? Your Complete Guide
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Learn why corporations are the preferred business structure for companies looking to scale, raise capital, and build long-term credibility.
            </p>
            <Button 
              size="lg" 
              className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white"
              asChild
            >
              <Link to="/documents/corporation">Start Your Corporation Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What is a Corporation Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What is a Corporation?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                A corporation is a distinct legal business entity that exists separately from its owners (called shareholders). This separation is what makes corporations so powerful—they can own property, enter into contracts, sue or be sued, and pay taxes independently of their owners.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                When you incorporate your business, you create a legal "person" that can conduct business in its own name. This provides you with limited liability protection, meaning your personal assets are generally protected from business debts and lawsuits. It's like building a legal wall between your personal finances and your business operations.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Corporations are the go-to structure for businesses that want to raise capital, offer employee benefits, attract larger clients, or expand nationally and internationally. The corporate structure provides credibility that is immediately recognized by banks, investors, government agencies, and the public.
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
              Why Choose a Corporation? Key Benefits
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Limited Liability Protection
                </h3>
                <p className="text-gray-600">
                  Your personal assets (home, savings, car) are protected from business debts and lawsuits. The corporation acts as a legal shield between you and business liabilities.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <DollarSign className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tax Benefits & Planning
                </h3>
                <p className="text-gray-600">
                  Corporations offer flexible tax strategies. C-Corps can reinvest profits at corporate rates, while S-Corps provide pass-through taxation with liability protection.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <TrendingUp className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Access to Capital
                </h3>
                <p className="text-gray-600">
                  Raise funds by issuing stock to investors. This ability to sell ownership shares makes it easier to secure investment and fuel business growth.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Building2 className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Enhanced Credibility
                </h3>
                <p className="text-gray-600">
                  "Inc." or "Corp." after your business name adds instant legitimacy. Banks, clients, and partners prefer working with incorporated businesses.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Clock className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Business Continuity
                </h3>
                <p className="text-gray-600">
                  Corporations continue to exist even when ownership changes. This perpetual existence provides stability and makes it easier to transfer ownership.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Briefcase className="h-12 w-12 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Employee Benefits
                </h3>
                <p className="text-gray-600">
                  Corporations can offer attractive employee benefit packages, including health insurance, retirement plans, and stock options to attract top talent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Corporations */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Types of Corporations
            </h2>
            <div className="space-y-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  C Corporation (C-Corp)
                </h3>
                <p className="text-gray-600 mb-4">
                  The traditional corporation structure. C-Corps are separate tax entities that pay corporate income tax on profits. They offer the most flexibility for raising capital and can have unlimited shareholders.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Businesses seeking investment</li>
                      <li>• Companies planning to go public</li>
                      <li>• High-growth businesses</li>
                      <li>• International operations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Unlimited shareholders</li>
                      <li>• Multiple share classes</li>
                      <li>• Corporate tax rates</li>
                      <li>• Maximum credibility</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  S Corporation (S-Corp)
                </h3>
                <p className="text-gray-600 mb-4">
                  An S-Corp is a special tax election that allows profits and losses to pass through to shareholders' personal tax returns, avoiding double taxation while maintaining corporate liability protection.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Small to medium businesses</li>
                      <li>• Service-based companies</li>
                      <li>• Family businesses</li>
                      <li>• Tax-conscious owners</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Pass-through taxation</li>
                      <li>• Limited to 100 shareholders</li>
                      <li>• US citizens/residents only</li>
                      <li>• Self-employment tax savings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporation vs Other Structures */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Corporation vs. Other Business Structures
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Corporation</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">LLC</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Partnership</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Sole Proprietorship</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Personal Liability Protection</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Ability to Raise Capital</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-yellow-500">Limited</td>
                    <td className="px-6 py-4 text-center text-yellow-500">Limited</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Tax Flexibility</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-yellow-500">Limited</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Professional Credibility</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-yellow-500">~</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">Perpetual Existence</td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                    <td className="px-6 py-4 text-center text-red-500">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* When to Choose Corporation */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              When Should You Choose a Corporation?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  Corporations Are Perfect For:
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Businesses seeking investment or venture capital</li>
                  <li>• Companies planning to go public</li>
                  <li>• High-growth businesses with expansion plans</li>
                  <li>• Businesses with multiple owners/shareholders</li>
                  <li>• Companies wanting to offer employee stock options</li>
                  <li>• International businesses</li>
                  <li>• Professional service firms</li>
                  <li>• Technology and software companies</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Scale className="h-6 w-6 text-bright-orange-500 mr-2" />
                  Consider Other Options If:
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• You want minimal paperwork and formalities</li>
                  <li>• You're a solo entrepreneur with no plans for investment</li>
                  <li>• You prefer complete operational flexibility</li>
                  <li>• You want to avoid corporate tax compliance</li>
                  <li>• Your business has simple ownership structure</li>
                  <li>• You're testing a business concept</li>
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
              How to Form a Corporation: The Process
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
                    Choose and Reserve Your Corporate Name
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Select a unique name that includes "Corporation," "Incorporated," "Corp.," or "Inc." Check availability through your state's business registry.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Consider reserving your name while you prepare other documents
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
                    Appoint a Registered Agent
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Every corporation needs a registered agent to receive legal documents. This can be you, another person, or a professional service.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Professional registered agent services provide privacy and reliability
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
                    File Articles of Incorporation
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Submit the required formation documents to your state's Secretary of State. This officially creates your corporation as a legal entity.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Filing fees typically range from $50-$300 depending on your state
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
                    Create Corporate Bylaws
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Bylaws outline your corporation's governance structure, meeting procedures, voting rights, and operational rules.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Well-drafted bylaws prevent conflicts and ensure smooth operations
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
                    Issue Stock and Hold First Board Meeting
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Issue initial shares to founders and hold your first board of directors meeting to adopt bylaws and elect officers.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Keep detailed records of all corporate actions from day one
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
                    Obtain EIN and Open Business Bank Account
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Get an Employer Identification Number (EIN) from the IRS and open a corporate bank account to keep business and personal finances separate.
                  </p>
                  <p className="text-sm text-gray-500">
                    Tip: Most banks require your Articles of Incorporation and EIN to open an account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Savings Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How Corporations Help You Save Money
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <DollarSign className="h-8 w-8 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Deductions</h3>
                    <p className="text-gray-600">
                      Corporations can deduct employee salaries, health insurance, office equipment, business travel, and retirement plan contributions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <TrendingUp className="h-8 w-8 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax Strategy Flexibility</h3>
                    <p className="text-gray-600">
                      Separate business and personal income for better tax planning and potentially lower overall tax liability.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Building2 className="h-8 w-8 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Profit Reinvestment</h3>
                    <p className="text-gray-600">
                      C-Corps can reinvest profits at corporate tax rates, which may be lower than personal income tax rates.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">S-Corp Tax Benefits</h3>
                    <p className="text-gray-600">
                      S-Corps offer pass-through taxation while potentially reducing self-employment taxes on distributions.
                    </p>
                  </div>
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
              Ready to Form Your Corporation?
            </h2>
            <p className="text-xl text-white mb-8">
              Let Legal Gram handle the complex paperwork while you focus on building your business. Our experienced team will guide you through every step of corporate formation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-bright-orange-500 hover:bg-gray-100"
                asChild
              >
                <Link to="/documents/corporation">
                  Start Your Corporation Now
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

export default WhatsACorporation;
