import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GET_USER, MAIN_APP_URL } from "../../constants/apiConstants";
import { get } from "../Api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "../../pages/Home/Home";
import Chat from "../../pages/Chat/Chat";
import Success from "../../pages/Stripe/Success";
import { getAuthToken } from "../../services/userServices";
import PrivacyPolicy from "../../pages/PrivacyPolicy/PrivacyPolicy";
import Failed from "../../pages/Stripe/Failed";

function App() {
  const [props, setProps] = useState({});
  useEffect(() => {
    const getUserDetails = async () => {
      let res;
      if (getAuthToken()) {
        res = await get(GET_USER);
      }
      if (res) {
        setProps(res?.data);
      } else {
        setProps({});
      }
    };
    const handleUpdateUser = () => {
      getUserDetails();
    };

    getUserDetails();
    document.addEventListener("userUpdate", handleUpdateUser);

    return () => {
      document.removeEventListener("userUpdate", handleUpdateUser);
    };
  }, []);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home {...props} />}></Route>
          <Route
            exact
            path={MAIN_APP_URL}
            element={<Chat {...props} />}
          ></Route>
          <Route path={`${MAIN_APP_URL}/*`}>
            <Route path=":pdfid" element={<Chat {...props} />}></Route>
          </Route>
          <Route
            exact
            path="/checkout/success"
            element={<Success {...props} />}
          ></Route>
          <Route
            exact
            path="/checkout/canceled"
            element={<Failed {...props} />}
          ></Route>
          <Route
            exact
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
