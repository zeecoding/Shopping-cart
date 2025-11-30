'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';

const drawerWidth = 240;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getCookie('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      const decoded: any = jwtDecode(token as string);
      if (decoded.role !== 'admin') {
        router.push('/'); // Redirect non-admins to home
      } else {
        setAuthorized(true);
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  if (!authorized) return null; // Or a loading spinner

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            SecureShop Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
              { text: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
              { text: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders' },
            ].map((item) => (
              <Link href={item.path} key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItem sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
            <ListItem sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }} onClick={() => { document.cookie = 'token=; Max-Age=0'; router.push('/login'); }}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}