import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Fuel, FileText, Shield, DollarSign, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GasLeaseInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Fuel className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gas Lease Agreement
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a comprehensive gas lease agreement for oil and gas exploration, drilling, and mineral rights with professional legal protection
          </p>
        </div>

        {/* Key Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              What's Included in Your Gas Lease Agreement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Exclusive Drilling Rights</h4>
                    <p className="text-sm text-gray-600">Complete exploration, drilling, and extraction rights for oil, gas, and hydrocarbons</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Royalty Provisions</h4>
                    <p className="text-sm text-gray-600">Detailed oil, gas, and casinghead gasoline royalty terms</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Development Obligations</h4>
                    <p className="text-sm text-gray-600">Clear drilling and development requirements with offset well provisions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Payment Terms</h4>
                    <p className="text-sm text-gray-600">Structured rental and royalty payment schedules</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Surface Use Rights</h4>
                    <p className="text-sm text-gray-600">Balanced rights for surface use by both lessor and lessee</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Assignment Provisions</h4>
                    <p className="text-sm text-gray-600">Rules for transferring lease rights and interests</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Default & Termination</h4>
                    <p className="text-sm text-gray-600">Clear procedures for addressing lease violations and termination</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Tax Allocation</h4>
                    <p className="text-sm text-gray-600">Clear division of tax responsibilities between parties</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When to Use */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                When to Use This Agreement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Leasing land for oil and gas exploration</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Mineral rights development</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Hydrocarbon extraction operations</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Energy development projects</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Natural gas drilling and production</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Legal Protection Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Comprehensive royalty protection</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Environmental compliance provisions</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Operational standards requirements</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Property restoration obligations</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-sm">Default cure procedures</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Important Lease Terms Covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Financial Terms</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Annual rental amounts</li>
                  <li>• Oil and gas royalty percentages</li>
                  <li>• Casinghead gasoline royalties</li>
                  <li>• Payment schedules and methods</li>
                  <li>• Tax allocation between parties</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Operational Rights</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Exclusive drilling and extraction rights</li>
                  <li>• Infrastructure development permissions</li>
                  <li>• Water usage and injection rights</li>
                  <li>• Processing facility construction</li>
                  <li>• Surface access and use</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Protections</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Development and drilling obligations</li>
                  <li>• Offset well requirements</li>
                  <li>• Assignment and transfer rules</li>
                  <li>• Default and cure procedures</li>
                  <li>• Termination and restoration terms</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">1</div>
                <h4 className="font-semibold mb-1">Enter Location</h4>
                <p className="text-xs text-gray-600">Provide property location and legal description</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">2</div>
                <h4 className="font-semibold mb-1">Define Parties</h4>
                <p className="text-xs text-gray-600">Enter lessor and lessee information</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">3</div>
                <h4 className="font-semibold mb-1">Set Terms</h4>
                <p className="text-xs text-gray-600">Configure lease terms and royalty rates</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mx-auto mb-2">4</div>
                <h4 className="font-semibold mb-1">Generate Agreement</h4>
                <p className="text-xs text-gray-600">Download your completed gas lease</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/gas-lease-form')} 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Create Your Gas Lease Agreement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            Professional-grade template • Instant PDF generation • Legally compliant
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default GasLeaseInfo;
