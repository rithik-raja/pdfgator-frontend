import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { get } from "../Api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "../../pages/Home/Home";
import Chat from "../../pages/Chat/Chat";
import Success from "../../pages/Stripe/Success";
import Cookies from "js-cookie";

function App() {

  const [props, setProps] = useState({
    onMessage: (data) => setProps(data)
  })
  useEffect(() => {
    const getUserDetails = async () => {
      let res
      if (Cookies.get("authtok")) {
        res = await get("api/getuser/")
      }
      if (res) {
        setProps(res.data)
      }
    }
    const handleUpdateUser = () => {getUserDetails()}

    getUserDetails()
    document.addEventListener("userUpdate", handleUpdateUser)

    return () => {document.removeEventListener("userUpdate", handleUpdateUser)}
  }, [])
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home {...props} />}></Route>
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
