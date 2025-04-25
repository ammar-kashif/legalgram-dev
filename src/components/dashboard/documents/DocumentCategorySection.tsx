
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DocumentProps {
  id: number;
  name: string;
  category: string;
  complexity: string;
  icon: React.ReactNode;
  badge: string;
  badgeColor: string;
  description: string;
  features: string[];
  gradientFrom: string;
  gradientTo: string;
}

interface DocumentCategorySectionProps {
  document: DocumentProps;
  onStartCreating: (id: number) => void;
  isAuthenticated: boolean;
  index: number;
}

const DocumentCategorySection: React.FC<DocumentCategorySectionProps> = ({
  document,
  onStartCreating,
  isAuthenticated,
  index
}) => {
  const isMobile = useIsMobile();
  const isEven = index % 2 === 0;
  
  return (
    <div 
      className={`relative p-6 md:p-8 rounded-2xl shadow-md border transition-all duration-300 hover:shadow-lg ${
        isEven 
        ? `bg-gradient-to-r ${document.gradientFrom} ${document.gradientTo}` 
        : `bg-gradient-to-l ${document.gradientFrom} ${document.gradientTo}`
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className={cn(
          "flex gap-8 items-start",
          isMobile ? "flex-col" : "flex-row"
        )}>
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                {document.icon}
              </div>
              <Badge variant="outline" className="bg-white/80">
                {document.category}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`${
                  document.badgeColor === "green" 
                    ? "bg-green-100 text-green-800" 
                    : document.badgeColor === "blue" 
                    ? "bg-blue-100 text-blue-800" 
                    : document.badgeColor === "bright-orange" 
                    ? "bg-bright-orange-100 text-bright-orange-800"
                    : "bg-deep-blue-100 text-deep-blue-800"
                }`}
              >
                {document.badge}
              </Badge>
            </div>
            
            <h2 className="text-xl md:text-2xl font-semibold text-deep-blue-900">
              {document.name}
            </h2>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground text-base md:text-lg">
                {document.description}
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={() => onStartCreating(document.id)}
                className="group bg-white text-bright-orange-600 hover:bg-bright-orange-50 border border-bright-orange-200 shadow-sm"
              >
                {isAuthenticated ? "Start Creating" : "Sign in to Use"}
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          
          <div className={cn(
            "bg-white/90 p-5 rounded-xl shadow-sm space-y-3",
            isMobile ? "w-full" : "w-full md:w-2/5"
          )}>
            <h3 className="font-medium text-deep-blue-900 text-lg flex items-center">
              <span className="bg-bright-orange-100 p-1 rounded-md text-bright-orange-500 mr-2 inline-flex">
                <CheckCircle className="h-4 w-4" />
              </span>
              Key Features
            </h3>
            <ul className="space-y-3">
              {document.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-deep-blue-800">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCategorySection;
