import React from 'react';
import { Route, Routes } from 'react-router-dom';

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
        <Routes>
          <Route exact path="/" element={<Resume />} />
          <Route exact path="/about" element={<Resume scrollTo="ResumeAboutMe" />} />
          <Route exact path="/skills" element={<Resume scrollTo="ResumeSkills" />} />
          <Route exact path="/experience" element={<Resume scrollTo="ResumeExperience" />} />
          <Route exact path="/projects" element={<Resume scrollTo="ResumeProjects" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  </StyledEngineProvider>
);

export default App;
