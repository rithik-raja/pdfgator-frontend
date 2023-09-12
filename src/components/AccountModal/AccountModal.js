import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./AccountModal.css";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getAuthToken, logOut } from "../../services/userServices";
import { useNavigate } from "react-router-dom";
import { GET_USAGE } from "../../constants/apiConstants";
import { get } from "../Api/api";
import PricingModal from "../PricingModal/PricingModal";

export default function AccountModal(props) {

  const getUsage = async () => {
    let res = await get(GET_USAGE);
    console.log(res);
    if (res?.data && res?.data?.data) {
      setUsage(res?.data?.data);
    }
    console.log(res?.data?.data);
  };
  useEffect(() => {
    getUsage();
  }, []);

  const getScopes = () => (!props.email) ? {
    search: "search_query_anon",
    upload: "file_upload_anon"
  } : (props.plan_name?.toLowerCase() === "free") ? {
    search: "search_query_user_free",
    upload: "file_upload_user_free"
  } : {
    search: "search_query_user_paid",
    upload: "file_upload_user_paid"
  }

  const navigate = useNavigate();
  const [usage, setUsage] = useState({
    usage_limits: {}
  })
  const [pricingModalShow, setPricingModalShow] = useState(false);
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
                  navigate("/")
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
              {props.isSubscriped ? "Usage Today" : "Free Usage Today"}
            </Card.Subtitle>
            <Card.Text>
              <Container>
                <Row className="justify-content-md-center">
                  <Col xs={8}>
                    <div class="progress-container">
                      <ProgressBar now={usage[getScopes().upload]} min={0} max={usage.usage_limits[getScopes().upload]} />
                    </div>
                  </Col>
                  <Col>{usage[getScopes().upload]}/{usage.usage_limits[getScopes().upload]} PDFs</Col>
                </Row>
                <Row className="justify-content-md-center">
                  <Col xs={8}>
                    <div class="progress-container">
                      <ProgressBar now={usage[getScopes().search]} min={0} max={usage.usage_limits[getScopes().search]} />
                    </div>
                  </Col>
                  <Col>{usage[getScopes().search]}/{usage.usage_limits[getScopes().search]} Questions</Col>
                </Row>
              </Container>
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <Row className="justify-content-md-center">
              <Col xs={8}>
                <div>Current Plan: {props.plan_name}</div>
              </Col>
              <Col>
                <Button size="sm" onClick={() => {setPricingModalShow(true)}}>View Plans</Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Modal.Body>
      <PricingModal
        show={pricingModalShow}
        onHide={() => setPricingModalShow(false)}
        email={props.email}
        isSubscriped={props.is_plus_user}
        isCanceled={props.is_cancel_pending}
        plan_id={props.plan_id}
        plan_name={props.plan_name}
      />
    </Modal>
  );
}
