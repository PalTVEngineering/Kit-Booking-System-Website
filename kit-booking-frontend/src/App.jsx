import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BookingPage from "./pages/BookingPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import FinishBookingPage from "./pages/FinishBookingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import KitSelectionPage from "./pages/KitSelectionPage.jsx";
import ReturnPage from "./pages/ReturnPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kitSelection" element={<KitSelectionPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/finish" element={<FinishBookingPage />} />
        <Route path="/confirmed" element={<ConfirmationPage />} />
        <Route path="/return" element={<ReturnPage />} />
      </Routes>
    </Router>
  );
}

export default App;
