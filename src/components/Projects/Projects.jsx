import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Container } from '@mui/material';
import { Timeline } from '@mui/lab';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FcBriefcase } from 'react-icons/fc';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import ProjectTile from './ProjectTile';
import ReactiveTimelineItem from '../common/ReactiveTimelineItem';
import { partitionProjects } from './projectCuration';

const ProjectTimeline = ({ projects, isWide, label }) => (
  <Timeline aria-label={label} position={isWide ? 'alternate' : 'right'}>
    {projects.map(project => (
      <ReactiveTimelineItem
        periodDescription={`${project.date}`}
        key={`${label}-${project.date}-${project.title}`}
        icon={<Avatar sx={{ backgroundColor: '#fff' }}>{project.techTheme.icon || <FcBriefcase />}</Avatar>}
        child={<ProjectTile project={project} elevation={24} />}
      />
    ))}
  </Timeline>
);

ProjectTimeline.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isWide: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

const Projects = ({ projects }) => {
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up('md'));
  const { featuredProjects, archiveProjects } = partitionProjects(projects);

  return (
    <ScreenBlock className="Resume-projects" id="Resume-projects">
      <Container>
        <div className="Resume-projects heading">
          <h2>Projects</h2>
          <p>A selection of work I can share publicly, plus experiments I build to understand systems more deeply.</p>
        </div>
        {featuredProjects.length > 0 ? (
          <section aria-labelledby="Featured-projects-heading">
            <Typography component="h3" id="Featured-projects-heading" variant="h4">
              Featured Projects
            </Typography>
            <ProjectTimeline projects={featuredProjects} isWide={isWide} label="Featured projects timeline" />
          </section>
        ) : null}
        {archiveProjects.length > 0 ? (
          <Accordion sx={{ mt: 3, width: '100%' }} TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary
              aria-controls="project-archaeology-content"
              expandIcon={<ExpandMoreIcon />}
              id="project-archaeology-heading"
            >
              <Typography component="h3" variant="h5">
                Project archaeology: things I&apos;ve built since 2005
              </Typography>
            </AccordionSummary>
            <AccordionDetails id="project-archaeology-content">
              <ProjectTimeline projects={archiveProjects} isWide={isWide} label="Project archaeology timeline" />
            </AccordionDetails>
          </Accordion>
        ) : null}
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
