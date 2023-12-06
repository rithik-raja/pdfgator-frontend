import React from "react";

import "./LandingPageCard.css";

import { Image } from "react-bootstrap";

const LandingPageCard = ({ imgSrc, text1, text2 }) => {
  return (
    <div className="landing-page-card d-flex flex-column align-items-start" style={{borderRadius: "20px"}}>
      <Image src={`/images/${imgSrc}.png`} fluid style={{borderRadius: "20px", objectFit: "cover"}}/>
      <div className="py-1 px-2 mb-4 d-flex flex-column align-items-start">
        <h5 className="mt-2" style={{color: "#212f49", marginBottom: 0}}>{text1}</h5>
        <span className="landing-page-card-text" style={{color: "rgb(70, 70, 70)", textAlign: "left"}}><i>{text2}</i></span>
      </div>
    </div>
  );
};

export default LandingPageCard;
