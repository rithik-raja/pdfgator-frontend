import React, { useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight";
import { ListGroup, Container, Col, Row, Form, Button } from "react-bootstrap";
import * as Icon from "react-feather";
import CitationModal from "../CitationModal/CitationModal";

// import type {
//   HighlightArea,
//   RenderHighlightsProps,
// } from "@react-pdf-viewer/highlight";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

// interface RenderHighlightAreasExampleProps {
//     areas: HighlightArea[];
//     fileUrl: string;
// }

const Pdf2 = ({ areas, fileUrl, pdfLists }) => {
  //   const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [currentIndex, setcurrentIndex] = useState(-1);

  const [modalShow, setModalShow] = React.useState(false);
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
                    plugins={[highlightPluginInstance]}
                  />
                </>
              ) : (
                <>
                  <div style={{ paddingTop: "30px" }}>Upload File</div>
                </>
              )}
            </Col>

            <Col className="d-none d-lg-block col-lg-3 py-2 right-sidebar">
              {/* <div>
                <ul className="right-sidebar-list">
                  <li
                    className="right-sidebar-list-item active"
                    onClick={() => moveResult(true)}
                  >
                    <Icon.ArrowUpCircle />
                    <span>Next result</span>
                  </li>
                  <li
                    className="right-sidebar-list-item"
                    onClick={() => moveResult(false)}
                  >
                    <Icon.ArrowDownCircle />
                    <span> Prev result</span>
                  </li>
                  <li className="right-sidebar-list-item">
                    <Icon.ZoomIn />
                    <span> Narrow search</span>
                  </li>
                  <li
                    className="right-sidebar-list-item"
                    onClick={() => setModalShow(true)}
                  >
                    <Icon.Book />
                    <span>Generate citation</span>
                  </li>
                  <CitationModal
                    pdflists={pdfLists}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
                </ul>
              </div> */}
              <ListGroup as="ol" numbered>
                {
                  areas.previews.map(
                    (preview, ind) =>
                      <ListGroup.Item onClick={() => jumpResult(ind)} as="li" key={ind} className="right-sidebar-button mx-2 my-1">{preview}</ListGroup.Item>
                  )
                }
              </ListGroup>
            </Col>
          </Row>
        </Container>
        <Container fluid className="searchbar-container position-relative">
          <Row>
            <Col className="col-lg-9 px-4">
              <Container fluid className="searchbar-container-inner">
                <div className="d-flex" style={{width: "100%"}}>
                  <div style={{marginRight: "auto"}}>
                    <Button>
                      <Icon.Book />
                    </Button>
                  </div>
                  <Button>
                    <Icon.ArrowLeft />
                  </Button>
                  <Button>
                    <Icon.ArrowRight />
                  </Button>
                </div>
                <Form className="d-flex w-100">
                  <Form.Control
                    type="search"
                    placeholder="Ask any question..."
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button>
                    Search
                  </Button>
                </Form>
              </Container>
            </Col>
            <Col className="d-none d-lg-block col-lg-3" />
          </Row>
        </Container>
      </Worker>
    </>
  );
};

export default Pdf2;
