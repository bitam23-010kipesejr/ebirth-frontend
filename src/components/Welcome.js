import React from 'react';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 15 }}>
      <Typography variant="h2" fontWeight="bold" gutterBottom color="primary">
        Welcome to eBirth
      </Typography>
      <Typography variant="h5" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
        Simplify Birth Certificate Verification
      </Typography>

      <Box>
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
