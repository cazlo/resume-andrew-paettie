import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import { FcEngineering, FcHome, FcManager, FcCommandLine, FcReading } from 'react-icons/fc';
import { BottomNavigationAction, SvgIcon } from '@mui/material';
import Scroll from 'react-scroll';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const { Link } = Scroll;
// eslint-disable-next-line react/jsx-props-no-spreading,no-unused-vars
const SLink = React.forwardRef((props, ref) => <Link {...props} />);

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
    offset: 12,
  },
  {
    label: 'Skills',
    name: 'ResumeSkills',
    icon: <FcEngineering />,
    offset: 18,
  },
  {
    label: 'Experience',
    name: 'ResumeExperience',
    icon: <FcManager />,
    offset: 18,
  },
  {
    label: 'Projects',
    name: 'ResumeProjects',
    icon: <FcCommandLine />,
    offset: 18,
  },
];

export default function SimpleBottomNavigation() {
  const theme = useTheme();
  return (
    <BottomNavigation
      showLabels={useMediaQuery(theme.breakpoints.up('md'))}
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
    >
      {buttons.map(button => (
        <BottomNavigationAction
          icon={<SvgIcon>{button.icon}</SvgIcon>}
          label={button.label}
          key={`${button.label}-${button.name}`}
          to={button.name}
          spy
          smooth
          offset={button.offset}
          duration={500}
          component={SLink}
        />
      ))}
    </BottomNavigation>
  );
}
