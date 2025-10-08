import BuildIcon from "@mui/icons-material/Build";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LightModeIcon from "@mui/icons-material/LightMode";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchKits } from "../services/api";

function KitSelectionPage() {
  const [kits, setKits] = useState([]);
  const [selectedKits, setSelectedKits] = useState([]); // unique IDs for DB
  const [kitQuantities, setKitQuantities] = useState({}); // id → quantity chosen

  const navigate = useNavigate();

  useEffect(() => {
    fetchKits()
      .then((res) => setKits(res.data))
      .catch((err) => console.error("Error fetching kits:", err));
  }, []);

  // A simple change to manage both states at once
  const handleToggleKit = (kit) => {
    const kitId = kit.id;
    const isSelected = selectedKits.includes(kitId);

    // 1. Update the list of selected IDs
    setSelectedKits((prev) =>
      isSelected ? prev.filter((id) => id !== kitId) : [...prev, kitId]
    );

    // 2. Update the quantities object
    setKitQuantities((prev) => {
      const updated = { ...prev };
      if (isSelected) {
        // If it was selected, remove it
        delete updated[kitId];
      } else {
        // If it wasn't selected, add it with quantity 1
        updated[kitId] = { ...kit, quantity: 1 };
      }
      return updated;
    });
  };

  // Handle quantity selection for multi kits
  const handleQuantityChange = (kit, qty) => {
  // If quantity is greater than 0, update or add the kit
  if (qty > 0) {
    setKitQuantities((prev) => ({
      ...prev,
      [kit.id]: { ...kit, quantity: qty },
    }));
    // Ensure the ID is in the selectedKits array
    if (!selectedKits.includes(kit.id)) {
      setSelectedKits((prev) => [...prev, kit.id]);
    }
  } else {
    // If quantity is 0, remove the kit completely
    setSelectedKits((prev) => prev.filter((id) => id !== kit.id));
    setKitQuantities((prev) => {
      const updated = { ...prev };
      delete updated[kit.id];
      return updated;
    });
  }
};

  const getIcon = (type) => {
    if (type.toLowerCase().includes("camera")) return <CameraAltIcon />;
    if (type.toLowerCase().includes("sound")) return <MusicNoteIcon />;
    if (type.toLowerCase().includes("light")) return <LightModeIcon />;
    return <BuildIcon />;
  };

  const grouped = {
    Camera: {
      // UPDATED: This now correctly finds "Camera", "Camera (3)", etc.
      main: kits.filter(
        (k) =>
          k.type.startsWith("Camera") &&
          !k.type.includes("Equipment") &&
          !k.type.includes("Lens")
      ),
      equipment: kits.filter((k) => k.type.startsWith("Camera Equipment")),
      lens: kits.filter((k) => k.type === "Camera Lens"),
    },
    Sound: kits.filter((k) => k.type.toLowerCase().startsWith("sound")),
    Lighting: kits.filter((k) => k.type.toLowerCase().includes("lighting")),
  };


  const handleProceed = () => {
    // This is now simple and always correct
    const kitQuantitiesArray = Object.values(kitQuantities);

    navigate("/booking", {
      state: {
        kitQuantities: kitQuantitiesArray, // For email summary
      },
  });
};

  const renderKitItem = (kit) => {
    const match = kit.type.match(/\((\d+)\)/); // e.g. "Sound (3)"
    const maxQty = match ? parseInt(match[1], 10) : 1;

    return (
      <ListItem key={kit.id}>
        <ListItemIcon>{getIcon(kit.type)}</ListItemIcon>
        <ListItemText primary={kit.name} />
        {maxQty > 1 ? (
          <FormControl size="small" sx={{ width: 80 }}>
            <InputLabel>Qty</InputLabel>
            <Select
              value={kitQuantities[kit.id]?.quantity || ""}
              label="Qty"
              onChange={(e) => handleQuantityChange(kit, Number(e.target.value))}
            >
              <MenuItem value="">0</MenuItem>
              {[...Array(maxQty)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
        <Checkbox
          edge="end"
          checked={selectedKits.includes(kit.id)}
          // Pass the whole kit object, not just the ID
          onChange={() => handleToggleKit(kit)}
        />
        )}
      </ListItem>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Select Your Kits
      </Typography>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        {/* CAMERA */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">📷 Camera</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Main cameras first */}
            {grouped.Camera.main.length > 0 && (
              <List>{grouped.Camera.main.map(renderKitItem)}</List>
            )}

            {/* Subgroups */}
            <Accordion sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Camera Equipment</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>{grouped.Camera.equipment.map(renderKitItem)}</List>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Camera Lenses</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>{grouped.Camera.lens.map(renderKitItem)}</List>
              </AccordionDetails>
            </Accordion>
          </AccordionDetails>
        </Accordion>

        {/* SOUND */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">🎤 Sound</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>{grouped.Sound.map(renderKitItem)}</List>
          </AccordionDetails>
        </Accordion>

        {/* LIGHTING */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">💡 Lighting</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>{grouped.Lighting.map(renderKitItem)}</List>
          </AccordionDetails>
        </Accordion>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleProceed}
          disabled={Object.keys(kitQuantities).length === 0}
        >
          Proceed to Booking
        </Button>
      </Box>
    </Container>
  );
}

export default KitSelectionPage;
