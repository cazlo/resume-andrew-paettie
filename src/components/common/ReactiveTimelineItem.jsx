import React, { useCallback } from 'react';
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
import { useSpotlight } from './TimelineSpotlight';

const moveDateToCardBreakpoint = 'md';

/**
 * A timeline row that fades its card in when it scrolls into view.
 *
 * With `spotlight`, the row instead takes part in the winner-takes-all
 * spotlight owned by an enclosing TimelineSpotlightProvider: its card is
 * visible only while this row is the one crossing the centre of the viewport,
 * so at most one card is up at a time. The experience timeline uses this so
 * the animated backdrop stays watchable around whichever card is being read;
 * Projects leaves it off because nothing animates back there, so its cards
 * fade in once and stay.
 *
 * `periodDescription` is optional. Rows whose card prints its own dates leave
 * it out — the experience timeline does, because a date on the rail sits
 * directly on the animated backdrop and stops being readable. Projects still
 * pass it, as nothing animates behind that section.
 */
export default function ReactiveTimelineItem({ periodDescription, icon, child, sceneId, spotlight }) {
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up(moveDateToCardBreakpoint));
  // The one-way reveal for non-spotlight timelines. Skipped entirely for
  // spotlight rows, whose visibility is the provider's call.
  const { ref: revealRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
    skip: spotlight,
  });
  const { ref: spotlightRef, spotlit } = useSpotlight(spotlight);
  const visible = spotlight ? spotlit : inView;
  const rowRef = useCallback(
    node => {
      revealRef(node);
      spotlightRef(node);
    },
    [revealRef, spotlightRef],
  );

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
        <div ref={rowRef} data-scene={sceneId || undefined}>
          {periodDescription && !isWide ? (
            <Typography variant="subtitle1" style={{ color: 'white' }}>
              {periodDescription}
            </Typography>
          ) : null}
          {/* Spotlight swaps have to keep pace with scrolling — a leisurely
              reveal reads fine once, but between every pair of cards it just
              looks like nothing is on screen. */}
          <Fade in={visible} timeout={spotlight ? { enter: 500, exit: 400 } : 1000}>
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
  spotlight: PropTypes.bool,
};

ReactiveTimelineItem.defaultProps = {
  periodDescription: null,
  sceneId: null,
  spotlight: false,
};
