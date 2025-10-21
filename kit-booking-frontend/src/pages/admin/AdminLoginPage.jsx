/****
 * AdminLoginPage.jsx
 * Author: Shawn Cui
 * Created: 2025-10-21
 * Description: Admin login page built with Material UI + Axios + React Router.
 */
import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// --- Mock admin credential (for local/dev demo) ---
const MOCK_ADMIN = {
  username: 'shawncui',
  password: '123456',
};

// This is the styled Card component that wraps the login form
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...(theme.palette?.mode === 'dark'
    ? {
        boxShadow:
          'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
      }
    : {}),
}));

// This sets up the main layout container for the page
const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100dvh',
  height: '100%',
  padding: theme.spacing(2),
  position: 'relative',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}));

export default function AdminLoginPage() {
  // Used to redirect after successful login
  const navigate = useNavigate();

  // Here we define all our state variables for form data and errors
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [usernameError, setUsernameError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Simple client-side validation for username and password
  const validate = () => {
    let valid = true;
    if (!username || username.trim().length < 3) {
      setUsernameError('Please enter a valid username (at least 3 characters).');
      valid = false;
    } else {
      setUsernameError('');
    }
    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  // Handles form submission and talks to the backend login API
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    // Quick local mock check: if using the demo credential, skip API and navigate
    if (username === MOCK_ADMIN.username && password === MOCK_ADMIN.password) {
      // simulate a tiny delay for UX consistency
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/admin/portal');
      }, 300);
      return;
    }

    try {
      setLoading(true);
      // TODO: adjust endpoint to match API repo
      const res = await axios.post('/api/admin/login', {
        username,
        password,
      });
      // Example: navigate to admin dashboard after success
      if (res.status >= 200 && res.status < 300) {
        navigate('/admin/portal');
      }
    } catch (e) {
      setSubmitError(e?.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // This is the page layout with Material UI components
  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="center" alignItems="stretch">
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            PalTV Admin Login
          </Typography>

          {/* If login fails, show an error alert here */}
          {submitError && <Alert severity="error">{submitError}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                id="username"
                type="text"
                name="username"
                placeholder="admin_user"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!usernameError}
                helperText={usernameError}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                type="password"
                name="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                sx={{ mb: 2 }}
              />
            </FormControl>


            {/* The Sign In button (shows loading spinner when logging in) */}
            <Button type="submit" fullWidth variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={22} /> : 'Sign in'}
            </Button>
          </Box>

        </Card>
      </SignInContainer>
    </>
  );
}
