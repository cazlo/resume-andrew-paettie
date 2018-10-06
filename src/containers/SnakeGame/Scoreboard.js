import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';

import './GridCell.css';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: grey.A700,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

const Scoreboard = props => {
  const { classes, scores } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Player Name</CustomTableCell>
            <CustomTableCell numeric>Score</CustomTableCell>
            <CustomTableCell numeric>Duration</CustomTableCell>
            <CustomTableCell>Time</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map(row => (
            <TableRow className={classes.row} key={`${row.time} ${row.score}`}>
              <CustomTableCell component="th" scope="row">
                {row.name}
              </CustomTableCell>
              <CustomTableCell numeric>{row.score}</CustomTableCell>
              <CustomTableCell numeric>{row.duration}</CustomTableCell>
              <CustomTableCell numeric>{row.time}</CustomTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

Scoreboard.propTypes = {
  scores: PropTypes.array,
  classes: PropTypes.object.isRequired,
};

Scoreboard.defaultPropTypes = {
  scores: [],
};

export default withStyles(styles)(Scoreboard);
