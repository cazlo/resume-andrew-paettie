import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import flow from 'lodash/flow';

import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Switch from '@material-ui/core/Switch/Switch';
import TextField from '@material-ui/core/TextField/TextField';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

import {
toggleEnableAstar, toggleGreedyShortestPathToTail, changeName,
} from './actions/aiConfigAction';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  column: {
    flexDirection: 'column',
  },
  slider: {
    padding: '22px 0px',
  },
});

const ConfigPanel = props => {
  const {
    enableAI,
    greedyShortestPathToTail,
    playerName,
    classes
  } = props;

  return (
    <div className={classes.root}>
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.column}>
          <Typography>Game Controls</Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.column}>
        <div className={classes.column}>

        <form noValidate autoComplete="off">
          <FormControlLabel
            label="A* shortest path"
            control={
              <Switch
                checked={enableAI}
                onChange={props.toggleEnableAI}
              />
            }
          />
          <FormControlLabel
            label="Greedy Shortest Path to Tail"
            control={
              <Switch
                checked={greedyShortestPathToTail}
                onChange={props.toggleGreedyShortestPathToTail}
              />
            }
          />
          <TextField
            // autoFocus
            margin="dense"
            id="playerName"
            label="Player Name"
            type="name"
            placeholder={playerName}
            value={playerName}
            // fullWidth
            variant="outlined"
            disabled={false}
            onChange={props.changeName}
          />
        </form>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
    </div>
  );
};

ConfigPanel.propTypes = {
  playerName: PropTypes.string.isRequired,
  enableAI: PropTypes.bool.isRequired,
  greedyShortestPathToTail: PropTypes.bool.isRequired,
  nodesSurroundingSnakeCostMultiplier: PropTypes.number.isRequired,
  nodesInCurrentDirectionOfTravelCostMultiplier: PropTypes.number.isRequired,
  normalNodeCostMultiplier: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,

  toggleEnableAI: PropTypes.func.isRequired,
  toggleGreedyShortestPathToTail: PropTypes.func.isRequired,
  changeName: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleEnableAI: toggleEnableAstar,
  toggleGreedyShortestPathToTail,
  changeName,
}, dispatch);

const mapStateToProps = state => ({
  ...state.aiConfig
});
const decorators = flow([withStyles(styles), connect(mapStateToProps, mapDispatchToProps)]);

export default decorators(ConfigPanel);
