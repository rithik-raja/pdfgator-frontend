import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Chat.css";
import Dropzone, { useDropzone } from "react-dropzone";
import * as Icon from "react-feather";
import PdfView from "../../components/PdfView/PdfView";
import { useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { GET_FILES, SET_FILES } from "../../constants/apiConstants";
import { get, post } from "../../components/Api/api";
import { uploadFileToApi } from "../../services/fileUploadService";
import { getSessionId } from "../../services/sessionService";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const [uploadedUrl, setuploadedUrl] = useState("");
  const [uploadedFile, setuploadedFile] = useState(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
  });
  const [pdfLists, setpdfLists] = useState([]);
  const [areas, setareas] = useState([
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
  ]);
  const fileInputOnChange = async (acceptedFiles) => {
    // const acceptedFiles = e.target.files;
    if (acceptedFiles.length > 0) {
      const newuploadedFile = acceptedFiles[0];
      setuploadedUrl(URL.createObjectURL(newuploadedFile));
      setuploadedFile(newuploadedFile);
      const response = await uploadFileToApi(newuploadedFile);
      if (response && response.data && response.data.id) {
        console.log(response);
        const name = response.data.file_path.split("/").pop() ?? "undefined";
        const newurl = String(response.data.id);
        const newpdflist = [
          ...pdfLists,
          {
            ...response.data,
            name: name,
            url: newurl,
            isActive: "true",
          },
        ];
        setpdfLists(newpdflist);
        setActivepdfList(newurl, newpdflist);
        navigate("/chat/" + String(response.data.id));
      }
    }
  };


  const { pdfid } = params;

  const getPdfLists = async () => {
    const response1 = await get(GET_FILES);
    console.log(response1.data);

    if (response1 && response1.data && response1.data.length) {
      const session_id = getSessionId();
      const response = response1.data.filter((obj) => {
        return obj.session_id === session_id;
      });
      let newlist = response;
      newlist = newlist.map((d, i) => ({
        ...d,
        name: d.file_path.split("/").pop() ?? "undefined",
        url: String(d.id),
      }));

      console.log(newlist);
      const index = newlist.findIndex((object) => {
        return object.url === pdfid;
      });
      if (index > -1) {
        newlist[index].isActive = "true";
        setuploadedUrl(newlist[index].file_path);
      }
      // else {
      //   newlist = [
      //     ...newlist,
      //     { name: pdfid, url: pdfid, isActive: "true" },
      //   ];
      // }
      setpdfLists(newlist);
    }
  };
  const setActivepdfList = (urlName, allpdflists) => {
    const currentUrl = urlName ?? pdfid;
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
    if (!pdfLists.length) getPdfLists();
  }, []);

  const handlePdfLinkClick = (index) => {
    let pdflists = pdfLists.map((e) => ({ ...e, isActive: "false" }));
    pdflists[index].isActive = "true";
    setpdfLists(pdflists);
    setuploadedUrl(pdflists[index].file_path);
  };

  const scrollToBottom = () => {
    const chat = document.getElementById("chatList");
    chat.scrollTop = chat.scrollHeight;
  };

  return (
    <>
      <header>
        <nav
          id="sidebarMenu"
          className="collapse d-lg-block sidebar collapse bg-dark"
        >
          <div className="position-sticky">
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
            <ul className="nav nav-pills flex-column mb-auto">
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
                    <Icon.FileText />
                    {list.name}
                  </Link>
                </li>
              ))}
              <div style={{ height: "50px" }}></div>
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
        <PdfView fileUrl={uploadedUrl} areas={areas} />
      </main>
    </>
  );
};

export default Chat;
