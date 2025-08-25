import BuildIcon from "@mui/icons-material/Build";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import WidgetsIcon from "@mui/icons-material/Widgets";
import {
  Button,
  Checkbox,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchKits } from "../services/api";


function HomePage() {
  const [kits, setKits] = useState([]);
  const [selectedKits, setSelectedKits] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchKits()
      .then((res) => setKits(res.data))
      .catch((err) => console.error("Error fetching kits:", err));
  }, []);

  const handleToggle = (id) => {
    setSelectedKits((prev) =>
      prev.includes(id) ? prev.filter((kitId) => kitId !== id) : [...prev, id]
    );
  };

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case "camera":
      case "cameras":
        return <CameraAltIcon />;
      case "equipment":
        return <BuildIcon />;
      case "misc":
        return <WidgetsIcon />;
      default:
        return <WidgetsIcon />;
    }
  };
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: isMobile ? 3 : 5, px: 2 }}>
      {/* Title */}
      <Typography
        variant={isMobile ? "h4" : "h3"}
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        PalTV Kit Booking System
      </Typography>

      {/* Subheading */}
      <Typography
        variant={isMobile ? "h6" : "h5"}
        gutterBottom
        sx={{ mt: isMobile ? 2 : 4 }}
      >
        What kit do you need?
      </Typography>

      {/* Kit List */}
      <Paper elevation={3} sx={{ mt: 2, borderRadius: 2 }}>
        <List>
          {kits.map((kit) => (
            <ListItem
              key={kit.id}
              button
              onClick={() => handleToggle(kit.id)}
              sx={{
                bgcolor: selectedKits.includes(kit.id)
                  ? "action.selected"
                  : "inherit",
                py: isMobile ? 1.5 : 2, // bigger touch area on mobile
              }}
            >
              <ListItemIcon sx={{ minWidth: isMobile ? 40 : 56 }}>
                {getIcon(kit.type)}
              </ListItemIcon>
              <ListItemText
                primary={kit.name}
                primaryTypographyProps={{
                  fontSize: isMobile ? "1rem" : "1.2rem",
                }}
              />
              <Checkbox
                edge="end"
                checked={selectedKits.includes(kit.id)}
                tabIndex={-1}
                disableRipple
                sx={{
                  "& .MuiSvgIcon-root": { fontSize: isMobile ? 20 : 28 }, // smaller/larger checkbox depending on screen
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Button
        type="button"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/booking", { state: { selectedKits: kits.filter(k => selectedKits.includes(k.id)) } })}
      >
        Proceed to Book
      </Button>

    </Container>
  );
}

export default HomePage;
