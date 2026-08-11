import React from 'react';
import PropTypes from 'prop-types';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import './Home.css';
import GridBackground from './GridBackground/GridBackground';
import heroTech from './heroTech';

const Home = ({ style }) => (
  <ScreenBlock id="Resume-home" style={style} className="ResumeHomeBlock">
    <div className="ResumeHomeBlock-headline-container">
      <div className="ResumeHomeBlock-headline ResumeHomeBlock-heading">
        <h1 className="Resume.im ResumeHomeBlock-heading">Drew Paettie</h1>
        <h2 className="ResumeHomeBlock-heading">Full-stack software engineer in Washington</h2>
      </div>
    </div>

    <div className="ResumeHomeBlock-squares">
      <GridBackground tiles={heroTech} />
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
