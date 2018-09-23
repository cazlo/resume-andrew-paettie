import React from 'react';
// eslint-disable-next-line
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

import selfImage from '../../data/me-2018.jpg';

import './AboutMe.css';
import ScreenBlock from '../../components/ScreenBlock/ScreenBlock';

const Intro = ({ style }) => (
  <ScreenBlock id="Resume-aboutMe" className="ResumeAboutMeBlock" style={style}>
    <div id="" className="Resume-aboutMe container">
      {/* <Jumbotron> */}
      {/* <Media> */}
      {/* <Row className="justify-content-center"> */}
      {/* <Col xs="12" sm="6" lg="8" className="justify-content-center"> */}
      {/* <Media body> */}
      {/* <Media heading> */}
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
          <h4>Senior Software Engineer</h4>
          <p className="Resume-summary" />I am an experienced and capable full stack software
          engineer with leadership experience.
          <br />
          <br />
          If you are interested in hiring a full stack software engineer, out my resume and projects
          and feel free to contact me via one of the listed methods.
          <br />
          <br />
          <div className="ResumeAboutMeBlock-links">
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              href="/static/resume/resume-Andrew-Paettie.pdf"
            >
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
            <Button href="mailto:andrew.paettie@gmail.com" variant="contained" color="secondary">
              Contact Me
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
  style: PropTypes.object,
};

Intro.defaultPropTypes = {
  style: {},
};

export default Intro;
