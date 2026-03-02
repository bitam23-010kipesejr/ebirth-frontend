import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Select, MenuItem, Button, Box, Alert
} from '@mui/material';

export default function DashboardOfficer() {
  const [birthInfos, setBirthInfos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchBirthInfos = async () => {
    try {
      const res = await api.get('/api/birth/all');
      setBirthInfos(res.data);
    } catch (err) {
      console.error('Error fetching birth info:', err);
    }
  };

  const handleEdit = (info) => {
    setEditingId(info.id);
    setStatus(info.status || '');
    setComment(info.comment || '');
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/api/birth/update-status/${id}`, {
        status,
        comment,
      });
      setMessage('Request updated successfully.');
      setEditingId(null);
      fetchBirthInfos();
    } catch (err) {
      const serverMessage = typeof err?.response?.data === 'string'
        ? err.response.data
        : 'Update failed';
      setMessage(serverMessage);
    }
  };

  const handleViewUploadedCertificate = async (id, fallbackName) => {
    try {
      const res = await api.get(`/api/birth/uploaded-certificate/${id}`, {
        responseType: 'blob',
      });

      const contentType = res.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const win = window.open(url, '_blank', 'noopener,noreferrer');

      if (!win) {
        const link = document.createElement('a');
        link.href = url;
        link.download = fallbackName || `uploaded_certificate_${id}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      setTimeout(() => window.URL.revokeObjectURL(url), 3000);
    } catch (err) {
      const serverMessage = typeof err?.response?.data === 'string'
        ? err.response.data
        : 'Unable to open uploaded certificate';
      setMessage(serverMessage);
    }
  };

  useEffect(() => {
    fetchBirthInfos();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Officer Dashboard</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

      <Paper sx={{ mt: 3, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Place of Birth</TableCell>
              <TableCell>Father Name</TableCell>
              <TableCell>Mother Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {birthInfos.map((info) => (
              <TableRow key={info.id}>
                <TableCell>{info.fullName}</TableCell>
                <TableCell>{info.dateOfBirth}</TableCell>
                <TableCell>{info.placeOfBirth}</TableCell>
                <TableCell>{info.fatherName}</TableCell>
                <TableCell>{info.motherName}</TableCell>
                <TableCell>{info.address}</TableCell>
                <TableCell>
                  {info.hasUploadedCertificate ? (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleViewUploadedCertificate(info.id, info.uploadedCertificateName)}
                    >
                      View Certificate
                    </Button>
                  ) : 'No'}
                </TableCell>

                <TableCell>
                  {editingId === info.id ? (
                    <Select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="CERTIFIED">Certified</MenuItem>
                      <MenuItem value="REJECTED">Rejected</MenuItem>
                    </Select>
                  ) : (
                    info.status
                  )}
                </TableCell>

                <TableCell>
                  {editingId === info.id ? (
                    <TextField
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      size="small"
                      fullWidth
                    />
                  ) : (
                    info.comment || '-'
                  )}
                </TableCell>

                <TableCell>
                  {editingId === info.id ? (
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdate(info.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => handleEdit(info)}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
