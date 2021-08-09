import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

// const useStyles = makeStyles(theme => ({
//   image: {
//     width: theme.spacing(12),
//     height: theme.spacing(12),
//   },
// }));

export default function WorkTile({ position }) {
  // const classes = useStyles();

  return (
    <Box display="flex" alignItems="center">
      <Box margin={0}>
        <Box width="100%">
          <Typography variant="h6">{position.title}</Typography>
          <Typography variant="subtitle1">{position.company}</Typography>
          <Typography variant="caption">{position.summary}</Typography>
          <br />
          Domains:
          {position.domains &&
            position.domains.map(domain => (
              <Chip size="large" avatar={<Avatar>{domain.icon}</Avatar>} label={domain.name} />
            ))}
          <br />
          Tech:
          {position.tech &&
            position.tech.map(tech => <Chip size="large" avatar={<Avatar>{tech.icon}</Avatar>} label={tech.name} />)}
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
