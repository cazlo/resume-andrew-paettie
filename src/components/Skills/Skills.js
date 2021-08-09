import React from 'react';

import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ScreenBlock from '../ScreenBlock/ScreenBlock';
import skillsContent from './skillsContent';
import './Skills.css';
import SkillDetail from './SkillDetail';

const mapSkillDetail = skills => skills.map(skill => <SkillDetail skill={skill} />);

const generateStyles = makeStyles(theme => ({
  skillSection: {
    padding: theme.spacing(2),
    color: theme.secondary,
  },
}));

const Skills = () => {
  const styles = generateStyles();
  return (
    <ScreenBlock id="Resume-skills" className="ResumeSkillsBlock container">
      <Grid container spacing={0}>
        <Grid item xs={12} className="heading">
          <h1>Skills</h1>
          <Typography>A quantitative breakdown of my journey through professional software development</Typography>
          <h2>Technical</h2>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.skillSection} elevation={3}>
            <h3>Languages</h3>
            {mapSkillDetail(skillsContent.technical.languages)}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.skillSection} elevation={3}>
            <h3>Data Persistence</h3>
            {mapSkillDetail(skillsContent.technical.persistence)}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.skillSection} elevation={3}>
            <h3>Cloud</h3>
            {mapSkillDetail(skillsContent.technical.cloud)}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.skillSection} elevation={3}>
            <h3>Containerization</h3>
            {mapSkillDetail(skillsContent.technical.containerization)}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.skillSection} elevation={3}>
            <h3>Operational</h3>
            {mapSkillDetail(skillsContent.technical.operational)}
          </Paper>
        </Grid>

        <Grid item xs={12} className="heading">
          <h2>Professional</h2>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.skillSection} elevation={3}>
            <h3>Project management</h3>
            {mapSkillDetail(skillsContent.professional.projectManagement)}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={styles.skillSection} elevation={3}>
            <h3>Soft Skills</h3>
            {mapSkillDetail(skillsContent.professional.softSkills)}
          </Paper>
        </Grid>
      </Grid>
    </ScreenBlock>
  );
};

export default Skills;
