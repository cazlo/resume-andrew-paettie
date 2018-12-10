import React from 'react';
import Typography from '@material-ui/core/Typography/Typography';

const Copyright = () => (
  <div>
    <Typography variant={'subtitle1'} align="center">
      &copy; 2013 - {new Date().getFullYear()}, Andrew Paettie
    </Typography>
  </div>
);

export default Copyright;
