import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography/Typography';
import withWidth from '@material-ui/core/withWidth';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import './VerticalTimeline.css';

const ShrunkIcon = icon => (
  <div
    style={{
      width: '75%',
      height: '75%',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
    }}
  >
    {icon}
  </div>
);

const ProjectContent = ({ project }) => (
  <>
    <div style={{ display: 'flex' }} className="">
      <div style={{}}>
        <Typography variant="h6">{project.title}</Typography>
        <Typography variant="subtitle1">{project.subtitle}</Typography>
        <Typography variant="caption">{project.content}</Typography>
        <div className="ProjectsBlock-technologies">
          {project.technologies.map((technology, j) => (
            <Chip
              // eslint-disable-next-line react/no-array-index-key
              key={j}
              label={technology.name}
              avatar={
                technology.icon ? (
                  <Avatar
                    style={{
                      background: '#747474',
                    }}
                  >
                    {ShrunkIcon(technology.icon)}
                  </Avatar>
                ) : null
              }
            />
          ))}
        </div>
      </div>
      {project.image ? (
        <div className="ProjectImage" style={{ marginLeft: '2em' }}>
          <img width="100px" height="100px" src={project.image} alt={project.title} />
        </div>
      ) : (
        ''
      )}
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
  </>
);

ProjectContent.propTypes = {
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

ProjectContent.defaultProps = {
  project: {},
};

const Projects = ({ projects, width }) => (
  <ScreenBlock className="Resume-projects" id="Resume-projects">
    <div className=" container">
      <div className="Resume-projects heading">
        <h2>Projects</h2>
      </div>
      <VerticalTimeline className="VerticalTimeline" animate={width === 'lg' || width === 'xl'}>
        {projects.map(project => (
          <VerticalTimelineElement
            key={`project-${project.title}`}
            icon={project.techTheme.icon}
            iconStyle={project.techTheme.iconStyle || project.techTheme.style}
            date={
              <Typography variant="subtitle1" style={{ color: 'white' }}>
                {project.date}
              </Typography>
            }
          >
            {ProjectContent({ project })}
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  </ScreenBlock>
);

Projects.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
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
  ).isRequired,
  width: PropTypes.string,
};

Projects.defaultProps = {
  width: 'lg',
};

export default withWidth()(Projects);
