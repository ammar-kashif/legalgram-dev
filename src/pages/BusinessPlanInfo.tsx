import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, TrendingUp, Target, DollarSign, Briefcase, Users, BarChart3 } from "lucide-react";

const BusinessPlanInfo = () => {
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
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Plan</h1>
            <p className="text-lg text-gray-600">
              Comprehensive roadmap for launching and growing your business venture
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Business Plan?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Business Plan is a formal document that outlines your business concept, strategy, 
                market analysis, financial projections, and operational framework. It serves as a 
                roadmap for your business journey and is essential for securing funding, attracting 
                partners, and guiding strategic decisions.
              </p>
              <p className="text-gray-700">
                A well-crafted business plan demonstrates your understanding of the market, validates 
                your business model, and provides a clear path to profitability. It's your opportunity 
                to present a compelling case for why your business will succeed and how you plan to 
                achieve your goals.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Key Components of Our Business Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Executive Summary</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Business overview and mission</li>
                    <li>• Market opportunity identification</li>
                    <li>• Investment requirements</li>
                    <li>• Expected returns and growth</li>
                    <li>• Key success factors</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Market Analysis</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Industry overview and trends</li>
                    <li>• Target market segmentation</li>
                    <li>• Competitive landscape analysis</li>
                    <li>• Market positioning strategy</li>
                    <li>• Customer needs assessment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Who Needs a Business Plan?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Startup Founders</h4>
                  <p className="text-sm text-gray-700">
                    New entrepreneurs launching their first business or testing a new concept
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Investors & Lenders</h4>
                  <p className="text-sm text-gray-700">
                    Essential for securing funding, loans, or attracting potential investors
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Expanding Businesses</h4>
                  <p className="text-sm text-gray-700">
                    Established companies planning new products, markets, or expansion
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                Product & Service Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Product Development</h4>
                  <p className="text-sm text-gray-700">Define your product or service offerings, unique features, and development timeline</p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Market Differentiation</h4>
                  <p className="text-sm text-gray-700">Identify what sets your offering apart from competitors and creates value for customers</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Target Customers</h4>
                  <p className="text-sm text-gray-700">Define your ideal customer segments and understand their specific needs and preferences</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Operational Framework</h4>
                  <p className="text-sm text-gray-700">Outline how you'll deliver your products or services efficiently and profitably</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Financial Planning & Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Investment Requirements:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Total funding needed to launch</li>
                    <li>• Breakdown by functional areas</li>
                    <li>• Marketing and advertising budget</li>
                    <li>• Product development costs</li>
                    <li>• Staffing and operational expenses</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Financial Projections:</h4>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Startup costs and initial capital</li>
                    <li>• Monthly revenue and expense forecasts</li>
                    <li>• Break-even analysis and timeline</li>
                    <li>• Profit margins and growth projections</li>
                    <li>• Unit pricing and sales volume estimates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                Market Analysis & Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Industry Overview</h4>
                  <p className="text-blue-700 text-sm">
                    Comprehensive analysis of your industry size, growth trends, and market 
                    opportunities specific to your business segment.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Demand Analysis</h4>
                  <p className="text-green-700 text-sm">
                    Identification of market demand drivers, consumer trends, and factors 
                    creating favorable conditions for your business.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Competitive Positioning</h4>
                  <p className="text-purple-700 text-sm">
                    Analysis of key competitors and your strategy for differentiation, 
                    market capture, and sustainable competitive advantage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-pink-600" />
                Implementation & Marketing Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Business Strategy</h4>
                  <p className="text-sm text-gray-700">Personalized customer experience, operational efficiency, and brand positioning</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Implementation Timeline</h4>
                  <p className="text-sm text-gray-700">Phased rollout from design and prototyping to launch, marketing, and scaling</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Marketing Campaigns</h4>
                  <p className="text-sm text-gray-700">Core marketing initiatives to drive customer acquisition and brand awareness</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Legal Compliance</h4>
                  <p className="text-sm text-gray-700">Proper business structure selection and regulatory compliance framework</p>
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
                  <h4 className="font-semibold text-red-800 mb-2">Market Validation</h4>
                  <p className="text-red-700 text-sm">
                    Ensure your business concept addresses real market needs and has sufficient 
                    demand to support sustainable growth and profitability.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Financial Realism</h4>
                  <p className="text-yellow-700 text-sm">
                    Base your financial projections on realistic assumptions and market research 
                    rather than overly optimistic estimates.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Risk Assessment</h4>
                  <p className="text-blue-700 text-sm">
                    Consider potential risks, market changes, and challenges that could impact 
                    your business and develop contingency plans.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-purple-600" />
                Benefits of a Professional Business Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Strategic Benefits:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Clear roadmap for business development</li>
                    <li>• Structured approach to market entry</li>
                    <li>• Risk identification and mitigation</li>
                    <li>• Performance benchmarks and goals</li>
                    <li>• Strategic decision-making framework</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Practical Benefits:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Enhanced credibility with investors</li>
                    <li>• Improved funding acquisition prospects</li>
                    <li>• Better team alignment and focus</li>
                    <li>• Professional presentation for partners</li>
                    <li>• Foundation for future planning</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Business Plan?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive 11-step form will guide you through creating a professional 
                business plan that covers all essential aspects of your venture.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Takes 15-20 minutes • Professional PDF output
              </p>
              <Button 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/business-plan-form')}
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

export default BusinessPlanInfo;