import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';

import { blue, red } from '@mui/material/colors';
import Resume from './containers/Resume/Resume';
import NotFound from './components/NotFound/NotFound';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: blue,
    secondary: red,
  },
});

const App = () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  </StyledEngineProvider>
);

export default App;
