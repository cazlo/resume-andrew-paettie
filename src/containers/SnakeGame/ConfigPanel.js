import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import flow from 'lodash/flow';
import { MdTimer } from 'react-icons/md';
import { FaArrowsAltH, FaArrowsAltV, FaRegHourglass } from 'react-icons/fa';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Switch from '@mui/material/Switch/Switch';
import TextField from '@mui/material/TextField/TextField';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip/Chip';
import Avatar from '@mui/material/Avatar/Avatar';
import Grid from '@mui/material/Grid/Grid';
import Card from '@mui/material/Card/Card';
import { CardContent, CardHeader, Container, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { changeName, setAlgorithm, toggleShowPath } from './actions/aiConfigAction';
import { setFrameLimit, setSize, setSpeed, toggleWallsAreFatal } from './actions/gameAction';
import Action from './actions/Action';

const sliders = props => {
  const { speed, frameTimeout, computedFrameTimeout } = props;

  const setSpeedOnChange = (e, v) => props.setSpeed({ speed: v });
  const setMaxFrameOnChange = (e, v) => props.setFrameLimit({ limit: v });

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
  ];
};
const gameSizeSliders = props => {
  const { numRows, numCols } = props;

  const setWidthOnChange = (e, v) => props.setSize({ numRows, numCols: v });
  const setHeightOnChange = (e, v) => props.setSize({ numRows: v, numCols });

  return [
    {
      label: 'Height',
      vertical: true,
      value: numRows,
      onChange: setHeightOnChange,
      max: 30,
      min: 6,
      step: 1,
      avatar: <FaArrowsAltV />,
    },
    {
      label: 'Width',
      vertical: false,
      value: numCols,
      onChange: setWidthOnChange,
      max: 50,
      min: 6,
      step: 1,
      avatar: <FaArrowsAltH />,
    },
  ];
};

const ConfigPanel = props => {
  const { playerName, showPath, wallsAreFatal, algorithm } = props;
  const theme = useTheme();
  return (
    <Card sx={{ backgroundColor: theme.palette.grey['500'] }}>
      <CardHeader title="Settings" />
      <CardContent>
        <Stack direction={useMediaQuery(theme.breakpoints.up('md')) ? 'row' : 'column'} spacing={4}>
          <Card>
            <CardHeader subheader="Game Settings " />
            <CardContent>
              <Grid container sx={{ flexGrow: 1 }} justifyContent="center" spacing={2}>
                <Grid item>
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
                  <FormControlLabel
                    label="Boundary Kills Snake"
                    /* eslint-disable-next-line react/destructuring-assignment */
                    control={<Switch checked={wallsAreFatal} onChange={props.toggleWallsAreFatal} />}
                  />
                </Grid>
                <Grid item>
                  <Container>
                    {sliders(props).map(slider => (
                      <Grid key={`${slider.label}`} container direction="column">
                        <Grid item xs={4}>
                          <Chip
                            size="medium"
                            label={`${slider.label}: ${slider.value.toFixed(0)}`}
                            color="primary"
                            avatar={<Avatar>{slider.avatar}</Avatar>}
                          />
                        </Grid>
                        <Grid item xs>
                          <Slider
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
                  </Container>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Game Size" />
            <CardContent>
              <Stack direction="row">
                {gameSizeSliders(props).map(slider => (
                  <Grid key={`${slider.label}`} container direction="column" sx={{ height: '150px', width: '150px' }}>
                    <Grid item xs>
                      <Slider
                        orientation={slider.vertical ? 'vertical' : 'horizontal'}
                        valueLabelDisplay="on"
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
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardHeader subheader="Pathfinding Settings " />
            <CardContent>
              <Stack container spacing={4} direction="column">
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Algorithm</InputLabel>
                  <Select
                    labelId="algorithm-select-label"
                    id="algorithm-select"
                    value={algorithm}
                    label="Algorithm"
                    /* eslint-disable-next-line react/destructuring-assignment */
                    onChange={event => props.setAlgorithm(event.target.value)}
                  >
                    <MenuItem value={Action.ALGORITHMS.astar}>Shortest Path to Food</MenuItem>
                    <MenuItem value={Action.ALGORITHMS.greedy}>
                      Shortest Path to Food Else Longest Path to Tail
                    </MenuItem>
                    <MenuItem value={Action.ALGORITHMS.none}>None</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  label="Show Path"
                  /* eslint-disable-next-line react/destructuring-assignment */
                  control={<Switch checked={showPath} onChange={props.toggleShowPath} />}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  );
};

ConfigPanel.propTypes = {
  algorithm: PropTypes.oneOf(Object.values(Action.ALGORITHMS)).isRequired,
  playerName: PropTypes.string.isRequired,
  showPath: PropTypes.bool.isRequired,
  wallsAreFatal: PropTypes.bool.isRequired,
  /* eslint-disable react/no-unused-prop-types */
  speed: PropTypes.number.isRequired,
  numRows: PropTypes.number.isRequired,
  numCols: PropTypes.number.isRequired,
  frameTimeout: PropTypes.number.isRequired,
  computedFrameTimeout: PropTypes.number.isRequired,
  changeName: PropTypes.func.isRequired,
  toggleShowPath: PropTypes.func.isRequired,
  toggleWallsAreFatal: PropTypes.func.isRequired,
  setAlgorithm: PropTypes.func.isRequired,
  setSize: PropTypes.func.isRequired,
  setFrameLimit: PropTypes.func.isRequired,
  setSpeed: PropTypes.func.isRequired,
  /* eslint-enable react/no-unused-prop-types */
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setAlgorithm,
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
