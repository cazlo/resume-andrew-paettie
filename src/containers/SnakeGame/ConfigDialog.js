import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Switch from '@material-ui/core/Switch/Switch';
import TextField from '@material-ui/core/TextField/TextField';
import Grid from '@material-ui/core/Grid';

import {
  toggleEnableAI, changeName,
  changeDotCostMultiplier, changeNormalCostMultiplier, changeSurroundingCostMultiplier
} from './actions/aiConfigAction';
import Slider from '@material-ui/lab/Slider/Slider';
import Typography from '@material-ui/core/Typography/Typography';

const ConfigPanel = props => {
  const {
    enableAI,
    playerName,
    nodesSurroundingSnakeCostMultiplier,
    nodesInCurrentDirectionOfTravelCostMultiplier,
    normalNodeCostMultiplier,
  } = props;

  return (
    <Grid container spacing={24} direction={'column'} style={{margin:"2px"}}>
      <Grid item xs={12}><h2>Game Controls</h2></Grid>
      <Grid item xs={12}><h3>Adjust settings for this game</h3></Grid>
      <Grid item xs={12}>
        <form noValidate autoComplete="off">
          <FormControlLabel
            label="Enable AI"
            control={
              <Switch
                value="checkedEnableAI"
                checked={enableAI}
                onChange={props.toggleEnableAI}
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
      </Grid>
      <Grid item xs={12}>
        <Typography>Weight of nodes surrounding snake</Typography>
        <Slider
          min={1} max={1000}
          onChange={(e,v) => props.changeSurroundingCostMultiplier(v)}
          value={nodesSurroundingSnakeCostMultiplier}
          style={{width:"95%"}}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Weight of nodes in the snake{"'"}s current direction of travel</Typography>
        <Slider
          min={1} max={1000}
          onChange={(e,v) => props.changeDotCostMultiplier(v)}
          value={nodesInCurrentDirectionOfTravelCostMultiplier}
          style={{width:"95%"}}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography>Weight of any other walkable nodes</Typography>
        <Slider
          min={1} max={1000}
          onChange={(e,v) => props.changeNormalCostMultiplier(v)}
          value={normalNodeCostMultiplier}
          style={{width:"95%"}}
        />
      </Grid>
      </Grid>
  );
};

ConfigPanel.propTypes = {
  playerName: PropTypes.string.isRequired,
  enableAI: PropTypes.bool.isRequired,
  nodesSurroundingSnakeCostMultiplier: PropTypes.number.isRequired,
  nodesInCurrentDirectionOfTravelCostMultiplier: PropTypes.number.isRequired,
  normalNodeCostMultiplier: PropTypes.number.isRequired,

  toggleEnableAI: PropTypes.func.isRequired,
  changeName: PropTypes.func.isRequired,
  changeDotCostMultiplier: PropTypes.func.isRequired,
  changeNormalCostMultiplier: PropTypes.func.isRequired,
  changeSurroundingCostMultiplier: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleEnableAI,
  changeName,
  changeDotCostMultiplier, changeNormalCostMultiplier, changeSurroundingCostMultiplier,
}, dispatch);

const mapStateToProps = state => ({
  ...state.aiConfig
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfigPanel);
