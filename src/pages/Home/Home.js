import React from "react";
import { Link } from "react-router-dom";
import FileUpload from "../../components/FileUpload/FileUpload";
import LandingPageCard from "../../components/LandingPageCard/LandingPageCard";
import Footer from "../../components/Footer/Footer";
import Login from "../../components/Login/Login";

const Home = () => {
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
      <div className="container">
        <header className="container">
          <div className="row">
            <div className="col-6 d-flex flex-column align-items-start">
              <Link to="/" className="text-dark text-decoration-none">
                <span
                  className="display-4"
                  style={{ fontFamily: "Open Sans", fontWeight: 800 }}
                >
                  pdfgator
                </span>
              </Link>
              <span className="medium mt-2">
                AI-Powered Semantic Search for Documents
              </span>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <img src="/images/logo.svg" alt="Logo"></img>
            </div>
          </div>
        </header>
        <div className="row mb-4"></div>
        <FileUpload />

        <Login />

        <div className="row mt-4">
          <div className="col-lg-4">
            <LandingPageCard
              icon="zap"
              heading="Accelerate Your Research"
              text="Never spend hours flipping through 100-page documents again. With a simple search, Pdfgator finds evidence for you and automatically generates citations in the format of your choice."
            />
          </div>
          <div className="col-lg-4">
            <LandingPageCard
              icon="filter"
              heading="Filter Out the Fluff"
              text="Pdfgator detects multiple lines of information and ranks them by relevance, giving you the most succint yet complete answer possible to your question."
            />
          </div>
          <div className="col-lg-4">
            <LandingPageCard
              icon="activity"
              heading="Boost Your Productivity"
              text="Get the information you need, when you need it. Pdfgator is perfect for academic research, cramming for exams, answering open-book quizzes, or simply perusing documents in general."
            />
          </div>
        </div>
        <Footer />
        {/* <div className="chat-container mt-3">
          <Link to="/chat/pdf1" className="text-decoration-none">
            <span className="">Chat Screen</span>
          </Link>
        </div> */}
      </div>
    </>
  );
};

export default Home;

// {/* <div className="col-lg-6">
//   <LandingPageCard
//     heading="It's like Ctrl+F, but better"
//     bulletPoints={[
//       "Upload a PDF file",
//       "Ask it anything",
//       "Get the most relevant paragraph",
//     ]}
//   />
// </div>
// <div className="col-lg-6">
//   <LandingPageCard
//     heading="Features"
//     bulletPoints={[
//       "Sort through snippets by relevance",
//       "Narrow down search to the most relevant sentence",
//       "Generate instant citations",
//     ]}
//   />
// </div> */}
