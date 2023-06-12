import React from "react";

import { Link } from "react-router-dom";
import "./Home.css";
const Home = () => {
  return (
    <>
      <div className="container">
        <header className="m-5">
          <Link to="/" className="text-dark text-decoration-none">
            <span className="title">Chat GPT</span>
          </Link>
        </header>
        <div className="chat-container">
          <Link to="/chat" className="text-decoration-none">
            <span className="">Chat Screen</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
