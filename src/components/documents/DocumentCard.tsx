
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DocumentItem {
  id: number;
  title: string;
  category: string;
  description: string;
  popular?: boolean;
}

interface DocumentCardProps {
  document: DocumentItem;
  isAuthenticated: boolean;
  onUseTemplate: (id: number) => void;
}

const DocumentCard = ({ document, isAuthenticated, onUseTemplate }: DocumentCardProps) => {
  return (
    <Card className="h-full flex flex-col transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg md:text-xl">{document.title}</CardTitle>
            <CardDescription>{document.category}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{document.description}</p>
        {document.popular && (
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Popular Template
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <Button 
          className={cn(
            "w-full group transform transition-transform duration-300 hover:scale-105 hover:rotate-1",
            isAuthenticated 
              ? "bg-primary hover:bg-primary/90" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
          )}
          onClick={() => onUseTemplate(document.id)}
        >
          {isAuthenticated ? "Use Template" : "Sign in to Use"}
          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;

