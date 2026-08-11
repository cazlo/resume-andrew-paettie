import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { FaHome } from 'react-icons/fa';
import Link from '@mui/material/Link';
import { Drawer, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import ConfigDialog from './ConfigPanel';

const SnakeNav = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const theme = useTheme();

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        backdropFilter: 'blur(18px)',
        backgroundColor: 'rgba(7, 16, 13, 0.82)',
        borderBottom: '1px solid rgba(143, 193, 96, 0.16)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, sm: 72 } }}>
          <Tooltip title="Back to portfolio">
            <IconButton
              component={Link}
              href="/"
              sx={{
                backgroundColor: 'rgba(143, 193, 96, 0.1)',
                border: '1px solid rgba(143, 193, 96, 0.2)',
                color: 'primary.main',
                mr: 2,
              }}
            >
              <FaHome size="1.15em" />
            </IconButton>
          </Tooltip>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  borderRadius: '50%',
                  boxShadow: '0 0 12px rgba(143, 193, 96, 0.8)',
                  height: 7,
                  width: 7,
                }}
              />
              <Typography sx={{ fontWeight: 800, letterSpacing: '0.14em' }} variant="subtitle1">
                Snake — 404
              </Typography>
            </Box>
            <Typography
              noWrap
              sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' }, lineHeight: 1.2 }}
              variant="caption"
            >
              Self-playing pathfinding demo
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <Button
                color="primary"
                onClick={handleOpenUserMenu}
                startIcon={<MenuIcon />}
                sx={{ borderColor: 'rgba(143, 193, 96, 0.28)', color: 'text.primary', px: { xs: 1.5, sm: 2.25 } }}
                variant="outlined"
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Controls
                </Box>
              </Button>
            </Tooltip>
            <Drawer
              sx={{
                // width: drawerWidth,
                // flexShrink: 0,
                overflowY: 'scroll',
                overflow: 'hidden',
                '& .MuiDrawer-paper': {
                  background: 'linear-gradient(180deg, #111b17 0%, #09110e 100%)',
                  borderBottom: '1px solid rgba(143, 193, 96, 0.22)',
                  boxSizing: 'border-box',
                  maxHeight: '92vh',
                  overflowY: 'auto',
                },
              }}
              variant="temporary"
              anchor="top"
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <IconButton
                aria-label="Close settings"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  position: 'absolute',
                  right: theme.spacing(2),
                  top: theme.spacing(2),
                  zIndex: 2,
                }}
                onClick={handleCloseUserMenu}
              >
                <Tooltip title="Save and close settings">
                  <CloseIcon />
                </Tooltip>
              </IconButton>
              <Box sx={{ mx: 'auto', width: '100%' }}>
                <ConfigDialog />
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default SnakeNav;
