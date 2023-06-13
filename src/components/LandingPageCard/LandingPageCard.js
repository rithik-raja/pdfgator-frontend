import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPageCard.css'

const LandingPageCard = ({ heading, bulletPoints }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{heading}</h5>
        <ul className="card-text">
          {bulletPoints.map((bulletPoint, index) => (
            <li key={index}>{bulletPoint}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LandingPageCard;
