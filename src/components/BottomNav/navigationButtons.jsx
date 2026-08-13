import React from 'react';
import { FcCommandLine, FcEngineering, FcHome, FcManager, FcReading } from 'react-icons/fc';

const navigationButtons = [
  {
    label: 'Home',
    name: 'Resume-home',
    icon: <FcHome />,
  },
  {
    label: 'Experience',
    name: 'ResumeExperience',
    icon: <FcManager />,
    offset: -18,
  },
  {
    label: 'Projects',
    name: 'ResumeProjects',
    icon: <FcCommandLine />,
    offset: -18,
  },
  {
    label: 'Skills',
    name: 'ResumeSkills',
    icon: <FcEngineering />,
    offset: -18,
  },
  {
    label: 'About Me',
    name: 'ResumeAboutMe',
    icon: <FcReading />,
    offset: -18,
  },
];

export default navigationButtons;
