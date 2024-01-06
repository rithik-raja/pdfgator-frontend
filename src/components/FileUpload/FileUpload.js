import React, { useState } from "react";
import Dropzone from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FileUpload.css";

import { useNavigate } from "react-router-dom";
import { uploadFileToApi } from "../../services/fileUploadService";
import PricingModal from "../PricingModal/PricingModal";

import Spinner from "../Spinner/spinner";
import * as Icon from "react-feather";
import { MAIN_APP_URL } from "../../constants/apiConstants";
import {
  FREE_PLAN_MAX_FILE_SIZE,
  PAID_PLAN_MAX_FILE_SIZE,
} from "../../constants/storageConstants";
import { displayToast } from "../CustomToast/CustomToast";

const FileUpload = (props) => {
  const navigate = useNavigate();

  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [pricingModalShow, setPricingModalShow] = useState(false);

  const fileInputOnChange = async (acceptedFiles) => {
    const plan = props?.stripeDetails?.find(
      (ele) => ele.is_plan_canceled === false
    );
    if (acceptedFiles.length > 0) {
      if (
        acceptedFiles[0].size >
        1024 *
          1024 *
          (plan?.is_plan_canceled === false
            ? PAID_PLAN_MAX_FILE_SIZE
            : FREE_PLAN_MAX_FILE_SIZE)
      ) {
        displayToast("The selected file is either too large or in an invalid format.", "danger");
        setPricingModalShow(true);
        return;
      }
      const newuploadedFile = acceptedFiles[0];
      setIsProcessingDocument(true);
      document.body.style.pointerEvents = "none";
      try {
        const { error, response } = await uploadFileToApi(
          newuploadedFile,
          props,
          false
        );
        if (!error) {
          setIsProcessingDocument(false);
          document.body.style.pointerEvents = "auto";
          navigate(MAIN_APP_URL + "/" + String(response.data.id));
        } else {
          setIsProcessingDocument(false);
          document.body.style.pointerEvents = "auto";
          if (response.status === 429) {
            displayToast("Usage limit exceeded", "danger");
            setPricingModalShow(true);
          } else {
            displayToast(response.data.detail ?? "Failed to upload file", "danger");
            console.error(response.data.detail)
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
          if (fileRejections.length) {
            displayToast("File type must be 'pdf'", "danger");
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
                  <Icon.Upload color="rgb(70, 70, 70)" />
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
      {pricingModalShow && (
        <PricingModal
          show={pricingModalShow}
          onHide={() => setPricingModalShow(false)}
          email={props.email}
          stripeDetails={props.stripeDetails}
        />
      )}
    </>
  );
};

export default FileUpload;
