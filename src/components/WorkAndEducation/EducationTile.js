import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { styled } from '@material-ui/core/styles';

// const useStyles = makeStyles(theme => ({
//   image: {
//     width: theme.spacing(12),
//     height: theme.spacing(12),
//   },
// }));

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function EducationTile({ education }) {
  // const classes = useStyles();

  return (
    <Box display="flex" alignItems="center">
      <Box margin={0}>
        <Box width="100%">
          <Typography variant="h5">{education.schoolName}</Typography>
          <Typography variant="h6">{education.degree}</Typography>
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
            {education.areasOfStudy.map(study => (
              <ListItem>
                <Chip variant="outlined" size="small" icon={study.icon} label={study.name} />
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
            {education.languages.map(language => (
              <ListItem>
                <Chip variant="outlined" size="small" icon={language.icon} label={language.name} />
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
            {education.gpa.map(gpa => (
              <ListItem>
                <Chip variant="outlined" size="large" avatar={<Avatar>{gpa.value}</Avatar>} label={`${gpa.name} GPA`} />
              </ListItem>
            ))}
          </Box>
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
