import BuildIcon from "@mui/icons-material/Build";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ExtensionIcon from "@mui/icons-material/Extension";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addUsers } from "../services/api";

function FinishBookingPage() {
  const location = useLocation();
  const { bookingData } = location.state || {}; // booking info + selectedKits
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Create user
      const userRes = await addUsers(formData);
      const userId = userRes.data.id;

      // 2. Send booking (kits handled later in booking_kits table)
      const bookingPayload = {
        user_id: userId,
        start_time: `${bookingData.date} ${bookingData.start_time}:00`, // "2025-08-25 09:00:00"
        end_time: `${bookingData.date} ${bookingData.end_time}:00`,     // "2025-08-25 17:00:00"
        email: formData.email,
        kits: bookingData.kits,
      };

      await axios.post("http://localhost:5000/api/bookings/create", bookingPayload);

      navigate("/confirmed")
    } catch (error) {
      console.error(error);
      alert("Error confirming booking.");
    }
  };

  // Choose icon for kit type
  const getKitIcon = (type) => {
    switch (type) {
      case "camera":
        return <CameraAltIcon />;
      case "equipment":
        return <BuildIcon />;
      default:
        return <ExtensionIcon />; // misc
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" align="center" gutterBottom sx={{ mt: 5 }}>
        Confirm Your Booking
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
        {/* Booking Summary */}
        <Typography variant="h6" gutterBottom>
          Selected Kits
        </Typography>
        <List>
          {bookingData?.kits?.length ? (
            bookingData.kits.map((kit) => (
              <ListItem key={kit.id}>
                <ListItemIcon>{getKitIcon(kit.type)}</ListItemIcon>
                <ListItemText primary={kit.name} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No kits selected.
            </Typography>
          )}
        </List>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Booking Date & Time
        </Typography>
        <Typography>
          {bookingData?.date} | {bookingData?.start_time} → {bookingData?.end_time}
        </Typography>

        {/* User Details Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            type="email"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Confirm Booking
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default FinishBookingPage;
