import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

import Resume from './containers/Resume/Resume';
import NotFound from './components/NotFound/NotFound';

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
        <Route exact path="/about" component={() => <Resume scrollTo="ResumeAboutMe" />} />
        <Route exact path="/experience" component={() => <Resume scrollTo="ResumeExperience" />} />
        <Route exact path="/skills" component={() => <Resume scrollTo="ResumeSkills" />} />
        <Route exact path="/projects" component={() => <Resume scrollTo="ResumeProjects" />} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </MuiThemeProvider>
);

export default App;
