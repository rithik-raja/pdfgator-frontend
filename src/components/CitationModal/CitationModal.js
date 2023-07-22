import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./CitationModal.css";
export default function CitationModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Generate Citation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <Form>
              <div className="mt-2">
                <label>Choose Format</label>
                <Form.Select aria-label="Default select example">
                  <option value="1">APA</option>
                  <option value="2">MLA</option>
                  <option value="3">Chicago/Turabian</option>
                  <option value="3">IEEE</option>
                </Form.Select>
              </div>
              <div className="mt-2">
                <label>Select your sources</label>
                <div className="mt-2 source-container">
                  <Form.Check type="checkbox" label="source 1" />
                  <Form.Check type="checkbox" label="source 2" />
                  <Form.Check
                    type="checkbox"
                    label="source3333333333333333333333333"
                  />
                  <Form.Check type="checkbox" label="sourcehjh" />
                </div>
              </div>
            </Form>
            <button type="button" class="mt-4 btn btn-primary">
              Generate
            </button>
          </div>
          <div className="col-md-6">
            <div>
              <div>Citation</div>
              <div className="citation-result">Result</div>
            </div>
            <div>
              <div>References</div>
              <div className="references-result mb-2">Result</div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
