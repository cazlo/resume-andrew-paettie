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
import { Drawer, Fab, Typography } from '@mui/material';
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
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Button component={Link} variant="contained" href="/">
            <FaHome size="2em" />
          </Button>

          <Box sx={{ flexGrow: 1, display: 'flex', margin: '1em' }}>
            <Typography variant="subtitle">Pathfinding to 404 page</Typography>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Drawer
              sx={{
                // width: drawerWidth,
                // flexShrink: 0,
                overflowY: 'scroll',
                overflow: 'hidden',
                '& .MuiDrawer-paper': {
                  // width: drawerWidth,
                  boxSizing: 'border-box',
                },
              }}
              variant="temporary"
              anchor="top"
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Fab
                sx={{ flexGrow: 0, position: 'fixed', top: theme.spacing(2), right: theme.spacing(2) }}
                onClick={handleCloseUserMenu}
              >
                <Tooltip title="Save and close settings">
                  <CloseIcon />
                </Tooltip>
              </Fab>
              <Box>
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
