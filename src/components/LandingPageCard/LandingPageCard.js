import React from "react";

import { Image } from "react-bootstrap";
import "./LandingPageCard.css"

const LandingPageCard = ({ imgSrc, text1, text2 }) => {
  return (
    <div className="landing-page-card d-flex flex-column align-items-start mb-4">
      <div className="landing-page-card-image-container">
        <Image src={`/images/${imgSrc}.webp`} fluid className="landing-page-card-image" alt={text1}/>
      </div>
      {/* <Image width="400px" height="800px" src={`/images/large_test.jpg`} fluid className="landing-page-card-image" alt={text1}/> */}
      <div className="py-1 px-4 mb-2 d-flex flex-column align-items-start">
        <h5 className="mt-2 landing-page-card-heading">{text1}</h5>
        <span className="landing-page-card-text"><i>{text2}</i></span>
      </div>
    </div>
  );
};

export default LandingPageCard;
