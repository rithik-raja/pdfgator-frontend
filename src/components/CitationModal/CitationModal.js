import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./CitationModal.css";
import Cite from "citation-js";
import { CITATION_TEMPLATE_FORMATS } from "../../constants/citationConstants";
import axios from "axios";

require("@citation-js/plugin-isbn");
require("@citation-js/plugin-doi");

export default function CitationModal(props) {
  const [templateFormat, settemplateFormat] = useState("apa");
  const [sourceId, setsourceId] = useState([]);
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
      let cite = new Cite(citationList);

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
          let cite = new Cite(citationList);
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
            <Button className="mt-4" onClick={generateCitation}>
              Generate
            </Button>
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
