import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import ChipList from '../common/ChipList';

export default function EducationTile({ education }) {
  return (
    <Box display="flex" alignItems="center">
      <Box margin={0}>
        <Box width="100%">
          <Typography variant="h5">{education.schoolName}</Typography>
          <Typography variant="h6">{education.degree}</Typography>
          <ChipList
            chips={education.areasOfStudy}
            getIcon={f => f.icon}
            getLabel={f => (f.link ? <a href={f.link}>{f.name}</a> : f.name)}
            getKey={f => `${education.schoolName}-focus-${f.name}`}
          />
          <br />
          <ChipList
            chips={education.languages}
            getIcon={f => f.icon}
            getLabel={f => f.name}
            getKey={f => `${education.schoolName}-language-${f.name}`}
          />
          <br />
          <ChipList
            chips={education.gpa}
            getIcon={gpa => <Avatar>{gpa.value}</Avatar>}
            getLabel={gpa => `${gpa.name} GPA`}
            getKey={gpa => `${gpa.name} GPA`}
          />
        </Box>
      </Box>
    </Box>
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
};
