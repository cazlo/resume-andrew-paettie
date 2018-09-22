import React from 'react';

// import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ReactIcon from 'react-devicon/react/original';
import JavascriptIcon from 'react-devicon/javascript/plain';
import NodeJsIcon from 'react-devicon/nodejs/plain';
import JavaIcon from 'react-devicon/java/plain';
import AwsIcon from 'react-devicon/amazonwebservices/plain-wordmark';
import DockerIcon from 'react-devicon/docker/plain';
import GithubIcon from 'react-devicon/github/original';
import PostgresIcon from 'react-devicon/postgresql/plain';
import PythonIcon from 'react-devicon/python/plain';
// todo CircleCI, Jest, Kotlin

/**
 * A centralized place to organize the style + icons of various technologies
 * */
const techTheme = {
  // todo refactor to remove color from all of these names
  reactColor: {
    style: {
      background: '#61DAFB',
      color: '#fff',
    },
    className: 'vertical-timeline-element--react',
    icon: <ReactIcon />,
  },
  javascriptColor: {
    style: {
      background: '#F0DB4F',
      color: '#fff',
    },
    className: 'vertical-timeline-element--javascript',
    icon: <JavascriptIcon />,
  },
  dockerColor: {
    style: {
      background: '#019bc6',
      color: '#fff',
    },
    className: 'vertical-timeline-element--docker',
    icon: <DockerIcon />,
  },
  nodeJsColor: {
    style: {
      background: '#4CC2E4',
      color: '#fff',
    },
    className: 'vertical-timeline-element--nodejs',
    icon: <NodeJsIcon />,
  },
  javaColor: {
    style: {
      background: '#21759b',
      color: '#fff',
    },
    className: 'vertical-timeline-element--java',
    icon: <JavaIcon />,
  },
  awsColor: {
    style: {
      background: '#4267B2',
      color: '#fff',
    },
    className: 'vertical-timeline-element--aws',
    icon: <AwsIcon />,
  },
  githubColor: {
    style: {
      background: '#6AD7E5',
      color: '#fff',
    },
    className: 'vertical-timeline-element--github',
    icon: <GithubIcon />,
  },
  postGresColor: {
    // todo change this to not be github colors
    style: {
      background: '#6AD7E5',
      color: '#fff',
    },
    className: 'vertical-timeline-element--postgres',
    icon: <PostgresIcon />,
  },
  pythonColor: {
    style: {
      background: '#f3c794',
      color: '#fff',
    },
    className: 'vertical-timeline-element--python',
    icon: <PythonIcon />,
  },
  othersColor: {
    style: {
      background: '#019bc6',
      color: '#fff',
    },
    className: 'vertical-timeline-element--others',
    icon: <PostgresIcon />,
  },
};

export default techTheme;
