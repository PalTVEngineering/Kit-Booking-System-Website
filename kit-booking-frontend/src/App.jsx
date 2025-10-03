import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BookingPage from "./pages/BookingPage.jsx"; // we'll make this
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/finish" element={<LandingPage />} />
        <Route path="/confirmed" element={<ConfirmationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
