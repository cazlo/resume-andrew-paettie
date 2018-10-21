import React, { Component } from 'react';
// import flow from 'lodash/flow';
// import { withTheme } from '@material-ui/core/styles';
import { sortBy } from 'lodash';
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
import techTheme from '../../common/techTheme';

import './Resume.css';

const { Element } = Scroll;

const getSkillsByLanguages = skills => {
  const skillsByLanguages = skills.reduce((obj, item) => {
    const newObj = obj;
    if (item.language) {
      newObj[item.language.name] = newObj[item.language.name] || [];
      newObj[item.language.name].push(item);
      newObj[item.language.name] = sortBy(newObj[item.language.name], [x => x.name]);
    }
    return newObj;
  }, {});

  return Object.keys(skillsByLanguages).map(key => skillsByLanguages[key]);
};

class Resume extends Component {
  componentDidMount() {
    if (this.props.scrollTo) {
      Scroll.scroller.scrollTo(this.props.scrollTo);
    }
  }

  render() {
    return (
      <div className="Resume">
        <Element>
          <Home />
        </Element>
        <Element name="ResumeAboutMe">
          <AboutMe style={techTheme.github.style} />
        </Element>
        <Element name="ResumeExperience">
          <WorkAndEducation educations={content.educations} positions={content.positions} />
        </Element>
        <Element name="ResumeSkills">
          <Skills skills={getSkillsByLanguages(content.skills)} tools={content.tools} />
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

// const decorators = flow([withTheme()]);

export default Resume;
