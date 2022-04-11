import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ChipList from '../common/ChipList';

const useStyles = makeStyles(theme => ({
  image: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

export default function ProjectTile({ project }) {
  const classes = useStyles();

  return (
    <div>
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
        <ChipList chips={project.technologies} getIcon={domain => domain.icon} getLabel={domain => domain.name} />
      </div>
      <br />
      <div className="ProjectsBlock-links">
        {project.links.map((link, j) => (
          <Button
            key={j} // eslint-disable-line react/no-array-index-key
            variant="outlined"
            color="default"
            target={link.url.includes('http') ? '_blank' : ''}
            href={link.url}
          >
            {link.text}
          </Button>
        ))}
      </div>
    </div>
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
