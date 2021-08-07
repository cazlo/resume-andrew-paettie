import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import HomeIcon from '@material-ui/icons/Home';
import WorkIcon from '@material-ui/icons/Work';
import FaceIcon from '@material-ui/icons/Face';
import SchoolIcon from '@material-ui/icons/School';
import SettingsIcon from '@material-ui/icons/SettingsApplications';
// import ToysIcon from '@material-ui/icons/Toys';
import CodeIcon from '@material-ui/icons/Code';
import { makeStyles } from '@material-ui/core';

import Link from './BottomNavLink';

const styles = makeStyles(theme => ({
  BottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,

    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'space-around',
    [theme.breakpoints.down('md')]: {
      height: 'auto !important',
    },
  },
  BottomNavLink: {
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
    label: 'Skills',
    name: 'ResumeSkills',
    icon: <SettingsIcon />,
  },
  {
    label: 'Projects',
    name: 'ResumeProjects',
    icon: <CodeIcon />,
  },
];

export default function SimpleBottomNavigation() {
  const classes = styles();
  return (
    <BottomNavigation value="0" className={classes.BottomNav}>
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
    </BottomNavigation>
  );
}
