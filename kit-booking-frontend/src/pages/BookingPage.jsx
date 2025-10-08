import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Kits and quantities from KitSelectionPage
  const { kitQuantities = [] } = location.state || {};

  const [date, setDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(dayjs().hour(9).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(17).minute(0));

  const handleProceed = () => {
  if (endTime.isBefore(startTime)) {
    alert("End time cannot be earlier than start time!");
    return;
  }


  const bookingData = {
    kitQuantities: kitQuantities,
    date: date.format("YYYY-MM-DD"),
    start_time: startTime.format("HH:mm"),
    end_time: endTime.format("HH:mm"),
  };

  navigate("/finish", { state: { bookingData } });
};

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Book Your Kit
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
        {/* Date and Time Pickers */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Select Date</Typography>
          <DatePicker
            label="Booking Date"
            value={date}
            format="DD/MM/YYYY"
            onChange={(newValue) => setDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Start Time</Typography>
          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            views={['hours', 'minutes']}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>End Time</Typography>
          <TimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            views={['hours', 'minutes']}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleProceed}
        >
          Finish Booking
        </Button>
      </Paper>
    </Container>
  );
}

export default BookingPage;
