import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography/Typography';
import withWidth from '@material-ui/core/withWidth/withWidth';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { FcGraduationCap, FcBriefcase } from 'react-icons/fc';

import ScreenBlock from '../ScreenBlock/ScreenBlock';
import techTheme from '../../common/techTheme';
import './WorkAndEducation.css';

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
            <Typography variant="h5">
              {position.title} @{position.company}
            </Typography>
            {position.keywords && (
              <div className="ResumeWorkAndEducationBlock-keywords">
                {position.keywords.map((keyword, j) => (
                  <span key={j}> {keyword.name} </span> // eslint-disable-line react/no-array-index-key
                ))}
              </div>
            )}
            <Typography variant="subtitle2">{position.summary}</Typography>
            {/* {position.more && ( */}
            {/* <ShowMore> */}
            {/* <p dangerouslySetInnerHTML={{ __html: position.more }} /> */}
            {/* </ShowMore> */}
            {/* )} */}
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
              <Typography variant="h5">{education.schoolName}</Typography>
              <Typography variant="h6">{education.degree}</Typography>
              {education.activities && !Array.isArray(education.activities) && (
                <Typography variant="subtitle2">{education.activities}</Typography>
              )}
              {education.summary && <Typography variant="subtitle1">{education.summary}</Typography>}
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
