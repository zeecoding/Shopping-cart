'use client';
import { useState, useEffect } from 'react';
import API from '@/utils/api';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogContent, TextField, DialogTitle, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: '', description: '' });
  const [editId, setEditId] = useState<string | null>(null);

  const fetchProducts = () => API.get('/products').then(res => setProducts(res.data));

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.put(`/products/${editId}`, formData);
      } else {
        await API.post('/products', formData);
      }
      setOpen(false);
      setFormData({ name: '',HP: '', stock: '', category: '', description: '', price: '' });
      setEditId(null);
      fetchProducts();
    } catch (error) {
      alert("Error saving product");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await API.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  const handleEdit = (product: any) => {
    setFormData(product);
    setEditId(product._id);
    setOpen(true);
  };

  return (
    <div>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add New Product
      </Button>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((row: any) => (
              <TableRow key={row._id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>${row.price}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.stock} 
                    color={row.stock < 10 ? 'error' : 'success'} 
                    variant="outlined" 
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(row)} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(row._id)} color="error"><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Name" fullWidth value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <TextField margin="dense" label="Description" fullWidth value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <TextField margin="dense" label="Price" type="number" fullWidth value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
          <TextField margin="dense" label="Stock" type="number" fullWidth value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
          <TextField margin="dense" label="Category" fullWidth value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}