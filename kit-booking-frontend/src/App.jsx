import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BookingPage from "./pages/BookingPage.jsx"; // we'll make this
import HomePage from "./pages/HomePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/confirm" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
