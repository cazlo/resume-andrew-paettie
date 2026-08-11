import React from 'react';
import Typography from '@mui/material/Typography/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Fade } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

const moveDateToCardBreakpoint = 'md';

/**
 * A timeline row that fades its card in the first time it scrolls into view.
 *
 * `periodDescription` is optional. Rows whose card prints its own dates leave
 * it out — the experience timeline does, because a date on the rail sits
 * directly on the animated backdrop and stops being readable. Projects still
 * pass it, as nothing animates behind that section.
 */
export default function ReactiveTimelineItem({ periodDescription, icon, child, sceneId }) {
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up(moveDateToCardBreakpoint));
  const { ref, inView } = useInView({
    threshold: isWide ? 0.4 : 0.2,
    triggerOnce: true,
  });

  return (
    <TimelineItem>
      {/*
        Rendered even when there is no date to show: MUI's alternate layout
        needs the element on the opposite side to keep balancing cards left
        and right.
      */}
      <TimelineOppositeContent
        sx={{ m: 'auto 0' }}
        align="right"
        variant="subtitle2"
        color="text.secondary"
        hidden={!isWide}
      >
        {periodDescription ? <Typography variant="subtitle2">{periodDescription}</Typography> : null}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot>{icon}</TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ py: '12px', px: 2 }}>
        {/* data-scene is what ExperienceBackdrop observes to decide which
            backdrop scene the reader is currently looking at. Absent for
            entries that have no scene, which leaves the default backdrop up. */}
        <div ref={ref} data-scene={sceneId || undefined}>
          {periodDescription && !isWide ? (
            <Typography variant="subtitle1" style={{ color: 'white' }}>
              {periodDescription}
            </Typography>
          ) : null}
          <Fade in={inView} timeout={1000}>
            <Box>{child}</Box>
          </Fade>
        </div>
      </TimelineContent>
    </TimelineItem>
  );
}

ReactiveTimelineItem.propTypes = {
  periodDescription: PropTypes.string,
  icon: PropTypes.element.isRequired,
  child: PropTypes.element.isRequired,
  sceneId: PropTypes.string,
};

ReactiveTimelineItem.defaultProps = {
  periodDescription: null,
  sceneId: null,
};
