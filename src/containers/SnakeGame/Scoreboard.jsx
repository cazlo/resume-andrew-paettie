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
import Typography from '@mui/material/Typography/Typography';

const PREFIX = 'Scoreboard';

const classes = {
  head: `${PREFIX}-head`,
  body: `${PREFIX}-body`,
  root: `${PREFIX}-root`,
  table: `${PREFIX}-table`,
  row: `${PREFIX}-row`,
};

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    backgroundColor: theme.palette.grey['500'],
  },

  [`& .${classes.table}`]: {
    minWidth: 700,
  },

  [`& .${classes.row}`]: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}));

const CustomTableCell = TableCell;

export default function Scoreboard(props) {
  const { scores } = props;

  return (
    <StyledAccordion className={classes.root}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.root}>
        <Typography variant="h6">High Scores</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.column}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
                Player Name
              </CustomTableCell>
              <CustomTableCell
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
                Score
              </CustomTableCell>
              <CustomTableCell
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
                Duration
              </CustomTableCell>
              <CustomTableCell
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
                Frame Count
              </CustomTableCell>
              <CustomTableCell
                classes={{
                  head: classes.head,
                  body: classes.body,
                }}
              >
                Time
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map(row => (
              <TableRow className={classes.row} key={`${row.time} ${row.score}`}>
                <CustomTableCell
                  component="th"
                  scope="row"
                  classes={{
                    head: classes.head,
                    body: classes.body,
                  }}
                >
                  {row.name}
                </CustomTableCell>
                <CustomTableCell
                  classes={{
                    head: classes.head,
                    body: classes.body,
                  }}
                >
                  {row.score}
                </CustomTableCell>
                <CustomTableCell
                  classes={{
                    head: classes.head,
                    body: classes.body,
                  }}
                >
                  {row.duration}
                </CustomTableCell>
                <CustomTableCell
                  classes={{
                    head: classes.head,
                    body: classes.body,
                  }}
                >
                  {row.frameCount}
                </CustomTableCell>
                <CustomTableCell
                  classes={{
                    head: classes.head,
                    body: classes.body,
                  }}
                >
                  {row.time}
                </CustomTableCell>
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
