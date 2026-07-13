import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import Typography from '@mui/material/Typography/Typography';
import Box from '@mui/material/Box';

const PREFIX = 'Scoreboard';

const classes = {
  root: `${PREFIX}-root`,
  table: `${PREFIX}-table`,
  row: `${PREFIX}-row`,
};

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  [`&.${classes.root}`]: {
    background: 'linear-gradient(145deg, rgba(20, 34, 28, 0.96), rgba(11, 20, 16, 0.96))',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: `${theme.shape.borderRadius * 2}px !important`,
    boxShadow: 'none',
    width: '100%',
    '&::before': {
      display: 'none',
    },
  },

  [`& .${classes.table}`]: {
    minWidth: 620,
    '& th': {
      borderBottomColor: 'rgba(255, 255, 255, 0.09)',
      color: theme.palette.text.secondary,
      fontSize: '0.7rem',
      fontWeight: 800,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    '& td': {
      borderBottomColor: 'rgba(255, 255, 255, 0.055)',
    },
  },

  [`& .${classes.row}`]: {
    transition: 'background-color 160ms ease',
    '&:hover': {
      backgroundColor: 'rgba(143, 193, 96, 0.055)',
    },
  },
}));

const CustomTableCell = TableCell;

export default function Scoreboard(props) {
  const { scores } = props;

  return (
    <StyledAccordion className={classes.root}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
        sx={{ minHeight: 72, px: { xs: 2, sm: 2.5 } }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5 }}>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(143, 193, 96, 0.1)',
              border: '1px solid rgba(143, 193, 96, 0.2)',
              borderRadius: 1.5,
              color: 'primary.main',
              display: 'flex',
              height: 40,
              justifyContent: 'center',
              width: 40,
            }}
          >
            <EmojiEventsOutlinedIcon fontSize="small" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, lineHeight: 1.25 }} variant="subtitle1">
              Run history
            </Typography>
            <Typography sx={{ color: 'text.secondary' }} variant="caption">
              High scores and completed simulations
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ overflowX: 'auto', px: { xs: 1, sm: 2.5 }, pt: 0 }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Player</CustomTableCell>
              <CustomTableCell>Score</CustomTableCell>
              <CustomTableCell>Duration</CustomTableCell>
              <CustomTableCell>Frames</CustomTableCell>
              <CustomTableCell>Time</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map(row => (
              <TableRow className={classes.row} key={`${row.time} ${row.score}`}>
                <CustomTableCell component="th" scope="row" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {row.name}
                </CustomTableCell>
                <CustomTableCell sx={{ color: 'primary.main', fontWeight: 800 }}>{row.score}</CustomTableCell>
                <CustomTableCell>{row.duration || '—'}</CustomTableCell>
                <CustomTableCell>{row.frameCount || '—'}</CustomTableCell>
                <CustomTableCell>{row.time}</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionDetails>
    </StyledAccordion>
  );
}

Scoreboard.propTypes = {
  scores: PropTypes.arrayOf(
    PropTypes.shape({
      score: PropTypes.number,
      duration: PropTypes.string,
      frameCount: PropTypes.string,
      time: PropTypes.string,
    }),
  ),
};

Scoreboard.defaultProps = {
  scores: [],
};
