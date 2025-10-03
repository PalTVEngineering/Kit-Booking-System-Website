import {
    Box,
    Button,
    Checkbox,
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

function ReturnPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ first_name: "", last_name: "" });
  const [booking, setBooking] = useState(null);
  const [checkedKits, setCheckedKits] = useState([]);
  const [completed, setCompleted] = useState(false);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Fetch booking
  const handleFindBooking = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      "http://localhost:5000/api/returns/find-user-bookings",
      {
        first_name: formData.first_name,
        last_name: formData.last_name
      }
    );

    // now booking.kits exists
    setBooking(res.data.booking);
    setStep(2);
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Error finding booking.");
  }
  };


  // Step 2: Handle checklist
  const handleToggleKit = (kitId) => {
    setCheckedKits((prev) =>
      prev.includes(kitId) ? prev.filter((id) => id !== kitId) : [...prev, kitId]
    );
  };

  // Step 3: Confirm return
  const handleConfirmReturn = async () => {
    try {
      await axios.post("http://localhost:5000/api/returns/confirm-return", {
        bookingId: booking.id,
        user_id: booking.user_id,
      });
      setCompleted(true);
    } catch (err) {
      console.error(err);
      alert("Error confirming return.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {!completed ? (
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          {/* Step 1: Enter Name */}
          {step === 1 && (
            <Box component="form" onSubmit={handleFindBooking}>
              <Typography variant="h5" gutterBottom>
                Return Your Kit
              </Typography>
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Find Booking
              </Button>
            </Box>
          )}

          {/* Step 2: Checklist */}
          {step === 2 && booking && (
            <>
              <Typography variant="h6" gutterBottom>
                Kits to Return
              </Typography>
              <List>
                {booking.kits.map((kit) => (
                  <ListItem
                    key={kit.id}
                    button
                    onClick={() => handleToggleKit(kit.id)}
                  >
                    <ListItemIcon>
                      <Checkbox checked={checkedKits.includes(kit.id)} />
                    </ListItemIcon>
                    <ListItemText primary={kit.name} />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
                disabled={checkedKits.length !== booking.kits.length}
                onClick={handleConfirmReturn}
              >
                Confirm Return
              </Button>
            </>
          )}
        </Paper>
      ) : (
        // Step 4: Completed
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Kit Return Complete ✅
          </Typography>
          <Typography variant="body1">
            Thank you for returning your equipment!
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default ReturnPage;
