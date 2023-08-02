import { post } from "../components/Api/api";
import { SET_FILES } from "../constants/apiConstants";
import { getSessionId } from "./sessionService";

export const uploadFileToApi = async (newuploadedFile, props) => {
  const formData = new FormData();
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  formData.append("file_name", newuploadedFile.name);
  formData.append("file_path", newuploadedFile);
  formData.append("type", newuploadedFile.type);
  formData.append("size", newuploadedFile.size);
  formData.append("session_id", props?.email ? props.email : getSessionId());
  const response = await post(SET_FILES, formData, config);
  return response;
};
