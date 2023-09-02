import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import * as Icon from "react-feather";

import InputGroup from "react-bootstrap/InputGroup";
import "./DocumentInfoModal.css";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getAuthToken, logOut } from "../../services/userServices";
import { post } from "../Api/api";
import { UPDATECITATIONDATA } from "../../constants/apiConstants";

const documentTypeOptions = [
  {
    name: "Book",
    value: "book",
    id: "1",
  },
  {
    name: "Article",
    value: "article-journal",
    id: "2",
  },
  {
    name: "Webpage",
    value: "webpage",
    id: "3",
  },
];
const allowedKeys = ["id", "author_names", "doc_type", "publisher", "publication_year", "title", "url", "container_title"];

const DocumentInfoModal = ({ currentActiveURL, pdflists, show, onHide, setErrorToastMessage }) => {

  const initDocumentData = () => {
    console.log(pdflists)
    if (!pdflists?.length) return {}
    const allDocumentData = pdflists.find((obj) => obj.id == currentActiveURL) // obj.id int and currentActiveUrl string, don't use ===
    if (!allDocumentData) return {}
    const out = allowedKeys.reduce((obj, key) => {
      const val = allDocumentData[key];
      console.log(val)
      obj[key] = key === "author_names" ? JSON.parse(val) : val;
      return obj;
    }, {});
    if (out.author_names === null) {
      out.author_names = [{given: "", family: ""}]
    }
    console.log(out)
    return out
  }

  const [documentData, setDocumentData] = useState(initDocumentData());

  useEffect(() => {
    setDocumentData(initDocumentData())
  }, [pdflists])

  // const [documentType, setdocumentType] = useState("");
  // const setDocumentType = (val) => setDocumentData({...documentData, doc_type: val})
  // const [documentTitle, setdocumentTitle] = useState("");
  // const [authorList, setAuthorList] = useState([["a", "b"], ["c", "d"]])
  // const [publisher, setpublisher] = useState("");
  // const [publishDate, setpublishDate] = useState("");
  // const [containerTitle, setcontainerTitle] = useState("");
  // const [url, seturl] = useState("");

  const ondocumentTypeSelectChange = (e) => {
    console.log(e.target.value);
    setDocumentData({...documentData, doc_type: e.target.value});
  };

  const saveDocumentInfo = async (event) => {
    event.preventDefault();
    const tempDocumentData = {}
    const idx = pdflists.findIndex((obj) => obj.id == currentActiveURL);
    Object.keys(documentData).forEach((key) => {
      if (key === "author_names") {
        const filteredAuthors = documentData[key].filter((obj) => obj.given && obj.family);
        const newItem = filteredAuthors.length ? JSON.stringify(documentData[key]) : null;
        tempDocumentData[key] = newItem;
        pdflists[idx][key] = newItem;
      } else {
        const newItem = documentData[key] ? documentData[key] : null;
        tempDocumentData[key] = newItem;
        pdflists[idx][key] = newItem;
      }
    })
    const res = await post(UPDATECITATIONDATA, {citation_data: tempDocumentData}, {}, setErrorToastMessage);
    if (res) {
      setErrorToastMessage("Successfully saved", "primary");
    }
  };

  const handleNameChange = (idx, which, e) => {
    setDocumentData((current) => {
      return {
        ...documentData,
        author_names: [
          ...current.author_names.slice(0, idx),
          {...current.author_names[idx], [which]: e.target.value},
          ...current.author_names.slice(idx + 1)
        ]
      };
    });
  }

  const handleAddAuthor = (idx) => {
    setDocumentData((current) => {
      if (current.author_names.length >= 10) return current;
      return {
        ...documentData,
        author_names: [
          ...current.author_names.slice(0, idx + 1),
          {given: "", family: ""},
          ...current.author_names.slice(idx + 1)
        ]
      };
    })
  }

  const handleRemoveAuthor = (idx) => {
    setDocumentData((current) => {
      console.log(current);
      return {
        ...documentData,
        author_names: current.author_names.filter((val, i) => idx !== i)
      };
    })
  }
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Document Info</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={saveDocumentInfo}>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group controlId="type">
                <Form.Label>Document Type:</Form.Label>
                <Form.Select
                  aria-label="type-select"
                  onChange={ondocumentTypeSelectChange}
                  value={documentData.doc_type ?? "book"}
                  name="type"
                >
                  {documentTypeOptions.map((options, index) => {
                    return (
                      <option key={index} value={options.value}>
                        {options.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="documentTitle">
                <Form.Label>Title:</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Document Title"
                  onChange={(e) => setDocumentData({...documentData, title: e.target.value})}
                  value={documentData.title ?? ""}
                  name="documentTitle"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-4">
            <Form.Label>Author(s):</Form.Label>
          </Row>

          {documentData?.author_names && documentData.author_names.map((name, idx) => 
              <Row key={idx}>
                <InputGroup className="mb-2">
                  <InputGroup.Text>{idx + 1}</InputGroup.Text>
                  <Form.Control
                    aria-label="First name"
                    placeholder="First Name"
                    value={name.given ?? ""}
                    autoComplete="off"
                    onChange={(e) => {handleNameChange(idx, "given", e)}}
                  />
                  <Form.Control
                    id={`author-last-name-${idx}`}
                    aria-label="Last name"
                    placeholder="Last Name"
                    value={name.family ?? ""}
                    autoComplete="off"
                    onChange={(e) => {handleNameChange(idx, "family", e)}}
                  />
                  <Button className="add-remove-button" onClick={() => {handleAddAuthor(idx)}}>
                    <Icon.Plus />
                  </Button>
                  {idx !== 0 &&
                    <Button className="add-remove-button" onClick={() => {handleRemoveAuthor(idx)}}>
                      <Icon.Minus />
                    </Button>
                  }
                </InputGroup>
              </Row>
          )}

          <Row className="mt-3">
            <Col>
              <Form.Group controlId="publisher">
                <Form.Label>Publisher:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Publisher"
                  onChange={(e) => setDocumentData({...documentData, publisher: e.target.value})}
                  value={documentData.publisher ?? ""}
                  name="publisher"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="publish_date">
                <Form.Label>Publication Year:</Form.Label>
                <Form.Control
                  type="text"
                  name="publish_date"
                  placeholder="Publication Year"
                  onChange={(e) => setDocumentData({...documentData, publication_year: e.target.value})}
                  value={documentData.publication_year ?? ""}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-4">
            {documentData.doc_type === "article-journal" ? (
              <>
                {" "}
                <Col>
                  <Form.Group controlId="containerTitle">
                    <Form.Label>Journal Name</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Journal Name"
                      onChange={(e) => setDocumentData({...documentData, container_title: e.target.value})}
                      value={documentData.container_title ?? ""}
                      name="container_title"
                    />
                  </Form.Group>
                </Col>
              </>
            ) : (
              <></>
            )}
            {documentData.doc_type === "article-journal" ||
            documentData.doc_type === "webpage" ? (
              <>
                <Col>
                  <Form.Group controlId="url">
                    <Form.Label>Url</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="url"
                      onChange={(e) => setDocumentData({...documentData, url: e.target.value})}
                      value={documentData.url ?? ""}
                      name="url"
                    />
                  </Form.Group>
                </Col>
              </>
            ) : (
              <></>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={saveDocumentInfo}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default DocumentInfoModal;
