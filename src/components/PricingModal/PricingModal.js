import React, { useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./PricingModal.css";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { logOut } from "../../services/userServices";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import useLogin from "../../components/Login/Login";
import { get, post } from "../Api/api";
import {
  CREATE_CHECKOUT,
  CUSTOMER_PORTAL,
  GET_PRODUCTS,
} from "../../constants/apiConstants";
const PricingModal = ({ stripeDetails, is_canceled, ...props }) => {
  const result = stripeDetails?.reduce((accumulator, value, index) => {
    return { ...accumulator, [value.product_id]: value };
  }, {});

  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const [pricingDetails, setPricingDetails] = useState([]);
  const [pricingDetails1, setPricingDetails1] = useState([]);

  const login = useLogin(setErrorToastMessage, loginCallBack);
  let product_id = null;
  function FooterButton({ details }) {
    let buttonVarient = "primary";
    let buttonText = "Get Plus";
    let plan_user = "free";
    if (result && result[details.id] !== undefined) {
      let plan = result[details.id];
      if (plan.is_plan_canceled === false) {
        if (plan.is_subscription_canceled === false) {
          buttonText = "Cancel";
          buttonVarient = "secondary";
          plan_user = "subcriped";
        } else if (plan.is_subscription_canceled === true) {
          buttonText = "Undo Cancel";
          buttonVarient = "primary";
          plan_user = "canceled";
        }
      }
    }
    function pricingButtonFunction() {
      product_id = details.id;
      if (props.email) {
        if (plan_user === "free") {
          handleCheckout();
        } else {
          showStripeCustomerPortal();
        }
      } else {
        login(); /**strip implemented in login callback function */
      }
    }
    return (
      <>
        <Button
          className="float-end m-1"
          variant={buttonVarient}
          size="sm"
          onClick={pricingButtonFunction}
        >
          {buttonText}
        </Button>
      </>
    );
  }

  async function loginCallBack(islogin) {
    console.log(islogin);
    if (islogin) {
      await handleCheckout();
    }
  }

  async function showStripeCustomerPortal() {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const formData = new FormData();
    let checkout_session_id = result?.[product_id]?.stripe_checkout_session_id;
    formData.append("checkout_session_id", checkout_session_id);
    const response = await post(CUSTOMER_PORTAL, formData, config);
    console.log(response);
    if (response && response?.data && response.data?.session) {
      let session = response.data?.session;
      console.log(session);
      window.location.href = session;
    } else {
      setErrorToastMessage("Something went wrong.");
    }
  }
  async function createCheckout() {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const formData = new FormData();
    formData.append("product_id", product_id);
    formData.append(
      "stripe_price_id",
      process.env.REACT_APP_PUBLIC_STRIPE_PRICE_ID
    );
    const response = await post(CREATE_CHECKOUT, formData, config);
    console.log(response);
    if (response && response?.data && response.data?.checkout_url) {
      let checkout_url = response.data?.checkout_url;
      console.log(checkout_url);
      window.location.href = checkout_url;
    } else {
      setErrorToastMessage(
        "Something went wrong while creating the Stripe session."
      );
    }
    product_id = null;
  }

  async function handleCheckout() {
    if (props.is_canceled === true) {
      showStripeCustomerPortal();
    } else if (props?.product_id) {
      showStripeCustomerPortal();
    } else {
      createCheckout();
    }
  }
  const getProducts = useCallback(async () => {
    let res = await get(GET_PRODUCTS);
    console.log(res?.data?.data?.data);
    if (
      res?.data &&
      res?.data?.data &&
      res?.data?.data?.data &&
      res?.data?.data?.data.length
    ) {
      let priceData = res?.data?.data?.data;
      if (priceData.length)
        priceData = priceData.filter((ele) => ele.active === true);

      setPricingDetails1(priceData);
    }
  }, []);

  const setActive = useCallback(() => {
    let priceData = pricingDetails1;
    let result = stripeDetails?.reduce((accumulator, value, index) => {
      return { ...accumulator, [value.product_id]: value };
    }, {});
    if (!stripeDetails?.length && priceData.length) {
      priceData[0].isCurrent = true;
    } else {
      priceData = priceData?.map((ele) => {
        ele.isCurrent = false;
        if (result && result[ele.id] !== undefined) {
          let plan = result[ele.id];
          if (plan.is_plan_canceled === false)
            if (plan.is_subscription_canceled === false) {
              ele.isCurrent = true;
            }
        }
        return ele;
      });
    }
    let test = priceData?.reduce((accumulator, value, index) => {
      return { ...accumulator, [value.isCurrent]: value };
    }, {});
    if (!test[true] && priceData.length) {
      priceData[0].isCurrent = true;
    }
    setPricingDetails(priceData);
  }, [pricingDetails1, stripeDetails]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    setActive();
  }, [setActive]);

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Upgrade to Pdfgator Plus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {pricingDetails.map((pricingDetail, index) => (
            <Col key={index}>
              <Card className="pricing">
                <Card.Header>
                  <span className="fw-bold">
                    {pricingDetail.metadata?.product_name}
                  </span>
                  {pricingDetail.isCurrent === true ? (
                    <span className="float-end text-muted">current</span>
                  ) : (
                    <></>
                  )}
                </Card.Header>
                <Card.Body>
                  <div className="p-3">
                    <span className="fw-bold fs-4">
                      ${pricingDetail.metadata?.price}
                    </span>

                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="plan-list">
                    <li>
                      <div>
                        <span className="fw-bold">
                          {pricingDetail.metadata?.no_pages} pages
                        </span>
                        <span className="text-muted">/PDF</span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="fw-bold">
                          {pricingDetail.metadata?.file_size} MB
                        </span>
                        <span className="text-muted">/PDF</span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="fw-bold">
                          {pricingDetail.metadata?.files_per_day} PDFs
                        </span>
                        <span className="text-muted">/day</span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="fw-bold">
                          {pricingDetail.metadata?.no_of_questions} questions
                        </span>
                        <span className="text-muted">/day</span>
                      </div>
                    </li>
                  </ul>
                </Card.Body>
                {pricingDetail.metadata?.product_name.toLocaleLowerCase() !==
                "free" ? (
                  <Card.Footer className="text-muted">
                    <FooterButton details={pricingDetail} />
                  </Card.Footer>
                ) : (
                  <></>
                )}
              </Card>
            </Col>
          ))}
        </Row>
        <Row>
          <div className="mt-3 text-center">
            {props.email ? (
              <>
                <span className="">Not {props.email}? </span>
                <span
                  className="text-primary alert-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    logOut();
                  }}
                >
                  Sign out
                </span>
              </>
            ) : (
              <>
                <span className="">Already have an account? </span>
                <span
                  className="text-primary alert-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    login();
                  }}
                >
                  Sign in
                </span>
              </>
            )}
          </div>
        </Row>
      </Modal.Body>
      <ErrorToast
        message={errorToastMessage}
        setMessage={setErrorToastMessage}
        color={"danger"}
      />
    </Modal>
  );
};
export default PricingModal;
