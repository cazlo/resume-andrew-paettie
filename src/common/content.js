import React from 'react';
import { FaCreditCard, FaHardHat, FaMicrochip, FaProjectDiagram, FaRobot, FaShoppingCart } from 'react-icons/fa';

import moment from 'moment';
import { MdArchitecture, MdSignalWifi4BarLock } from 'react-icons/md';
import {
  GiBrain,
  GiMicroscope,
  GiRoad,
  GiRunningShoe,
  GiServerRack,
  GiSharkJaws,
  GiSpaceSuit,
  GiSquirrel,
  GiWarpPipe,
} from 'react-icons/gi';
import { GrGraphQl, GrTest } from 'react-icons/gr';
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
  FcDataProtection,
  FcSearch,
  FcBinoculars,
  FcCollaboration,
  FcDocument,
  FcCustomerSupport,
  FcTimeline,
  FcManager,
} from 'react-icons/fc';
import { ReactComponent as Selenium } from 'devicon/icons/selenium/selenium-original.svg';
import { ReactComponent as Mongodb } from 'devicon/icons/mongodb/mongodb-original.svg';
import { AiFillRobot } from 'react-icons/ai';
import { BsBugFill, BsChatSquareText, BsFillEnvelopeFill, BsFillKanbanFill } from 'react-icons/bs';
import {
  SiApache,
  SiApacheant,
  SiApachesolr,
  SiDatadog,
  SiElasticsearch,
  SiKibana,
  SiNewrelic,
  SiNike,
  SiSplunk,
  SiSumologic,
} from 'react-icons/si';
import { IoRocket } from 'react-icons/io5';
import { DiScrum } from 'react-icons/di';
import { IoMdGitBranch } from 'react-icons/io';
import { VscOpenPreview } from 'react-icons/vsc';
import { WiTime12 } from 'react-icons/wi';
import Avatar from '@mui/material/Avatar';
import techTheme from './techTheme';
import heliGameImage from '../data/heli-game.gif';
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
  icon: <Avatar sx={{ backgroundColor: '#fff' }}>{techTheme.spring.icon}</Avatar>,
};

const ApiGatewayTech = { name: 'ApiGateway', icon: <Avatar>{techTheme.apiGateway.icon}</Avatar> };

const LambdaTech = { name: 'Lambda', icon: <Avatar>{techTheme.lambda.icon}</Avatar> };

const JavascriptTech = { name: 'Javascript', icon: <Avatar>{techTheme.javascript.icon}</Avatar> };

const KubernetesTech = {
  name: 'Kubernetes',
  icon: <Avatar sx={{ backgroundColor: '#fff' }}>{techTheme.kubernetes.icon}</Avatar>,
  iconBackground: techTheme.kubernetes.style.color,
};

