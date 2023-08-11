import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./PricingModal.css";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getAuthToken, logOut } from "../../services/userServices";

export default function PricingModal(props) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Upgrade to Pdfgator Plus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Subtitle className="mb-2 text-muted">Free</Card.Subtitle>
          <Card.Body>
            <Card.Text>
              <Container>
                <h1>
                  $0<span className="light-text">/mon</span>
                </h1>
              </Container>
            </Card.Text>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
}
