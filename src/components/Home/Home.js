import React from 'react';
import PropTypes from 'prop-types';

import GridBackground from '../../components/GridBackground/GridBackground';
import ScreenBlock from '../../components/ScreenBlock/ScreenBlock';

import appTheme from '../../common/techTheme';
import './Home.css';

export const Home = ({ style }) => (
  <ScreenBlock id="Resume-home" style={style} className="ResumeHomeBlock">
    <div className="ResumeHomeBlock-headline-container">
      <div className="ResumeHomeBlock-headline">
        <h1 className="Resume.im">Andrew Paettie</h1>
        <h2>Full-stack web engineer in Dallas</h2>
      </div>
    </div>

    <div className="ResumeHomeBlock-squares">
      <GridBackground>
        <div style={{ ...appTheme.reactColor.style }}>{appTheme.reactColor.icon}</div>
        <div style={{ ...appTheme.nodeJsColor.style }}>{appTheme.nodeJsColor.icon}</div>
        <div style={{ ...appTheme.awsColor.style }}>{appTheme.awsColor.icon}</div>
        <div style={{ ...appTheme.dockerColor.style }}>{appTheme.dockerColor.icon}</div>
        <div style={{ ...appTheme.pythonColor.style }}>{appTheme.pythonColor.icon}</div>
        <div style={{ ...appTheme.javaColor.style }}>{appTheme.javaColor.icon}</div>
      </GridBackground>
    </div>
  </ScreenBlock>
);

Home.propTypes = {
  style: PropTypes.object,
};

Home.defaultPropTypes = {
  style: {},
};

export default Home;
