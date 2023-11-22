import { useState } from "react";
import { Toast } from "react-bootstrap";

export const CustomToast = ({ initMessage, color }) => {

  const [message, setMessage] = useState(initMessage);

  return (
    <Toast
      bg={color}
      show={Boolean(message)}
      delay={3000}
      autohide
      onClose={() => {
        setMessage(null, color);
      }}
      className="text-white"
      style={{
        position: "fixed",
        width: "200px",
        left: "calc(50vw - 100px)",
        top: "30px",
        zIndex: 5000,
      }}
    >
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export const displayToast = (initMessage, color) => {
  const event = new CustomEvent("setToast", {
    detail: {
      initMessage,
      color
    }
  });
  document.dispatchEvent(event);
}
