import { Spinner } from "react-bootstrap";

const CustomSpinner = ({ color }) => (
  <Spinner style={{color: color}} animation="border" role="status">
    <span style={{color: color}} className="visually-hidden">Loading...</span>
  </Spinner>
);

export default CustomSpinner;
