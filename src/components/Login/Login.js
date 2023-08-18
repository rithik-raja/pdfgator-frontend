import { useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_OAUTH } from "../../constants/apiConstants";
import { post } from "../../components/Api/api";
import updateUser from "../../utils/updateUser";
import { setAuthToken } from "../../services/userServices";

const useLogin = (setError, loginCallBack = () => {}) =>
  useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      let loginResponse = codeResponse;
      let data = { access_token: loginResponse.access_token };
      const config = { headers: { "Content-Type": "application/json" } };
      const response = await post(GOOGLE_OAUTH, data, config);
      if (response) {
        setAuthToken(response.data?.token);
        updateUser();
        loginCallBack(true);
      } else {
        setError("Failed to log in");
        loginCallBack(false);
      }
    },
    onError: () => {
      console.log("Login Failed");

      loginCallBack(false);
    },
  });

export default useLogin;
