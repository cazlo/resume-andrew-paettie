import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import HomeIcon from '@material-ui/icons/Home';
import WorkIcon from '@material-ui/icons/Work';
import FaceIcon from '@material-ui/icons/Face';
import SchoolIcon from '@material-ui/icons/School';
import SettingsIcon from '@material-ui/icons/SettingsApplications';
import ToysIcon from '@material-ui/icons/Toys';
import CodeIcon from '@material-ui/icons/Code';

import './BottomNav.css';

const Link = props => {
  const { showLabel, ...rest } = props;
  return <Scroll.Link {...rest} />;
};

Link.propTypes = {
  showLabel: PropTypes.bool,
};

const buttons = [
  {
    label: 'home',
    name: 'Resume-home',
    icon: <HomeIcon />,
  },
  {
    label: 'aboutMe',
    name: 'Resume-aboutMe',
    icon: <FaceIcon />,
  },
  {
    label: 'workExperience',
    name: 'Resume-work',
    icon: <WorkIcon />,
  },
  {
    label: 'education',
    name: 'Resume-education',
    icon: <SchoolIcon />,
    offset: -16,
  },
  {
    label: 'skills',
    name: 'Resume-skills',
    icon: <SettingsIcon />,
  },
  {
    label: 'projects',
    name: 'Resume-projects',
    icon: <CodeIcon />,
  },
  {
    label: 'hobbies',
    name: 'Resume-hobbies',
    icon: <ToysIcon />,
  },
];

const SimpleBottomNavigation = () => (
  <BottomNavigation value="0" className="BottomNavigation">
    {buttons.map((button, j) => (
      <Link
        key={j} // eslint-disable-line react/no-array-index-key
        className="BottomNavigation-link"
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

export default SimpleBottomNavigation;
