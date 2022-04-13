import React from 'react';
import { GoGraph } from 'react-icons/go';
import { FaCreditCard, FaHardHat, FaMicrochip, FaRobot, FaShoppingCart } from 'react-icons/fa';

import moment from 'moment';
import { MdSignalWifi4BarLock } from 'react-icons/md';
import { GiMicroscope, GiRoad, GiRunningShoe, GiSharkJaws, GiSpaceSuit } from 'react-icons/gi';
import { GrGraphQl } from 'react-icons/gr';
import {
  FcAutomotive,
  FcDatabase,
  FcGlobe,
  FcImageFile,
  FcMultipleInputs,
  FcAssistant,
  FcScatterPlot,
  FcServices,
  FcShop,
  FcWorkflow,
  FcDataSheet,
  FcCommandLine,
  FcFinePrint,
  FcEngineering,
  FcParallelTasks,
  FcPrivacy,
} from 'react-icons/fc';
import { ReactComponent as Selenium } from 'devicon/icons/selenium/selenium-original.svg';
import { ReactComponent as Apache } from 'devicon/icons/apache/apache-original.svg';
import { AiFillRobot } from 'react-icons/ai';
import { BsBugFill } from 'react-icons/bs';
import { SiNike } from 'react-icons/si';
import { IoRocket } from 'react-icons/io5';
import Avatar from '@mui/material/Avatar';
import techTheme from './techTheme';
import heliGameImage from '../data/heli-game.gif';
import amatorizationImage from '../data/amatorization.gif';
import agent007Image from '../data/agent-007.gif';
import snakeImage from '../data/snake.gif';
import cryptoTradingImage from '../data/crypto-trade-analysis.png';
import samAnalysisImage from '../data/SAM-analysis.png';
import mySiteImage from '../data/mysite.png';
// Blue Origin logo by https://www.blueorigin.com/icons/featherfooter.svg,
// Fair use, https://en.wikipedia.org/w/index.php?curid=60735597
import { ReactComponent as BlueLogo } from '../data/Blue_Origin_Feather.svg';
// cox auto log by https://www.mulesoft.com/sites/default/files/2018-10/cox_automative.png
import coxAutoImage from '../data/cox_automative.png';

const AiIcon = FaRobot;
const MlIcon = GoGraph;

const JavaTech = {
  name: 'Java',
  icon: <Avatar style={{ backgroundColor: techTheme.java.iconStyle.background }}>{techTheme.java.icon}</Avatar>,
};

const GithubTech = {
  name: 'Github',
  icon: <Avatar style={{ backgroundColor: '#fff' }}>{techTheme.github.icon}</Avatar>,
};

const CircleCiTech = {
  name: 'CircleCI',
  icon: <Avatar style={{ backgroundColor: '#fff' }}>{techTheme.circleci.icon}</Avatar>,
};

const SpringTech = {
  name: 'Spring',
  icon: <Avatar style={{ backgroundColor: '#fff' }}>{techTheme.spring.icon}</Avatar>,
};

const ApiGatewayTech = { name: 'ApiGateway', icon: <Avatar>{techTheme.apiGateway.icon}</Avatar> };

const LambdaTech = { name: 'Lambda', icon: <Avatar>{techTheme.lambda.icon}</Avatar> };

const JavascriptTech = { name: 'Javascript', icon: <Avatar>{techTheme.javascript.icon}</Avatar> };

