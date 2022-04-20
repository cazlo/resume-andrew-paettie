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

export default function ReactiveTimelineItem({ periodDescription, icon, child }) {
  const theme = useTheme();
  const { ref, inView } = useInView({
    threshold: useMediaQuery(theme.breakpoints.up(moveDateToCardBreakpoint)) ? 0.4 : 0.2,
    triggerOnce: true,
  });

  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ m: 'auto 0' }}
        align="right"
        variant="subtitle2"
        color="text.secondary"
        hidden={useMediaQuery(theme.breakpoints.down(moveDateToCardBreakpoint))}
      >
        <Typography variant="subtitle2">{periodDescription}</Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot>{icon}</TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ py: '12px', px: 2 }}>
        <div ref={ref}>
          <Typography
            variant="subtitle1"
            style={{ color: 'white' }}
            hidden={useMediaQuery(theme.breakpoints.up(moveDateToCardBreakpoint))}
          >
            {periodDescription}
          </Typography>
          <Fade
            // direction={i % 2 === 0 ? 'left' : 'right'}
            in={inView}
            // mountOnEnter
            // unmountOnExit
            // container={containerRef.current}
            timeout={1000}
          >
            <Box>{child}</Box>
          </Fade>
        </div>
      </TimelineContent>
    </TimelineItem>
  );
}

ReactiveTimelineItem.propTypes = {
  periodDescription: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  child: PropTypes.element.isRequired,
};
