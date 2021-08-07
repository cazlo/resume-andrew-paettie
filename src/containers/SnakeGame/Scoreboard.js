import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import grey from '@material-ui/core/colors/grey';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography/Typography';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: grey.A700,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    backgroundColor: theme.palette.grey['500'],
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}));

export default function Scoreboard(props) {
  const { scores } = props;
  const classes = useStyles();

  return (
    <Accordion className={classes.root}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.root}>
        <Typography variant="h6">High Scores</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.column}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Player Name</CustomTableCell>
              <CustomTableCell>Score</CustomTableCell>
              <CustomTableCell>Duration</CustomTableCell>
              <CustomTableCell>Frame Count</CustomTableCell>
              <CustomTableCell>Time</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.map(row => (
              <TableRow className={classes.row} key={`${row.time} ${row.score}`}>
                <CustomTableCell component="th" scope="row">
                  {row.name}
                </CustomTableCell>
                <CustomTableCell>{row.score}</CustomTableCell>
                <CustomTableCell>{row.duration}</CustomTableCell>
                <CustomTableCell>{row.frameCount}</CustomTableCell>
                <CustomTableCell>{row.time}</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
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
