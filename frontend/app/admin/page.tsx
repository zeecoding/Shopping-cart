'use client';
import { useEffect, useState } from 'react';
import API from '@/utils/api';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    API.get('/analytics').then((res) => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <Typography>Loading Analytics...</Typography>;

  // Format data for Recharts
  const salesData = data.monthlySales.map((item: any) => ({
    name: `${item._id.month}/${item._id.year}`,
    Sales: item.sales,
    Orders: item.orders
  }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
      
      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">${data.kpi.totalRevenue.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h4">{data.kpi.totalOrders}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4">{data.kpi.totalProducts}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Sales Trends (Monthly)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Sales" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Top Products</Typography>
            {data.topProducts.map((p: any, i: number) => (
              <Box key={i} display="flex" justifyContent="space-between" mb={1} p={1} bgcolor="#f5f5f5" borderRadius={1}>
                <Typography>{p._id}</Typography>
                <Typography fontWeight="bold">${p.revenue}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}