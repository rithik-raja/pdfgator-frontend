import React from "react";
import { useState, useEffect } from "react";
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
import { GET_USAGE } from "../../constants/apiConstants";
import { get } from "../Api/api";
import PricingModal from "../PricingModal/PricingModal";
import { getProducts } from "../../services/productsService";

const AccountModal = ({ stripeDetails, ...props }) => {
  let prods = getProducts();

  let plan = stripeDetails?.find((ele) => ele.is_plan_canceled === false);
  let plan_name = "Free";
  if (prods && prods?.length && plan?.product_id) {
    let prod = prods?.find((ele) => ele.id === plan?.product_id);
    plan_name = prod?.metadata?.product_name;
  }

  const getUsage = async () => {
    const { error, response } = await get(GET_USAGE);
    if (!error) {
      setUsage(response.data);
    }
  };
  useEffect(() => {
    getUsage();
  }, [props.show]);

  const getScopes = () =>
    !props.email
      ? {
          search: "search_query_anon",
          upload: "file_upload_anon",
        }
      : !plan?.product_id
      ? {
          search: "search_query_user_free",
          upload: "file_upload_user_free",
        }
      : {
          search: "search_query_user_paid",
          upload: "file_upload_user_paid",
        };

  const navigate = useNavigate();
  const [usage, setUsage] = useState({
    usage_limits: {},
  });
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
              {plan?.product_id ? "Usage Today" : "Free Usage Today"}
            </Card.Subtitle>
            <Container>
              <Row className="justify-content-md-center">
                <Col xs={8}>
                  <div className="progress-container">
                    <ProgressBar
                      now={usage[getScopes().upload]}
                      min={0}
                      max={usage.usage_limits[getScopes().upload]}
                    />
                  </div>
                </Col>
                <Col>
                  {usage[getScopes().upload]}/
                  {usage.usage_limits[getScopes().upload]} PDFs
                </Col>
              </Row>
              <Row className="justify-content-md-center">
                <Col xs={8}>
                  <div className="progress-container">
                    <ProgressBar
                      now={usage[getScopes().search]}
                      min={0}
                      max={usage.usage_limits[getScopes().search]}
                    />
                  </div>
                </Col>
                <Col>
                  {usage[getScopes().search]}/
                  {usage.usage_limits[getScopes().search]} Questions
                </Col>
              </Row>
            </Container>
          </Card.Body>
          <Card.Footer>
            <Row className="justify-content-md-center">
              <Col xs={8}>
                <div>Current Plan: {plan_name}</div>
              </Col>
              <Col>
                <Button
                  size="sm"
                  onClick={() => {
                    setPricingModalShow(true);
                  }}
                >
                  View Plans
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Modal.Body>
      {pricingModalShow && (
        <PricingModal
          show={pricingModalShow}
          onHide={() => setPricingModalShow(false)}
          email={props.email}
          stripeDetails={stripeDetails}
        />
      )}
    </Modal>
  );
};

export default AccountModal;
