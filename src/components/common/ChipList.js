import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipList({ chips, getIcon, getLabel, getKey }) {
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
        <ListItem key={getKey(chip)}>
          <Chip
            variant="filled"
            size="medium"
            avatar={getIcon(chip)}
            label={getLabel(chip)}
            clickable={chip.link !== undefined}
          />
        </ListItem>
      ))}
    </Box>
  );
}

ChipList.propTypes = {
  chips: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.element,
      name: PropTypes.string,
    }).isRequired,
  ).isRequired,
  getIcon: PropTypes.func.isRequired,
  getLabel: PropTypes.func.isRequired,
  getKey: PropTypes.func.isRequired,
};
