
import { 
  Building2, BriefcaseBusiness, FileLock, Star,
  Award, UserCheck, CheckCircle, ShieldCheck,
  DollarSign, Clock, Rocket, Users, Search,
  ChartBar, Handshake, ClipboardCheck,
  BadgeCheck, Calendar, FileSearch, MessageCircle,
  BookOpen, HelpCircle, FileText, XCircle, Table
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import BusinessBackgroundSlideshow from "@/components/business/BusinessBackgroundSlideshow";
import FAQSection from "@/components/business/FAQSection";
import ComparisonCard from "@/components/business/ComparisonCard";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const StartABusiness = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <BusinessBackgroundSlideshow />
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Start Your Business the Right Way
            </h1>
            <p className="text-lg md:text-xl text-white mb-8 drop-shadow-md">
              Get your business up and running with professional legal documents and expert guidance.
            </p>
            <Button 
              size="lg" 
              className="bg-bright-orange-500 hover:bg-bright-orange-600 text-white shadow-lg"
              asChild
            >
              <Link to="/signup">Start Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-bright-orange-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="font-bold text-3xl text-bright-orange-500 mb-2">50K+</div>
              <div className="text-gray-600">Businesses Formed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-bright-orange-500 mb-2">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-bright-orange-500 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl text-bright-orange-500 mb-2">4.9/5</div>
              <div className="text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Everything You Need to Start Your Business
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-black/10 hover:shadow-lg transition-shadow">
              <Building2 className="h-10 w-10 text-bright-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-3">
                Business Registrations
              </h3>
              <ul className="space-y-3 mb-4">
                <li>
                  <Link to="/documents/llc" className="text-black hover:text-bright-orange-500 transition-colors">
                    Start an LLC
                  </Link>
                </li>
                <li>
                  <Link to="/documents/corporation" className="text-black hover:text-bright-orange-500 transition-colors">
                    Start a Corporation
                  </Link>
                </li>
                <li>
                  <Link to="/documents/non-profit" className="text-black hover:text-bright-orange-500 transition-colors">
                    Start a Non-profit
                  </Link>
                </li>
              </ul>
              <Link to="/documents" className="text-bright-orange-500 hover:underline">
                Learn More →
              </Link>
            </div>

            <div className="p-6 rounded-xl border border-black/10 hover:shadow-lg transition-shadow">
              <BriefcaseBusiness className="h-10 w-10 text-bright-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-3">
                Business Services
              </h3>
              <ul className="space-y-3 mb-4">
                <li>
                  <Link to="/documents/operating-agreement" className="text-black hover:text-bright-orange-500 transition-colors">
                    Operating Agreement
                  </Link>
                </li>
                <li>
                  <Link to="/documents/annual-report" className="text-black hover:text-bright-orange-500 transition-colors">
                    Annual Report Filing
                  </Link>
                </li>
                <li>
                  <Link to="/documents/business-plan" className="text-black hover:text-bright-orange-500 transition-colors">
                    Business Plan
                  </Link>
                </li>
              </ul>
              <Link to="/documents" className="text-bright-orange-500 hover:underline">
                Learn More →
              </Link>
            </div>

            <div className="p-6 rounded-xl border border-black/10 hover:shadow-lg transition-shadow">
              <FileLock className="h-10 w-10 text-bright-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-3">
                Business Property
              </h3>
              <ul className="space-y-3 mb-4">
                <li>
                  <Link to="/documents/trademark" className="text-black hover:text-bright-orange-500 transition-colors">
                    Trademark Registration
                  </Link>
                </li>
                <li>
                  <Link to="/documents/copyright" className="text-black hover:text-bright-orange-500 transition-colors">
                    Copyright Protection
                  </Link>
                </li>
                <li>
                  <Link to="/documents/nda" className="text-black hover:text-bright-orange-500 transition-colors">
                    Make an NDA
                  </Link>
                </li>
              </ul>
              <Link to="/documents" className="text-bright-orange-500 hover:underline">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 left-0">
                <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </span>
              </div>
              <img 
                src="/lovable-uploads/64df2e75-5059-4c45-b91a-1ab540ddf735.png"
                alt="Start your LLC" 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Start your LLC today
              </h2>
              <p className="text-lg text-gray-600">
                A Limited Liability Company (LLC), protects your personal assets from some business debts and lawsuits, and offers flexible tax management. They're a popular choice for solos and entrepreneurs.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  className="bg-bright-orange-500 hover:bg-bright-orange-600"
                  asChild
                >
                  <Link to="/documents/llc">Start my LLC</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/documents/llc-guide">Learn about LLCs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporation Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Launch your Corporation
              </h2>
              <p className="text-lg text-gray-600">
                Are you looking for investors, wanting to raise funds through stock sales, or planning to go public? A Corporation may be the right choice for you. A Corporation also shields you from personal liability.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  className="bg-bright-orange-500 hover:bg-bright-orange-600"
                  asChild
                >
                  <Link to="/documents/corporation">Start my Corporation</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/documents/corporation-guide">Learn about Corporations</Link>
                </Button>
              </div>
            </div>
            <div>
              <img 
                src="/lovable-uploads/330f6709-99cc-4717-90cb-6f17517714f6.png"
                alt="Start your Corporation" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* S-Corp Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Start your S-Corp election
              </h2>
              <p className="text-lg text-gray-600">
                S-corps are a way to unlock tax savings for your business. Add on an S-corp election when you register your Corporation with Legal Gram.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  className="bg-bright-orange-500 hover:bg-bright-orange-600"
                  asChild
                >
                  <Link to="/documents/s-corp">Start your S-Corp election</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/documents/s-corp-guide">Learn about S-Corps</Link>
                </Button>
              </div>
            </div>
            <div className="md:order-1">
              <img 
                src="/lovable-uploads/fd2c0a0d-9fe5-4ee0-84ed-6ec727130975.png"
                alt="Start your S-Corp" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
              <img 
                src="/lovable-uploads/d2c6f56f-0d2b-483e-bd39-89789cf2dccc.png"
                alt="Form a Partnership" 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="md:order-1 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Form a Partnership
              </h2>
              <p className="text-lg text-gray-600">
                Starting a business with partners? A Partnership structure allows you to share responsibilities, combine resources, and split profits. Choose from General, Limited, or Limited Liability Partnerships.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg"
                  className="bg-bright-orange-500 hover:bg-bright-orange-600"
                  asChild
                >
                  <Link to="/documents/partnership">Start my Partnership</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/documents/partnership-guide">Learn about Partnerships</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Comparison Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-4">Compare Business Structures</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the right business structure for your needs. Compare features and benefits to make an informed decision.
          </p>
          
          {/* Detailed Comparison Table */}
          <h3 className="text-2xl font-bold text-center mb-6">Business Structure Comparison Guide</h3>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mb-12">
            <UITable>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-1/4 font-bold">Key Feature</TableHead>
                  <TableHead className="w-1/4 font-bold">LLC</TableHead>
                  <TableHead className="w-1/4 font-bold">Corporation</TableHead>
                  <TableHead className="w-1/4 font-bold">S Corporation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Limited Liability Protection</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Protects owners' assets</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Protects shareholders</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Protects shareholders</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Tax Treatment</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Pass through or corporate</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Double taxation</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Pass through only</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Management Structure</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Member managed or manager managed</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Board of directors & officers</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Board of directors & officers</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Investor Flexibility (Stock Options)</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Limited options</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Can issue multiple stock classes</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Limited stock options</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Ownership Restrictions</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>No limit on owners</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>No restriction</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Limited (100 max, no foreign/entity/non-resident)</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Raising Capital</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Moderate (harder to attract funds)</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Easy (attracts investors)</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Limited (due to ownership restrictions)</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Ongoing Formalities</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>Fewer formal requirements</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Strict formalities</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <span>Strict formalities</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Self-Employment Taxes</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <HelpCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <span>May apply in full</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>W-2 salary + dividends</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span>W-2 salary + dividends</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </UITable>
          </div>
        </div>
      </section>

      {/* Expert Guidance Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Expert Guidance Every Step of the Way</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: MessageCircle, title: "Business Consultations", desc: "Get expert advice on choosing the right business structure" },
              { icon: FileSearch, title: "Document Review", desc: "Professional review of all your business documents" },
              { icon: Calendar, title: "Compliance Calendar", desc: "Stay on top of important deadlines and filings" },
              { icon: HelpCircle, title: "24/7 Support", desc: "Access to our knowledge base and support team" }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
                <item.icon className="h-10 w-10 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Business Resources</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Business Guide Library",
                desc: "Access comprehensive guides on starting and running your business",
                link: "/resources/guides"
              },
              {
                icon: FileText,
                title: "Document Templates",
                desc: "Download free templates for common business documents",
                link: "/resources/templates"
              },
              {
                icon: ChartBar,
                title: "Market Research Tools",
                desc: "Access industry reports and market analysis tools",
                link: "/resources/research"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <item.icon className="h-8 w-8 text-bright-orange-500 mr-3" />
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{item.desc}</p>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link to={item.link}>Learn More</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Business Formation Services?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Fast Processing", desc: "Get your business formed in as little as 24 hours" },
              { icon: ShieldCheck, title: "100% Accuracy", desc: "Guaranteed accurate filing with state authorities" },
              { icon: UserCheck, title: "Expert Support", desc: "Access to business formation specialists" },
              { icon: DollarSign, title: "Competitive Pricing", desc: "Transparent pricing with no hidden fees" },
              { icon: ClipboardCheck, title: "Compliance", desc: "Stay compliant with state regulations" },
              { icon: Handshake, title: "Dedicated Service", desc: "Personal attention to your business needs" }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-xl border border-gray-200 hover:border-bright-orange-300 transition-all hover:shadow-lg">
                <item.icon className="h-10 w-10 text-bright-orange-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Choose Your Business Type", desc: "Select the structure that fits your needs" },
              { step: "2", title: "Provide Information", desc: "Fill out our simple online questionnaire" },
              { step: "3", title: "Review & Submit", desc: "We'll prepare and file your documents" },
              { step: "4", title: "Start Operating", desc: "Receive your formation documents" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-bright-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Business Structures</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 border text-left">Feature</th>
                  <th className="p-4 border text-center">LLC</th>
                  <th className="p-4 border text-center">Corporation</th>
                  <th className="p-4 border text-center">S-Corporation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Limited Liability Protection", llc: true, corp: true, scorp: true },
                  { feature: "Tax Flexibility", llc: true, corp: false, scorp: true },
                  { feature: "Management Flexibility", llc: true, corp: false, scorp: false },
                  { feature: "Ownership Restrictions", llc: false, corp: false, scorp: true },
                  { feature: "Stock Options", llc: false, corp: true, scorp: true }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border">{row.feature}</td>
                    <td className="p-4 border text-center">
                      {row.llc ? <CheckCircle className="inline h-5 w-5 text-green-500" /> : "-"}
                    </td>
                    <td className="p-4 border text-center">
                      {row.corp ? <CheckCircle className="inline h-5 w-5 text-green-500" /> : "-"}
                    </td>
                    <td className="p-4 border text-center">
                      {row.scorp ? <CheckCircle className="inline h-5 w-5 text-green-500" /> : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                business: "Tech Startup",
                text: "The process was incredibly smooth. Got my LLC set up in no time!",
                rating: 5
              },
              {
                name: "Michael Chang",
                business: "Consulting Firm",
                text: "Excellent support team that guided me through every step.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                business: "E-commerce Store",
                text: "Best decision for my business. Highly recommend their services!",
                rating: 5
              }
            ].map((review, index) => (
              <div key={index} className="p-6 rounded-xl bg-white shadow-lg">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.text}</p>
                <div className="font-semibold">{review.name}</div>
                <div className="text-sm text-gray-500">{review.business}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-bright-orange-500 to-bright-orange-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Business Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of successful business owners who trusted us with their business formation</p>
          <Button 
            size="lg"
            className="bg-white text-bright-orange-500 hover:bg-gray-100"
            asChild
          >
            <Link to="/signup">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default StartABusiness;
