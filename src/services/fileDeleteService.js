import { post } from "../components/Api/api";
import { SET_FILES } from "../constants/apiConstants";
import { getSessionId } from "./sessionService";

export const uploadFileToApi = async (newuploadedFile, props) => {
  const formData = new FormData();
  const session_id = getSessionId();
  if (!session_id) {
    throw new Error("No session ID")
  }
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  formData.append("file_name", newuploadedFile.name);
  formData.append("file_path", newuploadedFile);
  formData.append("type", newuploadedFile.type);
  formData.append("size", newuploadedFile.size);
  formData.append("session_id", session_id);
  const response = await post(SET_FILES, formData, config);
  console.log(response)
  return response;
};
