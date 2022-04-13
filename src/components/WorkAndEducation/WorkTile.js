import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import ChipList from '../common/ChipList';

export default function WorkTile({ position }) {
  return (
    <Box display="flex" alignItems="center">
      <Box margin={0}>
        <Box width="100%">
          <Typography variant="h6">{position.title}</Typography>
          <Typography variant="subtitle1">{position.company}</Typography>
          <Typography variant="caption">{position.summary}</Typography>
          <br />
          <ChipList chips={position.domains} getIcon={domain => domain.icon} getLabel={domain => domain.name} />
          <br />
          <ChipList chips={position.tech} getIcon={t => t.icon} getLabel={t => t.name} />
        </Box>
      </Box>
    </Box>
  );
}

WorkTile.propTypes = {
  position: PropTypes.shape({
    title: PropTypes.string,
    summary: PropTypes.node,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    isCurrent: PropTypes.bool,
    company: PropTypes.string,
    domains: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.element,
        name: PropTypes.string,
      }),
    ),
    tech: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.element,
        name: PropTypes.string,
      }),
    ),
  }),
};

WorkTile.defaultProps = {
  position: {},
};
