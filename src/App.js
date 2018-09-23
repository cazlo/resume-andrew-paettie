import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

import Resume from './containers/Resume/Resume';
import Copyright from './components/Copyright/Copyright';

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
      <Copyright />
    </div>
  </MuiThemeProvider>
);

export default App;
