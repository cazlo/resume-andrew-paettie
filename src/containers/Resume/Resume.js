import React from 'react';
import flow from 'lodash/flow';
import { withTheme } from '@material-ui/core/styles';
import { sortBy } from 'lodash';

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

const Resume = () => (
  <div className="Resume">
    <Home />
    <AboutMe style={techTheme.github.style} />
    <WorkAndEducation educations={content.educations} positions={content.positions} />
    <Skills skills={getSkillsByLanguages(content.skills)} tools={content.tools} />
    <Projects projects={content.projects} />
    <Copyright />
    <BottomNav />
  </div>
);

const decorators = flow([withTheme()]);

export default decorators(Resume);
