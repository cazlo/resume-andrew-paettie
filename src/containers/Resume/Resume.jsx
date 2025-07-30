import React, { Component } from 'react';
import Scroll from 'react-scroll';
import * as PropTypes from 'prop-types';

import Home from '../../components/Home/Home';
import AboutMe from '../../components/AboutMe/AboutMe';
import Projects from '../../components/Projects/Projects';
import WorkAndEducation from '../../components/WorkAndEducation/WorkAndEducation';
import Skills from '../../components/Skills/Skills';
import BottomNav from '../../components/BottomNav/BottomNav';
import Copyright from '../../components/Copyright/Copyright';
import content from '../../common/content';

import './Resume.css';

const { Element } = Scroll;

class Resume extends Component {
  componentDidMount() {
    const { scrollTo } = this.props;
    if (scrollTo) {
      Scroll.scroller.scrollTo(scrollTo);
    }
  }

  render() {
    return (
      <div className="Resume">
        <Element>
          <Home />
        </Element>
        <Element name="ResumeAboutMe">
          <AboutMe />
        </Element>
        <Element name="ResumeSkills">
          <Skills skills={content.skills} tools={content.tools} />
        </Element>
        <Element name="ResumeExperience">
          <WorkAndEducation educations={content.educations} positions={content.positions} />
        </Element>
        <Element name="ResumeProjects">
          <Projects projects={content.projects} />
        </Element>
        <Copyright />
        <BottomNav />
      </div>
    );
  }
}

Resume.propTypes = {
  scrollTo: PropTypes.string,
};
Resume.defaultProps = {
  scrollTo: '',
};

// const decorators = flow([withTheme()]);

export default Resume;
