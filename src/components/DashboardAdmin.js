import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Container, Typography, TextField, Button, Table, TableBody,
  TableCell, TableHead, TableRow, Paper, Box
} from '@mui/material';

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const handleCreateOfficer = async () => {
    try {
      const res = await api.post('/api/admin/create-officer', newUser);
      setMessage(res.data);
      setNewUser({ fullName: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      setMessage('Failed to create officer');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await api.delete(`/api/admin/delete-user/${id}`);
      setMessage(res.data);
      fetchUsers();
    } catch (err) {
      setMessage('Delete failed');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Create Officer Account</Typography>
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={newUser.fullName}
          onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleCreateOfficer}>
          Create Officer
        </Button>
        {message && <Typography sx={{ mt: 2 }} color="secondary">{message}</Typography>}
      </Box>

      <Typography variant="h6">User Accounts</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
