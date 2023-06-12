import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Chat.css";

const Chat = () => {
  const [messageText, setmessageText] = useState(null);
  const [groupMessage, setgroupMessage] = useState([
    { isQues: false, msg: "Welcome to Chat GPT" },
  ]);

  const scrollToBottom = () => {
    const chat = document.getElementById("chatList");
    chat.scrollTop = chat.scrollHeight;
  };
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
                <span className="fs-4">New File</span>
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
        <h1 className="page-tittle pt-4 px-4">Chat GPT</h1>
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
          </div>
        </div>
      </main>
    </>
  );
};

export default Chat;
