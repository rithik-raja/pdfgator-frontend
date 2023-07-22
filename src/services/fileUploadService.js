import { post } from "../components/Api/api";
import { SET_FILES } from "../constants/apiConstants";
import { getSessionId } from "./sessionService";
import { getUserLoggedIn } from "./userServices";

export const uploadFileToApi = async (newuploadedFile) => {
  const formData = new FormData();
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  formData.append("file_name", newuploadedFile.name);
  formData.append("file_path", newuploadedFile);
  formData.append("type", newuploadedFile.type);
  formData.append("size", newuploadedFile.size);
  formData.append("session_id", getSessionId());
  formData.append("is_loggedin_user", getUserLoggedIn());
  formData.append("created_by", 0);
  const response = await post(SET_FILES, formData, config);
  return response;
};
