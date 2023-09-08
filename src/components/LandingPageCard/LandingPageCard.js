import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./LandingPageCard.css";

import * as Icon from "react-feather";

const LandingPageCard = ({ heading, text, icon }) => {
  const CustomIcon = Icon[icon];
  return (
    <div className="card">
      <CustomIcon className="card-img-top" color="rgb(1, 103, 255)" />
      <div className="card-body">
        <h4 className="card-title">{heading}</h4>
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
};

export default LandingPageCard;
