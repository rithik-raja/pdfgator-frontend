import React from "react";

import { Link } from "react-router-dom";
import "./Home.css";

import FileUpload from "../../components/FileUpload/FileUpload";
import LandingPageCard from "../../components/LandingPageCard/LandingPageCard";

const Home = () => {
  return (
    <>
      <div className="container">
        <header className="row mt-5">
          <Link to="/" className="text-dark text-decoration-none">
            <span className="title">Temp Name</span>
          </Link>
        </header>
        <div className="row mb-5">
          <span className="small">Find Relevant Content & Generate Automatic Citations from Any Document</span>
        </div>
        <FileUpload />
        <div className="row mt-5">
          <div className="col-lg-6">
            <LandingPageCard heading="It's like Ctrl+F, but better" bulletPoints={['Upload a PDF file', 'Ask it anything', 'Get the most relevant paragraph']} />
          </div>
          <div className="col-lg-6">
            <LandingPageCard heading="Features" bulletPoints={['Sort through snippets by relevance', 'Narrow down search to the most relevant sentence', 'Generate instant citations']} />
          </div>
        </div>
        <div className="chat-container mt-3">
          <Link to="/chat" className="text-decoration-none">
            <span className="">Chat Screen</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
