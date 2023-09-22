import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import Button from "react-bootstrap/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { VERIFY_CHECKOUT } from "../../constants/apiConstants";
import { get } from "../../components/Api/api";
import CustomSpinner from "../../components/Spinner/spinner";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let currentSessionId = searchParams.get("session_id");
  console.log(currentSessionId);
  const [isValid, setisValid] = useState(null);
  const verifySession = async () => {
    const res = await get(VERIFY_CHECKOUT + currentSessionId + "/");
    console.log(res);
    if (res?.data && res?.data?.data) {
      if (Response?.data?.data?.is_valid === true) {
        setisValid(true);
      } else {
        setisValid(false);
      }
    } else {
      setisValid(false);
    }
  };
  useEffect(() => {
    verifySession();
  }, [currentSessionId]);
  const [seconds, setseconds] = useState(5);

  setInterval(function () {
    if (isValid !== null) {
      let newSec = seconds - 1;
      setseconds(newSec);
      if (newSec === 0) {
        navigate("/", { replace: true });
        return 1;
      }
    }
  }, 1000);
  function TopContainer({ isValid }) {
    if (isValid === null) {
      return (
        <div
          className="top-container"
          style={{ padding: "80px 20px", color: "white" }}
        >
          <CustomSpinner />
          <h4 className="mt-5">Loading...</h4>
        </div>
      );
    } else if (isValid === true) {
      return (
        <div
          className="top-container-success"
          style={{ padding: "80px 20px", color: "white" }}
        >
          <Icon.CheckCircle size={"100px"} color="white" />
          <h4 className="mt-5">PAYMENT SUCCESS</h4>
        </div>
      );
    } else {
      return (
        <div
          className="top-container-failed"
          style={{ padding: "80px 20px", color: "white" }}
        >
          <Icon.XCircle size={"100px"} color="white" />
          <h4 className="mt-5">PAYMENT FAILED</h4>
        </div>
      );
    }
  }

  return (
    <>
      <style>
        {`
      body {
        min-height: 100vh;
        padding-top: 2rem;
      }     
      .top-container-success{
        background-image: radial-gradient(circle at -1% 57.5%, #13aa52 0%, #00662b 90%);
      }
      .top-container-failed{
        background-image: radial-gradient(circle at -1% 57.5%, #fb2056 0%, #870223 90%);
      }

    `}
      </style>
      <div className="container">
        <div className="h-100  d-flex align-items-center justify-content-center">
          <div className="w-100">
            <TopContainer isValid={isValid} />

            <div className="mt-4 bottom-container">
              <p style={{ color: "#3f51b5" }}>
                You will be redirected to the home page in {seconds} seconds
              </p>
              <Button
                className="mt-1 btn-secondary "
                onClick={() => navigate("/", { replace: true })}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Success;
