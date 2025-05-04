
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Feature {
  name: string;
  included: boolean;
  description?: string;
}

interface ComparisonCardProps {
  title: string;
  price: string;
  features: Feature[];
  popular?: boolean;
  showButton?: boolean;
}

const ComparisonCard = ({ title, price, features, popular, showButton = false }: ComparisonCardProps) => {
  return (
    <Card className={`relative ${popular ? 'border-bright-orange-500 shadow-lg' : 'border-gray-200'}`}>
      {popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-bright-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <p className="text-3xl font-bold mt-4">{price}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              {feature.included ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                  {feature.name}
                </span>
                {feature.description && (
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        
        {showButton && (
          <div className="mt-6">
            <Button className="w-full bg-bright-orange-500 hover:bg-bright-orange-600">
              Select {title}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonCard;
