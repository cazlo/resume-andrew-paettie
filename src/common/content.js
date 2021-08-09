import React from 'react';
import { GoGraph } from 'react-icons/go';
import { FaCreditCard, FaHardHat, FaMicrochip, FaRobot, FaShoppingCart } from 'react-icons/fa';

import moment from 'moment';
import { MdSignalWifi4BarLock } from 'react-icons/md';
import { GiRoad, GiRunningShoe, GiSharkJaws } from 'react-icons/gi';
import { GrGraphQl } from 'react-icons/gr';
import {
  FcAutomotive,
  FcDatabase,
  FcGlobe,
  FcImageFile,
  FcMultipleInputs,
  FcCustomerSupport,
  FcScatterPlot,
  FcServices,
  FcShop,
  FcWorkflow,
} from 'react-icons/fc';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip/Chip';
import { AiFillRobot } from 'react-icons/ai';
import techTheme from './techTheme';
import heliGameImage from '../data/heli-game.gif';
import amatorizationImage from '../data/amatorization.gif';
import agent007Image from '../data/agent-007.gif';
import snakeImage from '../data/snake.gif';
import cryptoTradingImage from '../data/crypto-trade-analysis.png';
import samAnalysisImage from '../data/SAM-analysis.png';
import mySiteImage from '../data/mysite.png';

const AiIcon = FaRobot;
const MlIcon = GoGraph;

