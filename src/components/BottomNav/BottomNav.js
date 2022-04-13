import React from 'react';
import { styled } from '@mui/material/styles';
import BottomNavigation from '@mui/material/BottomNavigation';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import FaceIcon from '@mui/icons-material/Face';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/SettingsApplications';
// import ToysIcon from '@mui/icons-material/Toys';
import CodeIcon from '@mui/icons-material/Code';

import Link from './BottomNavLink';

const PREFIX = 'BottomNav';

const classes = {
  BottomNav: `${PREFIX}-BottomNav`,
  BottomNavLink: `${PREFIX}-BottomNavLink`,
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

    [theme.breakpoints.down('lg')]: {
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
    icon: <HomeIcon />,
  },
  {
    label: 'About Me',
    name: 'ResumeAboutMe',
    icon: <FaceIcon />,
  },
  {
    label: 'Skills',
    name: 'ResumeSkills',
    icon: <SettingsIcon />,
  },
  {
    label: 'Work Experience',
    name: 'ResumeExperience',
    icon: <WorkIcon />,
  },
  {
    label: 'Education',
    name: 'Resume-education',
    icon: <SchoolIcon />,
    // offset: -16,
  },
  {
    label: 'Projects',
    name: 'ResumeProjects',
    icon: <CodeIcon />,
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
          {button.label}
        </Link>
      ))}
    </StyledBottomNavigation>
  );
}
