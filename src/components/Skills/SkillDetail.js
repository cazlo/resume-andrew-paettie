// adapted from https://material-ui.com/components/accordion/#secondary-heading-and-columns

import React from 'react';
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { Rating, Box } from '@mui/material';
import PropTypes from 'prop-types';

const PREFIX = 'SkillDetail';

const classes = {
  root: `${PREFIX}-root`,
  heading: `${PREFIX}-heading`,
  secondaryHeading: `${PREFIX}-secondaryHeading`,
  icon: `${PREFIX}-icon`,
  details: `${PREFIX}-details`,
  column: `${PREFIX}-column`,
  helper: `${PREFIX}-helper`,
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: '100%',
  },

  [`& .${classes.heading}`]: {
    fontSize: theme.typography.pxToRem(15),
  },

  [`& .${classes.secondaryHeading}`]: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  [`& .${classes.icon}`]: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },

  [`& .${classes.details}`]: {
    alignItems: 'center',
  },

  [`& .${classes.column}`]: {
    flexBasis: '33.33%',
    alignItems: 'center',
  },

  [`& .${classes.helper}`]: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
}));

const yearsTxt = year => `${year < 1 ? '<1' : year} year${year > 1 ? 's' : ''}`;

export default function SkillDetail({ skill }) {
  return (
    <Root className={classes.root}>
      <Accordion defaultExpanded={!skill.frameworks.length}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1c-content" id="panel1c-header">
          <div className={classes.column}>
            <Chip size="large" avatar={<Avatar>{skill.techTheme.icon}</Avatar>} label={skill.name} />
          </div>
          <div className={classes.column} />
          <div className={classes.column}>
            <Rating name="read-only" value={Number.parseFloat(skill.experience)} precision={0.5} readOnly />{' '}
            <Box>{yearsTxt(skill.experience)}</Box>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap">
            {skill.frameworks.map(framework => (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                margin={1}
                key={`skill-details-${skill.name}-${framework.name}`}
              >
                <Chip size="large" avatar={<Avatar>{framework.techTheme.icon}</Avatar>} label={framework.name} />
                <Typography variant="caption">
                  <Rating name="read-only" value={Number.parseFloat(framework.experience)} precision={0.5} readOnly />
                  <br />
                  {yearsTxt(framework.experience)}
                </Typography>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Root>
  );
}

SkillDetail.propTypes = {
  skill: PropTypes.shape({
    name: PropTypes.string,
    techTheme: PropTypes.shape({
      icon: PropTypes.element.isRequired,
    }),
    experience: PropTypes.string,
    frameworks: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
  }),
};

SkillDetail.defaultProps = { skill: {} };
