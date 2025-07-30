import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@mui/material';

import ChipList from '../common/ChipList';

export default function WorkTile({ position, elevation }) {
  return (
    <Card elevation={Math.floor(elevation)}>
      <CardContent>
        <Typography variant="h6">{position.title}</Typography>
        <Typography variant="subtitle1">{position.company}</Typography>
        <Typography variant="caption">{position.summary}</Typography>
        <br />
        <ChipList
          chips={position.domains}
          getIcon={domain => domain.icon}
          getLabel={domain => domain.name}
          getKey={domain => `${position.company}-${domain.name}`}
        />
        <br />
        <ChipList
          chips={position.tech}
          getIcon={t => t.icon}
          getLabel={t => t.name}
          getKey={t => `${position.company}-${t.name}`}
        />
      </CardContent>
    </Card>
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
  elevation: PropTypes.number.isRequired,
};

WorkTile.defaultProps = {
  position: {},
};
