import React, { useState } from "react";
import Dropzone from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FileUpload.css";

import { useNavigate } from "react-router-dom";
import { uploadFileToApi } from "../../services/fileUploadService";
import ErrorToast from "../../components/ErrorToast/ErrorToast";
import PricingModal from "../PricingModal/PricingModal";

import Spinner from "../Spinner/spinner";
import * as Icon from "react-feather";
import { MAIN_APP_URL } from "../../constants/apiConstants";
import {
  FREE_PLAN_MAX_FILE_SIZE,
  PAID_PLAN_MAX_FILE_SIZE,
} from "../../constants/storageConstants";

const FileUpload = (props) => {
  const navigate = useNavigate();

  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState(null);
  const [pricingModalShow, setPricingModalShow] = useState(false);

  const fileInputOnChange = async (acceptedFiles) => {
    console.log(acceptedFiles);
    if (acceptedFiles.length > 0) {
      if (
        acceptedFiles[0].size >
        1024 *
          1024 *
          (props.is_plus_user
            ? PAID_PLAN_MAX_FILE_SIZE
            : FREE_PLAN_MAX_FILE_SIZE)
      ) {
        setErrorToastMessage(
          "The selected file is either too large or in an invalid format."
        );
        return;
      }
      const newuploadedFile = acceptedFiles[0];
      setIsProcessingDocument(true);
      document.body.style.pointerEvents = "none";
      try {
        const response = await uploadFileToApi(
          newuploadedFile,
          props,
          setErrorToastMessage
        );
        if (response && response.data && response.data.id) {
          console.log(response);
          setIsProcessingDocument(false);
          document.body.style.pointerEvents = "auto";
          navigate(MAIN_APP_URL + "/" + String(response.data.id));
        } else {
          setIsProcessingDocument(false);
          document.body.style.pointerEvents = "auto";
          if (response === 0) {
            setErrorToastMessage("File upload limit exceeded");
            setPricingModalShow(true);
          }
        }
      } catch (e) {
        console.error(e);
        setIsProcessingDocument(false);
        document.body.style.pointerEvents = "auto";
      }
    }
  };

  return (
    <>
      <Dropzone
        onDrop={(acceptedFiles, fileRejections) => {
          console.log(fileRejections);
          if (fileRejections.length) {
            setErrorToastMessage("File type must be 'pdf' ");
          }
          fileInputOnChange(acceptedFiles);
        }}
        accept={{
          "application/pdf": [".pdf"],
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div className="file-upload-box" {...getRootProps()}>
              {isProcessingDocument ? (
                <>
                  <Spinner />
                  <p className="small">Processing Document...</p>
                </>
              ) : (
                <>
                  <input {...getInputProps()} />
                  <Icon.Upload color="rgb(85, 85, 85)" />
                  <p className="d-none d-sm-block small pt-2">
                    Drag and drop PDF here, or click to select
                  </p>
                  <p className="d-sm-none small">Click to upload PDF</p>
                </>
              )}
            </div>
          </section>
        )}
      </Dropzone>
      <ErrorToast
        message={errorToastMessage}
        setMessage={setErrorToastMessage}
        color={"danger"}
      />
      <PricingModal
        show={pricingModalShow}
        onHide={() => setPricingModalShow(false)}
        email={props.email}
        stripeDetails={props.stripeDetails}
      />
    </>
  );
};

export default FileUpload;
