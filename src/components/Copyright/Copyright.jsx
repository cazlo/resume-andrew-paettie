import React from 'react';
import Typography from '@mui/material/Typography/Typography';

const Copyright = () => (
  <div>
    <Typography variant="subtitle1" align="center">
      &copy; {new Date().getFullYear()}, Andrew Paettie
    </Typography>
  </div>
);

export default Copyright;
