import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Switch from '@material-ui/core/Switch/Switch';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import { saveConfigDialog, toggleEnableAI, toggleConfigDialog, changeName } from './actions/aiConfigAction';

const ConfigDialog = props => {
  const {
    dialogOpen,
    enableAI,
    playerName,
    saveConfigDialog,
    toggleEnableAI,
    toggleConfigDialog,
    changeName,
  } = props;

  return (
    <Dialog open={dialogOpen} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Game Controls</DialogTitle>
      <DialogContent>
        <DialogContentText>Adjust settings for this game</DialogContentText>
        <FormControlLabel
          label="Enable AI"
          control={
            <Switch
              value="checkedEnableAI"
              checked={enableAI}
              onChange={(event) => toggleEnableAI(event)}
            />
          }
        />
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Player Name"
          type="name"
          defaultValue={playerName}
          fullWidth
          // inputRef={playerNameRef}
          onChange={(event) => changeName(event)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleConfigDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={saveConfigDialog} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfigDialog.propTypes = {
  playerName: PropTypes.string.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  enableAI: PropTypes.bool.isRequired,
  saveConfigDialog: PropTypes.func.isRequired,
  toggleEnableAI: PropTypes.func.isRequired,
  toggleConfigDialog: PropTypes.func.isRequired,
  changeName: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({
  saveConfigDialog,
  toggleEnableAI,
  toggleConfigDialog,
  changeName,
}, dispatch);

const mapStateToProps = state => ({
  ...state.aiConfig,
  ...state.aiConfig.userInput,
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfigDialog);
