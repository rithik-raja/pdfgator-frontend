import React from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_OAUTH } from "../../constants/apiConstants";
import { post } from "../../components/Api/api";
import Cookies from "js-cookie";
import "./Login.css";
import * as Icon from "react-feather";
import updateUser from "../../utils/updateUser";


const useLogin = () => (
  useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      let loginResponse = codeResponse;
      let data = { access_token: loginResponse.access_token };
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await post(GOOGLE_OAUTH, data, config);
      console.log(response);
      Cookies.set("authtok", response.data.token, {expires: 7});
      updateUser()
    },
    onError: () => {
      console.log("Login Failed");
    },
  })
)

export default useLogin;
