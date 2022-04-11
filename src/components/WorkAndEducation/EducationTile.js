import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import ChipList from '../common/ChipList';

export default function EducationTile({ education }) {
  return (
    <Box display="flex" alignItems="center">
      <Box margin={0}>
        <Box width="100%">
          <Typography variant="h5">{education.schoolName}</Typography>
          <Typography variant="h6">{education.degree}</Typography>
          <ChipList chips={education.areasOfStudy} getIcon={s => s.icon} getLabel={s => s.name} />
          <br />
          <ChipList chips={education.languages} getIcon={s => s.icon} getLabel={s => s.name} />
          <br />
          <ChipList
            chips={education.gpa}
            getIcon={gpa => <Avatar>{gpa.value}</Avatar>}
            getLabel={gpa => `${gpa.name} GPA`}
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
