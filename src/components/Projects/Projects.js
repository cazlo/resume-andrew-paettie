import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
// import { FaGithub, FaHashtag } from 'react-icons/lib/fa';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import './VerticalTimeline.css';
import ScreenBlock from '../../components/ScreenBlock/ScreenBlock';

// projects will like be common/content.projects
const Projects = ({ projects, style }) => (
  <ScreenBlock className="Resume-projects" id="Resume-projects" style={style}>
    <div className=" container">
      <div className="Resume-projects heading">
        <h2 className="projectsHeading">Projects</h2>
        <p className="projectsHeading">Showcase of my latest builds</p>
      </div>
      <VerticalTimeline className="VerticalTimeline" animate={false}>
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
            <div style={{ display: 'flex' }} className="">
              <div style={{}}>
                <h3 className="vertical-timeline-element-title">{project.title}</h3>
                <h4 className="vertical-timeline-element-subtitle">{project.subtitle}</h4>
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

            <p>{project.content}</p>

            <br />
            <div className="ProjectsBlock-links">
              {project.links.map((link, j) => (
                <Button
                  key={j} // eslint-disable-line react/no-array-index-key
                  variant="outlined"
                  color="default"
                  target={link.url.includes("http")?"_blank":""}
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
  projects: PropTypes.array.isRequired,
  style: PropTypes.object,
};

export default Projects;
