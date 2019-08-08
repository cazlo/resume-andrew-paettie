import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import flow from 'lodash/flow';
import { FaRegHourglass, FaArrowsAltH, FaArrowsAltV } from 'react-icons/fa';

import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Switch from '@material-ui/core/Switch/Switch';
import TextField from '@material-ui/core/TextField/TextField';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slider from '@material-ui/lab/Slider/Slider';
import Chip from '@material-ui/core/Chip/Chip';
import { MdTimer } from 'react-icons/md';
import Avatar from '@material-ui/core/Avatar/Avatar';
import Grid from '@material-ui/core/Grid/Grid';
import { withStyles } from '@material-ui/core/styles';

import {
  toggleEnableAstar,
  toggleGreedy,
  changeName,
  toggleShowPath,
} from './actions/aiConfigAction';
import { toggleWallsAreFatal, setSize, setFrameLimit, setSpeed } from './actions/gameAction';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'hidden',
    backgroundColor: theme.palette.grey['500'],
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
    padding: '22px 0px',
  },
  chipCell: {
    width: '50%',
  },
  settingsSubSection: {
    width: '95%',
    marginLeft: '1em',
  },
});

const sliders = props => {
  const { speed, numRows, numCols, frameTimeout, computedFrameTimeout } = props;

  const setSpeedOnChange = (e, v) => props.setSpeed({ speed: v });
  const setMaxFrameOnChange = (e, v) => props.setFrameLimit({ limit: v });
  const setWidthOnChange = (e, v) => props.setSize({ numRows, numCols: v });
  const setHeightOnChange = (e, v) => props.setSize({ numRows: v, numCols });

  return [
    {
      label: 'Speed (ms between frames)',
      value: speed,
      onChange: setSpeedOnChange,
      max: 0,
      min: 200,
      step: 1,
      avatar: <MdTimer />,
    },
    {
      label: 'Max Frames Timeout',
      value: frameTimeout,
      onChange: setMaxFrameOnChange,
      max: computedFrameTimeout * 2,
      min: 100,
      step: 100,
      avatar: <FaRegHourglass />,
    },
    {
      label: 'Game Width',
      value: numCols,
      onChange: setWidthOnChange,
      max: 50,
      min: 6,
      step: 1,
      avatar: <FaArrowsAltH />,
    },
    {
      label: 'Game Height',
      value: numRows,
      onChange: setHeightOnChange,
      max: 50,
      min: 6,
      step: 1,
      avatar: <FaArrowsAltV />,
    },
  ];
};

const ConfigPanel = props => {
  const { aStar, greedy, playerName, showPath, wallsAreFatal, classes } = props;

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Settings</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.column}>
        <Typography variant="subtitle1"> Pathfinding Settings </Typography>
        <Grid container spacing={8} direction="row" className={classes.settingsSubSection}>
          <Grid item xs>
            <FormControlLabel
              label="Shortest Path to Food"
              /* eslint-disable-next-line react/destructuring-assignment */
              control={<Switch checked={aStar} onChange={props.toggleEnableAstar} />}
            />
          </Grid>
          <Grid item xs>
            <FormControlLabel
              label="Shortest Path to Food Else Longest Path to Tail"
              /* eslint-disable-next-line react/destructuring-assignment */
              control={<Switch checked={greedy} onChange={props.toggleGreedy} />}
            />
          </Grid>
          <Grid>
            <FormControlLabel
              label="Show Path"
              /* eslint-disable-next-line react/destructuring-assignment */
              control={<Switch checked={showPath} onChange={props.toggleShowPath} />}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1"> Game Settings </Typography>
        <Grid container spacing={8} direction="row" className={classes.settingsSubSection}>
          <Grid item xs>
            <form noValidate autoComplete="off">
              <TextField
                // autoFocus
                margin="dense"
                id="playerName"
                label="Name"
                type="name"
                placeholder={playerName}
                value={playerName}
                // fullWidth
                variant="outlined"
                disabled={false}
                /* eslint-disable-next-line react/destructuring-assignment */
                onChange={props.changeName}
              />
            </form>
          </Grid>
          <Grid item xs>
            <FormControlLabel
              label="Boundary Kills Snake"
              /* eslint-disable-next-line react/destructuring-assignment */
              control={<Switch checked={wallsAreFatal} onChange={props.toggleWallsAreFatal} />}
            />
          </Grid>
          <Grid container spacing={8} direction="column">
            {sliders(props).map(slider => (
              <Grid key={`${slider.label}`} container direction="column">
                <Grid item xs={4}>
                  <Chip
                    label={`${slider.label}: ${slider.value.toFixed(0)}`}
                    color="primary"
                    avatar={<Avatar>{slider.avatar}</Avatar>}
                  />
                </Grid>
                <Grid item xs>
                  <Slider
                    classes={{ container: classes.slider }}
                    value={slider.value}
                    max={slider.max}
                    min={slider.min}
                    step={slider.step}
                    aria-labelledby={`${slider.label}: ${slider.value}`}
                    onChange={slider.onChange}
                  />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
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
  /* eslint-disable react/no-unused-prop-types */
  speed: PropTypes.number.isRequired,
  numRows: PropTypes.number.isRequired,
  numCols: PropTypes.number.isRequired,
  frameTimeout: PropTypes.number.isRequired,
  computedFrameTimeout: PropTypes.number.isRequired,
  classes: PropTypes.shape({}).isRequired,

  toggleEnableAstar: PropTypes.func.isRequired,
  toggleGreedy: PropTypes.func.isRequired,
  changeName: PropTypes.func.isRequired,
  toggleShowPath: PropTypes.func.isRequired,
  toggleWallsAreFatal: PropTypes.func.isRequired,
  setSize: PropTypes.func.isRequired,
  setFrameLimit: PropTypes.func.isRequired,
  setSpeed: PropTypes.func.isRequired,
  /* eslint-enable react/no-unused-prop-types */
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleEnableAstar,
      toggleGreedy,
      toggleShowPath,
      changeName,
      toggleWallsAreFatal,
      setSize,
      setFrameLimit,
      setSpeed,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  ...state.aiConfig,
  ...state.game.game,
});
const decorators = flow([
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withStyles(styles),
]);

export default decorators(ConfigPanel);
