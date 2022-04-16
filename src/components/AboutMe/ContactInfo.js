import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import ChipList from '../common/ChipList';

const contactInfo = [
  {
    icon: 'todo', // todo
    name: 'email',
    link: 'mailto:paettiea.job@gmail.com',
  },
  {
    icon: 'todo', // todo
    name: 'Github',
    link: 'https://github.com/cazlo',
  },
  {
    icon: 'todo', // todo
    name: 'LinkedIn',
    link: 'https://www.linkedin.com/in/andrew-paettie/',
  },
  {
    icon: 'todo', // todo
    name: 'Resume PDF',
    link: '/static/resume/resume-Andrew-Paettie.pdf',
  },
  {
    icon: 'todo', // todo
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
