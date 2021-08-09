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

export default function EducationTile({ education }) {
  // const classes = useStyles();

  return (
    <Box display="flex" alignItems="center">
      <Box margin={0}>
        <Box width="100%">
          <Typography variant="h5">{education.schoolName}</Typography>
          <Typography variant="h6">{education.degree}</Typography>
          Areas of Focus:
          {education.areasOfStudy.map(study => (
            <Chip size="large" avatar={<Avatar>{study.icon}</Avatar>} label={study.name} />
          ))}
          <br />
          Languages:
          {education.languages.map(language => (
            <Chip size="large" avatar={<Avatar>{language.icon}</Avatar>} label={language.name} />
          ))}
          <br />
          GPA:{' '}
          {education.gpa.map(gpa => (
            <Chip size="large" avatar={<Avatar>{gpa.value}</Avatar>} label={gpa.name} />
          ))}
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
