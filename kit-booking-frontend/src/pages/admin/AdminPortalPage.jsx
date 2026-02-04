/**
 * AdminPortalPage.jsx
 * Author: Shawn Cui
 * Created: 2025-10-21
 * Description: Auth-protected Admin portal that fetches and displays current bookings.
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LightModeIcon from "@mui/icons-material/LightMode";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { adminBookings } from "../../services/api";
import { deleteBooking } from "../../services/api";


// The API endpoint where bookings would normally be fetched from
// (right now I'm using mock data below for demo purposes)

// Some fake bookings so we can see how the page looks without needing the backend yet.
// Each booking has a name, project name, time, and a list of kits booked.
// const MOCK_BOOKINGS = [
//   {
//     id: 'BKG-1001',
//     name: 'John Smith',
//     projectName: 'Project Aurora',
//     startTime: '2025-10-21T09:30:00Z',
//     endTime: '2025-10-21T12:30:00Z',
//     kits: [
//       { id: 'KIT-1', name: 'Canon EOS R6', qty: 1 },
//       { id: 'KIT-2', name: 'Manfrotto Tripod', qty: 1 },
//       { id: 'KIT-3', name: 'LED Lighting Kit', qty: 2 },
//     ],
//   },
//   {
//     id: 'BKG-1002',
//     name: 'Alice Wong',
//     projectName: 'Student Promo',
//     startTime: '2025-10-21T13:00:00Z',
//     endTime: '2025-10-21T15:00:00Z',
//     kits: [{ id: 'KIT-4', name: 'Sony A7 IV', qty: 1 }],
//   },
//   {
//     id: 'BKG-1003',
//     name: 'Dept. Physics',
//     projectName: 'Lab Recording',
//     startTime: '2025-10-22T08:00:00Z',
//     endTime: '2025-10-22T17:00:00Z',
//     kits: [
//       { id: 'KIT-5', name: 'Zoom H6 Recorder', qty: 2 },
//       { id: 'KIT-6', name: 'Shotgun Microphone', qty: 2 },
//       { id: 'KIT-7', name: 'Gimbal Stabilizer', qty: 1 },
//     ],
//   },
//   {
//     id: 'BKG-1004',
//     name: 'Tom Baker',
//     projectName: null,
//     startTime: '2025-10-23T10:00:00Z',
//     kits: [{ id: 'KIT-8', name: 'GoPro HERO12', qty: 3 }],
//   },
//   {
//     id: 'BKG-1005',
//     name: 'Sara Lee',
//     projectName: 'Course Demo',
//     startTime: '2025-10-24T14:00:00Z',
//     endTime: '2025-10-24T16:00:00Z',
//     kits: [],
//   },
// ];

// This is the main React component for the admin portal.
// It handles loading, displaying, and (eventually) fetching bookings.
export default function AdminPortalPage() {
  const navigate = useNavigate();
  // --- State management ---
  // bookings: holds our booking list
  // loading: shows a spinner when data is loading
  // error: holds any error messages from API or mock
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  console.log(localStorage.getItem('adminToken'));
  // --- Data fetching logic ---
  // This function will eventually call the real API.
  // For now, it's kept for future use when backend is ready.
  const fetchBookings = React.useCallback(async () => {
    setError('');
    setLoading(true);

    try {
      const res = await adminBookings();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setBookings(data);
    } catch (e) {
      // If unauthorized, redirect to login
      if (e.response.status === 401) {
        navigate('/admin');
      }
      console.error('Fetch error:', e);
      setError(e?.response?.data?.error || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleDeleteBooking = async (bookingId) => {
    try {
      // booking is of the form "BKG-123", we need to extract the numeric ID for the API call
      let id = bookingId.split("-")[1];
      id = parseInt(id, 10);
      // remove it from the UI 
      document.getElementById(bookingId).style.display = "none";
      // delete from DB
      await deleteBooking({ bookingId: id });
    } catch (e) {
      console.error("Error while deleting booking:", e);
      return;
    }
  }

  // 🔹 Load data on mount
  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);
  const getIcon = (type) => {
      if (type.toLowerCase().includes("camera")) return <CameraAltIcon />;
      if (type.toLowerCase().includes("sound")) return <MusicNoteIcon />;
      if (type.toLowerCase().includes("light")) return <LightModeIcon />;
      return <BuildIcon />;
    };
  // --- Loading state ---
  if (loading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
    );
  }

  // --- Error state ---
  if (error) {
    return (
        <Box sx={{ p: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
    );
  }

  // --- UI layout ---
  // Displays the booking list in accordions.
  // Each booking shows name, project, time, and can be expanded to show kits.
  return (
    <Box sx={{ p: 3, maxWidth: 960, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Current Bookings
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={22} />
          <Typography variant="body1">Loading bookings…</Typography>
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && bookings.length === 0 && (
        <Alert severity="info">No current bookings.</Alert>
      )}

      {!loading && !error && bookings.length > 0 && (
        <Box>
          {bookings.map((b) => {
            // extract and normalise fields (some might come from different API keys)
            const name = b.name || b.userName || b.requester || 'Unknown';
            const project = b.projectName || b.project || '';
            const start = b.startTime || b.start || b.bookingTime || b.from;
            const end = b.endTime || b.end || b.to;
            const timeLabel = start
              ? end
                ? `${dayjs(start).format('YYYY-MM-DD HH:mm')} → ${dayjs(end).format('YYYY-MM-DD HH:mm')}`
                : dayjs(start).format('YYYY-MM-DD HH:mm')
              : 'Time: N/A';
            const status = b.status || "unknown";
            const kits = Array.isArray(b.kits) ? b.kits : (b.items || b.kit || []);
            console.log('Bookings:', bookings);
            let colour = "#000000";
            // Set colour based on status of booking
            switch (status.toLowerCase()) {
              case "active":
                colour = "#1619db";
                break;
              case "closed(good)":
                colour = "#25ae55";
                break;
              case "closed(missing)":
                colour = "#db1616";
                break;
            }
            return (
              <Accordion id={b.id} key={b.id || `${name}-${start}`} disableGutters sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Grid container spacing={1} sx = {{ width: 1}}>
                    <Grid size={9}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {name} {project ? `– ${project}` : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {timeLabel}
                        </Typography>
                        <Typography variant="body2"  color={colour}>
                          Status: {status}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 3 }}>
                      {/* Delete button for each booking */}
                      <IconButton
                        component="div"
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBooking(b.id);
                        }}
                        color="error"
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                {/* When you click the booking, this expands to show what kits were booked. */}
                <AccordionDetails>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Kit booked:
                  </Typography>
                  {kits && kits.length > 0 ? (
                    <List dense disablePadding>
                      {kits.map((k, idx) => (
                        <React.Fragment key={k.id || idx}>
                          <ListItem>
                            <ListItemIcon>
                              {getIcon(k.type) || <Inventory2Icon />}
                            </ListItemIcon>
                            <ListItemText
                              primary={k.name || k.title || 'Unnamed kit'}
                              secondary={
                                k.qty ? `Qty: ${k.qty}` : (k.quantity ? `Qty: ${k.quantity}` : undefined)
                              }
                            />
                          </ListItem>
                          {idx < kits.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No kit items found for this booking.
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
