import React, { useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FileUpload.css";

import { useNavigate } from "react-router-dom";
import { uploadFileToApi } from "../../services/fileUploadService";

import Spinner from "../Spinner/spinner";
import * as Icon from "react-feather";
import { MAIN_APP_URL } from "../../constants/apiConstants";
import ErrorToast from "../../components/ErrorToast/ErrorToast";

const FileUpload = () => {
  const { acceptedFiles } = useDropzone();
  const navigate = useNavigate();
  const fileItems = acceptedFiles.map((file, index) => (
    <li key={index}>{file.name}</li>
  ));
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [errorToastMessage, setErrorToastMessage_] = useState(null);
  const [errorToastColor, setErrorToastColor] = useState("danger");
  const setErrorToastMessage = (msg, color = "danger") => {
    setErrorToastMessage_(msg);
    setErrorToastColor(color);
  };

  const fileInputOnChange = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newuploadedFile = acceptedFiles[0];
      setIsProcessingDocument(true);
      document.body.style.pointerEvents = "none";
      try {
        const response = await uploadFileToApi(newuploadedFile);
        if (response && response.data && response.data.id) {
          console.log(response);
          setIsProcessingDocument(false);
          document.body.style.pointerEvents = "auto";
          navigate(MAIN_APP_URL + "/" + String(response.data.id));
        } else {
          setErrorToastMessage("Failed to upload to server");
          setIsProcessingDocument(false);
          document.body.style.pointerEvents = "auto";
        }
      } catch (e) {
        console.error(e);
        setErrorToastMessage("Failed to upload to server");
        setIsProcessingDocument(false);
        document.body.style.pointerEvents = "auto";
      }
    }
  };

  return (
    <Dropzone onDrop={(acceptedFiles) => fileInputOnChange(acceptedFiles)}>
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
                <ul>{fileItems}</ul>
              </>
            )}
          </div>
          <ErrorToast
            message={errorToastMessage}
            setMessage={setErrorToastMessage}
            color={errorToastColor}
          />
        </section>
      )}
    </Dropzone>
  );
};

export default FileUpload;
