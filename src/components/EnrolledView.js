import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EnrolledView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/StudentEnrolledClasses");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h5 className="text-success">
        You have successfully enrolled in your courses!
      </h5>
    </div>
  );
};

export default EnrolledView;
