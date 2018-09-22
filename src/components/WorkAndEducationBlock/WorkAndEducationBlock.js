import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

// import { FaGithub, FaHashtag } from 'react-icons/lib/fa';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

// projects will like be common/content.projects
const WorkAndEducationBlock = ({ projects }) => (
  <div className="container">
    <div className="heading">
      <h2>Projects</h2>
      <p>Showcase of my latest builds</p>
    </div>
    <VerticalTimeline>
      {projects.map((project, i) => (
        <VerticalTimelineElement
          style={{
            borderTop: `3px solid ${project.techTheme.border}`,
          }}
          className={`ProjectsBlock ${project.techTheme.className}`}
          key={i} // eslint-disable-line react/no-array-index-key
          icon={project.techTheme.icon}
          iconStyle={project.techTheme.style}
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

      {/* <VerticalTimelineElement */}
      {/* className='vertical-timeline-element--work' */}
      {/* date='2017 - present' */}
      {/* iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }} */}
      {/* icon='' */}
      {/* > */}
      {/* <h3 className='vertical-timeline-element-title'>TODO: current title</h3> */}
      {/* <h4 className='vertical-timeline-element-subtitle'>TODO: location</h4> */}
      {/* <p> */}
      {/* TODO: buzzwords like: */}
      {/* Creative Direction, User Experience, Visual Design, SEO, Online Marketing */}
      {/* </p> */}
      {/* </VerticalTimelineElement> */}

      {/* <VerticalTimelineElement */}
      {/* className='vertical-timeline-element--work' */}
      {/* date='2015 - 2017' */}
      {/* iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }} */}
      {/* icon='' */}
      {/* > */}
      {/* <h3 className='vertical-timeline-element-title'>TODO DDC title</h3> */}
      {/* <h4 className='vertical-timeline-element-subtitle'>TODO DDC description</h4> */}
      {/* <p> */}
      {/* TODO Buzzwords about the incentive/inventory re-architectures */}
      {/* </p> */}
      {/* </VerticalTimelineElement> */}
      {/* <VerticalTimelineElement */}
      {/* className="vertical-timeline-element--education" */}
      {/* date="2009 - 2015" */}
      {/* iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }} */}
      {/* icon="" */}
      {/* > */}
      {/* <h3 className="vertical-timeline-element-title">Bachelor of Science in Computer Science</h3> */}
      {/* <h4 className="vertical-timeline-element-subtitle">Bachelor Degree</h4> */}
      {/* </VerticalTimelineElement> */}

      {/* <VerticalTimelineElement */}
      {/* className='vertical-timeline-element--education' */}
      {/* date='2014 - 2015' */}
      {/* iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }} */}
      {/* icon='' */}
      {/* > */}
      {/* <h3 className='vertical-timeline-element-title'>TODO Capitalsoft stuff</h3> */}
      {/* <h4 className='vertical-timeline-element-subtitle'>TODO Capitalsoft stuff</h4> */}
      {/* <p>TODO Capitalsoft stuff</p> */}
      {/* </VerticalTimelineElement> */}
    </VerticalTimeline>

    {/* <ProjectCard */}
    {/* githubUrl='https://github.com/cazlo/WhizCalc' */}
    {/* title='WhizCalc' */}
    {/* subtitle='January 2014' */}
    {/* text='A simple calculator app for android used to experiment with creating android apps.' */}
    {/* imageUrl={placeholderImgUrl} */}
    {/* /> */}
  </div>
);

WorkAndEducationBlock.propTypes = {
  projects: PropTypes.array.isRequired,
};

export default WorkAndEducationBlock;
