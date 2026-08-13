import React from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import './Home.css';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import GridBackground from './GridBackground/GridBackground';
import heroTech from './heroTech';

const scrollToSection = (name, offset) => {
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Scroll.scroller.scrollTo(name, {
    duration: reduceMotion ? 0 : 500,
    offset,
    smooth: !reduceMotion,
  });
};

const Home = ({ style }) => (
  <ScreenBlock id="Resume-home" style={style} className="ResumeHomeBlock">
    <div className="ResumeHomeBlock-headline-container">
      <div className="ResumeHomeBlock-headline ResumeHomeBlock-heading">
        <h1 className="Resume.im ResumeHomeBlock-heading">Drew Paettie</h1>
        <h2 className="ResumeHomeBlock-primary">
          Staff platform engineer building secure, reliable distributed systems
        </h2>
        <p className="ResumeHomeBlock-domains">Kubernetes · AWS · SRE · Security · Aerospace</p>
        <p className="ResumeHomeBlock-location">Based in Washington</p>
        <div className="ResumeHomeBlock-actions" aria-label="Portfolio shortcuts">
          <button type="button" onClick={() => scrollToSection('ResumeExperience', -18)}>
            View experience
          </button>
          <button type="button" onClick={() => scrollToSection('ResumeProjects', -18)}>
            Featured projects
          </button>
        </div>
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
