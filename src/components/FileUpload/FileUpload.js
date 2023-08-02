import React, { useEffect, useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FileUpload.css";
import uploadIcon from "../../images/upload.svg";

import { useNavigate } from "react-router-dom";
import { uploadFileToApi } from "../../services/fileUploadService";

const FileUpload = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const navigate = useNavigate();
  const fileItems = acceptedFiles.map((file, index) => (
    <li key={index}>{file.name}</li>
  ));

  const [uploadedUrl, setuploadedUrl] = useState("");
  const [uploadedFile, setuploadedFile] = useState(null);

  const fileInputOnChange = async (acceptedFiles) => {
    // const acceptedFiles = e.target.files;
    if (acceptedFiles.length > 0) {
      const newuploadedFile = acceptedFiles[0];
      setuploadedUrl(URL.createObjectURL(newuploadedFile));
      setuploadedFile(newuploadedFile);
      const response = await uploadFileToApi(newuploadedFile);
      if (response && response.data && response.data.id) {
        console.log(response);
        navigate("/chat/" + String(response.data.id));
      }
    }
  };

  return (
    <Dropzone onDrop={(acceptedFiles) => fileInputOnChange(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div className="file-upload-box" {...getRootProps()}>
            <input {...getInputProps()} />
            <img
              src={uploadIcon}
              alt="Upload Icon"
              className="upload-icon pt-1"
            />
            <p className="d-none d-sm-block small pt-2">
              Drag and drop PDF here, or click to select
            </p>
            <p className="d-sm-none small">Click to upload PDF</p>
            <ul>{fileItems}</ul>
          </div>
        </section>
      )}
    </Dropzone>
  );
};

export default FileUpload;
