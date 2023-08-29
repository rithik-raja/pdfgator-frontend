import React, { useState } from "react";
import { Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./CitationModal.css";
import Cite from "citation-js";
import { CITATION_TEMPLATE_FORMATS } from "../../constants/citationConstants";
import axios from "axios";

require("@citation-js/plugin-isbn");
require("@citation-js/plugin-doi");

let copyToClipboard = {
  citation: "",
  bibliography: ""
}

const CitationModal = ({setCopiedToClipboard, ...props}) => {

  const renderPopover = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to Copy
    </Tooltip>
  );

  const setFromCitationList = (list) => {
    let cite = new Cite(list);
    console.log(cite);
    let bibliography = cite.format("bibliography", {
      template: templateFormat,
      format: "html",
    });
    copyToClipboard.bibliography = cite.format("bibliography", {
      template: templateFormat,
      format: "text",
    });
    if (bibliography.includes("csl-left-margin")&& !bibliography.includes("csl-block")) {
      bibliography = bibliography.replaceAll(`class="csl-entry"`, `class="csl-entry-with-margin"`)
    }
    setbibliographyResult(bibliography);
    console.log(bibliography);
    let citation = cite.format("citation", {
      template: templateFormat,
      format: "html",
      lang: "en-US",
    });
    copyToClipboard.citation = cite.format("citation", {
      template: templateFormat,
      format: "text",
      lang: "en-US",
    });
    setcitationResult(citation);
    console.log(citation);
  }

  const [templateFormat, settemplateFormat] = useState("apa");
  const [checkedState, setCheckedState] = useState(
    new Array(props.pdflists.length).fill(false)
  );
  const [citationResult, setcitationResult] = useState();
  const [bibliographyResult, setbibliographyResult] = useState();

  const generateCitation = () => {
    const citationList = [];
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    checkedState.forEach((isChecked, idx) => {
      if (isChecked) {
        citationList.push(
          !props.pdflists[idx].isbn
            ? {
                type: null,
                title: props.pdflists[idx].title,
                author: JSON.parse(props.pdflists[idx].author_names),
                publisher: props.pdflists[idx].publisher,
                issued: {
                  "date-parts": [[props.pdflists[idx].publication_year]],
                },
                accessed: {
                  "date-parts": [[yyyy, mm, dd]],
                },
                "container-title": null, // journal name for article
                URL: null,
              }
            : props.pdflists[idx].isbn
        );
      }
    });

    setcitationResult("");
    setbibliographyResult("");
    var result = CITATION_TEMPLATE_FORMATS.find(
      (item) => item.value === templateFormat
    );

    if (result.is_default === "true") {
      console.log(checkedState);
      setFromCitationList(citationList);
    } else {
      console.log(checkedState);
      let data;
      let cslPath = result?.file_path
        ? result.file_path
        : "american-anthropological-association";
      axios
        .get("/csl-files/" + cslPath + ".csl")
        .then((res) => {
          console.log(res.data);
          data = res.data;
          let templateName = result.value;

          let config = Cite.plugins.config.get("@csl");
          config.templates.add(templateName, data);
          setFromCitationList(citationList);
        })
        .catch((err) => console.log(err));
    }
  };
  const onTemplateFormatChange = (e) => {
    console.log(e.target.value);
    settemplateFormat(e.target.value);
  };
  const onSourceChange = (position) => {
    let newCheckstate = checkedState;
    if (checkedState.length !== props.pdflists.length) {
      newCheckstate = new Array(props.pdflists.length).fill(false);
    }
    const updatedCheckedState = newCheckstate.map((item, index) =>
      index === position ? !item : item
    );
    console.log(updatedCheckedState)
    setCheckedState(updatedCheckedState);
  };

  const handleClose = () => {
    settemplateFormat("apa");
    setcitationResult("");
    setbibliographyResult("");
    setCheckedState(new Array(props.pdflists.length).fill(false));
    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Citations and References</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="modal-left-container d-flex flex-column col-md-6">
            <Form>
              <div className="">
                <label>Choose Format</label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={onTemplateFormatChange}
                  value={templateFormat}
                >
                  {CITATION_TEMPLATE_FORMATS.map((options, index) => {
                    return (
                      <option key={index} value={options.value}>
                        {options.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </div>
              <div className="mt-2">
                <label>Select Your Sources</label>
                <div className="source-container mb-2">
                  {props.pdflists.map((pdflist, index) => {
                    return (
                      <Form.Check
                        key={index}
                        id={"pdflist-id" + index}
                        type="checkbox"
                        label={pdflist.name}
                        // value={pdflist.id}
                        defaultChecked={false}
                        onChange={() => onSourceChange(index)}
                      />
                    );
                  })}
                </div>
              </div>
            </Form>
            <div className="mt-auto">
            <Button className="mt-2" onClick={generateCitation}>
              Generate
            </Button>
            </div>
          </div>
          {citationResult && bibliographyResult && citationResult !== "[NO_PRINTED_FORM]" &&
            <div className="col-md-6" style={{minHeight: "320px"}}>
              <div className="d-flex flex-column" style={{height: "25%"}}>
                <div>Citation</div>
                <OverlayTrigger overlay={renderPopover} placement="right">
                  <div className="citation-result" onClick={() => {
                      navigator.clipboard.writeText(copyToClipboard.citation);
                      setCopiedToClipboard();
                    }}>
                    <p dangerouslySetInnerHTML={{ __html: citationResult }} />
                    {/* <p>{citationResult}</p> */}
                  </div>
                </OverlayTrigger>
              </div>
              <div className="d-flex flex-column" style={{height: "75%"}}>
                <div>References</div>
                <OverlayTrigger overlay={renderPopover} placement="right">
                  <div className="references-result" onClick={() => {
                      navigator.clipboard.writeText(copyToClipboard.bibliography);
                      setCopiedToClipboard();
                    }}>
                    <p dangerouslySetInnerHTML={{ __html: bibliographyResult }} />
                    {/* <p>{bibliographyResult}</p> */}
                  </div>
                </OverlayTrigger>
              </div>
            </div>
          }
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CitationModal;
