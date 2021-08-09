import React from 'react';
import Button from '@material-ui/core/Button';
import { Box, Typography } from '@material-ui/core';

import PropTypes from 'prop-types';

import selfImage from '../../data/me.jpg';
import './AboutMe.css';
import ScreenBlock from '../ScreenBlock/ScreenBlock';

const Intro = ({ style }) => (
  <ScreenBlock id="Resume-aboutMe" className="ResumeAboutMeBlock" style={style}>
    <div id="" className="Resume-aboutMe container">
      <Typography className="heading">
        <h2 className="ResumeAboutMe" style={{ color: '#fff' }}>
          About Me
        </h2>
        <p id="ResumeAboutMeSubtitle" className="ResumeAboutMeBlock-Subtitle">
          A small introduction about myself
        </p>
      </Typography>
      <div className="ResumeAboutMeBlock-content">
        <Typography className="ResumeAboutMeBlock-description">
          <h3>Andrew Paettie</h3>
          <h4>Senior Software Based Solutions Engineer</h4>
          <p className="Resume-summary" />I am an experienced and capable full stack software engineer with leadership
          experience.
          <br />
          <br />
          If you are interested in hiring a full stack software engineer, check out my resume and projects. Feel free to
          contact me via one of the listed methods (serious inquiries only please).
          <br />
          <br />
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Box margin={1}>
              <Button href="mailto:paettiea@gmail.com" variant="contained" color="primary">
                Email
              </Button>
            </Box>
            <Box margin={1}>
              <Button href="https://github.com/cazlo" variant="contained" color="primary">
                Github
              </Button>
            </Box>
            <Box margin={1}>
              <Button href="https://www.linkedin.com/in/andrew-paettie/" variant="contained" color="primary">
                LinkedIn
              </Button>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Box margin={1}>
              <Button
                variant="contained"
                color="primary"
                target="_blank"
                href="/static/resume/resume-Andrew-Paettie.pdf"
              >
                Resume PDF
              </Button>
            </Box>
            <Box margin={1}>
              <Button
                variant="contained"
                color="primary"
                target="_blank"
                href="/static/resume/resume-Andrew-Paettie.docx"
              >
                Resume DOCX
              </Button>
            </Box>
          </Box>
        </Typography>

        <div className="ResumeAboutMeBlock-profilePicture Resume-profilePicture">
          <img alt="Andrew Paettie" src={selfImage} />
        </div>
      </div>
    </div>
  </ScreenBlock>
);

Intro.propTypes = {
  style: PropTypes.shape({}),
};

Intro.defaultProps = {
  style: {},
};

export default Intro;
