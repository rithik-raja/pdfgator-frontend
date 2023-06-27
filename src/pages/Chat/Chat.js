import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Chat.css";
import Dropzone, { useDropzone } from "react-dropzone";
import * as Icon from "react-feather";
import Pdf2 from "../../components/Pdf2";
import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import Pdf1 from "../../components/Pdf1/Pdf1";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
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
  const [pdfLists, setpdfLists] = useState([]);
  const fileInputOnChange = (acceptedFiles) => {
    // const acceptedFiles = e.target.files;
    if (acceptedFiles.length > 0) {
      const newuploadedFile = acceptedFiles[0];
      setuploadedUrl(URL.createObjectURL(newuploadedFile));
      setuploadedFile(newuploadedFile);
      const name = newuploadedFile.name;
      const lastDot = name.lastIndexOf(".");

      const newurl = name.substring(0, lastDot);
      const newpdflist = [
        ...pdfLists,
        {
          name: newurl,
          url: newurl,
          isActive: "true",
        },
      ];
      setpdfLists(newpdflist);
      navigate("/chat/" + newurl);
      setActivepdfList(newurl, newpdflist);
    }
  };

  const { pdfname } = params;

  const getPdfLists = () => {
    let newlist = [
      { name: "pdf1", url: "pdf1" },
      { name: "pdf2", url: "pdf2" },
      { name: "pdf3", url: "pdf3" },
    ];
    const index = newlist.findIndex((object) => {
      return object.url === pdfname;
    });
    if (index > -1) {
      newlist[index].isActive = "true";
    } else {
      newlist = [...newlist, { name: pdfname, url: pdfname, isActive: "true" }];
    }
    setpdfLists(newlist);
  };
  const setActivepdfList = (urlName, allpdflists) => {
    const currentUrl = urlName ?? pdfname;
    if (currentUrl.length) {
      const index = allpdflists.findIndex((object) => {
        return object.url === currentUrl;
      });
      if (index > -1) {
        let pdflists = allpdflists.map((e) => ({ ...e, isActive: "false" }));
        pdflists[index].isActive = "true";
        setpdfLists(pdflists);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      getPdfLists();
    }, 100);
  }, []);

  const handlePdfLinkClick = (index) => {
    let pdflists = pdfLists.map((e) => ({ ...e, isActive: "false" }));
    pdflists[index].isActive = "true";
    setpdfLists(pdflists);
    setuploadedUrl(null);
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

              {pdfLists.map((list, index) => (
                <li className="nav-item" key={index}>
                  <Link
                    className={
                      "nav-link " +
                      (list.isActive === "true" ? "active" : "text-white")
                    }
                    onClick={(event) => handlePdfLinkClick(index)}
                    aria-current="true"
                    to={"/chat/" + list.url}
                  >
                    {list.name}
                  </Link>
                </li>
              ))}

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
        <Pdf2 fileUrl={uploadedUrl} areas={areas} />

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
