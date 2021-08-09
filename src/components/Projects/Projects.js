import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography/Typography';
import withWidth from '@material-ui/core/withWidth';

import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import './VerticalTimeline.css';
import ProjectTile from './ProjectTile';

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
            <ProjectTile project={project} />
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
