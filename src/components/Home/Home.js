import React from 'react';
import PropTypes from 'prop-types';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import './Home.css';
import GridBackground from './GridBackground/GridBackground';
import appTheme from '../../common/techTheme';

const Home = ({ style }) => (
  <ScreenBlock id="Resume-home" style={style} className="ResumeHomeBlock">
    <div className="ResumeHomeBlock-headline-container">
      <div className="ResumeHomeBlock-headline ResumeHomeBlock-heading">
        <h1 className="Resume.im ResumeHomeBlock-heading">Andrew Paettie</h1>
        <h2 className="ResumeHomeBlock-heading">Full-stack web engineer in Oregon</h2>
      </div>
    </div>

    <div className="ResumeHomeBlock-squares">
      <GridBackground>
        <div style={{ ...appTheme.react.style }}>{appTheme.react.icon}</div>
        <div style={{ ...appTheme.nodeJs.style }}>{appTheme.nodeJs.icon}</div>
        <div style={{ ...appTheme.aws.style }}>{appTheme.aws.icon}</div>
        <div style={{ ...appTheme.docker.style }}>{appTheme.docker.icon}</div>
        <div style={{ ...appTheme.python.style }}>{appTheme.python.icon}</div>
        <div style={{ ...appTheme.java.style }}>{appTheme.java.icon}</div>
      </GridBackground>
    </div>
  </ScreenBlock>
);

Home.propTypes = {
  style: PropTypes.shape({}),
};

Home.defaultProps = {
  style: {},
};

export default Home;
