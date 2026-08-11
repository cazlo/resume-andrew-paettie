import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline/CssBaseline';

import Resume from './containers/Resume/Resume';
import NotFound from './components/NotFound/NotFound';
import theme from './common/vaporwaveTheme';

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
