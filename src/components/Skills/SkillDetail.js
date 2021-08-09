// adapted from https://material-ui.com/components/accordion/#secondary-heading-and-columns

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { Rating } from '@material-ui/lab';
import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
    alignItems: 'center',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
}));

const yearsTxt = year => `${year < 1 ? '<1' : year} year${year > 1 ? 's' : ''}`;

export default function SkillDetail({ skill }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Accordion defaultExpanded={!skill.frameworks.length}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1c-content" id="panel1c-header">
          <div className={classes.column}>
            <Chip size="large" avatar={<Avatar>{skill.techTheme.icon}</Avatar>} label={skill.name} />
          </div>
          <div className={classes.column} />
          <div className={classes.column}>
            <Rating name="read-only" value={skill.experience} precision={0.5} readOnly />{' '}
            <Box>{yearsTxt(skill.experience)}</Box>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap">
            {skill.frameworks.map(framework => (
              <Box display="flex" flexDirection="column" justifyContent="center" margin={1}>
                <Chip size="large" avatar={<Avatar>{framework.techTheme.icon}</Avatar>} label={framework.name} />
                <Typography variant="caption">
                  <Rating name="read-only" value={framework.experience} precision={0.5} readOnly />
                  <br />
                  {yearsTxt(framework.experience)}
                </Typography>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

SkillDetail.propTypes = {
  skill: PropTypes.shape({
    name: PropTypes.string,
    techTheme: PropTypes.string,
    experience: PropTypes.string,
    frameworks: PropTypes.string,
  }),
};

SkillDetail.defaultProps = { skill: {} };
