import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";
import Button from "react-bootstrap/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { VERIFY_CHECKOUT } from "../../constants/apiConstants";
import { post } from "../../components/Api/api";
import CustomSpinner from "../../components/Spinner/spinner";
import { CHECKOUT_SESSION_ID } from "../../constants/storageConstants";
import Cookies from "js-cookie";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let currentSessionId = searchParams.get("checkout_session_id");
  console.log(currentSessionId);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [message, setMessage] = useState(null);

  const verifySession = async () => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const formData = new FormData();
    formData.append("checkout_session_id", currentSessionId);
    const res = await post(VERIFY_CHECKOUT, formData, config);
    console.log(res);
    let data = res?.data?.data;
    if (data) {
      setPaymentStatus(data.payment_status);
      setMessage(data.message);
    } else {
      setPaymentStatus(false);
      setMessage("Something went wrong");
    }
  };
  useEffect(() => {
    verifySession();
    Cookies.set(CHECKOUT_SESSION_ID, currentSessionId, { expires: 30 });
  }, [currentSessionId]);

  const [seconds, setseconds] = useState(10);

  useEffect(() => {
    if (seconds === 0) {
      navigate("/", { replace: true });
      return;
    }
    setTimeout(() => {
      console.log(seconds);
      setseconds((seconds) => seconds - 1);
    }, 1000);
  }, [seconds]);

  // setInterval(function () {
  //   if (paymentStatus !== null) {
  //     let newSec = seconds - 1;
  //     setseconds(newSec);
  //     if (newSec === 0) {
  //       navigate("/", { replace: true });
  //       return 1;
  //     }
  //   }
  // }, 1000);
  function TopContainer({ paymentStatus }) {
    if (paymentStatus === null) {
      return (
        <div
          className="top-container"
          style={{ padding: "100px 20px", color: "white" }}
        >
          <CustomSpinner />
          <h4 className="mt-5">Loading...</h4>
        </div>
      );
    } else if (paymentStatus === true) {
      return (
        <div
          className="top-container success-bg"
          style={{ padding: "100px 20px", color: "white" }}
        >
          <Icon.CheckCircle size={"100px"} color="white" />
          <h4 className="mt-5">{message}</h4>
        </div>
      );
    } else {
      return (
        <div
          className="top-container failed-bg"
          style={{ padding: "100px 20px", color: "white" }}
        >
          <Icon.XCircle size={"100px"} color="white" />
          <h4 className="mt-5">{message}</h4>
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
      }     
      .success-bg{
        background-image: radial-gradient(circle at -1% 57.5%, #13aa52 0%, #00662b 90%);
      }
      .failed-bg{
        background-image: radial-gradient(circle at -1% 57.5%, #fb2056 0%, #870223 90%);
      }

    `}
      </style>
      <div className="container-fluid p-0">
        <div className="h-100  d-flex align-items-center justify-content-center">
          <div className="w-100">
            <TopContainer paymentStatus={paymentStatus} />

            <div className="mt-5 bottom-container">
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
