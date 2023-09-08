import React from "react";
import * as Icon from "react-feather";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="my-auto" style={{ padding: "80px 20px", color: "white" }}>
        <Icon.CheckCircle size={"100px"} color="green" />
        <h4 className="mt-5 text-success">PAYMENT SUCCESS</h4>
        <Button
          className="mt-3 btn-success"
          onClick={() => navigate("/", { replace: true })}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Success;
