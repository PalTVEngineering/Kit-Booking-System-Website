import { Box, Button, Container, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: isMobile ? 4 : 8, textAlign: "center" }}>
      {/* Title */}
      <Typography
        variant={isMobile ? "h4" : "h3"}
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        PalTV Kit Booking System
      </Typography>

      {/* Subheading */}
      <Typography
        variant={isMobile ? "h6" : "h5"}
        gutterBottom
        sx={{ mb: isMobile ? 3 : 5, color: "text.secondary" }}
      >
        What would you like to do?
      </Typography>

      {/* Buttons */}
      <Box display="flex" flexDirection="column" gap={3}>
        <Button
          variant="contained"
          color="primary"
          size={isMobile ? "medium" : "large"}
          onClick={() => navigate("/kitSelection")}
        >
          Book Kit
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          size={isMobile ? "medium" : "large"}
          onClick={() => navigate("/return")}
        >
          Return Kit
        </Button>
      </Box>
    </Container>
  );
}

export default HomePage;
