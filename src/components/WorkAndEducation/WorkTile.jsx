import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { Card, CardActionArea, CardContent } from '@mui/material';

import ChipList from '../common/ChipList';

export default function WorkTile({ position, elevation, onOpen }) {
  return (
    <Card elevation={Math.floor(elevation)}>
      {/*
        The whole tile is the control that opens the drill-down, so chips inside
        it must not be links of their own. Any link a role carries is surfaced in
        the dialog instead.
      */}
      <CardActionArea onClick={onOpen} aria-label={`${position.title} at ${position.company}, show details`}>
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
            disableLinks
          />
          <br />
          <ChipList
            chips={position.tech}
            getIcon={t => t.icon}
            getLabel={t => t.name}
            getKey={t => `${position.company}-${t.name}`}
            disableLinks
          />
        </CardContent>
      </CardActionArea>
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
  onOpen: PropTypes.func.isRequired,
};

WorkTile.defaultProps = {
  position: {},
};
