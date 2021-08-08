import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

import Resume from './containers/Resume/Resume';
import NotFound from './components/NotFound/NotFound';

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: blue,
    secondary: red,
  },
  typography: {
    useNextVariants: true,
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <div className="App">
      <Switch>
        <Route exact path="/" component={Resume} />
        <Route exact path="/about" component={() => <Resume scrollTo="ResumeAboutMe" />} />
        <Route exact path="/skills" component={() => <Resume scrollTo="ResumeSkills" />} />
        <Route exact path="/experience" component={() => <Resume scrollTo="ResumeExperience" />} />
        <Route exact path="/projects" component={() => <Resume scrollTo="ResumeProjects" />} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </MuiThemeProvider>
);

export default App;
