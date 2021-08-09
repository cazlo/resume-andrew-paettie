import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography/Typography';
import withWidth from '@material-ui/core/withWidth/withWidth';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { FcGraduationCap, FcBriefcase } from 'react-icons/fc';

import ScreenBlock from '../ScreenBlock/ScreenBlock';
import techTheme from '../../common/techTheme';
import './WorkAndEducation.css';
import WorkTile from './WorkTile';
import EducationTile from './EducationTile';

const formatPeriod = (start, end) => `${start} – ${end}`;

// positions and educations will like be common/content.projects
const WorkAndEducation = ({ positions, educations, width }) => (
  <ScreenBlock id="Resume-work" className="ResumeWorkAndEducationBlock">
    <div className="container">
      <div className="heading">
        <h2>Experience and Education</h2>
        <Typography>My previous jobs and my qualifications.</Typography>
      </div>

      <VerticalTimeline animate={width === 'lg' || width === 'xl'}>
        {positions.map((position, i) => (
          <VerticalTimelineElement
            className="Resume-position"
            key={i} // eslint-disable-line react/no-array-index-key
            icon={<FcBriefcase />}
            iconStyle={techTheme.postgres.style}
            date={
              <Typography variant="subtitle1" style={{ color: 'white' }}>
                {formatPeriod(position.startDate, position.endDate)}
              </Typography>
            }
          >
            <WorkTile position={position} />
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>

      <div id="Resume-education">
        <VerticalTimeline animate={width === 'lg' || width === 'xl'}>
          {educations.map((education, i) => (
            <VerticalTimelineElement
              position={i % 2 ? 'left' : 'right'}
              id=""
              className="Resume-position"
              key={i} // eslint-disable-line react/no-array-index-key
              icon={<FcGraduationCap />}
              iconStyle={{
                background: '#c65121', // utd color
              }}
              date={
                <Typography variant="subtitle1" style={{ color: 'white' }}>
                  {formatPeriod(education.startDate, education.endDate)}
                </Typography>
              }
            >
              <EducationTile education={education} />
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  </ScreenBlock>
);

WorkAndEducation.propTypes = {
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      summary: PropTypes.node,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      isCurrent: PropTypes.bool,
      company: PropTypes.string,
    }),
  ).isRequired,
  educations: PropTypes.arrayOf(
    PropTypes.shape({
      schoolName: PropTypes.string,
      fieldOfStudy: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      degree: PropTypes.string,
      activities: PropTypes.node,
    }),
  ).isRequired,
  width: PropTypes.string.isRequired,
};

export default withWidth()(WorkAndEducation);
