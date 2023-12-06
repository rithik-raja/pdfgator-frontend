import React from "react";
import { Link } from "react-router-dom";
import FileUpload from "../../components/FileUpload/FileUpload";
import LandingPageCard from "../../components/LandingPageCard/LandingPageCard";
import Footer from "../../components/Footer/Footer";
import { Image } from "react-bootstrap";
import "./Home.css";

// background: #83a4d4;  /* fallback for old browsers */
// background: -webkit-linear-gradient(to right, #b6fbff, #83a4d4);  /* Chrome 10-25, Safari 5.1-6 */
// background: linear-gradient(to right, rgba(182, 251, 255, 0.8), rgba(131, 164, 212, 0.8)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

// background-image: linear-gradient(to left bottom, #96befa, #b9ccfb, #d6dcfc, #ededfd, #ffffff);

const Home = (props) => {
  return (
    <>
      <style>
        {`
          body {
            min-height: 100vh;
            background-image: linear-gradient(to left bottom, #96befa, #b9ccfb, #d6dcfc, #ededfd, #ffffff);
            padding-top: 2rem;
          }
        `}
      </style>
      <div className="home-container">
        <header className="d-flex align-items-center">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            className="pdfgator-logo d-none d-md-block"
          />
          <div className="d-flex flex-column justify-content-center">
            <Link to="/" className="text-dark text-decoration-none">
              <span
                className="display-4"
                style={{ fontFamily: "Open Sans", fontWeight: 800, color: "#212f49" }}
              >
                pdfgator
              </span>
            </Link>
            {/* <span className="small mt-2" style={{color: "#212f49"}}>
              AI-powered Search for Documents
            </span> */}
          </div>
          <Link to="/app" style={{marginLeft: "auto"}}>
            <button className="landing-page-button">
              Go to App
            </button>
          </Link>
        </header>
        <br />
        <h4 className="d-none d-md-block mb-4" style={{color: "#212f49"}}>Chat with Your PDFs. Never Ctrl+F Again.</h4>
        <h6 className="d-block d-md-none mb-4" style={{color: "#212f49"}}>Chat with Your PDFs. Never Ctrl+F Again.</h6>
        <FileUpload {...props}/>
        <br />
        <br />
        <div className="d-flex flex-wrap align-items-start justify-content-around">
          <LandingPageCard
            imgSrc="landing_page_1"
            text1="Ask Questions, Get Answers"
            text2="Ask Pdfgator to explain, describe, or list anything in your document."
          />
          <LandingPageCard
            imgSrc="landing_page_2"
            text1="Highlighted Sources"
            text2="Click on the cited page numbers to jump to the exact line referenced in the answer."
          />
          <LandingPageCard
            imgSrc="landing_page_3"
            text1="Zero-Input Citations and References"
            text2="Pdfgator automatically detects cites in the format of your choice."
          />
          <LandingPageCard
            imgSrc="landing_page_4"
            text1="Effortless UI"
            text2="Easily manage your PDFs and chats. Your files are securely stored on our servers."
          />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
