/**
 * AdminPortalPage.jsx
 * Author: Shawn Cui
 * Created: 2025-10-21
 * Description: Auth-protected Admin portal that fetches and displays current bookings.
 */

import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
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
import dayjs from 'dayjs';


// The API endpoint where bookings would normally be fetched from
// (right now I'm using mock data below for demo purposes)
const BOOKINGS_API = '/api/admin/bookings'; // e.g. '/api/bookings' or '/api/admin/bookings?status=current'

// Some fake bookings so we can see how the page looks without needing the backend yet.
// Each booking has a name, project name, time, and a list of kits booked.
const MOCK_BOOKINGS = [
  {
    id: 'BKG-1001',
    name: 'John Smith',
    projectName: 'Project Aurora',
    startTime: '2025-10-21T09:30:00Z',
    endTime: '2025-10-21T12:30:00Z',
    kits: [
      { id: 'KIT-1', name: 'Canon EOS R6', qty: 1 },
      { id: 'KIT-2', name: 'Manfrotto Tripod', qty: 1 },
      { id: 'KIT-3', name: 'LED Lighting Kit', qty: 2 },
    ],
  },
  {
    id: 'BKG-1002',
    name: 'Alice Wong',
    projectName: 'Student Promo',
    startTime: '2025-10-21T13:00:00Z',
    endTime: '2025-10-21T15:00:00Z',
    kits: [{ id: 'KIT-4', name: 'Sony A7 IV', qty: 1 }],
  },
  {
    id: 'BKG-1003',
    name: 'Dept. Physics',
    projectName: 'Lab Recording',
    startTime: '2025-10-22T08:00:00Z',
    endTime: '2025-10-22T17:00:00Z',
    kits: [
      { id: 'KIT-5', name: 'Zoom H6 Recorder', qty: 2 },
      { id: 'KIT-6', name: 'Shotgun Microphone', qty: 2 },
      { id: 'KIT-7', name: 'Gimbal Stabilizer', qty: 1 },
    ],
  },
  {
    id: 'BKG-1004',
    name: 'Tom Baker',
    projectName: null,
    startTime: '2025-10-23T10:00:00Z',
    kits: [{ id: 'KIT-8', name: 'GoPro HERO12', qty: 3 }],
  },
  {
    id: 'BKG-1005',
    name: 'Sara Lee',
    projectName: 'Course Demo',
    startTime: '2025-10-24T14:00:00Z',
    endTime: '2025-10-24T16:00:00Z',
    kits: [],
  },
];

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

  // --- Data fetching logic ---
  // This function will eventually call the real API.
  // For now, it's kept for future use when backend is ready.
  React.useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.get(BOOKINGS_API, { withCredentials: true });
      // Expecting an array of bookings. Each booking example shape:
      // { id, name, projectName, startTime, endTime, kits: [ { id, name, qty }, ... ] }
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setBookings(data);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        // Not authenticated; bounce to login
        navigate('/admin', { replace: true });
        return;
      }
      setError(e?.response?.data?.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);
// --- Simulate fetching data ---
  // We use mock data here with a small delay so it feels realistic.
  React.useEffect(() => {
    setTimeout(() => {
      setBookings(MOCK_BOOKINGS);
      setLoading(false);
    }, 500);
  }, []);

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
            // extract and normalize fields (some might come from different API keys)
            const name = b.name || b.userName || b.requester || 'Unknown';
            const project = b.projectName || b.project || '';
            const start = b.startTime || b.start || b.bookingTime || b.from;
            const end = b.endTime || b.end || b.to;
            const timeLabel = start
              ? end
                ? `${dayjs(start).format('YYYY-MM-DD HH:mm')} → ${dayjs(end).format('YYYY-MM-DD HH:mm')}`
                : dayjs(start).format('YYYY-MM-DD HH:mm')
              : 'Time: N/A';
            const kits = Array.isArray(b.kits) ? b.kits : (b.items || b.kit || []);

            return (
              <Accordion key={b.id || `${name}-${start}`} disableGutters sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {name} {project ? `– ${project}` : ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {timeLabel}
                    </Typography>
                  </Box>
                </AccordionSummary>
                {/* When you click the booking, this expands to show what kits were booked. */}
                <AccordionDetails>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Kit booked
                  </Typography>
                  {kits && kits.length > 0 ? (
                    <List dense disablePadding>
                      {kits.map((k, idx) => (
                        <React.Fragment key={k.id || idx}>
                          <ListItem>
                            <ListItemIcon>
                              <Inventory2Icon />
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
