import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Accordion, AccordionDetails, AccordionSummary, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

const SkillPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  icon: PropTypes.element,
});

const SkillListPropType = PropTypes.arrayOf(SkillPropType).isRequired;

const summaryDescriptions = {
  platform:
    'Designs and operates observable cloud platforms, from infrastructure and containers to production telemetry.',
  applications: 'Builds maintainable services and interfaces with a pragmatic, testable approach to systems design.',
  delivery: 'Builds secure, reviewable paths from source to production with automation and supply-chain awareness.',
};

const findSkills = (rows, names) => {
  const entries = rows.flatMap(row => [row, ...(row.frameworks || [])]);
  return names.map(name => entries.find(entry => entry.name === name)).filter(Boolean);
};

function SkillChips({ skills }) {
  return (
    <Box
      aria-label="Representative technologies"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.75,
        mt: 1.5,
        maxWidth: '100%',
      }}
    >
      {skills.map(skill => (
        <Chip key={skill.name} label={skill.name} avatar={skill.icon} size="small" />
      ))}
    </Box>
  );
}

SkillChips.propTypes = {
  skills: SkillListPropType,
};

SkillChips.defaultProps = {
  skills: [],
};

function SummaryArea({ title, description, skills }) {
  return (
    <Grid item xs={12} md={4}>
      <Paper
        elevation={4}
        sx={{
          height: '100%',
          boxSizing: 'border-box',
          p: 2,
          borderTop: theme => `2px solid ${theme.palette.secondary.main}`,
        }}
      >
        <Typography variant="h5" component="h3">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {description}
        </Typography>
        <SkillChips skills={skills} />
      </Paper>
    </Grid>
  );
}

SummaryArea.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  skills: SkillListPropType,
};

SummaryArea.defaultProps = {
  skills: [],
};

function HowIWork() {
  const principles = [
    [
      'Engineering leadership',
      'Creates clarity, raises the quality bar, and helps teams make durable technical decisions.',
    ],
    [
      'Growth and learning',
      'Stays hands-on, learns in public, and turns new tools and constraints into practical improvements.',
    ],
    [
      'Customer empathy',
      'Connects operational details to the people relying on the product, especially when the stakes are high.',
    ],
    [
      'Architecture and coordination',
      'Uses shared models, written decisions, and steady cross-team communication to move complex work forward.',
    ],
  ];

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 2.5 }, mt: 3 }}>
      <Typography variant="h4" component="h3">
        How I work
      </Typography>
      <Grid container spacing={2} sx={{ mt: 0.25 }}>
        {principles.map(([title, description]) => (
          <Grid item xs={12} sm={6} key={title}>
            <Typography variant="subtitle1" component="h4">
              {title}
            </Typography>
            <Typography variant="body2">{description}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

function DetailedMatrix({ technical }) {
  return (
    <Accordion
      disableGutters
      elevation={3}
      sx={{ mt: 3, '&:before': { display: 'none' } }}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="full-skills-matrix-content"
        id="full-skills-matrix-header"
      >
        <Box>
          <Typography variant="h5" component="h3">
            Explore the full skills matrix
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detailed technical history, including frameworks, timelines, and recent use.
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails id="full-skills-matrix-content" sx={{ px: { xs: 0, sm: 2 }, pb: 2 }}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          <section aria-labelledby="programming-languages-heading">
            <Typography id="programming-languages-heading" variant="h5" sx={{ px: 2, pt: 1, pb: 1 }}>
              Programming Languages
            </Typography>
            <SkillTable rows={technical.languages} />
          </section>
          <section aria-labelledby="data-persistence-heading">
            <Typography id="data-persistence-heading" variant="h5" sx={{ px: 2, pt: 1, pb: 1 }}>
              Data Persistence
            </Typography>
            <SkillTable rows={technical.persistence} languageAlias="Concept" frameworkAlias="Technology" />
          </section>
          <section aria-labelledby="cloud-heading">
            <Typography id="cloud-heading" variant="h5" sx={{ px: 2, pt: 1, pb: 1 }}>
              Cloud
            </Typography>
            <SkillTable rows={technical.cloud} languageAlias="Provider" frameworkAlias="Building Blocks" />
          </section>
          <section aria-labelledby="delivery-heading">
            <Typography id="delivery-heading" variant="h5" sx={{ px: 2, pt: 1, pb: 1 }}>
              Platform, Delivery, and Security
            </Typography>
            <SkillTable rows={technical.operational} languageAlias="Concept" frameworkAlias="Tools" />
          </section>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

DetailedMatrix.propTypes = {
  technical: PropTypes.shape({
    languages: SkillListPropType,
    persistence: SkillListPropType,
    cloud: SkillListPropType,
    operational: SkillListPropType,
  }).isRequired,
};

const Skills = ({ skills }) => {
  const { technical } = skills;
  const languageSkills = findSkills(technical.languages, [
    'JavaScript',
    'TypeScript',
    'Node',
    'React',
    'Python',
    'Rust',
    'Go',
  ]);
  const dataSkills = findSkills(technical.persistence, ['SQL', 'postgres', 'DynamoDB']);
  const platformSkills = findSkills(technical.cloud, ['AWS', 'EKS']);
  const operationsSkills = findSkills(technical.operational, [
    'Terraform',
    'Docker',
    'Kubernetes',
    'Prometheus',
    'OpenTelemetry',
    'GitHub Actions',
    'ArgoCD',
    'Trivy',
    'semgrep',
    'sigstore / cosign',
  ]);

  return (
    <StyledScreenBlock id="Resume-skills" className="ResumeSkillsBlock container">
      <Box className={classes.skillSection}>
        <Box className="heading">
          <h2>Skills</h2>
          <Typography>
            Staff-level software engineering across cloud platforms, reliable delivery, and the applications that run on
            them.
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <SummaryArea
            title="Platform & Reliability"
            description={summaryDescriptions.platform}
            skills={[...platformSkills, ...operationsSkills.slice(0, 5)]}
          />
          <SummaryArea
            title="Languages & Application Engineering"
            description={summaryDescriptions.applications}
            skills={[...languageSkills, ...dataSkills]}
          />
          <SummaryArea
            title="Security & Delivery"
            description={summaryDescriptions.delivery}
            skills={operationsSkills.slice(5)}
          />
        </Grid>
        <HowIWork />
        <DetailedMatrix technical={technical} />
      </Box>
    </StyledScreenBlock>
  );
};

Skills.propTypes = {
  skills: PropTypes.shape({
    technical: DetailedMatrix.propTypes.technical,
  }),
};

Skills.defaultProps = {
  skills: content.skills,
};

export default Skills;
