import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { Timeline } from '@mui/lab';
import { Container } from '@mui/material';
import { FcBriefcase, FcGraduationCap } from 'react-icons/fc';
import Avatar from '@mui/material/Avatar';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import EducationTile from './EducationTile';
import ReactiveTimelineItem from '../common/ReactiveTimelineItem';
import WorkTile from './WorkTile';

const formatPeriod = duration => `${duration.startDate} – ${duration.endDate}`;

const moveDateToCardBreakpoint = 'md';

// positions and educations will like be common/content.projects
const WorkAndEducation = ({ positions, educations }) => {
  const theme = useTheme();
  const ref = useRef(null);
  return (
    <ScreenBlock id="Resume-work" className="ResumeWorkAndEducationBlock">
      <Container ref={ref}>
        <div className="heading">
          <h2>Experience and Education</h2>
          <Typography>My previous jobs and other qualifications.</Typography>
        </div>

        <Timeline position={useMediaQuery(theme.breakpoints.up(moveDateToCardBreakpoint)) ? 'alternate' : 'right'}>
          {positions.map((position, i) => (
            <ReactiveTimelineItem
              periodDescription={formatPeriod(position)}
              key={formatPeriod(position)}
              icon={<Avatar sx={{ backgroundColor: '#fff' }}>{position.icon || <FcBriefcase />}</Avatar>}
              child={<WorkTile position={position} index={i} elevation={24 - i * 5.7} />}
            />
          ))}
          {educations.map((education, i) => (
            <ReactiveTimelineItem
              periodDescription={formatPeriod(education)}
              key={formatPeriod(education)}
              icon={
                <Avatar sx={{ backgroundColor: '#c65121' /* utd color */ }}>
                  {education.icon || <FcGraduationCap />}
                </Avatar>
              }
              child={<EducationTile education={education} elevation={24 - i} />}
            />
          ))}
        </Timeline>
      </Container>
    </ScreenBlock>
  );
};

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
};

export default WorkAndEducation;
