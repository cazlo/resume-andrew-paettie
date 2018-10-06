import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Switch from '@material-ui/core/Switch/Switch';
import TextField from '@material-ui/core/TextField/TextField';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';

const ConfigDialog = props => {
  const {
    dialogOpen,
    enableAIChecked,
    playerName,
    playerNameRef,
    checkEnableAiToggled,
    closeSettings,
    closeAndSaveSettings,
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
              checked={enableAIChecked}
              onChange={checkEnableAiToggled}
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
          inputRef={playerNameRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeSettings} color="primary">
          Cancel
        </Button>
        <Button onClick={closeAndSaveSettings} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfigDialog.propTypes = {
  playerName: PropTypes.string.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  enableAIChecked: PropTypes.bool.isRequired,
  playerNameRef: PropTypes.object.isRequired,
  checkEnableAiToggled: PropTypes.func.isRequired,
  closeSettings: PropTypes.func.isRequired,
  closeAndSaveSettings: PropTypes.func.isRequired,
};

export default ConfigDialog;
