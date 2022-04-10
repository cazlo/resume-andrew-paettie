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
          <h4>Software engineer</h4>
          <p className="Resume-summary" />I am a full stack software engineer with around a decade of experience, and
          several years of leadership experience.
          <br />
          <br />
          Continued human habitation of our world is in jeopardy. Our only chance to get out of this mess is through
          science and engineering. As an engineer with the skills necessary to help, I am only interested in positions
          which will benefit society as a whole. For example, directly working to solve the climate crisis we are
          facing, or working to get kids involved in S.T.E.M. I am open to volunteering my time if the cause is just.
          <br />
          <br />
          If you need a software engineer in that domain, hit me up using any of the contact methods listed below!
          <br />
          <br />
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Box margin={1}>
              <Button href="mailto:paettiea.job@gmail.com" variant="contained" color="primary">
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
