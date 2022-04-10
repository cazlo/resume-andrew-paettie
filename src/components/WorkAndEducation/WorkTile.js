import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function WorkTile({ position }) {
  return (
    <Box display="flex" alignItems="center">
      <Box margin={0}>
        <Box width="100%">
          <Typography variant="h6">{position.title}</Typography>
          <Typography variant="subtitle1">{position.company}</Typography>
          <Typography variant="caption">{position.summary}</Typography>
          <br />
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
            {position.domains &&
              position.domains.map(domain => (
                <ListItem key={`${position.title}-${position.company}-${domain.name}`}>
                  <Chip variant="outlined" size="small" avatar={domain.icon} label={domain.name} />
                </ListItem>
              ))}
          </Box>
          <br />
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
            {position.tech &&
              position.tech.map(tech => (
                <ListItem key={`${position.title}-${position.company}-${tech.name}`}>
                  <Chip variant="outlined" size="small" avatar={tech.icon} label={tech.name} />
                </ListItem>
              ))}
          </Box>
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
