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
export default function PricingModal(props) {
  let pricingDetails = [
    {
      plan_name: "Free",
      currency_code: "$",
      price: "0",
      no_pages: "120",
      file_size: "10",
      files_per_day: "3",
      no_of_questions: "50",
      is_active: "true",
      is_delete: "false",
    },
    {
      plan_name: "Plus",
      currency_code: "$",
      price: "5",
      no_pages: "2000",
      file_size: "32",
      files_per_day: "50",
      no_of_questions: "1000",
      is_active: "false",
      is_delete: "true",
    },
  ];

  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const login = useLogin(setErrorToastMessage);

  function FooterButton({ is_active }) {
    return (
      <>
        <Button
          className="float-end m-1"
          variant={is_active === "true" ? "light" : "primary"}
          size="sm"
          onClick={props.email ? handleCheckout : getPlusFunction}
        >
          {is_active === "true" ? "Cancel" : "Get Plus"}
        </Button>
      </>
    );
  }
  function getPlusFunction() {
    login();
  }
  async function handleCheckout() {
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
                    <span className="fw-bold">{pricingDetail.plan_name}</span>
                    {pricingDetail.is_active === "true" ? (
                      <span className="float-end text-muted">current</span>
                    ) : (
                      <></>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <div className="p-3">
                      <span className="fw-bold fs-4">
                        {pricingDetail.currency_code}
                        {pricingDetail.price}
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
                  {pricingDetail.is_delete === "true" ? (
                    <Card.Footer className="text-muted">
                      <FooterButton is_active={pricingDetail.is_active} />
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
