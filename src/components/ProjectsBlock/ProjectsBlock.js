import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
// import { FaGithub, FaHashtag } from 'react-icons/lib/fa';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import './VerticalTimeline.css';
import ScreenBlock from '../../components/ScreenBlock/ScreenBlock';

// projects will like be common/content.projects
const ProjectsBlock = ({ projects, style }) => (
  <ScreenBlock className="Resume-projects" id="Resume-projects" style={style}>
    <div className=" container">
      <div className="Resume-projects heading">
        <h2 className="projectsHeading">Projects</h2>
        <p className="projectsHeading">Showcase of my latest builds</p>
      </div>
      <VerticalTimeline className="VerticalTimeline">
        {projects.map((project, i) => (
          <VerticalTimelineElement
            style={{
              borderTop: `3px solid ${project.techTheme.border}`,
              boxSizing: 'content-box',
            }}
            className={`ProjectsBlock ${project.techTheme.className} VerticalTimelineElement`}
            key={i} // eslint-disable-line react/no-array-index-key
            icon={project.techTheme.icon}
            iconStyle={project.techTheme.iconStyle || project.techTheme.style}
            date={project.date}
          >
            <div className="ProjectsBlock-technologies">
              {project.technologies.map((technology, j) => (
                <Chip key={j} label={technology.name} /> // eslint-disable-line react/no-array-index-key
              ))}
            </div>
            <h3 className="vertical-timeline-element-title">{project.title}</h3>
            <h4 className="vertical-timeline-element-subtitle">{project.subtitle}</h4>
            <p>
              {/* eslint-disable-next-line react/no-danger */}
              {/* <span dangerouslySetInnerHTML={{ __html: project.content }} /> */}
              {project.content}
            </p>
            <br />
            <div className="ProjectsBlock-links">
              {project.links.map((link, j) => (
                <Button
                  key={j} // eslint-disable-line react/no-array-index-key
                  variant="outlined"
                  color="default"
                  target="_blank"
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

ProjectsBlock.propTypes = {
  projects: PropTypes.array.isRequired,
  style: PropTypes.object.isRequired,
};

export default ProjectsBlock;
