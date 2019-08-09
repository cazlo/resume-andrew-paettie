import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography/Typography';
import withWidth from '@material-ui/core/withWidth';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import ScreenBlock from '../ScreenBlock/ScreenBlock';

import './VerticalTimeline.css';

// projects will like be common/content.projects
const Projects = ({ projects, style, width }) => (
  <ScreenBlock className="Resume-projects" id="Resume-projects" style={style}>
    <div className=" container">
      <div className="Resume-projects heading">
        <h2>Projects</h2>
        <Typography>Showcase of my latest builds</Typography>
      </div>
      <VerticalTimeline className="VerticalTimeline" animate={width === 'lg' || width === 'xl'}>
        {projects.map((project, i) => (
          <VerticalTimelineElement
            key={i} // eslint-disable-line react/no-array-index-key
            icon={project.techTheme.icon}
            iconStyle={project.techTheme.iconStyle || project.techTheme.style}
            date={<Typography variant="subtitle1">{project.date}</Typography>}
          >
            <div style={{ display: 'flex' }} className="">
              <div style={{}}>
                <Typography variant="h6">{project.title}</Typography>
                <Typography variant="subtitle1">{project.subtitle}</Typography>
                <div className="ProjectsBlock-technologies">
                  {project.technologies.map((technology, j) => (
                    <Chip
                      // eslint-disable-next-line react/no-array-index-key
                      key={j}
                      label={technology.name}
                      avatar={technology.icon ? <Avatar>{technology.icon}</Avatar> : null}
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

            <Typography variant="subtitle2">{project.content}</Typography>

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
  style: PropTypes.shape({}),
  width: PropTypes.string,
};

Projects.defaultProps = {
  style: {},
  width: 'lg',
};

export default withWidth()(Projects);
