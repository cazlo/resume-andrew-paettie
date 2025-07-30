import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/material';
import { Timeline } from '@mui/lab';
import Avatar from '@mui/material/Avatar';
import { FcBriefcase } from 'react-icons/fc';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import ProjectTile from './ProjectTile';
import ReactiveTimelineItem from '../common/ReactiveTimelineItem';

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
            Here are some things I built to showcase my skills and mess around with ideas in my free-time.
          </p>
        </div>
        <Timeline position={useMediaQuery(theme.breakpoints.up('md')) ? 'alternate' : 'right'}>
          {projects.map(project => (
            <ReactiveTimelineItem
              periodDescription={`${project.date}`}
              key={`${project.date}-${project.title}`}
              icon={<Avatar sx={{ backgroundColor: '#fff' }}>{project.techTheme.icon || <FcBriefcase />}</Avatar>}
              child={<ProjectTile project={project} elevation={24} />}
              // iconStyle={project.techTheme.iconStyle || project.techTheme.style}
            />
          ))}
        </Timeline>
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
