import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPageCard.css'

const LandingPageCard = ({ heading, text, icon }) => {
  return (
    <div className="card">
      <img className="card-img-top" src={"/images/" + icon + ".svg"} alt="Card image cap" />
      <div className="card-body">
        <h4 className="card-title">{heading}</h4>
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
};

export default LandingPageCard;
