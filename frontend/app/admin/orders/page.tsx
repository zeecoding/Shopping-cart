'use client';
import { useState, useEffect } from 'react';
import API from '@/utils/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Typography } from '@mui/material';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => API.get('/admin/orders').then(res => setOrders(res.data));

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status: newStatus });
      fetchOrders(); // Refresh to see changes
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Order Management</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order._id}>
                <TableCell>{order._id.substring(0, 8)}...</TableCell>
                <TableCell>{order.user?.email || 'Unknown'}</TableCell>
                <TableCell>{new Date(order.timestamp).toLocaleDateString()}</TableCell>
                <TableCell>${order.order_total}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    size="small"
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    sx={{
                      color: order.status === 'Pending' ? 'orange' : order.status === 'Paid' ? 'green' : 'blue',
                      fontWeight: 'bold'
                    }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}