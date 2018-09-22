import React from 'react';
import flow from 'lodash/flow';
// import Helmet from 'react-helmet';
// import { injectIntl, intlShape } from 'react-intl';
import { withTheme } from '@material-ui/core/styles';

import ProjectsBlock from '../../components/ProjectsBlock/ProjectsBlock';
import BottomNav from '../../components/BottomNav/BottomNav';
import AboutMe from '../../components/AboutMe/AboutMe';
import content from '../../common/content';

import './Resume.css';

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
    <AboutMe />
    <ProjectsBlock projects={content.projects} />
    <BottomNav />
  </div>
);

const decorators = flow([withTheme()]);

export default decorators(Resume);
