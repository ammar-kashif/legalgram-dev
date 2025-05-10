
import React from 'react';
import MakeDocuments from './MakeDocuments';

const MakeDocument = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Document Creation</h2>
      <p className="text-muted-foreground mb-8">
        Choose from our library of legal document templates to get started. Our easy-to-use forms will guide you through the process.
      </p>
      
      <MakeDocuments />
    </div>
  );
};

export default MakeDocument;
