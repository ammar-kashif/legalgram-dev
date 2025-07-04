import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, DollarSign, Scale, TrendingUp, Building } from "lucide-react";

const RoyaltyAgreementInfo = () => {
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
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Royalty Agreement</h1>
            <p className="text-lg text-gray-600">
              Licensing intellectual property in exchange for ongoing royalty payments
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                What is a Royalty Agreement?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                A Royalty Agreement is a legal contract that grants one party (the grantee) the right 
                to use another party's (the grantor's) intellectual property in exchange for ongoing 
                royalty payments. Unlike a lump-sum purchase, royalties provide continuous compensation 
                based on the commercial success of the licensed property.
              </p>
              <p className="text-gray-700">
                This arrangement allows IP owners to monetize their assets while maintaining ownership, 
                and enables businesses to access valuable intellectual property without large upfront 
                investments. Royalty agreements are common in industries like entertainment, technology, 
                pharmaceuticals, and manufacturing.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Key Components of Our Royalty Agreement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Rights & Territory</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Exclusive licensing rights</li>
                    <li>• Geographic territory definition</li>
                    <li>• Commercial use permissions</li>
                    <li>• Distribution and promotion rights</li>
                    <li>• Property protection obligations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Structure</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Flexible royalty calculation methods</li>
                    <li>• Regular payment schedules</li>
                    <li>• Detailed reporting requirements</li>
                    <li>• Late payment consequences</li>
                    <li>• Profit definition and deductions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-purple-600" />
                Who Uses Royalty Agreements?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">IP Owners</h4>
                  <p className="text-sm text-gray-700">
                    Inventors, artists, authors, and companies seeking to monetize their intellectual property
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Businesses</h4>
                  <p className="text-sm text-gray-700">
                    Companies wanting to use patented technology, trademarks, or copyrighted content
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Franchisors</h4>
                  <p className="text-sm text-gray-700">
                    Businesses licensing their brand, methods, and systems to franchisees
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                Types of Royalty Structures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
                  <h4 className="font-semibold">Percentage Royalty</h4>
                  <p className="text-sm text-gray-700">Fixed percentage of gross or net revenue (e.g., 5% of sales)</p>
                </div>
                <div className="p-3 bg-green-50 border-l-4 border-green-400">
                  <h4 className="font-semibold">Per-Unit Royalty</h4>
                  <p className="text-sm text-gray-700">Fixed amount per unit sold (e.g., $2.50 per product)</p>
                </div>
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
                  <h4 className="font-semibold">Tiered Royalty</h4>
                  <p className="text-sm text-gray-700">Rates change based on sales volume or time periods</p>
                </div>
                <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
                  <h4 className="font-semibold">Minimum Guarantees</h4>
                  <p className="text-sm text-gray-700">Guaranteed minimum payments regardless of sales performance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2 text-indigo-600" />
                Common Industries & Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold">Technology</h4>
                    <p className="text-sm text-gray-700">Software licensing, patent licensing, technology transfer</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold">Entertainment</h4>
                    <p className="text-sm text-gray-700">Music royalties, book publishing, film distribution</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold">Manufacturing</h4>
                    <p className="text-sm text-gray-700">Product design licensing, manufacturing processes</p>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold">Franchising</h4>
                    <p className="text-sm text-gray-700">Brand licensing, business model replication</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Benefits of Royalty Agreements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">For IP Owners (Grantors):</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Ongoing revenue stream</li>
                    <li>• Retained ownership of IP</li>
                    <li>• Market expansion without investment</li>
                    <li>• Risk sharing with licensees</li>
                    <li>• Multiple licensing opportunities</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">For Licensees (Grantees):</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Access to proven IP</li>
                    <li>• Lower upfront costs</li>
                    <li>• Reduced development time</li>
                    <li>• Performance-based payments</li>
                    <li>• Competitive advantage</li>
                  </ul>
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
                  <h4 className="font-semibold text-red-800 mb-2">Valuation Challenges</h4>
                  <p className="text-red-700 text-sm">
                    Determining fair royalty rates can be complex. Consider market standards, 
                    IP value, territory scope, and exclusivity when setting rates.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Performance Monitoring</h4>
                  <p className="text-yellow-700 text-sm">
                    Establish clear reporting requirements and audit rights to ensure 
                    accurate royalty calculations and payments.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Territory & Exclusivity</h4>
                  <p className="text-blue-700 text-sm">
                    Clearly define geographic boundaries and exclusivity terms to avoid 
                    conflicts and ensure proper market coverage.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Termination Provisions</h4>
                  <p className="text-purple-700 text-sm">
                    Include clear termination clauses for non-payment, breach of terms, 
                    or failure to meet minimum performance standards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Legal Protections Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Warranties & Representations</h4>
                  <p className="text-sm text-gray-700">Both parties provide assurances about their authority and compliance</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Indemnification</h4>
                  <p className="text-sm text-gray-700">Protection against claims arising from agreement breaches</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Confidentiality</h4>
                  <p className="text-sm text-gray-700">Protection of proprietary and business information</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold">Termination Rights</h4>
                  <p className="text-sm text-gray-700">Clear procedures for ending the agreement under various circumstances</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">Ready to Create Your Royalty Agreement?</h3>
              <p className="text-gray-600 mb-4">
                Our comprehensive 5-step form will guide you through creating a professional 
                royalty agreement that protects both parties and ensures fair compensation.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Takes 10-15 minutes • Professional PDF output
              </p>
              <Button 
                className="mt-6 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => navigate('/royalty-agreement-form')}
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

export default RoyaltyAgreementInfo;
