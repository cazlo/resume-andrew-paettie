import React from 'react';
import PropTypes from 'prop-types';
import SchoolIcon from '@material-ui/icons/School';
import WorkIcon from '@material-ui/icons/Work';
// import { FaGithub, FaHashtag } from 'react-icons/lib/fa';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';

import ScreenBlock from '../../components/ScreenBlock/ScreenBlock';
import techTheme from '../../common/techTheme';
import './WorkAndEducation.css';

const formatPeriod = (start, end) => {
  const isToday = end === 'Today' || end === "Aujourd'hui" || end === '今';

  const period = (isToday ? new Date().getFullYear() : parseInt(end, 10)) - parseInt(start, 10);

  if (period <= 1) {
    return `${start} – ${end}`;
  }

  return `${start} – ${end}`;
};

// positions and educations will like be common/content.projects
const WorkAndEducation = ({ positions, educations }) => (
  <ScreenBlock id="Resume-work" className="ResumeWorkAndEducationBlock">
    <div className="container">
      <div className="heading">
        <h2>Work experience & Education</h2>
        <p>My previous jobs and my qualifications.</p>
      </div>

      <VerticalTimeline animate={false}>
        {positions.map((position, i) => (
          // let picture = null;
          // if (position.picture) {
          //   picture = require(`../../data/img/${position.picture}`); // eslint-disable-line global-require
          // }
          <VerticalTimelineElement
            className="Resume-position"
            key={i} // eslint-disable-line react/no-array-index-key
            icon={<WorkIcon />}
            iconStyle={techTheme.postgres.style}
            date={formatPeriod(position.startDate, position.endDate)}
          >
            {/* {picture && ( */}
            {/* <img className="ResumeWorkAndEducationBlock-picture" alt="" src={picture} /> */}
            {/* )} */}
            <h3 className="vertical-timeline-element-title">
              {position.title} @{position.company}
            </h3>
            {position.keywords && (
              <div className="ResumeWorkAndEducationBlock-keywords">
                {position.keywords.map((keyword, j) => (
                  <span key={j}> {keyword.name} </span> // eslint-disable-line react/no-array-index-key
                ))}
              </div>
            )}
            <p>{position.summary}</p>
            {/* {position.more && ( */}
            {/* <ShowMore> */}
            {/* <p dangerouslySetInnerHTML={{ __html: position.more }} /> */}
            {/* </ShowMore> */}
            {/* )} */}
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>

      <div id="Resume-education">
        <VerticalTimeline animate={false}>
          {educations.map((education, i) => (
            <VerticalTimelineElement
              position={i % 2 ? 'left' : 'right'}
              id=""
              className="Resume-position"
              key={i} // eslint-disable-line react/no-array-index-key
              icon={<SchoolIcon />}
              iconStyle={techTheme.java.style}
              date={formatPeriod(education.startDate, education.endDate)}
            >
              <h3 className="vertical-timeline-element-title">{education.fieldOfStudy}</h3>
              <h4 className="vertical-timeline-element-subtitle">{education.degree}</h4>
              {education.activities &&
                !Array.isArray(education.activities) && <p>{education.activities}</p>}
              {education.activities &&
                Array.isArray(education.activities) && (
                  <div className="ResumeWorkAndEducationBlock-keywords">
                    {education.activities.map((activity, j) => (
                      <span key={j}> {activity.name} </span> // eslint-disable-line react/no-array-index-key
                    ))}
                  </div>
                )}
              {education.summary && <p>{education.summary}</p>}
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  </ScreenBlock>
);

WorkAndEducation.propTypes = {
  positions: PropTypes.array.isRequired,
  educations: PropTypes.array.isRequired,
};

export default WorkAndEducation;
