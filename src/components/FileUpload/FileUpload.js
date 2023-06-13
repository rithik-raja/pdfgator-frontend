import React from 'react';
import { useDropzone } from 'react-dropzone';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FileUpload.css';
import uploadIcon from '../../images/upload.svg';

const FileUpload = () => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const fileItems = acceptedFiles.map((file, index) => (
    <li key={index}>{file.name}</li>
  ));

  return (
    <div className="file-upload-box" {...getRootProps()}>
      <input {...getInputProps()} />
      <img src={uploadIcon} alt="Upload Icon" className="upload-icon pt-1" />
      <p className="d-none d-sm-block small pt-2">Drag and drop PDF here, or click to select</p>
      <p className="d-sm-none small">Click to upload PDF</p>
      <ul>{fileItems}</ul>
    </div>
  );
};

export default FileUpload;
