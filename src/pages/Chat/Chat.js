import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Chat.css";
import uploadIcon from "../../images/upload.svg";
import Dropzone, { useDropzone } from "react-dropzone";
import * as Icon from "react-feather";
import Pdf1 from "../../components/Pdf1/Pdf1";
import Pdf2 from "../../components/Pdf2";

const Chat = () => {
  const [messageText, setmessageText] = useState(null);
  const [groupMessage, setgroupMessage] = useState([
    { isQues: false, msg: "Welcome to Chat GPT" },
  ]);
  const [uploadedUrl, setuploadedUrl] = useState("");
  const [uploadedFile, setuploadedFile] = useState(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
  });
  const fileInputOnChange = (acceptedFiles) => {
    // const acceptedFiles = e.target.files;
    if (acceptedFiles.length > 0) {
      setuploadedUrl(URL.createObjectURL(acceptedFiles[0]));
      setuploadedFile(acceptedFiles[0]);
    }
  };

  const scrollToBottom = () => {
    const chat = document.getElementById("chatList");
    chat.scrollTop = chat.scrollHeight;
  };
  const areas = [
    {
      pageIndex: 3,
      height: 1.55401,
      width: 28.1674,
      left: 27.5399,
      top: 15.0772,
    },
    {
      pageIndex: 6,
      height: 1.32637,
      width: 37.477,
      left: 55.7062,
      top: 15.2715,
    },
    {
      pageIndex: 9,
      height: 1.55401,
      width: 28.7437,
      left: 16.3638,
      top: 16.6616,
    },
  ];
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!messageText) return;
    // this.sendMessage();
    console.log("submit");
    console.log(messageText);
    setgroupMessage([...groupMessage, { isQues: true, msg: messageText }]);
    event.target.reset();
    setmessageText("");
    scrollToBottom();
  };
  const handleChange = (event) => {
    setmessageText(event.target.value);
  };

  return (
    <>
      <header>
        <nav
          id="sidebarMenu"
          className="collapse d-lg-block sidebar collapse bg-dark"
        >
          <div className="position-sticky">
            <ul className="nav nav-pills flex-column mb-auto">
              <div className="upload-section text-white">
                <Dropzone
                  onDrop={(acceptedFiles) => fileInputOnChange(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <span className="fs-5">New File</span>
                        <input {...getInputProps()} />
                        <p className="d-none d-sm-block small">Drop PDF </p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="true"
                  to="/chat"
                >
                  pdf1
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white"
                  aria-current="true"
                  to="/chat"
                >
                  pdf2
                </Link>
              </li>
              <li className="nav-item ">
                <div className="alert alert-light footer-nav" role="alert">
                  <Link className="alert-link" to="/">
                    Signin
                  </Link>{" "}
                  to save chat history
                </div>
              </li>
            </ul>
            <hr />
          </div>
        </nav>
        <nav
          id="main-navbar"
          className="navbar navbar-expand-lg navbar-light bg-white fixed-top p-0"
        >
          <div className="container-fluid">
            <button
              className="navbar-toggler navbar-icon"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </nav>
      </header>

      <main>
        <div className="pdf-viewer-container">
          <div className="row">
            <div className="col-md-10">
              {uploadedUrl ? (
                <div className="all-page-container">
                  {/* <Pdf1 fileUrl={uploadedUrl} /> */}
                  <Pdf2 fileUrl={uploadedUrl} areas={areas} />
                  {/* <PdfViewer url={uploadedFile} /> */}
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="col-md-2 right-sidebar">
              <div>
                <ul className="right-sidebar-list">
                  <li class="right-sidebar-list-item active">
                    <Icon.ArrowUpCircle />
                    <span>Next result</span>
                  </li>
                  <li class="right-sidebar-list-item">
                    <Icon.ArrowDownCircle />
                    <span> Prev result</span>
                  </li>
                  <li class="right-sidebar-list-item">
                    <Icon.ZoomIn />
                    <span> Narrow search</span>
                  </li>
                  <li class="right-sidebar-list-item">
                    <Icon.Book />
                    <span>Generate citation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <h1 className="page-tittle pt-4 px-4">Chat GPT</h1>
        <div className="chatInputWrapper">
          <form onSubmit={handleSubmit}>
            <div className="input-group chat-input">
              <input
                type="text"
                className="form-control textarea input"
                placeholder="Enter your question..."
                onChange={handleChange}
              />

              <button className="btn btn-primary" type="submit">
                Send
              </button>
            </div>
          </form>
        </div>
        <div className="container-fluid pt-4 chatWindowContainer">
          <div className="chatWindow">
            <ul className="chat" id="chatList">
              {groupMessage.map((data) => (
                <div key={data.id}>
                  {data.isQues ? (
                    <li className="self">
                      <div className="msg">
                        <p>{data.isQues}</p>
                        <div className="message"> {data.msg}</div>
                      </div>
                    </li>
                  ) : (
                    <li className="other">
                      <div className="msg">
                        <p>{data.isQues}</p>
                        <div className="message"> {data.msg} </div>
                      </div>
                    </li>
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default Chat;
