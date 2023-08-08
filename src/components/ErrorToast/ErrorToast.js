import { Toast } from "react-bootstrap";

const ErrorToast = ({message, setMessage}) => {
  console.log("toast called" + message)
  return (
    <Toast bg="danger" show={Boolean(message)} delay={3000} autohide onClose={() => {setMessage(null)}} className="text-white" style={{position: "fixed", width: "200px", left: "calc(50vw - 100px)", top: "30px", zIndex: 30}}>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}

export default ErrorToast;