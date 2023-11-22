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
import NotFound from "../../pages/NotFound/NotFound";
import CustomToast from "../CustomToast/CustomToast";

function App() {

  const [props, setProps] = useState({});
  const [toastDetails, setToastDetails] = useState({
    initMessage: null,
    color: "blue"
  });

  useEffect(() => {
    const getUserDetails = async () => {
      let error, response;
      if (getAuthToken()) {
        ({ error, response } = await get(GET_USER));
      }
      if (!error) {
        setProps(response.data);
      } else {
        setProps({});
      }
    };

    const handleUpdateUser = () => {
      getUserDetails();
    };
    const handleToast = (event) => {
      setToastDetails(event.detail);
    }

    getUserDetails();

    document.addEventListener("userUpdate", handleUpdateUser);
    document.addEventListener("setToast", handleToast);
    return () => {
      document.removeEventListener("userUpdate", handleUpdateUser);
      document.removeEventListener("setToast", handleToast);
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CustomToast {...toastDetails} />
      </div>
    </Router>
  );
}

export default App;
