import React from 'react';
import PropTypes from 'prop-types';
import SchoolIcon from '@material-ui/icons/School';
import WorkIcon from '@material-ui/icons/Work';
import Typography from '@material-ui/core/Typography/Typography';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';

import ScreenBlock from '../../components/ScreenBlock/ScreenBlock';
import techTheme from '../../common/techTheme';
import './WorkAndEducation.css';
import withWidth from '@material-ui/core/withWidth/withWidth';

const formatPeriod = (start, end) => `${start} – ${end}`;

// positions and educations will like be common/content.projects
const WorkAndEducation = ({ positions, educations, width }) => (
  <ScreenBlock id="Resume-work" className="ResumeWorkAndEducationBlock">
    <div className="container">
      <div className="heading">
        <Typography variant={'h4'}>Work experience & Education</Typography>
        <Typography variant={'subtitle1'}>My previous jobs and my qualifications.</Typography>
      </div>

      <VerticalTimeline animate={width === 'lg' || width === 'xl'}>
        {positions.map((position, i) => (
          <VerticalTimelineElement
            className="Resume-position"
            key={i} // eslint-disable-line react/no-array-index-key
            icon={<WorkIcon />}
            iconStyle={techTheme.postgres.style}
            date={<Typography variant={'subtitle1'}>{formatPeriod(position.startDate, position.endDate)}</Typography>}
          >
            <Typography variant={'h5'}>{position.title} @{position.company}</Typography>
            {position.keywords && (
              <div className="ResumeWorkAndEducationBlock-keywords">
                {position.keywords.map((keyword, j) => (
                  <span key={j}> {keyword.name} </span> // eslint-disable-line react/no-array-index-key
                ))}
              </div>
            )}
            <Typography variant={'subtitle2'}>{position.summary}</Typography>
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
              icon={<SchoolIcon />}
              iconStyle={techTheme.java.style}
              date={<Typography variant={'subtitle1'}>{formatPeriod(education.startDate, education.endDate)}</Typography>}
            >
              <Typography variant={'h5'}>{education.fieldOfStudy}</Typography>
              <Typography variant={'h6'}>{education.degree}</Typography>
              {education.activities &&
                !Array.isArray(education.activities) && <Typography variant={'subtitle2'}>{education.activities}</Typography>}
              {/*{education.activities &&*/}
                {/*Array.isArray(education.activities) && (*/}
                  {/*<Typography variant={'subtitle2'}>*/}
                    {/*{education.activities.map((activity, j) => (*/}
                      {/*<span key={j}> {activity.name} </span> // eslint-disable-line react/no-array-index-key*/}
                    {/*))}*/}
                  {/*</Typography>*/}
                {/*)}*/}
              {education.summary && <Typography variant={'subtitle1'}>{education.summary}</Typography>}
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
  width: PropTypes.string.isRequired,
};

export default  withWidth()(WorkAndEducation);
