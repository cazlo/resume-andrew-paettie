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
import Slider from '@material-ui/lab/Slider/Slider';
import { withStyles } from '@material-ui/core/styles';

import {
toggleEnableAI, changeName,
changeDotCostMultiplier, changeNormalCostMultiplier, changeSurroundingCostMultiplier
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

});

const ConfigPanel = props => {
  const {
    enableAI,
    playerName,
    nodesSurroundingSnakeCostMultiplier,
    nodesInCurrentDirectionOfTravelCostMultiplier,
    normalNodeCostMultiplier,
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
        </div>
        <Typography>Weight of nodes surrounding snake</Typography>
        <Slider
          min={1} max={1000}
          onChange={(e,v) => props.changeSurroundingCostMultiplier(v)}
          value={nodesSurroundingSnakeCostMultiplier}
          style={{width:"95%"}}
        />
        <Typography>Weight of nodes in the snake{"'"}s current direction of travel</Typography>
        <Slider
          min={1} max={1000}
          onChange={(e,v) => props.changeDotCostMultiplier(v)}
          value={nodesInCurrentDirectionOfTravelCostMultiplier}
          style={{width:"95%"}}
        />
        <Typography>Weight of any other walkable nodes</Typography>
        <Slider
          min={1} max={1000}
          onChange={(e,v) => props.changeNormalCostMultiplier(v)}
          value={normalNodeCostMultiplier}
          style={{width:"95%"}}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
    </div>
  );
};

ConfigPanel.propTypes = {
  playerName: PropTypes.string.isRequired,
  enableAI: PropTypes.bool.isRequired,
  nodesSurroundingSnakeCostMultiplier: PropTypes.number.isRequired,
  nodesInCurrentDirectionOfTravelCostMultiplier: PropTypes.number.isRequired,
  normalNodeCostMultiplier: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,

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
const decorators = flow([withStyles(styles), connect(mapStateToProps, mapDispatchToProps)]);

export default decorators(ConfigPanel);
