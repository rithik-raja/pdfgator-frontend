import { useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_OAUTH } from "../../constants/apiConstants";
import { post } from "../../components/Api/api";
import updateUser from "../../utils/updateUser";
import { setAuthToken } from "../../services/userServices";
import { displayToast } from "../CustomToast/CustomToast";

const useLogin = (loginCallBack = () => {}) =>
  useGoogleLogin({
    onSuccess: async (codeResponse) => {
      let loginResponse = codeResponse;
      let data = { access_token: loginResponse.access_token };
      const config = { headers: { "Content-Type": "application/json" } };
      const { error, response } = await post(GOOGLE_OAUTH, data, config, false);
      if (!error) {
        displayToast("Successfully logged in", "success");
        setAuthToken(response.data.token);
        updateUser();
        loginCallBack(true);
      } else {
        displayToast("Failed to log in", "danger");
        loginCallBack(false);
      }
    },
    onError: () => {
      displayToast("Failed to log in", "danger");
      loginCallBack(false);
    },
  });

export default useLogin;
