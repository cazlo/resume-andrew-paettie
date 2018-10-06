import React from 'react';

import techTheme from './techTheme';
import heliGameImage from '../data/heli-game.gif';
import amatorizationImage from '../data/amatorization.gif';
import agent007Image from '../data/agent-007.gif';
import snakeImage from '../data/snake.gif';

export default {
  educations: [
    {
      schoolName: 'University of Texas Dallas',
      fieldOfStudy: 'Computer Science',
      startDate: '2010',
      endDate: '2015',
      degree: 'Bachelor of Science in Computer Science',
      activities: <span>Java, C++, C#, AI, Database, ML, Network Security, UNIX</span>,
    },
  ],
  positions: [
    {
      title: 'Full-stack software engineer',
      summary: (
        <span>
          NodeJS/Postgres/Javascript development
          <br />
          Node 8 | HapiJS | ReactJS | Docker | CI | AWS
        </span>
      ),
      startDate: '2017',
      endDate: 'Today',
      isCurrent: true,
      company: 'Cox Auto Data Solutions',
    },
    {
      title: 'Full-stack software engineer',
      summary: (
        <span>
          Java/MySQL/Javascript development
          <br />
          Spring Boot | Groovy | AngularJS | Docker | Jenkins
        </span>
      ),
      startDate: '2015',
      endDate: '2017',
      isCurrent: false,
      company: 'Cox Auto (Dealer.com)',
    },
    {
      title: 'Dev/Ops Intern',
      summary: (
        <span>
          Java EE/Oracle DB/Jquery development
          <br />
          J2EE | IIS | Jquery | Ant | Bugzilla
        </span>
      ),
      startDate: '2014',
      endDate: '2015',
      isCurrent: false,
      company: 'CapitalSoft',
    },
  ],
  tools: (
    <span>
      Operating system: Linux
      <br />
      IDE: Webstorm / Intellij
      <br />
      Containerization: Docker <br />
      Continuous integration software: Jenkins / CircleCI
      <br />
      Project Management Software: Rally / Github / Trello
      <br />
      Version control system software: Github
      <br />
    </span>
  ),
  projects: [
    {
      title: 'React Snake',
      subtitle: '404 for AndrewPaettie.com',
      date: 'October 2018',
      techTheme: techTheme.react,
      links: [
        {
          url: 'https://andrewpaettie.com/snake',
          text: 'Site',
        },
        {
          url:
            'https://github.com/cazlo/resume-andrew-paettie/tree/master/src/containers/SnakeGame',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'React',
          icon: techTheme.react.icon,
        },
        {
          name: 'AWS',
          icon: techTheme.aws.icon,
        },
        {
          name: 'CircleCI',
        },
      ],
      content: 'A snake game and AI implemented to solve the game in an optimized way',
      image: snakeImage,
    },
    {
      title: 'AndrewPaettie.com',
      subtitle: 'My résumé',
      date: '2015 - 2018',
      techTheme: techTheme.react,
      links: [
        {
          url: 'https://andrewpaettie.com',
          text: 'Site',
        },
        {
          url: 'https://github.com/cazlo/resume-andrew-paettie',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'React',
          icon: techTheme.react.icon,
        },
        {
          name: 'AWS',
          icon: techTheme.aws.icon,
        },
        {
          name: 'CircleCI',
        },
      ],
      content: 'A simple portfolio site to show some projects I have done',
      // image: '/img/this-site.png',
    },
    {
      title: 'JS Performance Analysis',
      subtitle: 'Analyzing differences between node 8 and 10',
      date: 'May 2018',
      techTheme: techTheme.javascript,
      links: [
        {
          url: 'https://github.com/cazlo/js-map-performance',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Javascript',
          icon: techTheme.javascript.icon,
        },
      ],
      content:
        'Something to test out differences in several map implementations between node 8 and 10',
      // image: '/img/this-site.png',
    },
    {
      title: 'CTF AI: Agent007',
      subtitle: 'University project',
      date: 'April 2015',
      techTheme: techTheme.java,
      links: [
        {
          url: 'https://github.com/cazlo/ctf/tree/master/ctf',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Java',
          icon: techTheme.java.icon,
        },
        {
          name: 'AI',
        },
      ],
      content: `An AI agent implemented in Java used to compete against other agents in a simple capture 
         the flag game written in Java. The Agent007 bot ended up placing 6th in a competition
         against 44 others.`,
      image: agent007Image,
    },
    {
      title: 'Artificial Intelligence',
      subtitle: 'University Course',
      date: 'March 2015',
      techTheme: techTheme.python,
      links: [
        {
          url: 'https://github.com/cazlo/exploring-AI',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Python',
          icon: techTheme.python.icon,
        },
        {
          name: 'AI',
        },
      ],
      content: `Some homework for an AI class I took, implementing search and constraint solving
          algorithms in python.`,
      // image: '/img/ai-brain.jpg',
    },
    {
      title: 'Machine Learning',
      subtitle: 'University Course',
      date: 'October 2014',
      techTheme: techTheme.python,
      links: [
        {
          url: 'https://github.com/cazlo/exploring-machine-learning',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Python',
          icon: techTheme.python.icon,
        },
        {
          name: 'ML',
        },
      ],
      content: `Some homework for a machine learning class I took, aimed towards implementing and using
          various prediction engines to classify data.`,
      // image: '/img/ml-stats.png',
    },
    {
      title: 'Various School Projects',
      subtitle: 'University Courses',
      date: '2012 - 2014',
      techTheme: techTheme.others,
      links: [
        {
          url: 'https://github.com/cazlo/academic-stuff',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Java',
          icon: techTheme.java.icon,
        },
        {
          name: 'C++',
        },
      ],
      content: `Just some random things I've made for school. Pictured is a loan amortization calculator featuring
       from scratch graphs and tables built using the swing UI framework for Java.`,
      image: amatorizationImage,
    },
    {
      title: 'Whiz Calc',
      subtitle: 'Android calculator app',
      date: 'January 2014',
      techTheme: techTheme.android,
      links: [
        {
          url: 'https://github.com/cazlo/WhizCalc',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Android',
          icon: techTheme.android.icon,
        },
        {
          name: 'Java',
          icon: techTheme.java.icon,
        },
      ],
      content: `A simple calculator app for android used to experiment with creating android apps.`,
    },
    {
      title: 'MOOPS',
      subtitle: 'MIPS assembler project',
      date: 'December 2013',
      techTheme: techTheme.others,
      links: [
        {
          url: 'https://github.com/cazlo/MOOPS-Moo-on-MIPS',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'MIPS',
        },
      ],
      content: `An implementation of the game moo in the MIPS assembly lanuage.  
      Also includes an algorithm for solving the puzzle within 16 moves.`,
      // image: '/img/Mars-moo.png',
    },
    {
      title: 'Helicopter Side-scroller',
      subtitle: 'School project',
      date: 'May 2013',
      techTheme: techTheme.java,
      links: [
        {
          url: 'https://github.com/cazlo/heli-madness',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'Java',
          icon: techTheme.java.icon,
        },
      ],
      content: `A simple side scroller implemented with Java Swing. Game engine built from scratch.`,
      image: heliGameImage,
    },
  ],
  skills: [
    {
      name: 'Java 8',
      language: {
        name: 'Java',
        style: techTheme.java,
      },
    },
    {
      name: 'Spring Boot',
      language: {
        name: 'Java',
        style: techTheme.java,
      },
    },
    {
      name: 'Maven',
      language: {
        name: 'Java',
        style: techTheme.java,
      },
    },
    {
      name: 'Kotlin',
      language: {
        name: 'Java',
        style: techTheme.java,
      },
    },
    {
      name: 'RESTful API design',
      language: {
        name: 'Java',
        style: techTheme.java,
      },
    },
    {
      name: 'JPA',
      language: {
        name: 'Java',
        style: techTheme.java,
      },
    },
    {
      name: 'JUnit',
      language: {
        name: 'Java',
        style: techTheme.java,
      },
    },
    {
      name: 'Node (6,8,10)',
      language: {
        name: 'Node',
        style: techTheme.nodeJs,
      },
    },
    {
      name: 'Knex',
      language: {
        name: 'Node',
        style: techTheme.nodeJs,
      },
    },
    {
      name: 'HapiJS',
      language: {
        name: 'Node',
        style: techTheme.nodeJs,
      },
    },
    {
      name: 'React',
      language: {
        name: 'Javascript',
        style: techTheme.javascript,
      },
    },
    {
      name: 'Redux',
      language: {
        name: 'Javascript',
        style: techTheme.javascript,
      },
    },
    {
      name: 'ES6',
      language: {
        name: 'Javascript',
        style: techTheme.javascript,
      },
    },
    {
      name: 'ES8',
      language: {
        name: 'Node',
        style: techTheme.nodeJs,
      },
    },
    {
      name: 'SQL (MYSQL, PostgreSQL)',
      language: {
        name: 'Others',
        style: techTheme.others,
      },
    },
    {
      name: 'NOSQL (Elasticsearch, MongoDB)',
      language: {
        name: 'Others',
        style: techTheme.others,
      },
    },
    {
      name: 'Continuous integration',
      language: {
        name: 'Others',
        style: techTheme.others,
      },
    },
    {
      name: 'TDD',
      language: {
        name: 'Others',
        style: techTheme.others,
      },
    },
    {
      name: 'HTML5/CSS3',
      language: {
        name: 'Others',
        style: techTheme.others,
      },
    },
    {
      name: 'JQUERY',
      language: {
        name: 'Javascript',
        style: techTheme.javascript,
      },
    },
    {
      name: 'Ramda',
      language: {
        name: 'Javascript',
        style: techTheme.javascript,
      },
    },
    {
      name: 'GIT',
      language: {
        name: 'Others',
        style: techTheme.others,
      },
    },
    {
      name: 'Docker',
      language: {
        name: 'Others',
        style: techTheme.others,
      },
    },
    {
      name: 'AWS',
      language: {
        name: 'Others',
        style: techTheme.others,
      },
    },
  ],
};
