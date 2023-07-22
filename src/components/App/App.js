import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "../../pages/Home/Home";
// import Chat from "../Pdf1/Pdf1";
import Chat from "../../pages/Chat/Chat";
import Success from "../../pages/Stripe/Success";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="/chat/*">
              <Route path=":pdfid" element={<Chat />}></Route>
            </Route>

            <Route exact path="/success" element={<Success />}></Route>
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
