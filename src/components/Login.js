import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });
      const user = res.data;

      if (typeof user === 'string') {
        setMessage(user);
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'ADMIN') navigate('/admin-dashboard');
      else if (user.role === 'OFFICER') navigate('/officer-dashboard');
      else navigate('/client-dashboard');
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null);
      setMessage(serverMessage || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        {message && <Alert severity="error" sx={{ mt: 2 }}>{message}</Alert>}
      </Box>
    </Container>
  );
}
