import { 
  Building2, BriefcaseBusiness, FileLock, Star,
  Award, UserCheck, CheckCircle, ShieldCheck,
  DollarSign, Clock, Rocket, Users, Search,
  ChartBar, Handshake, ClipboardCheck,
  BadgeCheck, Calendar, FileSearch, MessageCircle,
  BookOpen, HelpCircle, FileText, XCircle, Table
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useState } from "react";
import BusinessBackgroundSlideshow from "@/components/business/BusinessBackgroundSlideshow";
import FAQSection from "@/components/business/FAQSection";
import LLCBusinessFormation from "@/components/LLCBusinessFormation";
import CorporationFormation from "@/components/CorporationFormation";
import NonprofitFormation from "@/components/NonprofitFormation";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const StartABusiness = () => {
  const [isLLCFlowOpen, setIsLLCFlowOpen] = useState(false);
  const [isCorpFlowOpen, setIsCorpFlowOpen] = useState(false);
  const [isNonprofitFlowOpen, setIsNonprofitFlowOpen] = useState(false);

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
               Launch Your LLC Now
              </h2>
              <p className="text-lg text-gray-600">
               Setting up a Limited Liability Company (LLC) helps shield your personal assets from business-related debts or legal issues. It also gives you more options when it comes to managing taxes. That's why it's a go-to structure for solo business owners and entrepreneurs.
              </p>
              <div className="flex gap-4">
                <Dialog open={isLLCFlowOpen} onOpenChange={setIsLLCFlowOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-bright-orange-500 hover:bg-bright-orange-600"
                    >
                      Get Started
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <LLCBusinessFormation onClose={() => setIsLLCFlowOpen(false)} />
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/whats-an-llc">What's an LLC?</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* S-Corp Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/lovable-uploads/697f8a63-6e9a-41a0-9995-812ce5ce9381.png"
                alt="S-Corp Election" 
                className="rounded-lg w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                S-Corp Election
              </h2>
              <p className="text-lg text-gray-600">
                Save money on self-employment taxes while keeping things simple. An S-Corp election combines the flexibility of an LLC with potential tax savings. It's perfect for profitable businesses looking to reduce their tax burden.
              </p>
              <div className="flex gap-4">
                <Dialog open={isCorpFlowOpen} onOpenChange={setIsCorpFlowOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-bright-orange-500 hover:bg-bright-orange-600"
                      onClick={() => setIsCorpFlowOpen(true)}
                    >
                      Get Started
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <CorporationFormation onClose={() => setIsCorpFlowOpen(false)} />
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/whats-an-s-corp">What's an S-Corp?</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nonprofit Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">
                Start Your Nonprofit Organization
              </h2>
              <p className="text-lg text-gray-600">
                Looking to make a difference? Starting a nonprofit allows you to pursue your mission while enjoying tax benefits and eligibility for grants. We'll help you navigate the process from formation to tax-exempt status.
              </p>
              <div className="flex gap-4">
                <Dialog open={isNonprofitFlowOpen} onOpenChange={setIsNonprofitFlowOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-bright-orange-500 hover:bg-bright-orange-600"
                      onClick={() => setIsNonprofitFlowOpen(true)}
                    >
                      Get Started
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <NonprofitFormation onClose={() => setIsNonprofitFlowOpen(false)} />
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="lg"
                  asChild
                >
                  <Link to="/whats-a-nonprofit">What's a Nonprofit?</Link>
                </Button>
              </div>
            </div>
            <div>
              <img 
                src="/lovable-uploads/609d30f6-95e3-406f-810f-a8f6a462c3f1.png"
                alt="Nonprofit Formation" 
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Structure Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Compare Business Structures
          </h2>
          
          <div className="overflow-x-auto">
            <UITable className="w-full bg-white rounded-lg shadow-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-black">Feature</TableHead>
                  <TableHead className="font-bold text-black text-center">LLC</TableHead>
                  <TableHead className="font-bold text-black text-center">Corporation</TableHead>
                  <TableHead className="font-bold text-black text-center">Partnership</TableHead>
                  <TableHead className="font-bold text-black text-center">Sole Proprietorship</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Personal Asset Protection</TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tax Flexibility</TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Easy Setup</TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Investor Friendly</TableCell>
                  <TableCell className="text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Management Flexibility</TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </UITable>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Why Choose Legal Gram?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-black/10 hover:shadow-lg transition-shadow">
              <ShieldCheck className="h-10 w-10 text-bright-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-3">Expert Legal Review</h3>
              <p className="text-gray-600 mb-4">All documents reviewed by licensed attorneys</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Attorney-reviewed documents</li>
                <li>• State-specific compliance</li>
                <li>• Legal accuracy guaranteed</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl border border-black/10 hover:shadow-lg transition-shadow">
              <Clock className="h-10 w-10 text-bright-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-3">Fast & Efficient</h3>
              <p className="text-gray-600 mb-4">Get your business documents in minutes, not days</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Instant document generation</li>
                <li>• Same-day processing</li>
                <li>• Quick turnaround time</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl border border-black/10 hover:shadow-lg transition-shadow">
              <DollarSign className="h-10 w-10 text-bright-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-3">Affordable Pricing</h3>
              <p className="text-gray-600 mb-4">Professional legal services at a fraction of the cost</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Transparent pricing</li>
                <li>• No hidden fees</li>
                <li>• Money-back guarantee</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl border border-black/10 hover:shadow-lg transition-shadow">
              <Users className="h-10 w-10 text-bright-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-3">Dedicated Support</h3>
              <p className="text-gray-600 mb-4">Expert guidance every step of the way</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 24/7 customer support</li>
                <li>• Legal experts available</li>
                <li>• Personalized assistance</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl border border-black/10 hover:shadow-lg transition-shadow">
              <CheckCircle className="h-10 w-10 text-bright-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-3">Compliance Guaranteed</h3>
              <p className="text-gray-600 mb-4">Stay compliant with all state and federal requirements</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• State-specific forms</li>
                <li>• Updated regulations</li>
                <li>• Compliance monitoring</li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl border border-black/10 hover:shadow-lg transition-shadow">
              <Rocket className="h-10 w-10 text-bright-orange-500 mb-4" />
              <h3 className="text-xl font-semibold text-black mb-3">All-in-One Platform</h3>
              <p className="text-gray-600 mb-4">Everything you need to start and run your business</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Business formation</li>
                <li>• Legal documents</li>
                <li>• Ongoing compliance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-bright-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">1. Choose Your Structure</h3>
              <p className="text-gray-600">
                Select the business structure that best fits your needs. Our experts will guide you through the options.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-bright-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <ClipboardCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">2. Complete the Forms</h3>
              <p className="text-gray-600">
                Fill out our simple questionnaire. We'll handle all the paperwork and legal requirements for you.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-bright-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BadgeCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">3. Get Your Documents</h3>
              <p className="text-gray-600">
                Receive your completed legal documents and business registration. You're ready to start operating!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">Basic</h3>
                <div className="text-4xl font-bold text-bright-orange-500 mb-2">$99</div>
                <p className="text-gray-600">Perfect for simple businesses</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Business formation documents</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>State filing included</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Email support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Digital document delivery</span>
                </li>
              </ul>
              
              <Button className="w-full bg-bright-orange-500 hover:bg-bright-orange-600" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
            
            <div className="p-8 rounded-xl border-2 border-bright-orange-500 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-bright-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">Professional</h3>
                <div className="text-4xl font-bold text-bright-orange-500 mb-2">$199</div>
                <p className="text-gray-600">Everything you need to get started</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Operating Agreement</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>EIN registration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Phone support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Registered agent (1 year)</span>
                </li>
              </ul>
              
              <Button className="w-full bg-bright-orange-500 hover:bg-bright-orange-600" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
            
            <div className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">Premium</h3>
                <div className="text-4xl font-bold text-bright-orange-500 mb-2">$399</div>
                <p className="text-gray-600">Complete business package</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Business license research</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Trademark search</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Ongoing compliance alerts</span>
                </li>
              </ul>
              
              <Button className="w-full bg-bright-orange-500 hover:bg-bright-orange-600" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <FAQSection />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-black text-center mb-12">
            What Our Customers Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                business: "Tech Startup",
                text: "Legal Gram made forming my LLC incredibly easy. The whole process took less than 30 minutes!",
                rating: 5
              },
              {
                name: "Michael Chen",
                business: "Consulting Firm",
                text: "Professional service and great value. I saved thousands compared to hiring a lawyer.",
                rating: 5
              },
              {
                name: "Lisa Davis",
                business: "E-commerce Store",
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
