import React, { useState } from "react";
import getStripe from "../../lib/getStripe";
import AccountModal from "../../components/AccountModal/AccountModal";

import { Link } from "react-router-dom";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import useLogin from "../../components/Login/Login";
import "./Footer.css";

const Footer = (props) => {
  const [accountModalShow, setaccountModalShow] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const login = useLogin(setErrorToastMessage);
  const accountLinkClickFunction = () => {
    // setaccountModalShow(true);
    // return;
    if (props.email) {
      setaccountModalShow(true);
    } else {
      login();
    }
  };
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
    <>
      <div className="footer">
        <button className="footer-element" onClick={accountLinkClickFunction}>
          My Account
        </button>

        <button className="footer-element" onClick={handleCheckout}>
          Pricing
        </button>
        <Link className="footer-element" to="/privacy-policy" target="_blank">
          Privacy Policy
        </Link>
        <AccountModal
          show={accountModalShow}
          onHide={() => setaccountModalShow(false)}
          email={props.email}
        />
        <ErrorToast
          message={errorToastMessage}
          setMessage={setErrorToastMessage}
        />
      </div>
    </>
  );
};
export default Footer;
