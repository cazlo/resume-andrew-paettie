import React from 'react';

import { styled } from '@mui/material/styles';

import Typography from '@mui/material/Typography/Typography';
import Grid from '@mui/material/Grid/Grid';
import { Container, Paper } from '@mui/material';

import Box from '@mui/material/Box';
import ScreenBlock from '../ScreenBlock/ScreenBlock';
import content from '../../common/content';
import SkillTable from './SkillTable';

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

const Skills = () => (
  // const styles = generateStyles();
  <div>
    <StyledScreenBlock id="Resume-skills" className="ResumeSkillsBlock container">
      <Grid container spacing={0}>
        <Grid item xs={12} className="heading">
          <h2>Skills</h2>
          <Typography>A quantitative breakdown of my journey through professional software development</Typography>
          <h3>Software Engineering Tools</h3>
        </Grid>
        <Container>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box sx={{ margin: 2 }}>
                <Typography variant="h5">Programming Languages</Typography>
              </Box>
              <SkillTable rows={content.skills.technical.languages} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box sx={{ margin: 2 }}>
                <Typography variant="h5">Data Persistence</Typography>
              </Box>
              <SkillTable
                rows={content.skills.technical.persistence}
                languageAlias="Concept"
                frameworkAlias="Technology"
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box sx={{ margin: 2 }}>
                <Typography variant="h5">Cloud</Typography>
              </Box>
              <SkillTable
                rows={content.skills.technical.cloud}
                languageAlias="Provider"
                frameworkAlias="Building Blocks"
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box sx={{ margin: 2 }}>
                <Typography variant="h5">Operationalization</Typography>
              </Box>
              <SkillTable rows={content.skills.technical.operational} languageAlias="Concept" frameworkAlias="Tools" />
            </Paper>
          </Grid>
          <Grid item xs={12} className="heading">
            <h3>Professional</h3>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box sx={{ margin: 2 }}>
                <Typography variant="h5">Project Management</Typography>
              </Box>
              <SkillTable
                rows={content.skills.professional.projectManagement}
                languageAlias="Concept"
                frameworkAlias="Tools"
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box sx={{ margin: 2 }}>
                <Typography variant="h5">Soft Skills</Typography>
              </Box>
              <SkillTable rows={content.skills.professional.softSkills} />
            </Paper>
          </Grid>
        </Container>
      </Grid>
    </StyledScreenBlock>
  </div>
);
export default Skills;
