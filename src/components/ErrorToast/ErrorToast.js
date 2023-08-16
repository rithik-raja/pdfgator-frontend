import { Toast } from "react-bootstrap";

const ErrorToast = ({message, setMessage, color}) => {

  return (
    <Toast bg={color} show={Boolean(message)} delay={3000} autohide onClose={() => {setMessage(null, color)}} className="text-white" style={{position: "fixed", width: "200px", left: "calc(50vw - 100px)", top: "30px", zIndex: 5000}}>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}

export default ErrorToast;