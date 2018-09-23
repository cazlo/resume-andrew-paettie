import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';

import ScreenBlock from '../../components/ScreenBlock/ScreenBlock';

import './Skills.css';

const Skills = ({ skills, tools }) => (
  <ScreenBlock id="Resume-skills" className="ResumeSkillsBlock">
    <div className="container">
      <div className="heading">
        <h2>Skills</h2>
        <p>I can say i’m quite good at</p>
      </div>

      <div className="ResumeSkillsBlock-skills">
        {skills.map((skillCategory, i) => (
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
              {skillCategory.map((skill, j) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={j}>{skill.name}</div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <br />

      <div className="heading">
        <h2>Tools</h2>
        <p>My favorites tools</p>
      </div>

      <div className="ResumeSkillsBlock-tools">
        <p>{tools}</p>
      </div>
    </div>
  </ScreenBlock>
);

Skills.propTypes = {
  skills: PropTypes.array.isRequired,
  tools: PropTypes.string.isRequired,
};

export default Skills;
