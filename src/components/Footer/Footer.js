import React, { useState } from "react";
import getStripe from "../../lib/getStripe";
import AccountModal from "../../components/AccountModal/AccountModal";

import { Link } from "react-router-dom";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import useLogin from "../../components/Login/Login";
import "./Footer.css";
import PricingModal from "../PricingModal/PricingModal";
const newUserOrUnkonownUser = {
  isSubscriped: "False",
  isCanceled: "False",
};
const plusUser = {
  isSubscriped: "True",
  isCanceled: "False",
};
const cancelUser = {
  isSubscriped: "False",
  isCanceled: "True",
};
let subscription = plusUser;

const Footer = (props) => {
  const [accountModalShow, setaccountModalShow] = useState(false);
  const [pricingModalShow, setpricingModalShow] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const login = useLogin(setErrorToastMessage);

  const accountLinkClickFunction = () => {
    if (props.email) {
      setaccountModalShow(true);
    } else {
      login();
    }
  };

  const pricingLinkClickFunction = () => {
    setpricingModalShow(true);
  };

  return (
    <>
      <div className="footer">
        <button className="footer-element" onClick={accountLinkClickFunction}>
          My Account
        </button>

        <button className="footer-element" onClick={pricingLinkClickFunction}>
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

        <PricingModal
          show={pricingModalShow}
          onHide={() => setpricingModalShow(false)}
          email={props.email}
          isSubscriped={subscription.isSubscriped}
          isCanceled={subscription.isCanceled}
        />
      </div>
    </>
  );
};
export default Footer;
