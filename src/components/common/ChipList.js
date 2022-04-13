import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipList({ chips, getIcon, getLabel }) {
  return (
    <Box
      flexWrap="wrap"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        // flexWrap: 'wrap',
        flexDirection: 'row',
        // listStyle: 'none',
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {chips.map(chip => (
        <ListItem>
          <Chip variant="outlined" size="small" icon={getIcon(chip)} label={getLabel(chip)} />
        </ListItem>
      ))}
    </Box>
  );
}
