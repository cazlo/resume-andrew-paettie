import React from 'react';

import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography/Typography';
import Grid from '@mui/material/Grid/Grid';
import { Paper } from '@mui/material';

import ScreenBlock from '../ScreenBlock/ScreenBlock';
import skillsContent from './skillsContent';
import './Skills.css';
import SkillDetail from './SkillDetail';

const PREFIX = 'Skills';

const classes = {
  skillSection: `${PREFIX}-skillSection`,
};

const StyledScreenBlock = styled(ScreenBlock)(({ theme }) => ({
  [`& .${classes.skillSection}`]: {
    padding: theme.spacing(2),
    color: theme.secondary,
  },
}));

const mapSkillDetail = skills => skills.map(skill => <SkillDetail skill={skill} />);

// const generateStyles = makeStyles(({ theme }) => ({
//   [`& .${classes.skillSection}`]: {
//     padding: theme.spacing(2),
//     color: theme.secondary,
//   },
// }));

const Skills = () => (
  // const styles = generateStyles();
  <StyledScreenBlock id="Resume-skills" className="ResumeSkillsBlock container">
    <Grid container spacing={0}>
      <Grid item xs={12} className="heading">
        <h2>Skills</h2>
        <Typography>A quantitative breakdown of my journey through professional software development</Typography>
        <h3>Technical</h3>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <h3>Programming Languages</h3>
          {mapSkillDetail(skillsContent.technical.languages)}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <h3>Data Persistence</h3>
          {mapSkillDetail(skillsContent.technical.persistence)}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <h3>Cloud</h3>
          {mapSkillDetail(skillsContent.technical.cloud)}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <h3>Containerization</h3>
          {mapSkillDetail(skillsContent.technical.containerization)}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <h3>Operational</h3>
          {mapSkillDetail(skillsContent.technical.operational)}
        </Paper>
      </Grid>

      <Grid item xs={12} className="heading">
        <h3>Professional</h3>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <h3>Project management</h3>
          {mapSkillDetail(skillsContent.professional.projectManagement)}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <h3>Soft Skills</h3>
          {mapSkillDetail(skillsContent.professional.softSkills)}
        </Paper>
      </Grid>
    </Grid>
  </StyledScreenBlock>
);
export default Skills;
