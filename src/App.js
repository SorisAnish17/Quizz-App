import "./App.css";
import Home from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Hero from "./Components/Hero";
import RegisterPage from "./Components/RegisterPage";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hero/:userId" element={<Hero />} />
          <Route path="/home/:userId" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
