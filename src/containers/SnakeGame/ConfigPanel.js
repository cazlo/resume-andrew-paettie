import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import flow from 'lodash/flow';
import { FaArrowsAltH, FaArrowsAltV, FaRegHourglass } from 'react-icons/fa';

import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Switch from '@mui/material/Switch/Switch';
import TextField from '@mui/material/TextField/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip/Chip';
import { MdTimer } from 'react-icons/md';
import Avatar from '@mui/material/Avatar/Avatar';
import Grid from '@mui/material/Grid/Grid';

import { changeName, toggleEnableAstar, toggleGreedy, toggleShowPath } from './actions/aiConfigAction';
import { setFrameLimit, setSize, setSpeed, toggleWallsAreFatal } from './actions/gameAction';

const PREFIX = 'ConfigPanel';

const classes = {
  root: `${PREFIX}-root`,
  heading: `${PREFIX}-heading`,
  secondaryHeading: `${PREFIX}-secondaryHeading`,
  column: `${PREFIX}-column`,
  slider: `${PREFIX}-slider`,
  chipCell: `${PREFIX}-chipCell`,
  settingsSubSection: `${PREFIX}-settingsSubSection`,
};

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    overflowX: 'hidden',
    backgroundColor: theme.palette.grey['500'],
  },

  [`& .${classes.heading}`]: {
    fontSize: theme.typography.pxToRem(15),
  },

  [`& .${classes.secondaryHeading}`]: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  [`& .${classes.column}`]: {
    flexDirection: 'column',
  },

  [`& .${classes.slider}`]: {
    width: '100%',
    padding: '22px 0px',
  },

  [`& .${classes.chipCell}`]: {
    width: '50%',
  },

  [`& .${classes.settingsSubSection}`]: {
    width: '95%',
    marginLeft: '1em',
  },
}));

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
      max: 200,
      min: 0,
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
  const { aStar, greedy, playerName, showPath, wallsAreFatal } = props;

  return (
    <StyledAccordion className={classes.root}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Settings</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.column}>
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
                    className={classes.slider}
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
      </AccordionDetails>
    </StyledAccordion>
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
const decorators = flow([connect(mapStateToProps, mapDispatchToProps)]);

export default decorators(ConfigPanel);
