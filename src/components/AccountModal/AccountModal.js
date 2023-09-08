import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./AccountModal.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import { logOut } from "../../services/userServices";
import { useNavigate } from "react-router-dom";

export default function AccountModal(props) {
  const navigate = useNavigate();
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>My Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="mb-3">
          <Row>
            <Col xs={8}>{`${props.email}`}</Col>
            <Col>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  logOut();
                  props.onHide();
                  navigate("/");
                }}
              >
                Sign Out
              </Button>
            </Col>
          </Row>
        </Container>
        <Card>
          <Card.Body>
            <Card.Subtitle className="mb-2 text-muted">
              Free Usage Today
            </Card.Subtitle>
            <Card.Text>
              <Container>
                <Row className="justify-content-md-center">
                  <Col xs={8}>
                    <div class="progress-container">
                      <ProgressBar now={2} min={0} max={3} />
                    </div>
                  </Col>
                  <Col>2/3 PDFs</Col>
                </Row>
                <Row className="justify-content-md-center">
                  <Col xs={8}>
                    <div class="progress-container">
                      <ProgressBar now={5} min={0} max={50} />
                    </div>
                  </Col>
                  <Col>5/50 Questions</Col>
                </Row>
              </Container>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Row className="justify-content-md-center">
              <Col xs={8}>
                <div>Free Plan</div>
              </Col>
              <Col>
                <Button size="sm">Get plus</Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Modal.Body>
    </Modal>
  );
}
