import React from 'react';

import ReactIcon from 'react-devicon/react/original';
import JavascriptIcon from 'react-devicon/javascript/plain';
import NodeJsIcon from 'react-devicon/nodejs/plain';
import JavaIcon from 'react-devicon/java/original';
import AwsIcon from 'react-devicon/amazonwebservices/original';
import DockerIcon from 'react-devicon/docker/plain';
import GithubIcon from 'react-devicon/github/original';
import PostgresIcon from 'react-devicon/postgresql/plain';
import PythonIcon from 'react-devicon/python/plain';
import AndroidIcon from 'react-devicon/android/original';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
// todo CircleCI, Jest, Kotlin

/**
 * A centralized place to organize the style + icons of various technologies
 * */
const techTheme = {
  react: {
    style: {
      background: '#61DAFB',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--react',
    icon: <ReactIcon />,
  },
  javascript: {
    style: {
      background: '#F0DB4F',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--javascript',
    icon: <JavascriptIcon />,
  },
  docker: {
    style: {
      background: '#2f9ec4',
      color: '#fff',
    },
    className: 'vertical-timeline-element--docker',
    icon: <DockerIcon />,
  },
  nodeJs: {
    style: {
      background: '#8fc160',
      color: '#fff',
    },
    className: 'vertical-timeline-element--nodejs',
    icon: <NodeJsIcon />,
  },
  android: {
    style: {
      background: '#99c034',
      color: '#fff',
    },
    className: 'vertical-timeline-element--android',
    icon: <AndroidIcon />,
  },
  java: {
    style: {
      background: '#af0930',
      color: '#fff',
    },
    className: 'vertical-timeline-element--java',
    icon: <JavaIcon />,
  },
  aws: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    className: 'vertical-timeline-element--aws',
    icon: <AwsIcon />,
  },
  github: {
    style: {
      background: '#2f78b9',
      color: '#fff',
    },
    className: 'vertical-timeline-element--github',
    icon: <GithubIcon />,
  },
  postgres: {
    style: {
      background: '#3a6990',
      color: '#fff',
    },
    className: 'vertical-timeline-element--postgres',
    icon: <PostgresIcon />,
  },
  python: {
    style: {
      background: '#4075a3',
      color: '#fff',
    },
    className: 'vertical-timeline-element--python',
    icon: <PythonIcon />,
  },
  others: {
    style: {
      background: '#019bc6',
      color: '#fff',
    },
    className: 'vertical-timeline-element--others',
    icon: <MoreHorizIcon />,
  },
};

export default techTheme;
