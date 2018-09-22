import React from 'react';
// eslint-disable-next-line
import { Link } from 'react-router-dom';
import selfImage from '../../data/me-2018.jpg';

import './AboutMe.css';

const Intro = () => (
  <div className="Resume-aboutMe container">
    {/* <Jumbotron> */}
    {/* <Media> */}
    {/* <Row className="justify-content-center"> */}
    {/* <Col xs="12" sm="6" lg="8" className="justify-content-center"> */}
    {/* <Media body> */}
    {/* <Media heading> */}
    <div className="heading">
      <h2>About Me</h2>
    </div>
    {/* </Media> */}
    <p className="lead">
      I am an experienced and capable full stack software engineer with leadership experience. If
      you are interested in hiring a full stack software engineer, out my{' '}
      <Link to="/resume">résumé</Link> and <Link to="/projects">projects </Link>
      and feel free to contact me via one of the listed methods.
    </p>
    {/* </Media> */}
    {/* </Col> */}
    {/* <Col xs="12" sm="6" md="6" lg="4"> */}
    <div className="ResumeAboutMeBlock-profilePicture Resume-profilePicture">
      <img alt="Andrew Paettie" src={selfImage} />
    </div>
    {/* </Col> */}
    {/* </Row> */}
    {/* </Media> */}
    <p className="lead" />
    {/* </Jumbotron> */}
  </div>
);

export default Intro;
