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
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await API.post('/login', { email, password });
      
      setCookie('token', res.data.token, { maxAge: 3600 });
      setCookie('role', res.data.role, { maxAge: 3600 });
      
      // Smooth redirect
      if (res.data.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/shop');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ height: '100vh' }}>
      
      {/* LEFT SIDE: Visual/Brand (Hidden on Mobile) */}
      <Grid 
        item 
        xs={false} 
        md={6} 
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), rgba(15,23,42,0.8))',
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
        >
          <Typography variant="h3" color="white" fontWeight="bold" gutterBottom>
            Manage your empire.
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.8)">
            Monitor sales, track inventory, and process orders in real-time with SecureShop.
          </Typography>
        </Box>
      </Grid>

      {/* RIGHT SIDE: Form */}
      <Grid item xs={12} md={6} component={Paper} elevation={0} square sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 4 }}>
        <Box sx={{ maxWidth: 450, mx: 'auto', width: '100%' }}>
          
          <Box mb={4}>
            <Typography variant="h4" gutterBottom color="primary">Welcome back</Typography>
            <Typography variant="body1" color="text.secondary">
              Please enter your details to sign in.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Email</Typography>
            <TextField 
              fullWidth 
              placeholder="Enter your email"
              variant="outlined" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailOutlinedIcon color="action" /></InputAdornment>,
              }}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" fontWeight={600} mb={1}>Password</Typography>
            <TextField 
              fullWidth 
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              variant="outlined" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
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
              sx={{ mb: 4 }}
            />

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              type="submit" 
              disabled={loading}
              endIcon={!loading && <ArrowForwardIcon />}
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>
                Create account
              </Link>
            </Typography>
          </Box>

        </Box>
      </Grid>
    </Grid>
  );
}