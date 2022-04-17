import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { MdAlternateEmail, MdPictureAsPdf } from 'react-icons/md';
import { FcDocument } from 'react-icons/fc';
import { ReactComponent as LinkedIn } from 'devicon/icons/linkedin/linkedin-original.svg';

import ChipList from '../common/ChipList';
import techTheme from '../../common/techTheme';

const contactInfo = [
  {
    icon: <MdAlternateEmail />,
    name: 'email',
    link: 'mailto:paettiea.job@gmail.com',
  },
  {
    icon: techTheme.github.whiteIcon,
    name: 'Github',
    link: 'https://github.com/cazlo',
  },
  {
    icon: <LinkedIn />,
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/in/andrew-paettie/',
  },
  {
    icon: <MdPictureAsPdf />,
    name: 'Resume PDF',
    link: '/static/resume/resume-Andrew-Paettie.pdf',
  },
  {
    icon: <FcDocument />,
    name: 'Resume DOCX',
    link: '/static/resume/resume-Andrew-Paettie.docx',
  },
];

const ButtonLink = ({ link, name }) => <Button href={link}>{name}</Button>;

ButtonLink.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default function ContactInfo() {
  return (
    <ChipList
      chips={contactInfo}
      getKey={c => `${c.name}-${c.link}`}
      getLabel={c => ButtonLink(c)}
      getIcon={c => c.icon}
    />
  );
}
