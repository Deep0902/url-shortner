import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UrlShortner from "./components/UrlShortner/UrlShortner";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index path="/url" element={<UrlShortner />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
