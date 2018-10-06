import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import './GridCell.css';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const Scoreboard = props => {
  const { classes, scores } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Player Name</TableCell>
            <TableCell numeric>Score</TableCell>
            <TableCell numeric>Duration (s)</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map(row => (
            <TableRow key={`${row.time} ${row.score}`}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell numeric>{row.score}</TableCell>
              <TableCell numeric>{row.duration}</TableCell>
              <TableCell numeric>{row.time}</TableCell>
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
