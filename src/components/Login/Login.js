import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_OAUTH } from "../../constants/apiConstants";
import { post } from "../../components/Api/api";
import updateUser from "../../utils/updateUser";
import { setAuthToken } from "../../services/userServices";

const useLogin = () =>
  useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      let loginResponse = codeResponse;
      let data = { access_token: loginResponse.access_token };
      const config = { headers: { "Content-Type": "application/json" } };
      const response = await post(GOOGLE_OAUTH, data, config);
      console.log(response);
      setAuthToken(response.data?.token);
      updateUser();
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

export default useLogin;
