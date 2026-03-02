import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  Container,
  Box,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// ----- page components -----
import Welcome from './components/Welcome';
import Register from './components/Register';
import Login from './components/Login';
import DashboardClient from './components/DashboardClient';
import DashboardOfficer from './components/DashboardOfficer';
import DashboardAdmin from './components/DashboardAdmin';

// ----- optional: custom theme -----
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // blue
    secondary: { main: '#ffa000' }, // amber
  },
});

function App() {
  const currentUser = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* ---------- NAVBAR ---------- */}
        <AppBar position="static">
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  flexGrow: 1,
                  fontWeight: 'bold',
                }}
              >
                eBirth Certificate Verification
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {!currentUser ? (
                  <>
                    <Button color="inherit" component={Link} to="/register">
                      Register
                    </Button>
                    <Button color="inherit" component={Link} to="/login">
                      Login
                    </Button>
                  </>
                ) : (
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* ---------- ROUTES ---------- */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboards */}
          <Route path="/client-dashboard" element={<DashboardClient />} />
          <Route path="/officer-dashboard" element={<DashboardOfficer />} />
          <Route path="/admin-dashboard" element={<DashboardAdmin />} />

          {/* Fallback for unknown routes */}
          <Route
            path="*"
            element={
              <Container sx={{ mt: 10, textAlign: 'center' }}>
                <Typography variant="h3">404 – Page Not Found</Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 3 }}
                  component={Link}
                  to="/"
                >
                  Go Home
                </Button>
              </Container>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
