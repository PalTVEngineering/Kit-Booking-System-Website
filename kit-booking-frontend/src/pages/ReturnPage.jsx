import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { confirmReturn, findUserBookings, getBookingsAndKit } from "../services/api";

function ReturnPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ first_name: "", last_name: "" });
  const [bookingList, setBookingList] = useState([]);
  const [booking, setBooking] = useState(null);
  const [checkedKits, setCheckedKits] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Fetch all bookings for user
  const handleFindBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await findUserBookings({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      });
      setBookingList(res.data);
      //if only one booking, skip to step 3
      if (res.data.length == 1){
        const bookingRes = await(getBookingsAndKit({bookingId:res.data[0].id}));
        setBooking(bookingRes.data.booking);
        setStep(3); 
      }
      //otherwise go to step 2 to select a booking
      else{
        setStep(2);
      }
      } catch (err) {
        console.error("Error fetching bookings for user:", err);
        alert(err.response?.data?.error || "Could not find a booking for this name.");
      } finally {
        setLoading(false);
      }
  };

  //Step 2: Select a booking 
  const handleSelectBooking = async(bookingID)=>{
    setLoading(true);
    try{
      const res = await(getBookingsAndKit({bookingId:bookingID}));
      setBooking(res.data.booking);
      setStep(3)
    }catch(err){
      console.error("Error fetching booking data:", err);
    } finally{
      setLoading(false);
    }
  };
  
  // Step 3: Handle kit checklist
  const handleToggleKit = (kitId) => {
    setCheckedKits((prev) =>
      prev.includes(kitId)
        ? prev.filter((id) => id !== kitId)
        : [...prev, kitId]
    );
  };

  // Step 4: Confirm return
  const handleConfirmReturn = async () => {
    if (!booking?.id) {
      alert("No booking found to return.");
      return;
    }

    setLoading(true);
    try {
      await confirmReturn({ bookingId: booking.id });

      setCompleted(true);
    } catch (err) {
      console.error("Error confirming return:", err);
      alert(err.response?.data?.error || "Error confirming return.");
    } finally {
      setLoading(false);
    }
  };

  // UI rendering
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {!completed ? (
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          {/* Step 1: Enter Name */}
          {step === 1 && (
            <Box component="form" onSubmit={handleFindBooking}>
              <Typography variant="h5" gutterBottom fontWeight={600}>
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Find Booking"}
              </Button>
            </Box>
          )}
          {/* Step 2: Selecting a booking to return */}
          {step === 2 && bookingList && (
            <>
              <Typography variant="h6" gutterBottom>
                Choose a Booking
              </Typography>
              <List>
                <hr/>
                  {bookingList.map((bkg) => (
                    <ListItemButton
                      key={bkg.id}
                      onClick={() => handleSelectBooking(bkg.id)}
                      sx={{
                      borderRadius: 1,
                      mb: 1,
                    }}
                      >
                      <ListItemText>
                        Project: {bkg.project_title} <br />
                        Booking Date: {new Date(bkg.start_time).toLocaleDateString()} <br />
                        Time:{" "}
                        {new Date(bkg.start_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        →{" "}
                        {new Date(bkg.end_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </ListItemText>
                    </ListItemButton>
                  ))}
              </List>
            </>
          )}

          {/* Step 3: Checklist */}
          {step === 3 && booking && (
            <>
              <Typography variant="h6" gutterBottom>
                Kit to Return
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Booking Date: {new Date(booking.start_time).toLocaleDateString()} <br />
                Time:{" "}
                {new Date(booking.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                →{" "}
                {new Date(booking.end_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <List>
                {booking.kits.map((kit) => (
                  <ListItem
                    key={kit.id}
                    button
                    onClick={() => handleToggleKit(kit.id)}
                    sx={{
                      bgcolor: checkedKits.includes(kit.id)
                        ? "action.selected"
                        : "inherit",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox checked={checkedKits.includes(kit.id)} />
                    </ListItemIcon>
                    {/* UPDATED: Display the quantity if it's greater than 1 */}
                    <ListItemText
                      primary={`${kit.name}${kit.quantity > 1 ? ` (x${kit.quantity})` : ""}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
                disabled={
                  loading || checkedKits.length !== booking.kits.length
                }
                onClick={handleConfirmReturn}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Confirm Return"
                )}
              </Button>
            </>
          )}
        </Paper>
      ) : (
        // Step 4: Completed Screen
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Kit Return Complete ✅
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Thank you for returning your equipment!
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
            Your booking and user record have been safely removed from the system.
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default ReturnPage;