import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { Container } from '@mui/material';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import './VerticalTimeline.css';
import ProjectTile from './ProjectTile';

const Projects = ({ projects }) => {
  const theme = useTheme();
  return (
    <ScreenBlock className="Resume-projects" id="Resume-projects">
      <Container>
        <div className="Resume-projects heading">
          <h2>Projects</h2>
          <p>
            Most of my projects end up getting sold, along with my claim to the related IP.
            <br />
            Here are some free ones I built to showcase my skills and mess around in my free-time.
          </p>
        </div>
        <VerticalTimeline className="VerticalTimeline" animate={useMediaQuery(theme.breakpoints.up('lg'))}>
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
      </Container>
    </ScreenBlock>
  );
};

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
};

export default Projects;
