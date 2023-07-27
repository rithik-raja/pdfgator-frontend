import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./CitationModal.css";
import Cite from "citation-js";
// import { Cite, plugins } from "@citation-js/core";
import { CITATION_TEMPLATE_FORMATS } from "../../constants/citationConstants";
import axios from "axios";

require("@citation-js/plugin-isbn");

export default function CitationModal(props) {
  const [templateFormat, settemplateFormat] = useState("apa");
  const [sourceId, setsourceId] = useState([]);
  const [checkedState, setCheckedState] = useState(
    new Array(props.pdflists.length).fill(false)
  );
  const [citationResult, setcitationResult] = useState();
  const [bibliographyResult, setbibliographyResult] = useState();

  const generateCitation = () => {
    var result = CITATION_TEMPLATE_FORMATS.find(
      (item) => item.value === templateFormat
    );

    if (result.is_default === "true") {
      console.log(checkedState);
      let cite = new Cite("9780133909777");
      console.log(cite);
      let bibliography = cite.format("bibliography", {
        template: templateFormat,
        format: "text",
      });
      setbibliographyResult(bibliography);
      console.log(bibliography);
      let citation = cite.format("citation", {
        template: templateFormat,
        format: "text",
        lang: "en-US",
      });
      setcitationResult(citation);
      console.log(citation);
    } else {
      console.log(checkedState);
      let data;
      axios
        .get("/csl-files/american-anthropological-association.csl")
        .then((res) => {
          console.log(res.data);
          data = res.data;
          let templateName = result.value;

          let config = Cite.plugins.config.get("@csl");
          config.templates.add(templateName, data);
          let cite = new Cite("9780133909777");
          console.log(cite);
          let bibliography = cite.format("bibliography", {
            template: templateName,
            format: "text",
          });
          setbibliographyResult(bibliography);
          console.log(bibliography);
          let citation = cite.format("citation", {
            template: templateName,
            format: "text",
            lang: "en-US",
          });
          setcitationResult(citation);
          console.log(citation);
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
    if (!checkedState.length) {
      newCheckstate = new Array(props.pdflists.length).fill(false);
    }
    const updatedCheckedState = newCheckstate.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const handleClose = () => {
    settemplateFormat("apa");
    setsourceId([]);
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
        <Modal.Title>Generate Citation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <Form>
              <div className="mt-2">
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
                <label>Select your sources</label>
                <div className="mt-2 source-container">
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
            <button
              type="button"
              className="mt-4 btn btn-primary"
              onClick={generateCitation}
            >
              Generate
            </button>
          </div>
          <div className="col-md-6">
            <div>
              <div>Citation</div>
              <div className="citation-result">
                {/* <p dangerouslySetInnerHTML={{ __html: citationResult }} /> */}
                <p>{citationResult}</p>
              </div>
            </div>
            <div>
              <div>References</div>
              <div className="references-result mb-2">
                {/* <p dangerouslySetInnerHTML={{ __html: bibliographyResult }} /> */}
                <p>{bibliographyResult}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
