import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BookingPage from "./pages/BookingPage.jsx";
import ConfirmationPage from "./pages/ConfirmationPage.jsx";
import FinishBookingPage from "./pages/FinishBookingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import KitSelectionPage from "./pages/KitSelectionPage.jsx";
import ReturnPage from "./pages/ReturnPage.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";
import AdminPortalPage from "./pages/admin/AdminPortalPage.jsx";
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
        <Route path="/admin/*">
          <Route index element={<AdminLoginPage />} />
          <Route path="portal" element={<AdminPortalPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
