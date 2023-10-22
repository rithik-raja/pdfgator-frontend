import React, { useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./PricingModal.css";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CustomSpinner from "../Spinner/spinner";
import {
  getCheckoutSessionID,
  getUserPlanStatus,
  logOut,
} from "../../services/userServices";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import useLogin from "../../components/Login/Login";
import { get, post } from "../Api/api";
import {
  CREATE_CHECKOUT,
  CUSTOMER_PORTAL,
  GET_PRODUCTS,
} from "../../constants/apiConstants";
import {
  CURRENT_PLAN_EXPIRED,
  CURRENT_PLAN_FREE,
  CURRENT_PLAN_SUBSCRIPED,
  CURRENT_PLAN_SUBSCRIPTION_CANCELED,
} from "../../constants/userConstants";
import { useRef } from "react";
const PricingModal = ({ stripeDetails, ...props }) => {
  const [errorToastMessage, setErrorToastMessage_] = useState(null);
  const [errorToastColor, setErrorToastColor] = useState("danger");
  const setErrorToastMessage = (msg, color = "danger") => {
    setErrorToastMessage_(msg);
    setErrorToastColor(color);
  };
  const [pricingDetails, setPricingDetails] = useState([]);
  const [pricingDetails1, setPricingDetails1] = useState([]);
  const [loginCheck, setLoginCheck] = useState(false);
  const [loginProId, setloginProId] = useState(null);

  const login = useLogin(setErrorToastMessage, loginCallBack);
  let product_id = useRef(null);
  function FooterButton({ details }) {
    let buttonVarient = "primary";
    let buttonText = "Get Plus";
    let userPlan =
      getUserPlanStatus(stripeDetails, details?.id) || CURRENT_PLAN_FREE;
    if (userPlan === CURRENT_PLAN_FREE || userPlan === CURRENT_PLAN_EXPIRED) {
      buttonVarient = "primary";
      buttonText = "Get Plus";
    } else if (userPlan === CURRENT_PLAN_SUBSCRIPED) {
      buttonText = "Cancel";
      buttonVarient = "secondary";
    } else if (userPlan === CURRENT_PLAN_SUBSCRIPTION_CANCELED) {
      buttonText = "Undo Cancel";
      buttonVarient = "primary";
    }

    function pricingButtonFunction() {
      product_id.current = details?.id;
      if (props.email) {
        if (
          userPlan === CURRENT_PLAN_FREE ||
          userPlan === CURRENT_PLAN_EXPIRED
        ) {
          handleCheckout();
        } else if (
          userPlan === CURRENT_PLAN_SUBSCRIPED ||
          userPlan === CURRENT_PLAN_SUBSCRIPTION_CANCELED
        ) {
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
    if (islogin) {
      setLoginCheck(true);
      setloginProId(product_id.current);
      // await handleCheckout();
    }
  }
  const showStripeCustomerPortal = useCallback(async () => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const formData = new FormData();
    const result = stripeDetails?.reduce((accumulator, value, index) => {
      return { ...accumulator, [value.product_id]: value };
    }, {});
    let checkout_session_id =
      result?.[product_id.current]?.stripe_checkout_session_id ||
      getCheckoutSessionID();
    formData.append("checkout_session_id", checkout_session_id);
    const response = await post(CUSTOMER_PORTAL, formData, config);
    if (response && response?.data && response.data?.session) {
      let session = response.data?.session;
      window.location.href = session;
    } else {
      setErrorToastMessage("Something went wrong.");
    }
  }, [stripeDetails]);

  const createCheckout = useCallback(async () => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const formData = new FormData();
    formData.append("product_id", product_id.current);
    formData.append(
      "stripe_price_id",
      process.env.REACT_APP_PUBLIC_STRIPE_PRICE_ID
    );
    const response = await post(CREATE_CHECKOUT, formData, config);
    if (response && response?.data && response.data?.checkout_url) {
      let checkout_url = response.data?.checkout_url;
      window.location.href = checkout_url;
    } else {
      setErrorToastMessage(
        "Something went wrong while creating the Stripe session."
      );
    }
    product_id.current = null;
  }, []);
  async function handleCheckout() {
    if (!product_id.current) return 0;
    let userPlan = getUserPlanStatus(stripeDetails, product_id.current);
    if (userPlan === CURRENT_PLAN_FREE || userPlan === CURRENT_PLAN_EXPIRED) {
      createCheckout();
    } else if (
      userPlan === CURRENT_PLAN_SUBSCRIPED ||
      userPlan === CURRENT_PLAN_SUBSCRIPTION_CANCELED
    ) {
      showStripeCustomerPortal();
    }
  }

  const getProducts = useCallback(async () => {
    let res = await get(GET_PRODUCTS);
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
    priceData = priceData?.map((ele) => {
      ele.isCurrent = false;
      if (result && result[ele.id] !== undefined) {
        let plan = result[ele.id];
        if (plan.is_plan_canceled === false)
          // if (plan.is_subscription_canceled === false) {
          ele.isCurrent = true;
        // }
      }
      return ele;
    });
    if ((!stripeDetails?.length || !props.email) && priceData.length) {
      priceData[0].isCurrent = true;
    }
    let test = priceData?.reduce((accumulator, value, index) => {
      return { ...accumulator, [value.isCurrent]: value };
    }, {});
    if (!test[true] && priceData.length) {
      priceData[0].isCurrent = true;
    }
    setPricingDetails(priceData);
  }, [pricingDetails1, stripeDetails, props?.email]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    setActive();
  }, [setActive]);

  useEffect(() => {
    if (loginCheck) {
      if (stripeDetails && loginProId) {
        product_id.current = loginProId;
        if (!product_id.current) return 0;
        let userPlan = getUserPlanStatus(stripeDetails, product_id.current);
        if (
          userPlan === CURRENT_PLAN_FREE ||
          userPlan === CURRENT_PLAN_EXPIRED
        ) {
          createCheckout();
        } else if (
          userPlan === CURRENT_PLAN_SUBSCRIPED ||
          userPlan === CURRENT_PLAN_SUBSCRIPTION_CANCELED
        ) {
          showStripeCustomerPortal();
        }
      }
    }
  }, [
    createCheckout,
    loginCheck,
    loginProId,
    product_id,
    showStripeCustomerPortal,
    stripeDetails,
  ]);

  // useEffect(() => {
  //   function handleUserLogin() {
  //     console.log(props.stripeDetails);
  //   }
  //   document.addEventListener("userUpdate", handleUserLogin);
  //   return () => {
  //     document.removeEventListener("userUpdate", handleUserLogin);
  //   };
  // }, [props.stripeDetails]);

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
          {pricingDetails.length === 0 && (
            <Col className="d-flex align-items-center justify-content-center">
              <CustomSpinner />
            </Col>
          )}
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
                  <ul className="plan-list m-0">
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
                    logOut(setErrorToastMessage);
                    setLoginCheck(false);
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
        color={errorToastColor}
      />
    </Modal>
  );
};
export default PricingModal;
