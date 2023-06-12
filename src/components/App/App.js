import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "../../pages/Home/Home";
import Chat from "../../pages/Chat/Chat";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/chat" element={<Chat />}></Route>
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