export default {
  educations: [
    {
      schoolName: 'University of Texas @Dallas',
      fieldOfStudy: 'Computer Science',
      startDate: '2010',
      endDate: '2015',
      degree: 'Bachelor of Science in Computer Science',
      activities: (
        <span>
          <Chip size="small" avatar={<Avatar>{techTheme.java.icon}</Avatar>} label="Java" />
          <Chip size="small" avatar={<Avatar>{techTheme.python.icon}</Avatar>} label="Python" />
          <Chip size="small" avatar={<Avatar>{techTheme.cplusplus.icon}</Avatar>} label="C++" />
          <Chip size="small" avatar={<Avatar>{techTheme.csharp.icon}</Avatar>} label="C#" />
          <Chip size="small" avatar={<Avatar>{techTheme.dotNet.icon}</Avatar>} label=".Net" />
          <Chip
            size="small"
            avatar={
              <Avatar>
                <AiFillRobot />
              </Avatar>
            }
            label="AI"
          />
          <Chip
            size="small"
            avatar={
              <Avatar>
                <FcDatabase />
              </Avatar>
            }
            label="Database Design"
          />
          <Chip
            size="small"
            avatar={
              <Avatar>
                <FcScatterPlot />
              </Avatar>
            }
            label="Machine Learning"
          />
          <Chip size="small" avatar={<Avatar>{techTheme.security.icon}</Avatar>} label="Network Security" />
          <Chip size="small" avatar={<Avatar>{techTheme.linux.icon}</Avatar>} label="Linux" />
        </span>
      ),
    },
  ],
  positions: [
    {
      title: 'Senior Software engineer',
      summary: (
        <span>
          Java/AWS/Javascript devops position with technical leadership and architecture responsibilities
          <br />
          <FcGlobe /> <FcShop /> <FaCreditCard /> <FaShoppingCart /> <GiRunningShoe /> <FcWorkflow />
          <br />
          Global Retail Payment
          <br />
          <Chip size="small" avatar={<Avatar>{techTheme.java.icon}</Avatar>} label="Java" />
          <Chip size="small" avatar={<Avatar>{techTheme.nodeJs.icon}</Avatar>} label="Node" />
          <Chip size="small" avatar={<Avatar>{techTheme.dotNet.icon}</Avatar>} label=".Net" />
          <Chip size="small" avatar={<Avatar>{techTheme.micronaut.icon}</Avatar>} label="Micronaut" />
          <Chip size="small" avatar={<Avatar>{techTheme.cucumber.icon}</Avatar>} label="Cucumber" />
          <Chip size="small" avatar={<Avatar>{techTheme.docker.icon}</Avatar>} label="Docker" />
          <Chip size="small" avatar={<Avatar>{techTheme.github.icon}</Avatar>} label="Github" />
          <Chip size="small" avatar={<Avatar>{techTheme.jenkins.icon}</Avatar>} label="Jenkins" />
          <Chip size="small" avatar={<Avatar>{techTheme.terraform.icon}</Avatar>} label="Terraform" />
          <Chip size="small" avatar={<Avatar>{techTheme.aws.icon}</Avatar>} label="AWS" />
          <Chip size="small" avatar={<Avatar>{techTheme.apiGateway.icon}</Avatar>} label="ApiGateway" />
          <Chip size="small" avatar={<Avatar>{techTheme.lambda.icon}</Avatar>} label="Lambda" />
          <Chip
            size="small"
            avatar={
              <Avatar>
                <FcServices />
              </Avatar>
            }
            label="Microservices"
          />
          <Chip
            size="small"
            avatar={
              <Avatar>
                <FcCustomerSupport />
              </Avatar>
            }
            label="On call support"
          />
          <Chip size="small" avatar={<Avatar>{techTheme.agile.icon}</Avatar>} label="Agile" />
        </span>
      ),
      startDate: '2019',
      endDate: 'Today',
      isCurrent: true,
      company: 'Nike',
    },
    {
      title: 'Senior Full-stack Software Engineer',
      summary: (
        <span>
          NodeJS/Postgres/Javascript devops position with technical leadership responsibilities
          <br />
          <FcAutomotive /> <FcDatabase /> <FcWorkflow />
          <br />
          Vehicle Catalog Data Ingestion and Management
          <br />
          <Chip size="small" avatar={<Avatar>{techTheme.nodeJs.icon}</Avatar>} label="Node" />
          <Chip size="small" avatar={<Avatar>{techTheme.react.icon}</Avatar>} label="React" />
          <Chip size="small" avatar={<Avatar>{techTheme.python.icon}</Avatar>} label="Python" />
          <Chip size="small" avatar={<Avatar>{techTheme.docker.icon}</Avatar>} label="Docker" />
          <Chip size="small" avatar={<Avatar>{techTheme.github.icon}</Avatar>} label="Github" />
          <Chip size="small" avatar={<Avatar>{techTheme.circleci.icon}</Avatar>} label="CircleCI" />
          <Chip size="small" avatar={<Avatar>{techTheme.terraform.icon}</Avatar>} label="Terraform" />
          <Chip size="small" avatar={<Avatar>{techTheme.aws.icon}</Avatar>} label="AWS" />
          <Chip size="small" avatar={<Avatar>{techTheme.ec2.icon}</Avatar>} label="EC2" />
          <Chip size="small" avatar={<Avatar>{techTheme.nomad.icon}</Avatar>} label="Nomad" />
          <Chip size="small" avatar={<Avatar>{techTheme.consul.icon}</Avatar>} label="Consul" />
          <Chip size="small" avatar={<Avatar>{techTheme.nginx.icon}</Avatar>} label="Nginx" />
          <Chip
            size="small"
            avatar={
              <Avatar>
                <FcServices />
              </Avatar>
            }
            label="Microservices"
          />
          <Chip
            size="small"
            avatar={
              <Avatar>
                <FcCustomerSupport />
              </Avatar>
            }
            label="On call support"
          />
          <Chip size="small" avatar={<Avatar>{techTheme.agile.icon}</Avatar>} label="Agile" />
        </span>
      ),
      startDate: '2017',
      endDate: '2019',
      isCurrent: false,
      company: 'Cox Auto (Data Solutions)',
    },
    {
      title: 'Full-stack Software Engineer',
      summary: (
        <span>
          Java/MySQL/Javascript development
          <br />
          <FcAutomotive /> <FcDatabase /> <FcMultipleInputs />
          <br />
          High Throughput Inventory Management Systems
          <br />
          <Chip size="small" avatar={<Avatar>{techTheme.java.icon}</Avatar>} label="Java" />
          <Chip size="small" avatar={<Avatar>{techTheme.spring.icon}</Avatar>} label="Spring Boot" />
          <Chip size="small" avatar={<Avatar>{techTheme.groovy.icon}</Avatar>} label="Groovy" />
          <Chip size="small" avatar={<Avatar>{techTheme.angular.icon}</Avatar>} label="AngularJS" />
          <Chip size="small" avatar={<Avatar>{techTheme.mysql.icon}</Avatar>} label="Mysql" />
          <Chip size="small" avatar={<Avatar>{techTheme.github.icon}</Avatar>} label="Github" />
          <Chip size="small" avatar={<Avatar>{techTheme.jenkins.icon}</Avatar>} label="Jenkins" />
          <Chip
            size="small"
            avatar={
              <Avatar>
                <FcCustomerSupport />
              </Avatar>
            }
            label="On call support"
          />
          <Chip size="small" avatar={<Avatar>{techTheme.agile.icon}</Avatar>} label="Agile" />
        </span>
      ),
      startDate: '2015',
      endDate: '2017',
      isCurrent: false,
      company: 'Cox Auto (Dealer.com)',
    },
    {
      title: 'Dev/Ops Engineer',
      summary: (
        <span>
          Sys admin, web app development, and test automation
          <br />
          <GiRoad /> <FaHardHat />
          <br />
          Construction management and accounting software
          <br />
          <Chip size="small" avatar={<Avatar>{techTheme.java.icon}</Avatar>} label="Java" />
          <Chip size="small" avatar={<Avatar>{techTheme.jquery.icon}</Avatar>} label="Jquery" />
          <Chip size="small" avatar={<Avatar>{techTheme.oracle.icon}</Avatar>} label="Oracle DB" />
          <Chip size="small" avatar={<Avatar>{techTheme.oracle.icon}</Avatar>} label="Weblogic" />
          <Chip size="small" avatar={<Avatar>{techTheme.others.icon}</Avatar>} label="Bugzilla" />
          <Chip size="small" avatar={<Avatar>{techTheme.others.icon}</Avatar>} label="Selenium" />
          <Chip size="small" avatar={<Avatar>{techTheme.others.icon}</Avatar>} label="Ant" />
        </span>
      ),
      startDate: '2014',
      endDate: '2015',
      isCurrent: false,
      company: 'CapitalSoft',
    },
  ],
  projects: [
    {
      title: 'Andrew Paettie.com',
      subtitle: 'My résumé',
      date: `2014 - ${moment().year()}`,
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
          name: 'Github',
          icon: techTheme.github.icon,
        },
        {
          name: 'CircleCI',
          icon: techTheme.circleci.icon,
        },
        {
          name: 'React',
          icon: techTheme.react.icon,
        },
        {
          name: 'Jest',
          icon: techTheme.jest.icon,
        },
        {
          name: 'AWS',
          icon: techTheme.aws.icon,
        },
        {
          name: 'S3',
          icon: techTheme.s3.icon,
        },
        {
          name: 'CloudFront',
          icon: techTheme.cloudfront.icon,
        },
        {
          name: 'Route53',
          icon: techTheme.route53.icon,
        },
      ],
      content: 'A simple portfolio site to show some projects I have built.',
      image: mySiteImage,
    },
    {
      title: 'Crypto Trading Analysis Platform',
      subtitle: 'Swing trade crypto currency bot',
      date: 'April 2021',
      techTheme: techTheme.nodeJs,
      links: [
        {
          url: 'https://github.com/cazlo/muskbot-architecture',
          text: 'Architecture Documentation',
        },
      ],
      technologies: [
        {
          name: 'Node',
          icon: techTheme.nodeJs.icon,
        },
        {
          name: 'React',
          icon: techTheme.react.icon,
        },
        {
          name: 'Jest',
          icon: techTheme.jest.icon,
        },
        {
          name: 'Postgres',
          icon: techTheme.postgres.icon,
        },
        {
          name: 'Docker',
          icon: techTheme.docker.icon,
        },
        {
          name: 'Twitter',
          icon: techTheme.twitter.icon,
        },
        {
          name: 'Microservices',
          icon: <FcServices />,
        },
      ],
      content:
        // eslint-disable-next-line max-len
        'Microservice clusters for ingesting data and using that data to analyze various algorithms for trading crypto currencies',
      image: cryptoTradingImage,
    },
    {
      title: 'SAM Performance',
      subtitle: 'Analyzing performance of SAM',
      date: 'July 2020',
      techTheme: techTheme.aws,
      links: [
        {
          url: 'https://cazlo.github.io/aws-lambda-sam-performance/',
          text: 'Performance Analysis',
        },
        {
          url: 'https://github.com/cazlo/aws-lambda-sam-performance',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'AWS',
          icon: techTheme.aws.icon,
        },
        {
          name: 'Lambda',
          icon: techTheme.lambda.icon,
        },
        {
          name: 'Api Gateway',
          icon: techTheme.apiGateway.icon,
        },
        {
          name: 'Java',
          icon: techTheme.java.icon,
        },
        {
          name: 'Micronaut',
          icon: techTheme.micronaut.icon,
        },
        {
          name: 'Quarkus',
          icon: techTheme.quarkus.icon,
        },
        {
          name: 'Node',
          icon: techTheme.nodeJs.icon,
        },
        {
          name: 'React',
          icon: techTheme.react.icon,
        },
      ],
      content:
        // eslint-disable-next-line max-len
        "Performance analysis comparing various implementations of serverless APIs built with AWS's Serverless Framework.",
      image: samAnalysisImage,
    },
    {
      title: 'React Snake',
      subtitle: '404 for this site',
      date: 'October 2018',
      techTheme: techTheme.react,
      links: [
        {
          url: '/snake',
          text: 'Site',
        },
        {
          url: 'https://github.com/cazlo/resume-andrew-paettie/tree/master/src/containers/SnakeGame',
          text: 'View source code',
        },
      ],
      technologies: [
        {
          name: 'React',
          icon: techTheme.react.icon,
        },
        {
          name: 'AI',
          icon: <AiIcon />,
        },
      ],
      content: 'A snake game and AI implemented to solve the game in an optimized way',
      image: snakeImage,
    },
    {
      title: 'JS Performance Analysis',
      subtitle: 'Analyzing differences between node 8 and 10',
      date: 'May 2018',
      techTheme: techTheme.nodeJs,
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
      content: 'Something to test out differences in several map implementations between node 8 and 10',
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
          icon: <AiIcon />,
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
          icon: <AiIcon />,
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
          icon: <MlIcon />,
        },
      ],
      content: `Some homework for a machine learning class I took, aimed towards implementing and using
          various prediction engines to classify data.`,
      // image: '/img/ml-stats.png',
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
          icon: <FaMicrochip />,
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
          icon: techTheme.cplusplus.icon,
        },
      ],
      content: `Some things I've made for school. Pictured is a loan amortization calculator featuring
       from scratch graphs and tables built using the swing UI framework for Java.`,
      image: amatorizationImage,
    },
    {
      title: 'Backtrack',
      subtitle: 'Penetration testing',
      date: '2009',
      techTheme: techTheme.security,
      technologies: [
        {
          name: 'Linux',
          icon: techTheme.linux.icon,
        },
        {
          name: 'Aircrack-ng',
          icon: <MdSignalWifi4BarLock />,
        },
        {
          name: 'Wireshark',
          icon: <GiSharkJaws />,
        },
        {
          name: 'Nmap',
          icon: <GrGraphQl />,
        },
      ],
      content:
        // eslint-disable-next-line max-len
        'Used the backtrack linux distribution to learn about penetration testing. Setup networks with vulnerabilities and then attempted to attack them.',
      links: [
        {
          url: 'http://www.backtrack-linux.org/',
          text: 'Backtrack Linux',
        },
      ],
    },
    {
      title: 'Rockbox',
      subtitle: 'MP3 Player Replacement Firmware',
      date: '2006-2008',
      techTheme: techTheme.c,
      technologies: [
        {
          name: 'C',
          icon: techTheme.c.icon,
        },
        {
          name: 'BMP',
          icon: <FcImageFile />,
        },
      ],
      content: 'Developed themes and provided QA for IPod and Sansa e200 firmware replacement.',
      links: [
        {
          url: 'https://www.rockbox.org/',
          text: 'Rockbox.org',
        },
      ],
    },
    {
      title: 'Linux From Scratch',
      subtitle: 'Building a linux installation from scratch',
      date: '2005',
      techTheme: techTheme.linux,
      technologies: [
        {
          name: 'Linux',
          icon: techTheme.linux.icon,
        },
        {
          name: 'Bash',
          icon: techTheme.bash.icon,
        },
        {
          name: 'C',
          icon: techTheme.c.icon,
        },
      ],
      // eslint-disable-next-line max-len
      content: `Compiled linux from scratch to create a low power wireless print server via CUPS and IPP. At the time, gcc compilation alone took several hours!`,
      links: [
        {
          url: 'https://www.linuxfromscratch.org/',
          text: 'Linux From Scratch',
        },
      ],
    },
  ],
};
