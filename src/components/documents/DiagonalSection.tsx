
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

interface DiagonalSectionProps {
  document: {
    id: number;
    name: string;
    category: string;
    complexity: string;
  };
  index: number;
  onSelect: (id: number) => void;
  isAuthenticated: boolean;
}

const DiagonalSection = ({ document, index, onSelect, isAuthenticated }: DiagonalSectionProps) => {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 my-16 py-8 ${
      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
    }`}>
      {/* Flowing decorative line */}
      <div className="absolute inset-0 overflow-hidden z-0 hidden md:block">
        <div 
          className={`absolute w-full ${isEven ? '-translate-y-1/2' : 'translate-y-1/2'}`} 
          style={{
            height: '100px',
            background: `url('${'/lovable-uploads/310c80a8-1724-491b-b9ad-1014830b0771.png'}') no-repeat center center`,
            backgroundSize: 'cover',
            transform: `${isEven ? 'scaleY(-1)' : 'scaleY(1)'}`,
            opacity: 0.1
          }}
        />
      </div>
      
      {/* Document Card */}
      <div className="w-full md:w-1/2 z-10">
        <Card className="transform hover:scale-105 transition-transform duration-300 shadow-lg border-t-4 border-t-primary backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="flex items-start gap-3">
              <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
              <span>{document.name}</span>
            </CardTitle>
            <CardDescription>{document.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                {document.complexity} Complexity
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              This document template provides a standard format that complies with legal requirements.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full group"
              onClick={() => onSelect(document.id)}
            >
              {isAuthenticated ? "Use Template" : "Sign in to Use"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Document Preview Image */}
      <div className="w-full md:w-1/2 z-10">
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 backdrop-blur-sm bg-white/5">
          <img 
            src={`/lovable-uploads/${
              index % 2 === 0 
                ? "34269ddd-2754-4348-8200-d0cbb7790b18.png"
                : "bbae67ec-7fdd-49d8-adfd-ca2a1c8a05a1.png"
            }`}
            alt={`${document.name} preview`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default DiagonalSection;
