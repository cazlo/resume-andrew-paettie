import React, { useRef, useState } from 'react';
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
import { TimelineSpotlightProvider } from '../common/TimelineSpotlight';
import WorkTile from './WorkTile';
import DetailDialog from '../common/DetailDialog';
import { positionDetail, educationDetail } from './detailModel';
import sceneForPosition from '../ExperienceBackdrop/sceneForPosition';
import formatPeriod from './formatPeriod';

const moveDateToCardBreakpoint = 'md';

// positions and educations will like be common/content.projects
const WorkAndEducation = ({ positions, educations }) => {
  const theme = useTheme();
  const ref = useRef(null);
  // One dialog for the whole timeline rather than one per tile: only a single
  // drill-down can be open, and every tile renders the same way.
  const [detail, setDetail] = useState(null);

  return (
    <ScreenBlock id="Resume-work" className="ResumeWorkAndEducationBlock">
      <Container ref={ref}>
        <div className="heading">
          <h2>Experience and Education</h2>
          <Typography>My previous jobs and other qualifications.</Typography>
        </div>

        {/* One spotlight across jobs and education both: they share a rail,
            so "the row being read" has to be decided over all of them. */}
        <TimelineSpotlightProvider>
          <Timeline position={useMediaQuery(theme.breakpoints.up(moveDateToCardBreakpoint)) ? 'alternate' : 'right'}>
            {positions.map(position => (
              /* No periodDescription: the tiles print their own dates, because a
                 date on the timeline rail sits directly on the scene backdrop
                 and stops being readable. */
              <ReactiveTimelineItem
                key={formatPeriod(position)}
                icon={<Avatar sx={{ backgroundColor: '#fff' }}>{position.icon || <FcBriefcase />}</Avatar>}
                sceneId={sceneForPosition(position)}
                spotlight
                child={
                  <WorkTile position={position} elevation={24} onOpen={() => setDetail(positionDetail(position))} />
                }
              />
            ))}
            {educations.map(education => (
              <ReactiveTimelineItem
                key={formatPeriod(education)}
                spotlight
                icon={
                  <Avatar sx={{ backgroundColor: '#c65121' /* utd color */ }}>
                    {education.icon || <FcGraduationCap />}
                  </Avatar>
                }
                child={
                  <EducationTile
                    education={education}
                    elevation={24}
                    onOpen={() => setDetail(educationDetail(education))}
                  />
                }
              />
            ))}
          </Timeline>
        </TimelineSpotlightProvider>
      </Container>
      <DetailDialog open={Boolean(detail)} onClose={() => setDetail(null)} detail={detail} />
    </ScreenBlock>
  );
};

WorkAndEducation.propTypes = {
  positions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      summary: PropTypes.node,
      impact: PropTypes.string,
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
