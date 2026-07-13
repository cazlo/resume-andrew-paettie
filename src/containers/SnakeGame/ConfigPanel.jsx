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

import Typography from '@mui/material/Typography';
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
      max: 2000,
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

const settingsCardSx = {
  background: 'linear-gradient(145deg, rgba(20, 34, 28, 0.98), rgba(11, 20, 16, 0.98))',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: 'none',
  flex: '1 1 300px',
  minWidth: 0,
  '& .MuiCardHeader-subheader': {
    color: 'text.primary',
    fontSize: '0.9rem',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
};

export const ConfigPanel = props => {
  const { playerName, showPath, wallsAreFatal, algorithm } = props;
  return (
    <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none', p: { xs: 1, sm: 2.5 } }}>
      <CardHeader
        subheader="Tune simulation speed, board dimensions, and solver behavior. Changes apply to the next run."
        subheaderTypographyProps={{ sx: { color: 'text.secondary', mt: 0.5 } }}
        sx={{ pr: 8 }}
        title="Simulation controls"
        titleTypographyProps={{ sx: { fontWeight: 800, letterSpacing: '-0.02em' }, variant: 'h5' }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
          <Card sx={settingsCardSx}>
            <CardHeader subheader="Game settings" />
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
          <Card sx={settingsCardSx}>
            <CardHeader subheader="Game Size" />
            <CardContent>
              <Stack direction="row">
                {gameSizeSliders(props).map(slider => (
                  <Grid
                    key={`${slider.label}`}
                    alignItems="center"
                    container
                    direction="column"
                    sx={{ height: '190px', overflow: 'visible', px: 2, width: '150px' }}
                  >
                    <Grid item>
                      <Typography
                        id={`game-size-${slider.label.toLowerCase()}`}
                        sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}
                        variant="caption"
                      >
                        {slider.label}: {slider.value}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      data-testid={`game-size-${slider.label.toLowerCase()}-track`}
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexGrow: 1,
                        justifyContent: 'center',
                        minHeight: 0,
                        overflow: 'visible',
                        width: slider.vertical ? 'auto' : '100%',
                      }}
                    >
                      <Slider
                        orientation={slider.vertical ? 'vertical' : 'horizontal'}
                        valueLabelDisplay="auto"
                        value={slider.value}
                        max={slider.max}
                        min={slider.min}
                        step={slider.step}
                        aria-labelledby={`game-size-${slider.label.toLowerCase()}`}
                        onChange={slider.onChange}
                        sx={{
                          ...(slider.vertical ? { height: '120px' } : { width: '100%' }),
                          '& .MuiSlider-valueLabel': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            zIndex: 2,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            </CardContent>
          </Card>
          <Card sx={settingsCardSx}>
            <CardHeader subheader="Pathfinding" />
            <CardContent>
              <Stack spacing={4} direction="column">
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
                    <MenuItem value={Action.ALGORITHMS.hamiltonian}>Hamiltonian Cycle (even boards)</MenuItem>
                    <MenuItem value={Action.ALGORITHMS.hamiltonianShortcut}>
                      Hamiltonian Cycle with Safe Shortcuts (even boards)
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
