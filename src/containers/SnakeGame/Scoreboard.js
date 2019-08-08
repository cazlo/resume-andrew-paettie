import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import grey from '@material-ui/core/colors/grey';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
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

const styles = theme => ({
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
});

const Scoreboard = props => {
  const { classes, scores } = props;

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.root}>
        <Typography variant="h6">High Scores</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.column}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Player Name</CustomTableCell>
              <CustomTableCell numeric>Score</CustomTableCell>
              <CustomTableCell numeric>Duration</CustomTableCell>
              <CustomTableCell numeric>Frame Count</CustomTableCell>
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
                <CustomTableCell numeric>{row.frameCount}</CustomTableCell>
                <CustomTableCell numeric>{row.time}</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

Scoreboard.propTypes = {
  scores: PropTypes.arrayOf(
    PropTypes.shape({
      score: PropTypes.number,
      duration: PropTypes.string,
      frameCount: PropTypes.string,
      time: PropTypes.string,
    }),
  ),
  classes: PropTypes.shape({}).isRequired,
};

Scoreboard.defaultProps = {
  scores: [],
};

export default withStyles(styles)(Scoreboard);
