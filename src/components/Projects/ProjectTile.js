import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, styled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  image: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
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
        <Box
          flexWrap="wrap"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            // flexWrap: 'wrap',
            flexDirection: 'row',
            // listStyle: 'none',
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {project.technologies.map(technology => (
            <ListItem key={`${project.title}-${technology.name}`}>
              <Chip label={technology.name} variant="outlined" avatar={technology.icon} />
            </ListItem>
          ))}
        </Box>
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
