import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { addUsers } from "../services/api";

function LandingPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const [userId, setUserId] = useState(null); // store user id for future booking

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addUsers(formData);
      setUserId(response.data.id);
      alert("User details saved successfully!");
      setFormData({ first_name: "", last_name: "", email: "" });
    } catch (error) {
      console.error(error);
      alert("Error saving user details.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" align="center" gutterBottom sx={{ mt: 5 }}>
        PalTV Kit Booking
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Enter Your Details
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
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

        {/* For now, just show the saved user id */}
        {userId && (
          <Typography sx={{ mt: 2 }} color="success.main">
            User saved! ID: {userId}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default LandingPage;
