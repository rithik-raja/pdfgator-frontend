import { useState } from "react";

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
import { useNavigate, useParams } from "react-router-dom";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

const PdfView = ({ areas, fileUrl, pdfLists }) => {
  const navigate = useNavigate();
  let totalPages;
  const [currentIndex, setcurrentIndex] = useState(-1);
  const [modalShow, setModalShow] = useState(false);

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
            .filter((area) => area.pageIndex === props.pageIndex)
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
    if (areas.indices.length > 0) {
      let currentVal = isNext ? currentIndex + 1 : currentIndex - 1;
      if (currentVal >= 0 && currentVal < areas.indices.length) {
        jumpToHighlightArea(areas.bboxes[areas.indices[currentVal]]);
        setcurrentIndex(currentVal);
      }
    }
  };

  const jumpResult = (ind) => {
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

  const deleteCurrentFile = () => {
    console.log("delete");
    navigate("/chat/");
  };

  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js">
        <Container fluid>
          <Row>
            <Col className="col-lg-9 pdf-viewer-container">
              {fileUrl ? (
                <>
                  <Viewer
                    fileUrl={fileUrl}
                    plugins={[
                      highlightPluginInstance,
                      pageNavigationPluginInstance,
                      jumpToPagePluginInstance,
                    ]}
                  />
                </>
              ) : (
                <>
                  <div style={{ paddingTop: "30px" }}>
                    Select or Upload a File
                  </div>
                </>
              )}
            </Col>

            <Col className="d-none d-lg-block col-lg-3 py-2 right-sidebar">
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
                    <SearchBarButton
                      text="Citations & References"
                      IconComponent={Icon.Book}
                      onClickFunc={() => setModalShow(true)}
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
                <Form className="d-flex w-100">
                  <Form.Control
                    type="search"
                    placeholder="Ask any question..."
                    className="me-2"
                    aria-label="Search"
                    style={{ border: 0, boxShadow: "none" }}
                  />
                  <Button>Search</Button>
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
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </Worker>
    </>
  );
};

export default PdfView;
