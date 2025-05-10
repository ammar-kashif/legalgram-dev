
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DocumentDetail = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the user dashboard with documents tab active
    navigate("/user-dashboard");
  }, [navigate]);

  return null;
};

export default DocumentDetail;
