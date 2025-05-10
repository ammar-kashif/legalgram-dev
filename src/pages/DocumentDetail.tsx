
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DocumentDetail = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the documents page which uses ConditionalForm.tsx
    navigate("/documents");
  }, [navigate]);

  return null;
};

export default DocumentDetail;
