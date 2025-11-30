'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/utils/api';
import { setCookie } from 'cookies-next';
import { 
  Box, Button, TextField, Typography, Paper, Alert, Grid, InputAdornment, IconButton 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Register the user
      await API.post('/register', { 
        ...formData, 
        role: 'user' 
      });

      // 2. Auto-Login immediately using the same credentials
      const loginRes = await API.post('/login', {
        email: formData.email,
        password: formData.password
      });

      // 3. Store tokens and redirect
      setCookie('token', loginRes.data.token, { maxAge: 3600 });
      setCookie('role', loginRes.data.role, { maxAge: 3600 });

      if (loginRes.data.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/shop');
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ height: '100vh', width: '100%' }}>
      
      {/* LEFT SIDE: Visual (Fixed Layout Props) */}
      <Grid 
        item 
        xs={12} 
        md={6} 
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: { xs: 'none', md: 'block' } // Hide completely on mobile
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.3), rgba(15,23,42,0.9))',
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
        >
          <Typography variant="h3" color="white" fontWeight="bold" gutterBottom>
            Join the movement.
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)">
            Start your journey with SecureShop today.
          </Typography>
        </Box>
      </Grid>

      {/* RIGHT SIDE: Form */}
      <Grid item xs={12} md={6} component={Paper} elevation={0} square sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 4 }}>
        <Box sx={{ maxWidth: 450, mx: 'auto', width: '100%' }}>
          
          <Box mb={4}>
            <Typography variant="h4" gutterBottom color="primary">Create an account</Typography>
            <Typography variant="body1" color="text.secondary">
              It only takes a minute to get started.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{error}</Alert>}

          <form onSubmit={handleSignup}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Full Name</Typography>
            <TextField 
              fullWidth 
              name="username"
              placeholder="e.g. John Doe"
              variant="outlined" 
              value={formData.username} 
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonOutlineIcon color="action" /></InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" fontWeight={600} mb={1}>Email</Typography>
            <TextField 
              fullWidth 
              name="email"
              placeholder="name@company.com"
              variant="outlined" 
              value={formData.email} 
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailOutlinedIcon color="action" /></InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" fontWeight={600} mb={1}>Password</Typography>
            <TextField 
              fullWidth 
              name="password"
              placeholder="Create a strong password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined" 
              value={formData.password} 
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlinedIcon color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Must be at least 6 characters"
              sx={{ mb: 4 }}
            />

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              type="submit" 
              disabled={loading}
              endIcon={!loading && <RocketLaunchIcon />}
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              {loading ? 'Setting up...' : 'Sign Up & Login'}
            </Button>
          </form>

          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>
                Log in
              </Link>
            </Typography>
          </Box>

        </Box>
      </Grid>
    </Grid>
  );
}