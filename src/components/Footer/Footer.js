import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import useLogin from "../../components/Login/Login";
import { MAIN_APP_URL } from "../../constants/apiConstants";

import AccountModal from "../../components/AccountModal/AccountModal";
import PricingModal from "../PricingModal/PricingModal";

const Footer = (props) => {
  const [accountModalShow, setaccountModalShow] = useState(false);
  const [pricingModalShow, setpricingModalShow] = useState(false);

  const login = useLogin();

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
        <Link className="footer-element" to={MAIN_APP_URL}>
          App
        </Link>
        <span className="footer-element">|</span>
        <span className="footer-element" onClick={accountLinkClickFunction}>
          My Account
        </span>
        <span className="footer-element">|</span>
        <span className="footer-element" onClick={pricingLinkClickFunction}>
          Pricing
        </span>
        <span className="footer-element">|</span>
        <Link className="footer-element" to="/privacy-policy" target="_blank">
          Privacy Policy
        </Link>
        {accountModalShow && (
          <AccountModal
            show={accountModalShow}
            onHide={() => setaccountModalShow(false)}
            email={props.email}
            stripeDetails={props.stripeDetails}
          />
        )}

        {pricingModalShow && (
          <PricingModal
            show={pricingModalShow}
            onHide={() => setpricingModalShow(false)}
            email={props.email}
            stripeDetails={props.stripeDetails}
          />
        )}
      </div>
    </>
  );
};
export default Footer;
