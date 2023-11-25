/* eslint-disable eqeqeq */

import { useState, useEffect, useRef } from "react";

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

import {
  BASE_URL,
  DELETE_FILES,
  MAIN_APP_URL,
  SEARCH_QUERY,
} from "../../constants/apiConstants";
import { post } from "../Api/api";
import CustomSpinner from "../Spinner/spinner";
import { getSessionId } from "../../services/sessionService";
import DocumentInfoModal from "../DocumentInfoModal/DocumentInfoModal";
import { displayToast } from "../CustomToast/CustomToast";
import { getAuthToken } from "../../services/userServices";

const PdfView = ({
  areas,
  fileUrl,
  pdfLists,
  currentActiveURL,
  setAreas,
  isProcessingDocument,
  setpdfLists,
  setPricingModalShow
}) => {
  const navigate = useNavigate();
  let totalPages;
  const [currentIndex, setcurrentIndex] = useState(-1);
  const [citationModalShow, setCitationModalShow] = useState(false);
  const [infoModalShow, setInfoModalShow] = useState(false);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [rightSidebarShowEvidence, setRightSidebarShowEvidence] = useState(false);
  const [llmTempContent, setLlmTempContent] = useState(null);
  const jumpIndex = useRef([-1, -1]); // jump after new areas are set from history
  const tokCount = useRef(0);

  useEffect(() => {
    jumpResult(jumpIndex.current[1]);
    document.getElementById(`evidence-sidebar-button-${jumpIndex.current[1]}`)?.scrollIntoView();
  }, [areas]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sidebarEle = document.getElementById("right-sidebar");
    sidebarEle.scrollTop = sidebarEle.scrollHeight;
  }, [isQueryLoading])

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

  // const moveResult = (isNext) => {
  //   if (areas?.indices?.length > 0) {
  //     let currentVal = isNext ? currentIndex + 1 : currentIndex - 1;
  //     if (currentVal >= 0 && currentVal < areas.indices.length) {
  //       jumpToHighlightArea(areas.bboxes[areas.indices[currentVal]]);
  //       setcurrentIndex(currentVal);
  //     }
  //   }
  // };

  const jumpResult = (ind) => {
    if (!areas.indices?.length) return;
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
        jumpToPage(page - 1);
      }
    }
  };

  // const llmNewToken = (tok, pdfIdx) => {
  //   setpdfLists((current) => {
  //     current[pdfIdx] = {
  //       ...current[pdfIdx],
  //       searchHistory: [
  //         ...current[pdfIdx].searchHistory.slice(0, -1),
  //         {
  //           llm_response: ["current[pdfIdx].searchHistory[current[pdfIdx].searchHistory.length - 1] + tok"]
  //         }
  //       ],
  //     };
  //     console.log(current)
  //     return current;
  //   });
  // }

  const handleSearchQuery = async (event, overrideQuery = null) => {
    event.preventDefault();
    if (currentActiveURL === undefined) return
    const query = overrideQuery
      ? overrideQuery
      : document.getElementById("search-bar-text-entry").value;
    document.body.style.pointerEvents = "none";
    try {
      const searchInputElement = document.getElementById(
        "search-bar-text-entry"
      );
      const searchSubmitElement = document.getElementById(
        "search-bar-submit-button"
      );
      const pdfIdx = pdfLists.findIndex((obj) => obj.id == currentActiveURL);
      let final_data;
      if (query?.trim() && currentActiveURL) {
        setIsQueryLoading(true);
        setAreas({});
        searchInputElement.disabled = true;
        searchSubmitElement.disabled = true;
        const eventSource =  new EventSource(
          BASE_URL + "/" +
          SEARCH_QUERY +
          currentActiveURL + "/" +
          encodeURIComponent(query).replace("%2F", "<|escapeslash|>") + "/" +
          getSessionId() + "/" +
          getAuthToken()
        );
        setpdfLists((current) => {
          const current_ = [...current];
          current_[pdfIdx] = {
            ...current_[pdfIdx],
            searchHistory: [
              ...current_[pdfIdx].searchHistory,
              query,
              {
                llm_response: ["Loading..."]
              }
            ],
          };
          return current_;
        });
        const sidebarEle = document.getElementById("right-sidebar");
        tokCount.current = 0;
        eventSource.onmessage = (event) => {
          const data = event.data;
          if (data.slice(0, 20) !== "<|endofllmresponse|>") {
            setLlmTempContent((current) => current === null ? data : current + data);
            tokCount.current += 1;
            sidebarEle.scrollTop = sidebarEle.scrollHeight;
          } else {
            final_data = JSON.parse(data.slice(20));
            eventSource.close();
          }
        }
        eventSource.onerror = (error) => {
          if (error.status === 429) {
            setPricingModalShow(true);
            displayToast("Search query limit exceeded", "danger");
          } else {
            displayToast("Failed to perform search", "danger");
            console.error(error);
          }
          eventSource.close();
        }
        setLlmTempContent(null);
        while (eventSource.readyState !== EventSource.CLOSED) {
          await new Promise((res) => setTimeout(res, 500));
        }
      }
      if (final_data) {
        setAreas(final_data);
        setpdfLists((current) => {
          current[pdfIdx] = {
            ...current[pdfIdx],
            searchHistory: [
              ...current[pdfIdx].searchHistory.slice(0, -1),
              final_data
            ],
          };
          jumpIndex.current = [current[pdfIdx].searchHistory.length - 1, -1];
          return current;
        });
      }
      setLlmTempContent(null);
      
      searchInputElement.disabled = false;
      searchSubmitElement.disabled = false;
      document.body.style.pointerEvents = "auto";
      // setpdfLists((current) => {
      //   if (!current[pdfIdx].searchHistory.includes(query)) {
      //     current[pdfIdx] = {
      //       ...current[pdfIdx],
      //       searchHistory: [
      //         ...current[pdfIdx].searchHistory.slice(
      //           0,
      //           SEARCH_MEMORY_PER_FILE * 2 - 2
      //         ),
      //         query,
      //         final_data
      //       ],
      //     };
      //     jumpIndex.current = [current[pdfIdx].searchHistory.length - 1, -1];
      //   }
      //   return current;
      // });
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
        <Button size="sm" variant="light" onClick={onClickFunc}>
          <IconComponent color="black" />
        </Button>
      </OverlayTrigger>
    );
  };

  const deleteCurrentFile = async () => {
    if (fileUrl) {
      const { error, response } = await post(DELETE_FILES, { target: currentActiveURL });
      if (!error) {
        if (pdfLists && pdfLists?.length !== 1) {
          const idx = pdfLists.findIndex((obj) => obj.id == currentActiveURL); // obj.id int and currentActiveUrl string, don't use ===
          navigate(
            `${MAIN_APP_URL}/${
              pdfLists[idx === pdfLists.length - 1 ? idx - 1 : idx + 1].id
            }/`
          );
        } else {
          navigate(MAIN_APP_URL);
        }
      } else {
        displayToast("Failed to delete file", "danger");
        console.error(response.data.detail);
      }
    }
  };

  const currentPdfData = pdfLists?.find((obj) => obj.id == currentActiveURL);

  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js">
        <Container fluid>
          <Row>
            <Col className="d-none d-lg-block col-lg-6 pdf-viewer-container">
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
                  // onDocumentLoad={() => {
                  //   if (areas?.bboxes?.length) {
                  //     jumpResult(0);
                  //   }
                  // }}
                />
              ) : (
                <div style={{ paddingTop: "30px" }}>
                  Select or Upload a File
                </div>
              )}
            </Col>
            <Col
              className={`col-lg-${rightSidebarShowEvidence ? 4 : 6} py-2 right-sidebar`}
              id="right-sidebar"
              style={{
                boxShadow: !fileUrl || isProcessingDocument
                  ? "-10px 0px 10px 1px rgb(0 0 0 / 6%)"
                  : "none"
              }}
            >
              <ListGroup as="ul" style={{display: "flex"}}>
                {currentPdfData?.searchHistory?.length ? (
                  currentPdfData?.searchHistory?.map((query, ind) => (
                      <ListGroup.Item
                        style={{
                          borderRadius: "10px",
                          maxWidth: "75%",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          //left: `${ind % 2 === 1 ? 0 : 33.33}%`,
                          textAlign: "left"
                        }}
                        as="li"
                        key={ind}
                        className={`right-sidebar-button my-2 right-sidebar-item-margin-class-${Number(ind % 2 === 1)}`}
                      >
                        <div
                          style={{ width: "85%", marginLeft: "3px" }}
                        >
                          {
                            llmTempContent !== null && currentPdfData.searchHistory.length -1 === ind ?
                            <span
                              className="me-auto"
                              style={{whiteSpace: "pre-wrap"}}
                            >
                              {llmTempContent.trim() === "" ? "Loading..." : llmTempContent}
                            </span> :

                            (typeof query === "string") ?
                            <span
                              className="me-auto"
                            >
                              {query}
                            </span> :
                            query.llm_response.map((ele, idx) => idx % 2 === 0 ?
                              <span
                                key={idx}
                                style={{whiteSpace: "pre-wrap"}}>
                                  {ele}
                              </span> :
                              <strong
                                className="jump-page-link"
                                key={idx}
                                onClick={() => {
                                  if (ind === jumpIndex.current[0]) {
                                    jumpResult(ele[1]);
                                  }
                                  jumpIndex.current = [ind, ele[1]];
                                  setAreas(query);
                                  document.getElementById(`evidence-sidebar-button-${jumpIndex.current[1]}`)?.scrollIntoView();
                                }}
                                style={{
                                  cursor: "pointer",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                  {`[page ${ele[0] + 1}]`}
                              </strong>
                            )
                          }
                        </div>
                      </ListGroup.Item>
                    ))
                ) : (
                  !isQueryLoading &&
                  <div
                    className="d-flex flex-column align-items-center justify-content-center mt-2"
                    style={{ color: "rgb(108,117,124)" }}
                  >
                    <Icon.Inbox size={"40px"} />
                    <span>No Searches Yet</span>
                  </div>
                )}
              </ListGroup>
              {
                isQueryLoading && tokCount.current <= 1 &&
                <div className="d-flex flex-column align-items-center justify-content-center mt-2">
                  <CustomSpinner />
                </div>
              }
            </Col>
            {
              rightSidebarShowEvidence &&
              <Col className="d-none d-lg-block evidence-sidebar col-lg-2">
                {
                  areas?.bboxes?.length ? (
                    <ListGroup as="ol" numbered>
                      {areas?.previews?.map((preview, ind) => (
                        <ListGroup.Item
                          onClick={() => jumpResult(ind)}
                          id={`evidence-sidebar-button-${ind}`}
                          style={{
                            boxShadow:
                              ind === currentIndex
                                ? "0 4px 8px rgba(0, 0, 0, 0.4)"
                                : "none",
                            backgroundColor:
                              ind === currentIndex
                                ? "rgba(230, 230, 230, 0.9)"
                                : "white"
                          }}
                          as="li"
                          key={ind}
                          className="evidence-sidebar-button mx-2 my-1"
                        >
                          {preview}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div
                      className="d-flex flex-column align-items-center justify-content-center mt-2"
                      style={{ color: "rgb(108,117,124)" }}
                    >
                      <Icon.Inbox size={"40px"} />
                      <span>No Evidence</span>
                    </div>
                  )
                }
              </Col>
            }
          </Row>
        </Container>

        <Container fluid className="searchbar-pdftools-container position-relative">
          <Row>
            <Col className="d-none d-lg-block col-lg-6">
              <Container fluid className="pdftools-container-inner">
                <div
                  className="d-flex align-items-center"
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
                  <div style={{ marginRight: "0.5rem" }} className="d-none d-lg-block">
                    {!currentPdfData?.isbn && (
                      <SearchBarButton
                        text="Document Info"
                        IconComponent={Icon.Info}
                        onClickFunc={() => fileUrl && setInfoModalShow(true)}
                      />
                    )}
                  </div>
                  {
                    Object.keys(areas)?.length > 0 &&
                    <div style={{ marginRight: "0.5rem" }} className="d-none d-lg-block">
                      <SearchBarButton
                        text={
                          rightSidebarShowEvidence
                            ? "Hide Evidence"
                            : "List Evidence"
                        }
                        IconComponent={
                          rightSidebarShowEvidence
                            ? Icon.X
                            : Icon.List
                        }
                        onClickFunc={() =>
                          setRightSidebarShowEvidence((cur) => !cur)
                        }
                      />
                    </div>
                  }
                  <div className="d-none d-lg-block">
                    <SearchBarButton
                      text="Citations & References"
                      IconComponent={Icon.Book}
                      onClickFunc={() =>
                        pdfLists?.length && setCitationModalShow(true)
                      }
                    />
                  </div>
                  {/* <div style={{ marginRight: "0.5rem" }}>
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
                  /> */}
                </div>
              </Container>
            </Col>
            <Col className="col-lg-6 px-2">
              <Container fluid className="searchbar-container-inner">
                <Form className="d-flex w-100" onSubmit={handleSearchQuery}>
                  <Form.Control
                    id="search-bar-text-entry"
                    type="search"
                    placeholder="Ask any question..."
                    className="me-2"
                    aria-label="Search"
                    style={{ border: 0, boxShadow: "none" }}
                    autoComplete="off"
                  />
                  <Button id="search-bar-submit-button" type="submit">
                    Search
                  </Button>
                </Form>
              </Container>
            </Col>
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
            displayToast("Copied to Clipboard", "success");
          }}
        />
        <DocumentInfoModal
          currentActiveURL={currentActiveURL}
          pdflists={pdfLists}
          show={infoModalShow}
          onHide={() => setInfoModalShow(false)}
        />
      </Worker>
    </>
  );
};

export default PdfView;
