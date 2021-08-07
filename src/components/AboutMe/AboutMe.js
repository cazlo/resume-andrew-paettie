import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

import selfImage from '../../data/me.jpg';

import './AboutMe.css';
import ScreenBlock from '../ScreenBlock/ScreenBlock';

const Intro = ({ style }) => (
  <ScreenBlock id="Resume-aboutMe" className="ResumeAboutMeBlock" style={style}>
    <div id="" className="Resume-aboutMe container">
      <div className="heading">
        <h2 className="ResumeAboutMe" style={{ color: '#fff' }}>
          About Me
        </h2>
        <p id="ResumeAboutMeSubtitle" className="ResumeAboutMeBlock-Subtitle">
          A small introduction about myself
        </p>
      </div>
      <div className="ResumeAboutMeBlock-content">
        <div className="ResumeAboutMeBlock-description">
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
          <div className="ResumeAboutMeBlock-links">
            <Button variant="contained" color="primary" target="_blank" href="/static/resume/resume-Andrew-Paettie.pdf">
              Resume PDF
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              href="/static/resume/resume-Andrew-Paettie.docx"
            >
              Resume DOCX
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button href="https://github.com/cazlo" variant="contained" color="primary">
              Github
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button href="https://www.linkedin.com/in/andrew-paettie/" variant="contained" color="primary">
              LinkedIn
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button href="mailto:paettiea@gmail.com" variant="contained" color="primary">
              Email
            </Button>
          </div>
        </div>

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
