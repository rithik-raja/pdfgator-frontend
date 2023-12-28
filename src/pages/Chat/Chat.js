import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Chat.css";
import Dropzone from "react-dropzone";
import * as Icon from "react-feather";
import PdfView from "../../components/PdfView/PdfView";
import { displayToast } from "../../components/CustomToast/CustomToast";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_FILES,
  MAIN_APP_URL,
} from "../../constants/apiConstants";
import { get } from "../../components/Api/api";
import { uploadFileToApi } from "../../services/fileUploadService";
import { Container } from "react-bootstrap";

import useLogin from "../../components/Login/Login";
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
  const [rightSidebarShowEvidence, setRightSidebarShowEvidence] = useState(false);
  const [uploadedUrl, setuploadedUrl] = useState("");
  const [pdfLists, setpdfLists] = useState([]);
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [areas, setAreas] = useState({});
  //const [searchMemory, setSearchMemory] = useState({});

  const login = useLogin();

  // const preserveOldSearch = () => {
  //   if (Object.keys(areas).length) {
  //     setSearchMemory({
  //       ...searchMemory,
  //       [currentActiveURL]: {
  //         query: document.getElementById("search-bar-text-entry").value,
  //         areas: areas,
  //       },
  //     });
  //   }
  // };

  const fileInputOnChange = async (acceptedFiles) => {
    const plan = props?.stripeDetails?.find(
      (ele) => ele.is_plan_canceled === false
    );
    if (acceptedFiles.length > 0) {
      if (
        acceptedFiles[0].size >
        1024 *
          1024 *
          (plan?.is_plan_canceled === false
            ? PAID_PLAN_MAX_FILE_SIZE
            : FREE_PLAN_MAX_FILE_SIZE)
      ) {
        displayToast("The selected file is either too large or in an invalid format.", "danger");
        setPricingModalShow(true);
        return;
      }
      const newuploadedFile = acceptedFiles[0];
      // setuploadedUrl(URL.createObjectURL(newuploadedFile)); // TODO
      document.body.style.pointerEvents = "none";
      try {
        setIsProcessingDocument(true);
        const { error, response } = await uploadFileToApi(
          newuploadedFile,
          props,
          false
        );
        if (!error && response.data.id) {
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
          //preserveOldSearch();
          currentActiveURL = newurl;
          setAreas({});
          document.getElementById("search-bar-text-entry").value = "";
          setpdfLists(newpdflist);
          setRightSidebarShowEvidence(false);
          setActivepdfList(newurl, newpdflist);
          setIsProcessingDocument(false);
          document.body.style.pointerEvents = "auto";
          navigate(MAIN_APP_URL + "/" + newurl);
        } else {
          document.body.style.pointerEvents = "auto";
          setIsProcessingDocument(false);
          if (response.status === 429 || response.status === 413) {
            displayToast(response.status === 429 ? "Usage limit exceeded" : response.data.detail, "danger");
            setPricingModalShow(true);
          } else {
            displayToast("Failed to upload file", "danger");
            console.error(response.data.detail);
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
    const sessionid = getSessionId();
    let error, response;
    if (props.email) {
      ({ error, response } = await get(GET_FILES, false));
    } else {
      ({ error, response } = await get(GET_FILES + sessionid + "/"));
    }
    if (error) {
      return;
    }

    if (response.data.pdfData?.length) {
      let newlist = response.data.pdfData;
      newlist = newlist.map((d, i) => ({
        ...d,
        name: d.file_name ?? "undefined",
        str_url: String(d.id),
        searchHistory:
          response.data.search_history && response.data.search_history[d.id]
            ? response.data.search_history[d.id]
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
    getPdfLists();
    document.addEventListener("userUpdate", getPdfLists);
    return () => {
      document.removeEventListener("userUpdate", getPdfLists);
    };
  }, [getPdfLists]);

  // useEffect(() => {
  //   setAreas(searchMemory[currentActiveURL]?.areas ?? {});
  //   document.getElementById("search-bar-text-entry").value =
  //     searchMemory[currentActiveURL]?.query ?? "";
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentActiveURL]);

  const handlePdfLinkClick = (index) => {
    if (currentActiveURL === pdfLists[index].id) {
      return;
    }
    //preserveOldSearch();
    currentActiveURL = pdfLists[index].id;
    let pdflists = pdfLists.map((e) => ({ ...e, isActive: "false" }));
    pdflists[index].isActive = "true";
    //setAreas(searchMemory[currentActiveURL]?.areas ?? {});
    setAreas({});
    // document.getElementById("search-bar-text-entry").value =
    //   searchMemory[currentActiveURL]?.query ?? "";
    setpdfLists(pdflists);
    setRightSidebarShowEvidence(false);
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
                  displayToast("File type must be 'pdf'", "danger");
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
            <div style={{ height: props.email ? "30px" : "65px" }}></div>
            <li className="nav-item footer-nav alert alert-light" style={{padding: "10px"}}>
              <>
                {props.email ? (
                  <></>
                ) : (
                  <div
                    className="nav-signin-prompt"
                    role="alert"
                  >
                    <b>
                      <u
                        className="nav-signin-prompt-link"
                        onClick={() => {
                          login();
                          navigate(MAIN_APP_URL);
                        }}
                      >
                        Sign in
                      </u>{" "}
                      to save your files
                    </b>
                  </div>
                )}
                <div className="sidebar-footer d-flex align-items-center justify-content-center">
                  <Link className="mx-3" to="/">Home</Link>
                  <Link className="mx-3" onClick={accountLinkClickFunction}>Account</Link>
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

      <main className="main-pdfview">
        <PdfView
          fileUrl={uploadedUrl}
          areas={areas}
          pdfLists={pdfLists}
          setpdfLists={setpdfLists}
          currentActiveURL={currentActiveURL}
          setAreas={setAreas}
          isProcessingDocument={isProcessingDocument}
          setPricingModalShow={setPricingModalShow}
          rightSidebarShowEvidence={rightSidebarShowEvidence}
          setRightSidebarShowEvidence={setRightSidebarShowEvidence}
        />
      </main>
      {accountModalShow && (
        <AccountModal
          show={accountModalShow}
          onHide={() => setaccountModalShow(false)}
          email={props.email}
          stripeDetails={props.stripeDetails}
        />
      )}
      {pricingModalShow && (
        <PricingModal
          show={pricingModalShow}
          onHide={() => setPricingModalShow(false)}
          email={props.email}
          stripeDetails={props.stripeDetails}
        />
      )}
    </>
  );
};

export default Chat;
