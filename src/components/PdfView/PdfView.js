import { useState, useEffect } from "react";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import jumpToPagePlugin from "../../utils/jumpToPagePlugin";
import {
  ListGroup,
  Container,
  Col,
  Row,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import * as Icon from "react-feather";
import CitationModal from "../CitationModal/CitationModal";
import { useNavigate } from "react-router-dom";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

import { DELETE_FILES, SEARCH_QUERY } from "../../constants/apiConstants";
import { get, post } from "../Api/api";
import CustomSpinner from "../Spinner/spinner";
import { getSessionId } from "../../services/sessionService";
import DocumentInfoModal from "../DocumentInfoModal/DocumentInfoModal";

let jumpToPageFlag = 0;

const PdfView = ({
  areas,
  fileUrl,
  pdfLists,
  currentActiveURL,
  setAreas,
  isProcessingDocument,
  setErrorToastMessage,
  handlePdfLinkClick,
}) => {
  const navigate = useNavigate();
  let totalPages;
  const [currentIndex, setcurrentIndex] = useState(-1);
  const [citationModalShow, setCitationModalShow] = useState(false);
  const [infoModalShow, setInfoModalShow] = useState(false);
  const [isQueryLoading, setIsQueryLoading] = useState(false);

  useEffect(() => {
    if (areas?.bboxes?.length && jumpToPageFlag) {
      jumpResult(0);
      jumpToPageFlag = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas]);

  const renderHighlights = (props) => (
    <div
      className="rpv-core__viewer"
      style={{
        border: "1px solid rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <div>
          {areas.bboxes
            ?.filter((area) => area.pageIndex === props.pageIndex)
            .map((area, idx) => (
              <div
                key={idx}
                className="highlight-area"
                style={Object.assign(
                  {},
                  {
                    background: "yellow",
                    opacity: 0.4,
                  },
                  props.getCssProperties(area, props.rotation)
                )}
              />
            ))}
        </div>
      </div>
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlights,
    trigger: Trigger.None,
  });
  const { jumpToHighlightArea } = highlightPluginInstance;

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { CurrentPageLabel } = pageNavigationPluginInstance;

  const jumpToPagePluginInstance = jumpToPagePlugin();
  const { jumpToPage } = jumpToPagePluginInstance;

  const moveResult = (isNext) => {
    if (areas?.indices?.length > 0) {
      let currentVal = isNext ? currentIndex + 1 : currentIndex - 1;
      if (currentVal >= 0 && currentVal < areas.indices.length) {
        jumpToHighlightArea(areas.bboxes[areas.indices[currentVal]]);
        setcurrentIndex(currentVal);
      }
    }
  };

  const jumpResult = (ind) => {
    console.log(areas);
    if (ind >= 0 && ind < areas.indices.length) {
      jumpToHighlightArea(areas.bboxes[areas.indices[ind]]);
      setcurrentIndex(ind);
    }
  };

  const handleJumpPage = (event) => {
    if (event.key === "Enter") {
      let page = document.getElementById("page-number-input").value;
      page = parseInt(page);
      if (Number.isInteger(page) && page <= totalPages && page > 0) {
        console.log(page);
        jumpToPage(page - 1);
      }
    }
  };

  const handleSearchQuery = async (event) => {
    event.preventDefault();
    const query = document.getElementById("search-bar-text-entry").value;
    let res;
    console.log(query);
    console.log(currentActiveURL);
    document.body.style.pointerEvents = "none";
    try {
      const searchInputElement = document.getElementById(
        "search-bar-text-entry"
      );
      const searchSubmitElement = document.getElementById(
        "search-bar-submit-button"
      );
      if (query?.trim() && currentActiveURL) {
        setIsQueryLoading(true);
        setAreas({});
        searchInputElement.disabled = true;
        searchSubmitElement.disabled = true;
        res = await get(
          SEARCH_QUERY +
            currentActiveURL +
            "/" +
            encodeURIComponent(query).replace("%2F", "<|escapeslash|>") +
            "/" +
            getSessionId() +
            "/"
        );
      }
      const data = res?.data?.data;
      if (data) {
        console.log(data);
        if (data.exception) {
          setErrorToastMessage(
            "An internal server error occured. Please contact us if this problem persists."
          );
        } else {
          jumpToPageFlag = 1;
          setAreas(data);
        }
      }
      searchInputElement.disabled = false;
      searchSubmitElement.disabled = false;
      document.body.style.pointerEvents = "auto";
      setIsQueryLoading(false);
    } catch (e) {
      console.error(e);
      document.body.style.pointerEvents = "auto";
    }
  };

  const SearchBarButton = ({ text, IconComponent, onClickFunc }) => {
    const renderPopover = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        {text}
      </Tooltip>
    );
    return (
      <OverlayTrigger overlay={renderPopover}>
        <Button variant="light" onClick={onClickFunc}>
          <IconComponent color="black" />
        </Button>
      </OverlayTrigger>
    );
  };

  const deleteCurrentFile = async () => {
    if (fileUrl) {
      const res = await post(DELETE_FILES, { target: currentActiveURL });
      if (res) {
        if (pdfLists && pdfLists?.length !== 1) {
          const idx = pdfLists.findIndex((obj) => obj.id == currentActiveURL); // obj.id int and currentActiveUrl string, don't use ===
          navigate(
            `/chat/${
              pdfLists[idx === pdfLists.length - 1 ? idx - 1 : idx + 1].id
            }/`
          );
        } else {
          navigate("/chat/");
        }
      } else {
        setErrorToastMessage("Failed to delete file");
      }
    }
  };

  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js">
        <Container fluid>
          <Row>
            <Col className="col-lg-9 pdf-viewer-container">
              {isProcessingDocument ? (
                <div className="mt-5 d-flex flex-column align-items-center justify-content-center">
                  <CustomSpinner />
                  <span className="mt-2">Processing Document...</span>
                </div>
              ) : fileUrl ? (
                <Viewer
                  fileUrl={fileUrl}
                  plugins={[
                    highlightPluginInstance,
                    pageNavigationPluginInstance,
                    jumpToPagePluginInstance,
                  ]}
                  onDocumentLoad={() => {
                    if (areas?.bboxes?.length) {
                      jumpResult(0);
                    }
                    console.log("loaded");
                  }}
                />
              ) : (
                <div style={{ paddingTop: "30px" }}>
                  Select or Upload a File
                </div>
              )}
            </Col>

            <Col
              className="d-none d-lg-block col-lg-3 py-2 right-sidebar"
              style={{
                boxShadow: !fileUrl
                  ? "-10px 0px 10px 1px rgb(0 0 0 / 6%)"
                  : "none",
                zIndex: 1000,
              }}
            >
              {areas?.bboxes?.length ? (
                <ListGroup as="ol" numbered>
                  {areas?.previews?.map((preview, ind) => (
                    <ListGroup.Item
                      onClick={() => jumpResult(ind)}
                      style={{
                        boxShadow:
                          ind === currentIndex
                            ? "0 4px 8px rgba(0, 0, 0, 0.4)"
                            : "none",
                      }}
                      as="li"
                      key={ind}
                      className="right-sidebar-button mx-2 my-1"
                    >
                      {preview}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : isQueryLoading ? (
                <div className="d-flex flex-column align-items-center justify-content-center mt-2">
                  <CustomSpinner />
                </div>
              ) : (
                <div
                  className="d-flex flex-column align-items-center justify-content-center mt-2"
                  style={{ color: "rgb(108,117,124)" }}
                >
                  <Icon.Inbox size={"40px"} />
                  <span>No Results</span>
                </div>
              )}
            </Col>
          </Row>
        </Container>

        <Container fluid className="searchbar-container position-relative">
          <Row>
            <Col className="col-lg-9 px-4">
              <Container fluid className="searchbar-container-inner">
                <div
                  className="d-flex mb-2 align-items-center "
                  style={{ width: "100%" }}
                >
                  <div style={{ marginRight: "0.5rem" }}>
                    <SearchBarButton
                      text="Delete File"
                      IconComponent={Icon.Trash}
                      onClickFunc={() => deleteCurrentFile()}
                    />
                  </div>
                  <div
                    style={{
                      marginRight: "auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      onKeyDown={handleJumpPage}
                      defaultValue={1}
                      style={{ marginRight: "0.2rem" }}
                      id="page-number-input"
                      className="plain-input"
                    />
                    <span id="total-pages-span">of</span>
                  </div>
                  <div style={{ marginRight: "0.5rem" }}>
                    {!pdfLists.find((obj) => obj.id == currentActiveURL)?.isbn &&
                      <SearchBarButton
                        text="Document Info"
                        IconComponent={Icon.Info}
                        onClickFunc={() => fileUrl && setInfoModalShow(true)}
                      />
                    }
                  </div>
                  <div style={{ marginRight: "0.5rem" }}>
                    <SearchBarButton
                      text="Citations & References"
                      IconComponent={Icon.Book}
                      onClickFunc={() =>
                        pdfLists?.length && setCitationModalShow(true)
                      }
                    />
                  </div>
                  <div style={{ marginRight: "0.5rem" }}>
                    <SearchBarButton
                      text="Previous Result"
                      IconComponent={Icon.ArrowLeft}
                      onClickFunc={() => moveResult(false)}
                    />
                  </div>
                  <SearchBarButton
                    text="Next Result"
                    IconComponent={Icon.ArrowRight}
                    onClickFunc={() => moveResult(true)}
                  />
                </div>
                <Form className="d-flex w-100" onSubmit={handleSearchQuery}>
                  <Form.Control
                    id="search-bar-text-entry"
                    type="search"
                    placeholder="Ask any question..."
                    className="me-2"
                    aria-label="Search"
                    style={{ border: 0, boxShadow: "none" }}
                  />
                  <Button id="search-bar-submit-button" type="submit">
                    Search
                  </Button>
                </Form>
              </Container>
            </Col>
            <Col className="d-none d-lg-block col-lg-3" />
          </Row>
        </Container>

        <CurrentPageLabel>
          {(props) => {
            totalPages = props.numberOfPages;
            document.getElementById("page-number-input").value =
              props.currentPage + 1;
            document.getElementById(
              "total-pages-span"
            ).innerText = `of ${totalPages}`;
          }}
        </CurrentPageLabel>

        <CitationModal
          pdflists={pdfLists}
          show={citationModalShow}
          onHide={() => setCitationModalShow(false)}
          setCopiedToClipboard={() => {
            setErrorToastMessage("Copied to Clipboard", "primary");
          }}
        />
        <DocumentInfoModal
          currentActiveURL={currentActiveURL}
          pdflists={pdfLists}
          show={infoModalShow}
          onHide={() => setInfoModalShow(false)}
          setErrorToastMessage={setErrorToastMessage}
        />
      </Worker>
    </>
  );
};

export default PdfView;
