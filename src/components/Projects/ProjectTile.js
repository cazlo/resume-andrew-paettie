import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ChipList from '../common/ChipList';

const PREFIX = 'ProjectTile';

const classes = {
  image: `${PREFIX}-image`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.image}`]: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

export default function ProjectTile({ project }) {
  return (
    <Root>
      <Box display="flex" alignItems="center">
        {project.image && (
          <Box margin={1}>
            <Avatar
              variant="rounded"
              title={project.title}
              src={project.image}
              alt={project.title}
              className={classes.image}
            />
          </Box>
        )}
        <Box width="100%">
          <Typography variant="h6">{project.title}</Typography>
          <Typography variant="subtitle1">{project.subtitle}</Typography>
        </Box>
      </Box>
      <Typography variant="caption">{project.content}</Typography>
      <div className="ProjectsBlock-technologies">
        <ChipList
          chips={project.technologies}
          getIcon={tech => tech.icon}
          getLabel={tech => tech.name}
          getKey={tech => `${project.title}-${tech.name}`}
        />
      </div>
      <br />
      <div className="ProjectsBlock-links">
        {project.links.map(link => (
          <Button
            variant="outlined"
            target={link.url.includes('http') ? '_blank' : ''}
            href={link.url}
            key={`${project.title}-${link.text}-url`}
          >
            {link.text}
          </Button>
        ))}
      </div>
    </Root>
  );
}

ProjectTile.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    date: PropTypes.string,
    techTheme: PropTypes.shape({}),
    links: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        text: PropTypes.string,
      }),
    ),
    technologies: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        icon: PropTypes.node,
      }),
    ),
    content: PropTypes.string,
    image: PropTypes.node,
  }),
};

ProjectTile.defaultProps = {
  project: {},
};
