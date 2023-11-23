import { Toast } from "react-bootstrap";

export const CustomToast = ({ details, setDetails }) => {

  return (
    <Toast
      bg={details.color}
      show={Boolean(details.initMessage)}
      delay={3000}
      autohide
      onClose={() => {
        setDetails((prev) => ({
          ...prev,
          initMessage: null
        }));
      }}
      className="text-white"
      style={{
        textAlign: "center",
        position: "fixed",
        width: "200px",
        left: "calc(50vw - 100px)",
        top: "30px",
        zIndex: 5000,
      }}
    >
      <Toast.Body>{details.initMessage}</Toast.Body>
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
