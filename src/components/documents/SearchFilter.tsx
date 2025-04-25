
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: string[];
}

const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  categories,
}: SearchFilterProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 mb-8">
      <Input
        type="text"
        placeholder="Search templates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
      
      <div className={`flex flex-wrap gap-2 ${isMobile ? 'overflow-x-auto pb-2 -mx-4 px-4' : ''}`}>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            className={`
              whitespace-nowrap text-sm
              ${activeCategory === category 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
