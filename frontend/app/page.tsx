'use client';
import Link from 'next/link';
import { Box, Button, Container, Typography, Stack, Paper } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Home() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={10} sx={{ p: 6, borderRadius: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)' }}>
          
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold" color="primary">
            SecureShop
          </Typography>
          
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Welcome to the secure online shopping mart. <br />
            Please select a portal to continue.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center">
            
            {/* Public Shop Button */}
            <Link href="/shop" passHref style={{ textDecoration: 'none' }}>
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<StorefrontIcon />} 
                sx={{ px: 5, py: 2, fontSize: '1.1rem', border: '2px solid' }}
              >
                Go to Shop
              </Button>
            </Link>

            {/* Admin Portal Button */}
            <Link href="/login" passHref style={{ textDecoration: 'none' }}>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<AdminPanelSettingsIcon />} 
                sx={{ px: 5, py: 2, fontSize: '1.1rem' }}
              >
                Admin Panel
              </Button>
            </Link>

          </Stack>

        </Paper>
        
        <Typography variant="body2" sx={{ mt: 4, color: 'white', opacity: 0.8, textAlign: 'center' }}>
          SecureShop System © 2025
        </Typography>

      </Container>
    </Box>
  );
}