const since = year => new Date().getFullYear() - year;
const between = (year, laterYear) => laterYear - year;
const stillUsed = () => new Date().getFullYear();

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
          link: 'https://github.com/cazlo/exploring-AI',
        },
        {
          name: 'Machine Learning',
          icon: <FcScatterPlot />,
          link: 'https://github.com/cazlo/exploring-machine-learning',
        },
        {
          name: 'Network Security',
          icon: techTheme.security.icon,
        },
        {
          name: 'Linux',
          icon: techTheme.linux.icon,
          link: 'https://github.com/cazlo/academic-stuff',
        },
        {
          name: 'Database Design',
          icon: <FcDatabase />,
        },
        {
          name: 'Computer Architecture',
          icon: <FcDatabase />,
          link: 'https://github.com/cazlo/MOOPS-Moo-on-MIPS',
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
        KubernetesTech,
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
          icon: <SiApacheant />,
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
  skills: {
    technical: {
      languages: [
        {
          ...JavaTech,
          experience: between(2014, 2017) + since(2019),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'JUnit',
              description: 'Unit and integration testing',
              icon: JavaTech.icon,
              experience: between(2015, 2017) + since(2019),
              lastUsed: stillUsed(),
            },
            {
              name: 'Spring (boot)',
              description: 'Gluing together the various standards that make Enterprise Java what it is',
              icon: SpringTech.icon,
              experience: between(2015, 2017) + between(2019, 2020),
              lastUsed: 2020,
            },
            {
              name: 'Micronaut',
              description: 'Using GraalVM and AOT to make java lambdas performant enough for the real world',
              icon: techTheme.micronaut.icon,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Gradle',
              description:
                'Someone thought it was a good idea to define java build processes using Groovy. Based on Maven',
              icon: techTheme.gradle.icon,
              experience: between(2016, 2017) + between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Maven',
              description: 'Declarative stable java builds. Based on Ant',
              icon: techTheme.maven.icon,
              experience: between(2015, 2017) + between(2019, 2020),
              lastUsed: stillUsed(),
            },
            {
              name: 'Quarkus',
              description: 'Using GraalVM and AOT to make java code fast in "scale to 0" use cases',
              icon: techTheme.quarkus.icon,
              experience: between(2020, 2021) + since(2022),
              lastUsed: stillUsed(),
            },
            {
              name: 'Tomcat',
              description: 'A server to run WARs',
              icon: techTheme.tomcat.icon,
              experience: between(2015, 2017) + between(2019, 2020),
              lastUsed: 2020,
            },
          ],
        },
        {
          ...JavascriptTech,
          experience: between(2014, 2019) + since(2021),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'Node',
              description: 'Backend process/API development',
              icon: techTheme.nodeJs.icon,
              experience: since(2017),
              lastUsed: stillUsed(),
            },
            {
              name: 'Jest',
              description: 'Test driven development for unit and integration tests of javascript code',
              icon: techTheme.jest.icon,
              experience: since(2018),
              lastUsed: stillUsed(),
            },
            {
              name: 'React',
              description: 'A popular UI framework developed by Metabook',
              icon: techTheme.react.icon,
              experience: since(2018),
              lastUsed: stillUsed(),
            },
            {
              name: 'Redux',
              description: 'Global state management for react with fantastic debugging capabilities',
              icon: techTheme.redux.icon,
              experience: between(2017, 2019),
              lastUsed: stillUsed(),
            },
            {
              name: 'Cucumber',
              description: 'Integration tests focusing on end user behavior',
              icon: techTheme.cucumber.icon,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Angular',
              description: 'UI framework',
              icon: techTheme.angular.icon,
              experience: between(2016, 2017),
              lastUsed: 2017,
            },
          ],
        },
        {
          name: 'Python',
          icon: techTheme.python.icon,
          experience: between(2012, 2014) + between(2017, 2019) + since(2021.5),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'Locust.io',
              description: 'Easy load testing framework',
              icon: techTheme.python.icon,
              experience: between(2017, 2021),
              lastUsed: 2021,
            },
            {
              name: 'virtualenv',
              description: 'Installing python + dependencies locally instead of at the system level',
              icon: techTheme.python.icon,
              experience: between(2017, 2019) + since(2021.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'scikit-learn',
              description: 'Several tools for machine learning, e.g. SVM',
              icon: techTheme.python.icon,
              experience: between(2017, 2018),
              lastUsed: 2018,
            },
            {
              name: 'pytest',
              description: 'Unit and integration testing python code',
              icon: techTheme.python.icon,
              experience: between(2017, 2018),
              lastUsed: 2018,
            },
            {
              name: 'opencv',
              description: 'Python wrapper for OpenCV computer vision',
              icon: techTheme.c.icon,
              experience: between(2021.5, 2022),
              lastUsed: 2022,
            },
          ],
        },
        {
          name: 'C#',
          icon: techTheme.csharp.icon,
          experience: between(2014.5, 2015) + between(2020, 2021),
          lastUsed: 2021,
          frameworks: [
            {
              name: '.Net',
              description: 'Analyzed legacy Microsoft Java code to use as specifications for new systems',
              icon: techTheme.dotNet.icon,
              experience: between(2020, 2021),
              lastUsed: 2021,
            },
          ],
        },
        {
          name: 'C(++)',
          icon: techTheme.c.icon,
          experience: between(2006, 2006.5) + between(2010, 2010.5) + between(2014, 2014.5),
          lastUsed: 2014,
          frameworks: [
            {
              name: 'opencv',
              description:
                'Computer vision library used for a few experiements such as finger counting and eye tracking',
              icon: techTheme.cplusplus.icon,
              experience: between(2014, 2014.5),
              lastUsed: 2014,
            },
          ],
        },
      ],
      persistence: [
        {
          name: 'SQL',
          icon: <FcDataProtection />,
          experience: between(2014, 2019) + since(2021.5),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'postgres',
              description: 'Combination of DBA, schema development, and performance optimization',
              icon: techTheme.postgres.icon,
              experience: between(2017, 2019) + since(2021.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'mysql',
              description: 'Combination of DBA and query development of existing schemas',
              icon: techTheme.mysql.icon,
              experience: between(2015, 2017) + since(2021.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'oracle',
              description: 'Mostly DBA, with some query development for troubleshooting',
              icon: techTheme.oracle.icon,
              experience: between(2014, 2015),
              lastUsed: 2015,
            },
          ],
        },
        {
          name: 'NoSQL',
          icon: <FcDataSheet />,
          experience: between(2015, 2015.5) + between(2018, 2019) + between(2019, 2021),
          lastUsed: 2021,
          frameworks: [
            {
              name: 'DynamoDB',
              description: 'AWS Key value store with useful event streaming and DR capabilities',
              icon: techTheme.dynamoDb.icon,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Reddis',
              description: 'In memory cache',
              icon: techTheme.others.icon, // todo reddis
              experience: between(2018, 2019),
              lastUsed: 2019,
            },
            {
              name: 'Monogodb',
              description: 'Storing and searching uniformly structured JSONs',
              icon: <Mongodb />,
              experience: between(2015, 2015.5),
              lastUsed: 2015,
            },
          ],
        },
        {
          name: 'Search',
          icon: <FcSearch />,
          experience: since(2016),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'Elasticsearch',
              description: 'Full text search which builds on lucene',
              icon: <SiElasticsearch />,
              experience: since(2016),
              lastUsed: stillUsed(),
            },
            {
              name: 'Solr',
              description: 'Full text search used as a cache on top of SQL database',
              icon: <SiApachesolr />,
              experience: between(2015, 2017),
              lastUsed: 2017,
            },
            {
              name: 'Lucene',
              description: 'In-memory full text search',
              icon: <SiApache />,
              experience: between(2014.5, 2015),
              lastUsed: 2015,
            },
          ],
        },
        {
          name: 'Messaging',
          icon: <BsFillEnvelopeFill />,
          experience: between(2015, 2017) + between(2019, 2021.5),
          lastUsed: 2021,
          frameworks: [
            {
              name: 'SQS',
              description: 'AWS queue service with guaranteed message delivery and useful DR capabilities',
              icon: techTheme.sqs.icon,
              experience: between(2016, 2017) + between(2019, 2021.5),
              lastUsed: 2021,
            },
            {
              name: 'RabbitMq',
              description: 'Full featured message broker (topics + queues) written in erlang',
              icon: techTheme.rabbitmq.icon,
              experience: between(2015, 2017),
              lastUsed: 2017,
            },
            {
              name: 'Kinesis',
              description: 'AWS event stream used by many services, e.g. DynamoDB event streaming.',
              icon: techTheme.kinesis.icon,
              experience: between(2020, 2021),
              lastUsed: 2021,
            },
          ],
        },
      ],
      cloud: [
        {
          name: 'AWS',
          icon: techTheme.aws.icon,
          experience: since(2017),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'S3',
              icon: techTheme.s3.icon,
              experience: since(2017),
              lastUsed: stillUsed(),
            },
            {
              name: 'IAM',
              icon: techTheme.iam.icon,
              experience: since(2017),
              lastUsed: stillUsed(),
            },
            {
              name: 'EC2',
              icon: techTheme.ec2.icon,
              experience: since(2017),
              lastUsed: stillUsed(),
            },
            {
              name: 'RDS',
              icon: techTheme.rds.icon,
              experience: between(2017, 2019) + since(2021.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'SQS',
              icon: techTheme.sqs.icon,
              experience: between(2016, 2017) + between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'DynamoDB',
              icon: techTheme.dynamoDb.icon,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Lambda',
              icon: techTheme.lambda.icon,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'ApiGateway',
              icon: techTheme.apiGateway.icon,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Serverless Application Model (SAM)',
              icon: <GiSquirrel />,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Cloudfront',
              icon: techTheme.cloudfront.icon,
              experience: since(2017),
              lastUsed: stillUsed(),
            },
            {
              name: 'Route53',
              icon: techTheme.route53.icon,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },

            {
              name: 'Glue',
              icon: techTheme.glue.icon,
              experience: between(2017, 2019),
              lastUsed: 2019,
            },
          ],
        },
      ],
      operational: [
        {
          name: 'Infrastructure as Code',
          icon: <GiServerRack />,
          experience: since(2017),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'Docker',
              icon: techTheme.docker.icon,
              experience: since(2017),
              lastUsed: stillUsed(),
            },
            {
              name: 'Terraform',
              icon: techTheme.terraform.icon,
              experience: between(2016, 2016.5) + since(2017),
              lastUsed: stillUsed(),
            },
            {
              name: 'Cloudformation',
              icon: techTheme.aws.icon, // tood cloudformation icon
              experience: since(2019),
              lastUsed: stillUsed(),
            },
            {
              name: 'Ansible',
              icon: techTheme.ansible.icon,
              experience: between(2016, 2016.5) + since(2021.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'Podman',
              icon: <Avatar sx={{ backgroundColor: '#fff' }}>{techTheme.podman.icon}</Avatar>,
              experience: 0.1,
              lastUsed: stillUsed(),
            },
          ],
        },
        {
          name: 'Container Orchestration',
          icon: techTheme.docker.icon,
          experience: since(2018),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'docker-compose',
              icon: techTheme.docker.icon,
              experience: since(2019),
              lastUsed: stillUsed(),
            },
            {
              name: 'Nomad',
              icon: techTheme.nomad.icon,
              experience: between(2017, 2019),
              lastUsed: 2019,
            },
            {
              name: 'AWS ECS',
              icon: techTheme.aws.icon, // todo ecs icon
              experience: between(2020, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Kubernetes',
              icon: KubernetesTech.icon,
              experience: since(2021.5),
              lastUsed: stillUsed(),
            },
          ],
        },
        {
          name: 'Security Testing',
          icon: techTheme.security.icon,
          experience: since(2015),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'Peer Review',
              description: 'Reviewing and testing processes with a critical approach to security',
              icon: <GiMicroscope />,
              experience: since(2015),
              lastUsed: stillUsed(),
            },
            {
              name: 'Dependabot',
              description: 'Scanning dependencies for known CVEs in Github',
              icon: GithubTech.icon,
              experience: since(2017.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'OWASP Top 10',
              description: 'A data driven approach to avoiding security issues via secure design',
              icon: techTheme.security.icon,
              experience: since(2019),
              lastUsed: stillUsed(),
            },
            {
              name: 'SonarQube',
              description: 'SAST of Java code in pipelines',
              icon: JavaTech.icon,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'SpotBugs',
              description: 'SAST of Java code in pipelines',
              icon: JavaTech.icon,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Gemnasium',
              description: 'Scanning dependencies for known CVEs in Gitlab',
              icon: techTheme.gitlab.icon,
              experience: since(2021.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'Aircrack-ng',
              icon: techTheme.security.icon,
              description: 'Pen testing wireless networks',
              experience: between(2014, 2015),
              lastUsed: 2015,
            },
          ],
        },
        {
          name: 'Monitoring',
          icon: (
            <Avatar>
              <FcBinoculars />
            </Avatar>
          ),
          experience: since(2017),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'Datadog',
              icon: <SiDatadog />,
              experience: between(2017, 2019) + since(2021.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'Sumologic',
              icon: <SiSumologic />,
              experience: between(2017, 2019),
              lastUsed: 2019,
            },
            {
              name: 'Newrelic',
              description: 'APM for monitoring server KPIs',
              icon: <SiNewrelic />,
              experience: between(2016, 2017) + between(2019, 2020),
              lastUsed: 2020,
            },
            {
              name: 'Cloudwatch',
              icon: techTheme.aws.icon, // todo cloudwatch icon
              experience: since(2019),
              lastUsed: stillUsed(),
            },
            {
              name: 'Splunk',
              description:
                'Dashboard for auditing all events related to business transactions aggregated by correlation id',
              icon: <SiSplunk />,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Kibana',
              description: '',
              icon: <SiKibana />,
              experience: since(2021.5),
              lastUsed: stillUsed(),
            },
          ],
        },
        {
          name: 'CI/CD',
          icon: <GiWarpPipe />,
          experience: since(2015),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'CircleCI',
              icon: CircleCiTech.icon,
              experience: since(2017.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'Jenkins',
              icon: techTheme.jenkins.icon,
              experience: between(2015, 2017) + between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Gitflow',
              description:
                'Branching pattern with long lived branches `main` and `develop`. New features branch out of `develop`',
              icon: <IoMdGitBranch />,
              experience: between(2015, 2017) + between(2019, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Github Flow',
              description: 'Branching pattern where new features branch out and back into `main`',
              icon: GithubTech.icon,
              experience: between(2017, 2019) + since(2021.5),
              lastUsed: stillUsed(),
            },
            {
              name: 'Gitlab CI',
              icon: techTheme.gitlab.icon,
              experience: since(2021.5),
              lastUsed: stillUsed(),
            },
          ],
        },
        {
          name: '0 downtime deploy',
          icon: <WiTime12 />,
          experience: since(2015),
          lastUsed: stillUsed(),
          frameworks: [
            {
              name: 'Code review',
              icon: <VscOpenPreview />,
              experience: since(2015),
              lastUsed: stillUsed(),
            },
            {
              name: 'Integration testing',
              icon: (
                <Avatar sx={{ backgroundColor: '#fff' }}>
                  <GrTest />
                </Avatar>
              ),
              experience: since(2016),
              lastUsed: stillUsed(),
            },
            {
              name: 'SAM canaries',
              icon: <GiSquirrel />,
              experience: between(2019, 2021),
              lastUsed: 2021,
            },
          ],
        },
      ],
    },
    professional: {
      projectManagement: [
        {
          name: 'Agile',
          icon: <FcCollaboration />,
          experience: since(2015),
          lastUsed: new Date().getFullYear(),
          frameworks: [
            {
              name: 'Scrum',
              icon: <DiScrum />,
              experience: between(2015, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Kanban',
              icon: <BsFillKanbanFill />,
              experience: between(2017, 2018) + since(2021),
              lastUsed: stillUsed(),
            },
          ],
        },
        {
          name: 'Team coordination',
          icon: <FcDocument />,
          experience: since(2015),
          lastUsed: new Date().getFullYear(),
          frameworks: [
            {
              name: 'Trello',
              icon: techTheme.trello.icon,
              experience: between(2015, 2019),
              lastUsed: 2019,
            },
            {
              name: 'Slack',
              description: 'Bot development, meme production',
              icon: techTheme.slack.icon,
              experience: between(2017, 2021),
              lastUsed: 2021,
            },
            {
              name: 'Hipchat',
              description: 'Bot development via hubot',
              icon: <BsChatSquareText />,
              experience: between(2016, 2018),
              lastUsed: 2018,
            },
            {
              name: 'C4 diagrams',
              icon: <FaProjectDiagram />,
              experience: since(2018),
              lastUsed: stillUsed(),
            },
            {
              name: 'Architecture Decision Records',
              icon: <MdArchitecture />,
              experience: since(2018),
              lastUsed: stillUsed(),
            },
          ],
        },
      ],
      softSkills: [
        {
          name: 'Customer Service',
          icon: <FcCustomerSupport />, // ssss
          experience: since(2005),
          frameworks: [],
        },
        {
          name: 'Time management',
          icon: <FcTimeline />,
          experience: since(2010),
          frameworks: [],
        },
        {
          name: 'Growth mindset',
          icon: <GiBrain />,
          experience: since(2012),
          frameworks: [],
        },
        {
          name: 'Engineering leadership',
          icon: <FcManager />,
          experience: since(2017),
          frameworks: [],
        },
      ],
    },
  },
};
