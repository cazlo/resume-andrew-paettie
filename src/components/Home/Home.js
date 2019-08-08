import React from 'react';
import PropTypes from 'prop-types';

import GridBackground from './GridBackground/GridBackground';
import ScreenBlock from '../ScreenBlock/ScreenBlock';

import appTheme from '../../common/techTheme';
import './Home.css';

const Home = ({ style }) => (
  <ScreenBlock id="Resume-home" style={style} className="ResumeHomeBlock">
    <div className="ResumeHomeBlock-headline-container">
      <div className="ResumeHomeBlock-headline">
        <h1 className="Resume.im">Andrew Paettie</h1>
        <h2>Full-stack web engineer in Portland</h2>
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
