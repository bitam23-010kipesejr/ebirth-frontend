import React, { useCallback, useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

export default function DashboardClient() {
  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    fatherName: '',
    motherName: '',
    address: '',
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [message, setMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const clientId = user?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!certificateFile) {
      setMessage('Please upload your birth certificate first.');
      return;
    }
    if (!clientId) {
      setMessage('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    const data = new FormData();
    data.append(
      'birthInfo',
      new Blob([JSON.stringify(form)], { type: 'application/json' })
    );
    data.append('certificate', certificateFile);

    try {
      const res = await api.post(
        `/api/birth/submit-with-certificate/${clientId}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
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
      setCertificateFile(null);
      fetchSubmissions();
    } catch (err) {
      const serverMessage = typeof err?.response?.data === 'string'
        ? err.response.data
        : 'Failed to submit birth info';
      setMessage(serverMessage);
    }
  };

  const fetchSubmissions = useCallback(async () => {
    if (!clientId) {
      setMessage('Session expired. Please login again.');
      navigate('/login');
      return;
    }
    const [clientRes, allRes] = await Promise.allSettled([
      api.get(`/api/birth/client/${clientId}`),
      api.get('/api/birth/all'),
    ]);

    if (clientRes.status === 'fulfilled') {
      const directItems = Array.isArray(clientRes.value?.data) ? clientRes.value.data : [];
      if (directItems.length > 0) {
        setSubmissions(directItems);
        setMessage('');
        return;
      }
    }

    if (allRes.status === 'fulfilled') {
      const allItems = Array.isArray(allRes.value?.data) ? allRes.value.data : [];
      setSubmissions(
        allItems.filter((item) => Number(item?.submittedById) === Number(clientId))
      );
      setMessage('');
      return;
    }

    const clientErr = clientRes.status === 'rejected' ? clientRes.reason : null;
    const allErr = allRes.status === 'rejected' ? allRes.reason : null;
    const serverMessage =
      (typeof clientErr?.response?.data === 'string' && clientErr.response.data) ||
      (typeof allErr?.response?.data === 'string' && allErr.response.data) ||
      'Failed to load your submissions.';
    setMessage(serverMessage);
    setSubmissions([]);
  }, [clientId, navigate]);

  const handleDownload = async (submissionId) => {
    if (!clientId) {
      setMessage('Session expired. Please login again.');
      navigate('/login');
      return;
    }
    try {
      const res = await api.get(`/api/birth/download/${submissionId}`, {
        params: { clientId },
        responseType: 'blob',
      });

      const contentType = res.headers['content-type'] || 'application/pdf';
      const disposition = res.headers['content-disposition'] || '';
      const matched = disposition.match(/filename="(.+)"/);
      const filename = matched?.[1] || `certified_birth_certificate_${submissionId}.pdf`;

      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const serverMessage = typeof err?.response?.data === 'string'
        ? err.response.data
        : 'Unable to download certificate right now.';
      setMessage(serverMessage);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Submit Birth Information
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        {[
          ['Full Name', 'fullName'],
          ['Date of Birth', 'dateOfBirth', 'date'],
          ['Place of Birth', 'placeOfBirth'],
          ['Father Name', 'fatherName'],
          ['Mother Name', 'motherName'],
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
            InputLabelProps={type === 'date' ? { shrink: true } : undefined}
          />
        ))}

        <Button variant="outlined" component="label" sx={{ mt: 2 }}>
          Upload Birth Certificate (PDF/JPG/PNG)
          <input
            type="file"
            hidden
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
          />
        </Button>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {certificateFile ? `Selected: ${certificateFile.name}` : 'No file selected'}
        </Typography>

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
              <TableCell>Place of Birth</TableCell>
              <TableCell>Father Name</TableCell>
              <TableCell>Mother Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Download</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.dateOfBirth}</TableCell>
                <TableCell>{item.placeOfBirth}</TableCell>
                <TableCell>{item.fatherName}</TableCell>
                <TableCell>{item.motherName}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{String(item.status || '').toUpperCase()}</TableCell>
                <TableCell>{item.comment || '-'}</TableCell>
                <TableCell>
                  {String(item.status || '').toUpperCase() === 'CERTIFIED' ? (
                    <Button variant="contained" size="small" onClick={() => handleDownload(item.id)}>
                      Download
                    </Button>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))}
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No submissions found for your account.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
