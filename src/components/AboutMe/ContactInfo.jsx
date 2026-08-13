import React from 'react';
import { MdAlternateEmail } from 'react-icons/md';
import { ReactComponent as LinkedIn } from 'devicon/icons/linkedin/linkedin-original.svg';

import ChipList from '../common/ChipList';
import techTheme from '../../common/techTheme';

const contactInfo = [
  {
    icon: <MdAlternateEmail />,
    name: 'Email',
    link: 'mailto:paettiea.job@gmail.com',
  },
  {
    icon: techTheme.github.whiteIcon,
    name: 'GitHub',
    link: 'https://github.com/cazlo',
  },
  {
    icon: <LinkedIn />,
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/in/andrew-paettie/',
  },
];

export default function ContactInfo() {
  return (
    <ChipList chips={contactInfo} getKey={c => `${c.name}-${c.link}`} getLabel={c => c.name} getIcon={c => c.icon} />
  );
}
