import React from 'react';
import { styled } from '@mui/material/styles';
import BottomNavigation from '@mui/material/BottomNavigation';
import { FcDiploma1, FcEngineering, FcHome, FcManager, FcMindMap, FcReading } from 'react-icons/fc';

import { Typography } from '@mui/material';
import Link from './BottomNavLink';

const PREFIX = 'BottomNav';

const classes = {
  BottomNav: `${PREFIX}-BottomNav`,
  BottomNavLink: `${PREFIX}-BottomNavLink`,
  BottomNavLabel: `${PREFIX}-BottomNavLabel`,
};

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  [`&.${classes.BottomNav}`]: {
    width: '100%',
    position: 'fixed',
    bottom: 0,

    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
  },

  [`& .${classes.BottomNavLink}`]: {
    width: '100%',
    minWidth: '60px',
    maxWidth: '168px',
    flex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    color: '#e9e9e9',
    cursor: 'pointer',
    outline: 'none',
    transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

    [theme.breakpoints.down('md')]: {
      // fontSize: 0,
      // minWidth: '25%',
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  },
  [`& .${classes.BottomNavLabel}`]: {
    [theme.breakpoints.down('md')]: {
      display: 'hidden',
      fontSize: 0,
      // minWidth: '25%',
      paddingTop: '10px',
      paddingBottom: '10px',
    },
  },
}));

const buttons = [
  {
    label: 'Home',
    name: 'Resume-home',
    icon: <FcHome />,
  },
  {
    label: 'About Me',
    name: 'ResumeAboutMe',
    icon: <FcReading />,
  },
  {
    label: 'Skills',
    name: 'ResumeSkills',
    icon: <FcEngineering />,
  },
  {
    label: 'Work Experience',
    name: 'ResumeExperience',
    icon: <FcManager />,
  },
  {
    label: 'Education',
    name: 'Resume-education',
    icon: <FcDiploma1 />,
    // offset: -16,
  },
  {
    label: 'Projects',
    name: 'ResumeProjects',
    icon: <FcMindMap />,
  },
];

export default function SimpleBottomNavigation() {
  return (
    <StyledBottomNavigation value="0" className={classes.BottomNav}>
      {buttons.map((button, j) => (
        <Link
          key={j} // eslint-disable-line react/no-array-index-key
          className={classes.BottomNavLink}
          to={button.name}
          activeClass="active"
          spy
          smooth
          offset={button.offset}
          duration={500}
        >
          {button.icon}
          <Typography className={classes.BottomNavLabel} variant="subtitle2">
            {button.label}
          </Typography>
        </Link>
      ))}
    </StyledBottomNavigation>
  );
}
