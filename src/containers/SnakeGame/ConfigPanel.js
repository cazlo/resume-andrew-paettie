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
  toggleEnableAstar, toggleGreedy, changeName, toggleShowPath,
} from './actions/aiConfigAction';
import {
  toggleWallsAreFatal, setSize, setFrameLimit, setSpeed,
} from './actions/gameAction';
import Slider from '@material-ui/lab/Slider/Slider';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'hidden',
    backgroundColor: theme.palette.grey["500"],
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
    width: '100%',
    padding: '22px 0px'
  },
});

const ConfigPanel = props => {
  const {
    aStar,
    greedy,
    playerName,
    classes,
    showPath,
    wallsAreFatal,
    speed,
    numRows,
    numCols,
    frameTimeout,
    computedFrameTimeout
  } = props;

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
        <Typography variant={'h6'}>Settings</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.column}>
        <Typography variant="subtitle1">           Pathfinding Settings            </Typography>

        <FormControlLabel
          label="Shortest Path to Food"
          control={
            <Switch
              checked={aStar}
              onChange={props.toggleEnableAstar}
            />
          }
        />
        <FormControlLabel
          label="Shortest Path to Food Else Longest Path to Tail"
          control={
            <Switch
              checked={greedy}
              onChange={props.toggleGreedy}
            />
          }
        />
        <FormControlLabel
          label="Show Path"
          control={
            <Switch
              checked={showPath}
              onChange={props.toggleShowPath}
            />
          }
        />

        <Typography variant="subtitle1">             Game Settings            </Typography>

        <form noValidate autoComplete="off">
          <TextField
            // autoFocus
            margin="dense"
            id="playerName"
            label="AI Name"
            type="name"
            placeholder={playerName}
            value={playerName}
            // fullWidth
            variant="outlined"
            disabled={false}
            onChange={props.changeName}
          />
        </form>

        <FormControlLabel
          label="Moving Beyond World Boundary Kills Snake"
          control={
            <Switch
              checked={wallsAreFatal}
              onChange={props.toggleWallsAreFatal}
            />
          }
        />

        <Typography id="label">Speed </Typography>
        <Slider
          classes={{ container: classes.slider }}
          value={speed}
          max={0}
          min={200}
          aria-labelledby="label"
          onChange={(e, v) => props.setSpeed({ speed: v })}
        />

        <Typography id="label">Max Frame Count Timeout</Typography>
        <Slider
          classes={{ container: classes.slider }}
          value={frameTimeout}
          max={computedFrameTimeout * 2}
          min={1000}
          step={100}
          aria-labelledby="label"
          onChange={(e, v) => props.setFrameLimit({ limit: v })}
        />

        <Typography id="label">Game Width</Typography>
        <Slider
          classes={{ container: classes.slider }}
          value={numCols}
          max={50}
          min={6}
          step={1}
          aria-labelledby="label"
          onChange={(e,v) => props.setSize({ numRows, numCols : v })}
        />

        <Typography id="label">Game Height</Typography>
        <Slider
          classes={{ container: classes.slider }}
          value={numRows}
          max={50}
          min={6}
          step={1}
          aria-labelledby="label"
          onChange={(e, v) => props.setSize({ numRows: v, numCols })}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

ConfigPanel.propTypes = {
  aStar: PropTypes.bool.isRequired,
  greedy: PropTypes.bool.isRequired,
  playerName: PropTypes.string.isRequired,
  showPath: PropTypes.bool.isRequired,
  wallsAreFatal: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  numRows: PropTypes.number.isRequired,
  numCols: PropTypes.number.isRequired,
  frameTimeout: PropTypes.number.isRequired,
  computedFrameTimeout: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,

  toggleEnableAstar: PropTypes.func.isRequired,
  toggleGreedy: PropTypes.func.isRequired,
  changeName: PropTypes.func.isRequired,
  toggleShowPath: PropTypes.func.isRequired,
  toggleWallsAreFatal: PropTypes.func.isRequired,
  setSize: PropTypes.func.isRequired,
  setFrameLimit: PropTypes.func.isRequired,
  setSpeed: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleEnableAstar, toggleGreedy, toggleShowPath,
  changeName,
  toggleWallsAreFatal, setSize, setFrameLimit, setSpeed,
}, dispatch);

const mapStateToProps = state => ({
  ...state.aiConfig,
  ...state.game.game,
});
const decorators = flow([connect(mapStateToProps, mapDispatchToProps), withStyles(styles)]);

export default decorators(ConfigPanel);
