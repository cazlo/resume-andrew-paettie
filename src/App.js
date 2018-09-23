import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

import Resume from './containers/Resume/Resume';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    error: red,
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <div className="App">
      <Switch>
        <Route exact path="/" component={Resume} />
        <Route component={Resume} />
      </Switch>
      <br />
      <div className="pull-down">
        <p className="muted" align="center">
          &copy; 2013 - {new Date().getFullYear()}, Andrew Paettie
        </p>
      </div>
    </div>
  </MuiThemeProvider>
);

export default App;
