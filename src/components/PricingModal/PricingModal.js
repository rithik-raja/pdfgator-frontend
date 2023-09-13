import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./PricingModal.css";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { logOut } from "../../services/userServices";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import useLogin from "../../components/Login/Login";
import getStripe from "../../lib/getStripe";
import { get, post } from "../Api/api";
import { CHECKOUT, GET_PRODUCTS } from "../../constants/apiConstants";
export default function PricingModal(props) {
  console.log(props.plan_id)
  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const [pricingDetails, setPricingDetails] = useState([
    {
      product_name: "Free",
      currency_code: "$",
      price: 0,
      no_pages: 123,
      file_size: 10,
      files_per_day: 3,
      no_of_questions: 50,
      //is_current: true
      plan_id: 0,
      is_paid: false,
    },
    {
      product_name: "Plus",
      currency_code: "$",
      price: 5,
      no_pages: 2000,
      file_size: 32,
      files_per_day: 50,
      no_of_questions: 1000,
      //is_current: false,
      plan_id: 1,
      is_paid: true,
    },
  ]);

  const login = useLogin(setErrorToastMessage, loginCallBack);

  function FooterButton({ details }) {
    let buttonVarient = "primary";
    let buttonText = "Get Plus";
    if (props.isCanceled) {
      buttonText = "Undo Cancel";
      buttonVarient = "primary";
    } else if (props.isSubscriped) {
      buttonText = "Cancel";
      buttonVarient = "secondary";
    }
    function pricingButtonFunction() {
      if (props.email) {
        handleCheckout();
      } else {
        login(); /**strip implemented in login callback function */
      }
    }
    return (
      <>
        {/* {props.isSubscriped === "False" && props.isCanceled === "True" && (
          <span className="float-end">subscription was canceled</span>
        )} */}
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
    const response = await post(CHECKOUT, {}, config);
    console.log(response);
    if (response && response?.data && response.data?.checkout_url) {
      let checkout_url = response.data?.checkout_url;
      console.log(checkout_url);
      window.location.href = checkout_url;
    }
  }

  async function handleCheckout() {
    if (props.isSubscriped === "True") {
      showStripeCustomerPortal();
    } else if (props.isCanceled === "True") {
      showStripeCustomerPortal();
    } else {
      const stripe = await getStripe();
      await stripe.redirectToCheckout({
        lineItems: [
          {
            price: process.env.REACT_APP_PUBLIC_STRIPE_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        successUrl: `http://localhost:3000/checkout/success`,
        cancelUrl: `http://localhost:3000`,
        customerEmail: props.email,
      });
    }
  }
  const getProducts = async () => {
    let res = await get(GET_PRODUCTS);
    console.log(res);
    if (res?.data && res?.data?.data && res?.data?.data.length) {
      setPricingDetails(res?.data?.data);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

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
          {pricingDetails.map((pricingDetail, idx_) => (
            <Col key={idx_}>
              <Card className="pricing">
                <Card.Header>
                  <span className="fw-bold">
                    {pricingDetail.product_name}
                  </span>
                  {pricingDetail.product_name.toLowerCase() === props.plan_name?.toLowerCase() ? (
                    <span className="float-end text-muted">current</span>
                  ) : (
                    <></>
                  )}
                </Card.Header>
                <Card.Body>
                  <div className="p-3">
                    <span className="fw-bold fs-4">
                      ${pricingDetail.price}
                    </span>

                    <span className="text-muted">/month</span>
                  </div>
                  <ul className="plan-list">
                    <li>
                      <div>
                        <span className="fw-bold">
                          {pricingDetail.no_pages} pages
                        </span>
                        <span className="text-muted">/PDF</span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="fw-bold">
                          {pricingDetail.file_size} MB
                        </span>
                        <span className="text-muted">/PDF</span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="fw-bold">
                          {pricingDetail.files_per_day} PDFs
                        </span>
                        <span className="text-muted">/day</span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span className="fw-bold">
                          {pricingDetail.no_of_questions} questions
                        </span>
                        <span className="text-muted">/day</span>
                      </div>
                    </li>
                  </ul>
                </Card.Body>
                {pricingDetail.product_name.toLocaleLowerCase() !== "free" ? (
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
      />
    </Modal>
  );
}
