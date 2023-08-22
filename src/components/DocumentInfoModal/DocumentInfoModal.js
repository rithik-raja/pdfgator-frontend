import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import InputGroup from "react-bootstrap/InputGroup";
import "./DocumentInfoModal.css";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getAuthToken, logOut } from "../../services/userServices";
let documentTypeOptions = [
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
export default function DocumentInfoModal(props) {
  const [documentType, setdocumentType] = useState("");
  const [documentTitle, setdocumentTitle] = useState("");
  const [authorFirstName, setauthorFirstName] = useState("");
  const [authorLastName, setauthorLastName] = useState("");
  const [publisher, setpublisher] = useState("");
  const [publishDate, setpublishDate] = useState("");
  const [containerTitle, setcontainerTitle] = useState("");
  const [url, seturl] = useState("");
  console.log(props);
  const ondocumentTypeSelectChange = (e) => {
    console.log(e.target.value);
    setdocumentType(e.target.value);
  };
  const saveDocumentInfo = (event) => {
    event.preventDefault();
    console.log("save");
  };
  return (
    <Modal
      {...props}
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
                <Form.Label>Choose Type</Form.Label>
                <Form.Select
                  aria-label="type-select"
                  onChange={ondocumentTypeSelectChange}
                  value={documentType}
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
                <Form.Label>Title</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Document Title"
                  onChange={(e) => setdocumentTitle(e.target.value)}
                  value={documentTitle}
                  name="documentTitle"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <InputGroup className="mb-3 mt-3">
              <InputGroup.Text>Add New Author</InputGroup.Text>
              <Form.Control
                aria-label="First name"
                placeholder="First Name"
                onChange={(e) => setauthorFirstName(e.target.value)}
                value={authorFirstName}
              />
              <Form.Control
                aria-label="Last name"
                placeholder="Last Name"
                onChange={(e) => setauthorLastName(e.target.value)}
                value={authorLastName}
              />
            </InputGroup>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="publisher">
                <Form.Label>Publisher</Form.Label>

                <Form.Control
                  type="text"
                  placeholder="Publisher"
                  onChange={(e) => setpublisher(e.target.value)}
                  value={publisher}
                  name="publisher"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="publish_date">
                <Form.Label>Publish Date</Form.Label>
                <Form.Control
                  type="date"
                  name="publish_date"
                  placeholder="Publish Date"
                  onChange={(e) => setpublishDate(e.target.value)}
                  value={publishDate}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-3">
            {documentType === "article-journal" ? (
              <>
                {" "}
                <Col>
                  <Form.Group controlId="containerTitle">
                    <Form.Label>Journal Name</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Journal Name"
                      onChange={(e) => setcontainerTitle(e.target.value)}
                      value={containerTitle}
                      name="containerTitle"
                    />
                  </Form.Group>
                </Col>
              </>
            ) : (
              <></>
            )}
            {documentType === "article-journal" ||
            documentType === "webpage" ? (
              <>
                <Col>
                  <Form.Group controlId="url">
                    <Form.Label>Url</Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="url"
                      onChange={(e) => seturl(e.target.value)}
                      value={url}
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
          <Button variant="success" type="submit" onClick={saveDocumentInfo}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
