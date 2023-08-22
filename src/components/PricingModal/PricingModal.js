import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./PricingModal.css";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getAuthToken, logOut } from "../../services/userServices";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import useLogin from "../../components/Login/Login";

import getStripe from "../../lib/getStripe";
import { get, post } from "../Api/api";
import { CHECKOUT, GET_PRODUCTS } from "../../constants/apiConstants";
export default function PricingModal(props) {
  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const [pricingDetails, setPricingDetails] = useState([]);
  const [currentProductId, setcurrentProductId] = useState(null);

  const login = useLogin(setErrorToastMessage, loginCallBack);

  function FooterButton({ is_active, details }) {
    function pricingButtonFunction() {
      let product_id = details.id;
      console.log(product_id);
      if (is_active === false) {
        if (props.email) {
          handleCheckout();
        } else {
          login(); /**Checkout implemented in login callback function */
        }
      } else {
        /*** TODO:: Cancel plan for already paid user */
      }
    }
    return (
      <>
        <Button
          className="float-end m-1"
          variant={is_active === true ? "light" : "primary"}
          size="sm"
          onClick={pricingButtonFunction}
        >
          {is_active === true ? "Cancel" : "Get Plus"}
        </Button>
      </>
    );
  }

  function loginCallBack(islogin) {
    console.log(islogin);
    if (islogin) {
      handleCheckout();
    }
  }

  async function handleCheckout() {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    /**TODO:: Pro id hardcoded */
    const response = await post(CHECKOUT + "4/", {}, config);
    console.log(response);
    if (response && response?.data && response.data?.checkout_url) {
      let checkout_url = response.data?.checkout_url;
      console.log(checkout_url);
      window.location.href = checkout_url;
    }
  }

  async function handleCheckout1() {
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: process.env.REACT_APP_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      successUrl: `http://localhost:3000/success`,
      cancelUrl: `http://localhost:3000`,
      customerEmail: "customer@email.com",
    });
    console.warn(error.message);
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
          {pricingDetails.map((pricingDetail) => (
            <>
              <Col>
                <Card className="pricing">
                  <Card.Header>
                    <span className="fw-bold">
                      {pricingDetail.product_name}
                    </span>
                    {pricingDetail.is_active === true ? (
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
                  {/* TODO:: Conditionally render this footer button need backend data */}
                  {pricingDetail.price > 0 ? (
                    <Card.Footer className="text-muted">
                      <FooterButton is_active={false} details={pricingDetail} />
                    </Card.Footer>
                  ) : (
                    <></>
                  )}
                </Card>
              </Col>
            </>
          ))}
        </Row>
        <Row>
          <div className="mt-3 text-center">
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
