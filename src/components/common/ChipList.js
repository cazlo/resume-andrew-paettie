import React from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import { styled } from '@material-ui/core/styles';

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
