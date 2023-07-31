import React from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_OAUTH } from "../../constants/apiConstants";
import { post } from "../../components/Api/api";
import "./Login.css";
import * as Icon from "react-feather";
const Login = () => {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      let loginResponse = codeResponse;
      let data = { access_token: loginResponse.access_token };
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await post(GOOGLE_OAUTH, data, config);
      console.log(response);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  return (
    <>
      <div className="login mt-4">
        <button className="login-button" onClick={() => login()}>
          Sign in to save your files
        </button>
      </div>
      {/* <button onClick={() => login()}>Log In Using Google</button>
     
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      /> */}
    </>
  );
};

export default Login;
