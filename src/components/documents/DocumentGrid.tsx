
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import DocumentCard, { DocumentItem } from "./DocumentCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface DocumentGridProps {
  documents: DocumentItem[];
  isAuthenticated: boolean;
  onUseTemplate: (id: number) => void;
  searchTerm: string;
  activeCategory: string;
  onReset: () => void;
}

const DocumentGrid = ({
  documents,
  isAuthenticated,
  onUseTemplate,
  searchTerm,
  activeCategory,
  onReset,
}: DocumentGridProps) => {
  const isMobile = useIsMobile();
  
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-4">No documents found</h3>
        <Button onClick={onReset} variant="outline" className="inline-flex items-center">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
      {filteredDocuments.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          isAuthenticated={isAuthenticated}
          onUseTemplate={onUseTemplate}
        />
      ))}
    </div>
  );
};

export default DocumentGrid;
