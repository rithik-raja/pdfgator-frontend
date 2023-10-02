import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const Cancelled = () => {
  const navigate = useNavigate();
  const [seconds, setseconds] = useState(10);

  useEffect(() => {
    if (seconds === 0) {
      navigate("/", { replace: true });
      return;
    }
    setTimeout(() => {
      setseconds((seconds) => seconds - 1);
    }, 1000);
  }, [seconds, navigate]);

  return (
    <>
      <style>
        {`
      body {
        min-height: 100vh;
        background-image: linear-gradient(to left bottom, #96befa, #b9ccfb, #d6dcfc, #ededfd, #ffffff);
      }  
    `}
      </style>
      <div className="container-fluid p-0">
        <div className="h-100  d-flex align-items-center justify-content-center">
          <div className="w-100">
            <div style={{ padding: "100px 20px" }}>
              <Icon.Gift size={"80px"} color="grey" />
              <h3 className="mt-4" style={{ paddingTop: "30px" }}>
                Get More Features in <span className="text-primary">PLUS</span>{" "}
                plan
              </h3>
              <div className="mt-4 " style={{ paddingTop: "30px" }}>
                <p style={{ color: "#3f51b5" }}>
                  Redirects to home page in {seconds} seconds
                </p>
                {/* <Button
                  className="btn-primary"
                  style={{ marginRight: "10px" }}
                  onClick={() => navigate("/", { replace: true })}
                >
                  GET PLUS NOW
                </Button> */}
                <Button
                  className="btn-secondary"
                  onClick={() => navigate("/", { replace: true })}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cancelled;
