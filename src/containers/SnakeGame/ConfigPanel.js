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
import GridList from '@material-ui/core/GridList/GridList';
import GridListTile from '@material-ui/core/GridListTile/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader';
import { withStyles } from '@material-ui/core/styles';

import {
toggleEnableAstar, toggleGreedyShortestPathToTail, changeName,
} from './actions/aiConfigAction';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
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
    padding: '22px 0px',
  },
  gridList: {
    width: "100%",
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
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant={"h6"}>Controls</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.column}>
        <GridList className={classes.gridList}>
          <GridListTile cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">Path Finding</ListSubheader>
          </GridListTile>
          <form noValidate autoComplete="off">
            <GridListTile cols={1}>
            <FormControlLabel
              label="A* shortest path to food"
              control={
                <Switch
                  checked={enableAI}
                  onChange={props.toggleEnableAI}
                />
              }
            />
            </GridListTile>
            <GridListTile cols={1}>
            <FormControlLabel
              label="Shortest Path To Food Else Longest Path To Tail"
              control={
                <Switch
                  checked={greedyShortestPathToTail}
                  onChange={props.toggleGreedyShortestPathToTail}
                />
              }
            />
            </GridListTile>
          </form>

          <GridListTile cols={2} style={{ height: 'auto' }}>
            <ListSubheader component="div">Game Settings</ListSubheader>
          </GridListTile>
          <GridListTile>
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
          </GridListTile>
        </GridList>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

ConfigPanel.propTypes = {
  playerName: PropTypes.string.isRequired,
  enableAI: PropTypes.bool.isRequired,
  greedyShortestPathToTail: PropTypes.bool.isRequired,
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
const decorators = flow([connect(mapStateToProps, mapDispatchToProps), withStyles(styles)]);

export default decorators(ConfigPanel);
