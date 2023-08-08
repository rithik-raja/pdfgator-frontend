import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GET_USER } from "../../constants/apiConstants";
import { get } from "../Api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "../../pages/Home/Home";
import Chat from "../../pages/Chat/Chat";
import Success from "../../pages/Stripe/Success";
import { getAuthToken } from "../../services/userServices";

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
          <Route exact path="/chat" element={<Chat {...props} />}></Route>
          <Route path="/chat/*">
            <Route path=":pdfid" element={<Chat {...props} />}></Route>
          </Route>

          <Route exact path="/success" element={<Success />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
