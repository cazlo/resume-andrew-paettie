import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { CardActions, CardContent, CardHeader } from '@mui/material';
import ChipList from '../common/ChipList';

const PREFIX = 'ProjectTile';

const classes = {
  image: `${PREFIX}-image`,
};

const Root = styled(Card)(({ theme }) => ({
  [`& .${classes.image}`]: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
}));

export default function ProjectTile({ project, elevation }) {
  return (
    <Root elevation={Math.floor(elevation)}>
      <CardContent>
        <CardHeader
          display="flex"
          avatar={
            project.image && (
              <Avatar
                variant="rounded"
                title={project.title}
                src={project.image}
                alt={project.title}
                className={classes.image}
              />
            )
          }
          title={project.title}
          subheader={project.subtitle}
        />
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
        <CardActions>
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
        </CardActions>
      </CardContent>
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
  elevation: PropTypes.number.isRequired,
};

ProjectTile.defaultProps = {
  project: {},
};
