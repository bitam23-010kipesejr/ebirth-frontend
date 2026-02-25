import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Alert,
  Paper,
} from '@mui/material';

export default function DashboardClient() {
  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    fatherName: '',
    motherName: '',
    address: '',
  });
  const [message, setMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        `/api/birth/submit/${user.id}`,
        form
      );
      setMessage(res.data);
      setForm({
        fullName: '',
        dateOfBirth: '',
        placeOfBirth: '',
        fatherName: '',
        motherName: '',
        address: '',
      });
      fetchSubmissions();
    } catch (err) {
      setMessage('Failed to submit birth info');
    }
  };

  // ✅ Fetch submissions
  const fetchSubmissions = async () => {
    try {
      const res = await api.get(
        `/api/birth/client/${user.id}`
      );
      setSubmissions(res.data);
    } catch (err) {
      console.error('Error loading submissions');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Submit Birth Information
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        {[
          ['Full Name', 'fullName'],
          ['Date of Birth', 'dateOfBirth', 'date'],
          ['Place of Birth', 'placeOfBirth'],
          ['Father’s Name', 'fatherName'],
          ['Mother’s Name', 'motherName'],
          ['Address', 'address'],
        ].map(([label, name, type = 'text']) => (
          <TextField
            key={name}
            label={label}
            type={type}
            fullWidth
            margin="normal"
            value={form[name]}
            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
            required
          />
        ))}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>

      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

      <Typography variant="h5" gutterBottom>
        Your Submissions
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.dateOfBirth}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.comment || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
