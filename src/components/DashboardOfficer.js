import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, TextField, Select, MenuItem, Button, Box
} from '@mui/material';

export default function DashboardOfficer() {
  const [birthInfos, setBirthInfos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');

  // Fetch all birth info
  const fetchBirthInfos = async () => {
    try {
      const res = await api.get('/api/birth/all');
      setBirthInfos(res.data);
    } catch (err) {
      console.error('Error fetching birth info:', err);
    }
  };

  // Start editing a specific row
  const handleEdit = (info) => {
    setEditingId(info.id);
    setStatus(info.status || '');
    setComment(info.comment || '');
  };

  // Save updated status and comment
  const handleUpdate = async (id) => {
    try {
      await api.put(`/api/birth/update-status/${id}`, {
        status,
        comment,
      });
      setEditingId(null);
      fetchBirthInfos();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  useEffect(() => {
    fetchBirthInfos();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Officer Dashboard</Typography>

      <Paper sx={{ mt: 3, overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Place of Birth</TableCell>
              <TableCell>Father’s Name</TableCell>
              <TableCell>Mother’s Name</TableCell>
              <TableCell>Address</TableCell>
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
