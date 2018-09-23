import React from 'react';
import flow from 'lodash/flow';
// import Helmet from 'react-helmet';
// import { injectIntl, intlShape } from 'react-intl';
import { withTheme } from '@material-ui/core/styles';

import Home from '../../components/Home/Home';
import AboutMe from '../../components/AboutMe/AboutMe';
import ProjectsBlock from '../../components/ProjectsBlock/ProjectsBlock';
import WorkAndEducationBlock from '../../components/WorkAndEducationBlock/WorkAndEducationBlock';
import Skills from '../../components/Skills/Skills';
import BottomNav from '../../components/BottomNav/BottomNav';
import content from '../../common/content';
import techTheme from '../../common/techTheme';

import './Resume.css';

const getSkillsByLanguages = skills => {
  const skillsByLanguages = skills.reduce((obj, item) => {
    const newObj = obj;
    if (item.language) {
      newObj[item.language.name] = newObj[item.language.name] || [];
      newObj[item.language.name].push(item);
    }
    return newObj;
  }, {});

  return Object.keys(skillsByLanguages).map(key => skillsByLanguages[key]);
}

const Resume = () => (
  // const cv = this.props.cvPDF;
  //
  // const { theme } = this.props;
  //
  // const primaryColor = theme.palette.primary.main;
  // const secondaryColor = theme.palette.secondary.main;
  // const styles = {
  //   primaryColor: {
  //     background: primaryColor,
  //     color: '#fff',
  //   },
  //   secondaryColor: {
  //     background: secondaryColor,
  //     color: '#fff',
  //   },
  // };

  <div className="Resume">
    {/* <Helmet */}
    {/* title={this.props.meta.title} */}
    {/* meta={[ */}
    {/* { name: 'description', content: this.props.meta.description }, */}
    {/* { name: 'keywords', content: this.props.meta.keywords }, */}
    {/* { property: 'og:title', content: this.props.meta.title }, */}
    {/* { property: 'twitter:title', content: this.props.meta.title }, */}
    {/* { */}
    {/* property: 'og:description', */}
    {/* content: this.props.meta.description, */}
    {/* }, */}
    {/* ]} */}
    {/* /> */}
    <Home />
    <AboutMe style={techTheme.githubColor.style} />
    <WorkAndEducationBlock educations={content.educations} positions={content.positions} />
    <Skills skills={getSkillsByLanguages(content.skills)} tools={content.tools} />
    <ProjectsBlock projects={content.projects} />
    <BottomNav />
  </div>
);

const decorators = flow([withTheme()]);

export default decorators(Resume);
