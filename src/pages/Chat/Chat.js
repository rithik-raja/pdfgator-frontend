import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Chat.css";
import Dropzone from "react-dropzone";
import * as Icon from "react-feather";
import PdfView from "../../components/PdfView/PdfView";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import { useNavigate, useParams } from "react-router-dom";
import { GET_FILES, MAIN_APP_URL } from "../../constants/apiConstants";
import { get } from "../../components/Api/api";
import { uploadFileToApi } from "../../services/fileUploadService";
import { Container } from "react-bootstrap";

import useLogin from "../../components/Login/Login";
import { getAuthToken } from "../../services/userServices";
import { getSessionId } from "../../services/sessionService";
import AccountModal from "../../components/AccountModal/AccountModal";
import PricingModal from "../../components/PricingModal/PricingModal";
import {
  FREE_PLAN_MAX_FILE_SIZE,
  PAID_PLAN_MAX_FILE_SIZE,
} from "../../constants/storageConstants";

let currentActiveURL;

const Chat = (props) => {
  const navigate = useNavigate();
  const params = useParams();

  const [accountModalShow, setaccountModalShow] = useState(false);
  const [pricingModalShow, setPricingModalShow] = useState(false);
  const [uploadedUrl, setuploadedUrl] = useState("");
  const [errorToastMessage, setErrorToastMessage_] = useState(null);
  const [errorToastColor, setErrorToastColor] = useState("danger");
  const setErrorToastMessage = (msg, color = "danger") => {
    setErrorToastMessage_(msg);
    setErrorToastColor(color);
  };
  const [pdfLists, setpdfLists] = useState([]);
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [areas, setAreas] = useState({});
  const [searchMemory, setSearchMemory] = useState({});

  const login = useLogin(setErrorToastMessage);

  const preserveOldSearch = () => {
    if (Object.keys(areas).length) {
      setSearchMemory({
        ...searchMemory,
        [currentActiveURL]: {
          query: document.getElementById("search-bar-text-entry").value,
          areas: areas,
        },
      });
    }
  };

  const fileInputOnChange = async (acceptedFiles) => {
    const plan = props?.stripeDetails?.find((ele) => ele.is_plan_canceled === false);
    if (acceptedFiles.length > 0) {
      console.log(props?.stripeDetails)
      console.log(props?.stripeDetails?.is_plan_canceled)
      if (
        acceptedFiles[0].size >
        1024 *
          1024 *
          (plan?.is_plan_canceled === false
            ? PAID_PLAN_MAX_FILE_SIZE
            : FREE_PLAN_MAX_FILE_SIZE)
      ) {
        setErrorToastMessage(
          "The selected file is either too large or in an invalid format."
        );
        setPricingModalShow(true);
        return;
      }
      const newuploadedFile = acceptedFiles[0];
      setuploadedUrl(URL.createObjectURL(newuploadedFile));
      document.body.style.pointerEvents = "none";
      try {
        setIsProcessingDocument(true);
        const response = await uploadFileToApi(
          newuploadedFile,
          props,
          setErrorToastMessage
        );
        if (response && response.data && response.data.id) {
          console.log(response);
          const name = response.data.file_name.split("/").pop() ?? "undefined";
          const newurl = String(response.data.id);
          const newpdflist = [
            ...pdfLists,
            {
              ...response.data,
              name: name,
              str_url: newurl,
              isActive: "true",
            },
          ];
          preserveOldSearch();
          currentActiveURL = newurl;
          setAreas({});
          document.getElementById("search-bar-text-entry").value = "";
          setpdfLists(newpdflist);
          setActivepdfList(newurl, newpdflist);
          setIsProcessingDocument(false);
          document.body.style.pointerEvents = "auto";
          navigate(MAIN_APP_URL + "/" + newurl);
        } else {
          document.body.style.pointerEvents = "auto";
          setIsProcessingDocument(false);
          if (response === 0) {
            setErrorToastMessage("File upload limit exceeded");
            setPricingModalShow(true);
          }
          setuploadedUrl("");
          navigate(MAIN_APP_URL);
        }
      } catch (e) {
        console.error(e);
        document.body.style.pointerEvents = "auto";
      }
    }
  };

  const { pdfid } = params;
  currentActiveURL = pdfid;

  const getPdfLists = useCallback(async () => {
    console.log("TEST");
    console.log(getAuthToken());
    const sessionid = getSessionId();
    let response1;
    if (props.email) {
      response1 = await get(GET_FILES, setErrorToastMessage);
    } else {
      response1 = await get(GET_FILES + sessionid + "/", setErrorToastMessage);
    }
    if (response1 === null) {
      return;
    }
    response1 = response1.data;
    console.log(response1.search_history);

    if (response1 && response1.data && response1.data.length) {
      let newlist = response1.data;
      newlist = newlist.map((d, i) => ({
        ...d,
        name: d.file_name ?? "undefined",
        str_url: String(d.id),
        searchHistory:
          response1.search_history && response1.search_history[d.id]
            ? response1.search_history[d.id]
            : [],
      }));

      const index = newlist.findIndex((object) => {
        return object.str_url === pdfid;
      });
      if (index > -1) {
        newlist[index].isActive = "true";
        setuploadedUrl(newlist[index].file_path);
      }
      setpdfLists(newlist);
    } else {
      setpdfLists([]);
    }
  }, [pdfid, props.email]);

  const setActivepdfList = (urlName, allpdflists) => {
    const currentUrl = urlName ?? pdfid;
    if (currentUrl.length) {
      const index = allpdflists.findIndex((object) => {
        return object.str_url === currentUrl;
      });
      if (index > -1) {
        let pdflists = allpdflists.map((e) => ({ ...e, isActive: "false" }));
        pdflists[index].isActive = "true";
        setpdfLists(pdflists);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("userUpdate", getPdfLists);
    return () => {
      document.removeEventListener("userUpdate", getPdfLists);
    };
  }, [getPdfLists]);

  useEffect(() => {
    getPdfLists();
    setAreas(searchMemory[currentActiveURL]?.areas ?? {});
    document.getElementById("search-bar-text-entry").value =
      searchMemory[currentActiveURL]?.query ?? "";
  }, [currentActiveURL, getPdfLists, searchMemory]);

  const handlePdfLinkClick = (index) => {
    if (currentActiveURL === pdfLists[index].id) {
      return;
    }
    preserveOldSearch();
    currentActiveURL = pdfLists[index].id;
    let pdflists = pdfLists.map((e) => ({ ...e, isActive: "false" }));
    pdflists[index].isActive = "true";
    setAreas(searchMemory[currentActiveURL]?.areas ?? {});
    document.getElementById("search-bar-text-entry").value =
      searchMemory[currentActiveURL]?.query ?? "";
    setpdfLists(pdflists);
    setuploadedUrl(pdflists[index].file_path);
  };
  const accountLinkClickFunction = () => {
    if (props.email) {
      setaccountModalShow(true);
    } else {
      login();
      navigate(MAIN_APP_URL);
    }
  };

  return (
    <>
      <header>
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar bg-dark">
          <div className="upload-section text-white my-3 mx-2">
            <Dropzone
              accept={{
                "application/pdf": [".pdf"],
              }}
              onDrop={(acceptedFiles, fileRejections) => {
                if (fileRejections?.length) {
                  setErrorToastMessage("File type must be 'pdf' ");
                }
                fileInputOnChange(acceptedFiles);
              }}
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
          <ul className="nav nav-pills flex-column mb-auto align-items-center">
            {pdfLists.map((list, index) => (
              <li className="nav-item" key={index}>
                <Link
                  className={
                    "nav-link " +
                    (list.isActive === "true" ? "active" : "text-white")
                  }
                  onClick={(event) => handlePdfLinkClick(index)}
                  aria-current="true"
                  to={MAIN_APP_URL + "/" + list.str_url}
                >
                  <Icon.FileText />
                  {list.name}
                </Link>
              </li>
            ))}
            <div style={{ height: props.email ? "0px" : "50px" }}></div>
            <li className="nav-item footer-nav">
              <>
                {props.email ? (
                  <></>
                ) : (
                  <div
                    className="alert alert-light nav-signin-prompt"
                    role="alert"
                  >
                    <span
                      className="alert-link"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        login();
                        navigate(MAIN_APP_URL);
                      }}
                    >
                      Sign in
                    </span>{" "}
                    to save your files
                  </div>
                )}
                <div className="sidebar-footer">
                  <Link to="/">Home</Link>
                  <Link onClick={accountLinkClickFunction}>Account</Link>
                </div>
              </>
            </li>
          </ul>
          <hr />
        </nav>
        <nav
          id="main-navbar"
          className="navbar navbar-expand-lg navbar-light fixed-top p-0"
        >
          <Container
            fluid
            className="d-flex d-lg-none navbar-toggler-container py-2 iscollapsed"
            id="navbar-mobile"
          >
            <button
              className="navbar-toggler bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => {
                document
                  .getElementById("navbar-mobile")
                  .classList.toggle("iscollapsed");
              }}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </Container>
        </nav>
      </header>

      <main>
        <PdfView
          fileUrl={uploadedUrl}
          areas={areas}
          pdfLists={pdfLists}
          setpdfLists={setpdfLists}
          currentActiveURL={currentActiveURL}
          setAreas={setAreas}
          isProcessingDocument={isProcessingDocument}
          setErrorToastMessage={setErrorToastMessage}
          setPricingModalShow={setPricingModalShow}
        />
      </main>
      <AccountModal
        show={accountModalShow}
        onHide={() => setaccountModalShow(false)}
        email={props.email}
        stripeDetails={props.stripeDetails}
      />
      <PricingModal
        show={pricingModalShow}
        onHide={() => setPricingModalShow(false)}
        email={props.email}
        stripeDetails={props.stripeDetails}
      />
      <ErrorToast
        message={errorToastMessage}
        setMessage={setErrorToastMessage}
        color={errorToastColor}
      />
    </>
  );
};

export default Chat;
