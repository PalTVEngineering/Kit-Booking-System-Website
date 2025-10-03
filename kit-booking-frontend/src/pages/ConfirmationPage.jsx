import { Container, Paper, Typography } from "@mui/material";

function ConfirmationPage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          🎉 Booking Confirmed!
        </Typography>
        <Typography variant="body1">
          You should see a confirmation email in your inbox shortly.
        </Typography>
      </Paper>
    </Container>
  );
}

export default ConfirmationPage;
