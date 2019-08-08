import React from 'react';
import PropTypes from 'prop-types';

import { sortBy } from 'lodash';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid/Grid';
import Chip from '@material-ui/core/Chip/Chip';

import ScreenBlock from '../ScreenBlock/ScreenBlock';

import './Skills.css';

export const getSkillsByLanguages = skills => {
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

export const getToolsByCategory = tools => {
  const toolsByCategory = tools.reduce((obj, item) => {
    const newObj = obj;
    if (item.category) {
      newObj[item.category] = newObj[item.category] || [];
      newObj[item.category].push(item);
      newObj[item.category] = sortBy(newObj[item.category], [x => x.category]);
    }
    return newObj;
  }, {});

  return Object.keys(toolsByCategory).map(key => toolsByCategory[key]);
};

const Skills = ({ skills, tools }) => (
  <ScreenBlock id="Resume-skills" className="ResumeSkillsBlock container">
    <Grid container spacing={16}>
      <Grid item xs={12} className="heading">
        <h2>Skills</h2>
        <Typography>I can say i’m quite good at</Typography>
      </Grid>

      <Grid item className="ResumeSkillsBlock-skills" xs={12}>
        {getSkillsByLanguages(skills).map((skillCategory, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Card key={i}>
            <CardContent>
              <Avatar
                style={{
                  ...skillCategory[0].language.style.style,
                  width: 100,
                  height: 100,
                  margin: '0 auto',
                }}
              >
                {skillCategory[0].language.style.icon}
              </Avatar>
              <h3
                style={{
                  color: skillCategory[0].language.style.style.background,
                }}
              >
                {skillCategory[0].language.name}
              </h3>
              {skillCategory.map(skill => (
                // eslint-disable-next-line react/no-array-index-key
                <div
                  key={`skill-${skill.name}`}
                  style={{
                    color: skillCategory[0].language.style.style.background,
                  }}
                >
                  {skill.name}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <br />
      </Grid>

      <Grid item xs={12} className="heading">
        <h2>Tools</h2>
        <Typography>My favorite tools</Typography>
      </Grid>

      <Grid item className="ResumeSkillsBlock-tools" xs={12}>
        <Table>
          <TableBody>
            {getToolsByCategory(tools).map(category => (
              <TableRow key={`tools-${category[0].category}`}>
                <TableCell className="ResumeSkillsBlock-tools-cell">
                  <Chip
                    avatar={<Avatar>{category[0].categoryIcon}</Avatar>}
                    label={category[0].category}
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'right' }} className="ResumeSkillsBlock-tools-cell">
                  {category.map(tool => (
                    <Chip
                      avatar={<Avatar>{tool.icon}</Avatar>}
                      label={tool.name}
                      key={`${tool.name}-${category[0].category}`}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  </ScreenBlock>
);

Skills.propTypes = {
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      language: PropTypes.shape({
        name: PropTypes.string,
        style: PropTypes.shape({}),
      }),
    }),
  ).isRequired,
  tools: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string,
      categoryIcon: PropTypes.node,
      name: PropTypes.string,
      icon: PropTypes.node,
    }),
  ).isRequired,
};

export default Skills;