export default {
  educations: [
    {
      schoolName: 'University of Texas @Dallas',
      fieldOfStudy: 'Computer Science',
      startDate: '2010',
      endDate: '2015',
      degree: 'Bachelor of Science in Computer Science',
      areasOfStudy: [
        {
          name: 'AI',
          icon: <AiFillRobot />,
        },
        {
          name: 'Machine Learning',
          icon: <FcScatterPlot />,
        },
        {
          name: 'Network Security',
          icon: techTheme.security.icon,
        },
        {
          name: 'Linux',
          icon: techTheme.linux.icon,
        },
        {
          name: 'Database Design',
          icon: <FcDatabase />,
        },
      ],
      languages: [
        JavaTech,
        { name: 'Python', icon: techTheme.python.icon },
        { name: 'C++', icon: techTheme.cplusplus.icon },
        { name: 'C#', icon: techTheme.csharp.icon },
        { name: '.Net', icon: techTheme.dotNet.icon },
      ],
      gpa: [
        { name: 'Major', value: '3.8' },
        { name: 'Overall', value: '3.2' },
      ],
    },
  ],
  positions: [
    {
      title: 'Site Reliability Engineer',
      company: 'Blue Origin',
      startDate: '2021',
      endDate: 'Today',
      isCurrent: true,
      tech: [
        JavaTech,
        { name: 'Node', icon: techTheme.nodeJs.icon },
        { name: 'Python', icon: techTheme.python.icon },
        { name: 'Linux', icon: techTheme.linux.icon },
        { name: 'Docker', icon: techTheme.docker.icon },
        {
          name: 'Kubernetes',
          icon: <Avatar style={{ backgroundColor: '#fff' }}>{techTheme.kubernetes.icon}</Avatar>,
          iconBackground: techTheme.kubernetes.style.color,
        },
        { name: 'Gitlab (CI)', icon: techTheme.gitlab.icon },
        { name: 'Artifactory', icon: techTheme.artifactory.icon },
        { name: 'Terraform', icon: techTheme.terraform.icon },
        { name: 'Ansible', icon: techTheme.ansible.icon },
        { name: 'AWS', icon: techTheme.aws.icon },
        { name: 'EC2', icon: <Avatar>{techTheme.ec2.icon}</Avatar> },
      ],
      domains: [
        { name: 'Space Exploration', icon: <GiSpaceSuit /> },
        { name: 'Rocket Engines', icon: <IoRocket /> },
        { name: 'Developer Enablement', icon: <FcCommandLine /> },
        { name: 'Business Workflow', icon: <FcWorkflow /> },
        { name: 'Standards Compliance', icon: <FcFinePrint /> },
        { name: 'Systems Administration', icon: <FcEngineering /> },
        { name: 'Monitoring', icon: <GiMicroscope /> },
        { name: 'Security', icon: <FcPrivacy /> },
        { name: 'On-call support', icon: <FcAssistant /> },
        { name: 'Technical Project Management', icon: <FcParallelTasks /> },
      ],
      summary: (
        <span>
          Devops position with technical leadership responsibilities
          <br />
          Development and maintenance of foundational systems supporting software engineering across the organization
        </span>
      ),
      icon: <BlueLogo />,
    },
    {
      title: 'Senior Software engineer',
      company: 'Nike',
      startDate: '2019',
      endDate: '2021',
      isCurrent: false,
      tech: [
        JavaTech,
        { name: 'Node', icon: techTheme.nodeJs.icon },
        { name: '.Net', icon: techTheme.dotNet.icon },
        { name: 'Micronaut', icon: techTheme.micronaut.icon },
        { name: 'Cucumber', icon: techTheme.cucumber.icon },
        { name: 'Docker', icon: techTheme.docker.icon },
        GithubTech,
        { name: 'Jenkins', icon: techTheme.jenkins.icon },
        { name: 'Terraform', icon: techTheme.terraform.icon },
        { name: 'AWS', icon: techTheme.aws.icon },
        ApiGatewayTech,
        LambdaTech,
        { name: 'Microservices', icon: <FcServices /> },
      ],
      domains: [
        { name: 'Shoes', icon: <GiRunningShoe /> },
        { name: 'Global', icon: <FcGlobe /> },
        { name: 'Retail', icon: <FcShop /> },
        { name: 'Payment', icon: <FaCreditCard /> },
        { name: 'Checkout', icon: <FaShoppingCart /> },
        { name: 'Business Workflow', icon: <FcWorkflow /> },
        { name: 'On-call support', icon: <FcAssistant /> },
        { name: 'Agile', icon: techTheme.agile.icon },
      ],
      summary: <span>Devops position with technical leadership and architecture responsibilities</span>,
      icon: <SiNike />,
    },
    {
      title: 'Senior Full-stack Software Engineer',
      company: 'Cox Automotive (Data Solutions)',
      startDate: '2017',
      endDate: '2019',
      isCurrent: false,
      tech: [
        { name: 'Node', icon: techTheme.nodeJs.icon },
        { name: 'React', icon: techTheme.react.icon },
        { name: 'Python', icon: techTheme.python.icon },
        { name: 'Docker', icon: techTheme.docker.icon },
        GithubTech,
        CircleCiTech,
        { name: 'Terraform', icon: techTheme.terraform.icon },
        { name: 'AWS', icon: techTheme.aws.icon },
        { name: 'EC2', icon: <Avatar>{techTheme.ec2.icon}</Avatar> },
        { name: 'Nomad', icon: techTheme.nomad.icon },
        { name: 'Consul', icon: techTheme.consul.icon },
        { name: 'Nginx', icon: techTheme.nginx.icon },
        { name: 'Microservices', icon: <FcServices /> },
      ],
      domains: [
        { name: 'Automotive', icon: <FcAutomotive /> },
        { name: 'Database', icon: <FcDatabase /> },
        { name: 'Business Workflow', icon: <FcWorkflow /> },
        { name: 'On-call support', icon: <FcAssistant /> },
        { name: 'Agile', icon: techTheme.agile.icon },
      ],
      summary: (
        <span>
          Devops position with technical leadership responsibilities
          <br />
          Vehicle Catalog Data Ingestion and Management
        </span>
      ),
      icon: <img src={coxAutoImage} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="cox automotive" />,
    },
    {
      title: 'Full-stack Software Engineer',
      company: 'Cox Automotive (Dealer.com)',
      startDate: '2015',
      endDate: '2017',
      isCurrent: false,
      tech: [
        JavaTech,
        SpringTech,
        { name: 'Groovy', icon: techTheme.groovy.icon },
        { name: 'Angular', icon: techTheme.angular.icon },
        { name: 'Mysql', icon: techTheme.mysql.icon },
        GithubTech,
        { name: 'Jenkins', icon: techTheme.jenkins.icon },
      ],
      domains: [
        { name: 'Automotive', icon: <FcAutomotive /> },
        { name: 'Database', icon: <FcDatabase /> },
        { name: 'Business Workflow', icon: <FcWorkflow /> },
        { name: 'Data Aggregation', icon: <FcMultipleInputs /> },
        { name: 'On-prem to AWS Migration', icon: techTheme.aws.icon },
        { name: 'On-call support', icon: <FcAssistant /> },
        { name: 'Agile', icon: techTheme.agile.icon },
      ],
      summary: (
        <span>
          Software developer
          <br />
          High throughput inventory management systems
        </span>
      ),
      icon: <img src={coxAutoImage} style={{ maxWidth: '100%', maxHeight: '100%' }} alt="cox automotive" />,
    },
    {
      title: 'Dev/Ops Engineer',
      startDate: '2014',
      endDate: '2015',
      isCurrent: false,
      company: 'CapitalSoft',
      tech: [
        JavaTech,
        { name: 'Jquery', icon: techTheme.jquery.icon },
        { name: 'Oracle DB', icon: techTheme.oracle.icon },
        { name: 'Weblogic', icon: techTheme.oracle.icon },
        { name: 'Bugzilla', icon: <BsBugFill /> },
        {
          name: 'Selenium',
          icon: (
            <Avatar style={{ backgroundColor: 'white' }}>
              <Selenium />
            </Avatar>
          ),
        },
        {
          name: 'Ant',
          icon: (
            <Avatar style={{ backgroundColor: 'white' }}>
              <Apache />
            </Avatar>
          ),
        },
      ],
      domains: [
        { name: 'Construction', icon: <FaHardHat /> },
        { name: 'Toll Road', icon: <GiRoad /> },
        { name: 'Accounting', icon: <FcDataSheet /> },
        { name: 'Business Workflow', icon: <FcWorkflow /> },
      ],
      summary: (
        <span>
          Sys admin, web app development, and test automation
          <br />
          Construction management and accounting software
        </span>
      ),
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
        GithubTech,
        CircleCiTech,
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
        LambdaTech,
        ApiGatewayTech,
        JavaTech,
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
      technologies: [JavascriptTech],
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
        JavaTech,
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
        JavaTech,
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
      technologies: [JavaTech],
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
        JavaTech,
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
