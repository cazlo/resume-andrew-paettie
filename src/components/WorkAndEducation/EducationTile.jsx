import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import { Card, CardActionArea, CardContent } from '@mui/material';
import ChipList from '../common/ChipList';
import formatPeriod from './formatPeriod';

export default function EducationTile({ education, elevation, onOpen }) {
  return (
    <Card elevation={Math.floor(elevation)}>
      {/* See WorkTile: the tile is the control, so its chips cannot be links. */}
      <CardActionArea onClick={onOpen} aria-label={`${education.schoolName}, show details`}>
        <CardContent>
          {/* See WorkTile: dates belong in the card, not on the rail. */}
          <Typography variant="overline" color="text.secondary" display="block">
            {formatPeriod(education)}
          </Typography>
          <Typography variant="h5">{education.schoolName}</Typography>
          <Typography variant="h6">{education.degree}</Typography>
          <ChipList
            chips={education.areasOfStudy}
            getIcon={f => f.icon}
            getLabel={f => f.name}
            getKey={f => `${education.schoolName}-focus-${f.name}`}
            disableLinks
          />
          <br />
          <ChipList
            chips={education.languages}
            getIcon={f => f.icon}
            getLabel={f => f.name}
            getKey={f => `${education.schoolName}-language-${f.name}`}
            disableLinks
          />
          <br />
          <ChipList
            chips={education.gpa}
            getIcon={gpa => <Avatar>{gpa.value}</Avatar>}
            getLabel={gpa => `${gpa.name} GPA`}
            getKey={gpa => `${gpa.name} GPA`}
            disableLinks
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

EducationTile.propTypes = {
  education: PropTypes.shape({
    schoolName: PropTypes.string,
    fieldOfStudy: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    degree: PropTypes.string,
    activities: PropTypes.node,
    areasOfStudy: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.element,
        name: PropTypes.string,
      }),
    ),
    languages: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.element,
        name: PropTypes.string,
      }),
    ),
    gpa: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string,
      }),
    ),
  }).isRequired,
  elevation: PropTypes.number.isRequired,
  onOpen: PropTypes.func.isRequired,
};
