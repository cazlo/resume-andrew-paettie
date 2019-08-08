/* eslint-disable react/no-danger */
import React from 'react';

import ReactIcon from 'react-devicon/react/original';
import JavascriptIcon from 'react-devicon/javascript/plain';
import NodeJsIcon from 'react-devicon/nodejs/plain';
import JavaIcon from 'react-devicon/java/original';
import AwsIcon from 'react-devicon/amazonwebservices/original';
import DockerIcon from 'react-devicon/docker/plain';
import GithubIcon from 'react-devicon/github/original';
import PostgresIcon from 'react-devicon/postgresql/plain';
import PythonIcon from 'react-devicon/python/original';
import AndroidIcon from 'react-devicon/android/plain';
import AngularIcon from 'react-devicon/angularjs/plain';
import SlackIcon from 'react-devicon/slack/original';
import LinuxIcon from 'react-devicon/linux/plain';
import UbuntuIcon from 'react-devicon/ubuntu/plain';
import NpmIcon from 'react-devicon/npm/original-wordmark';
import DebianIcon from 'react-devicon/debian/plain';
import CplusplusIcon from 'react-devicon/cplusplus/plain';
import IntellijIcon from 'react-devicon/intellij/plain';
import WebstormIcon from 'react-devicon/webstorm/plain';
import TrelloIcon from 'react-devicon/trello/plain';
import GitIcon from 'react-devicon/git/plain';

import { FaJenkins, FaEllipsisH } from 'react-icons/fa';

import JestSvg from '../data/jest.svg';
import CircleciSvg from '../data/circleci.svg';
import SpringSvg from '../data/spring.svg';
import RabbitmqSvg from '../data/rabbitmq.svg';

/**
 * A centralized place to organize the style + icons of various technologies
 * */
const techTheme = {
  rabbitmq: {
    style: {
      background: '#e8772d',
      color: '#fff',
    },
    icon: <span dangerouslySetInnerHTML={{ __html: RabbitmqSvg }} />,
  },
  spring: {
    style: {
      background: '#70bd4d',
      color: '#fff',
    },
    // iconStyle: {
    //   background: '#303233',
    // },
    icon: <span dangerouslySetInnerHTML={{ __html: SpringSvg }} className="SpringIcon" />,
  },
  cplusplus: {
    style: {
      background: '#3b4aa4',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: <CplusplusIcon />,
  },
  circleci: {
    style: {
      background: '#163947',
      color: '#fff',
    },
    // iconStyle: {
    //   background: '#303233',
    // },
    icon: <span dangerouslySetInnerHTML={{ __html: CircleciSvg }} />,
  },
  debian: {
    style: {
      background: '#9e0031',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: <DebianIcon />,
  },
  npm: {
    style: {
      background: '#c42939',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: <NpmIcon />,
  },
  jest: {
    style: {
      background: '#903b58',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: <span dangerouslySetInnerHTML={{ __html: JestSvg }} className="JestIcon" />,
  },
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
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--android',
    icon: <AndroidIcon />,
  },
  java: {
    style: {
      background: '#af0930',
      color: '#fff',
    },
    iconStyle: {
      background: '#eeeeee',
    },
    className: 'vertical-timeline-element--java',
    icon: <JavaIcon className="JavaIcon" />,
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
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--python',
    icon: <PythonIcon />,
  },
  angular: {
    style: {
      background: '#91324f',
      color: '#fff',
    },
    icon: <AngularIcon />,
  },
  slack: {
    style: {
      background: '#7dcfb1',
      color: '#fff',
    },
    icon: <SlackIcon />,
  },
  linux: {
    style: {
      background: '#e9b32a',
      color: '#fff',
    },
    icon: <LinuxIcon />,
  },
  ubuntu: {
    style: {
      background: '#e6692b',
      color: '#fff',
    },
    icon: <UbuntuIcon />,
  },
  others: {
    style: {
      background: '#019bc6',
      color: '#fff',
    },
    className: 'vertical-timeline-element--others',
    icon: <FaEllipsisH />,
  },
  git: {
    style: {
      background: '#e24036',
      color: '#fff',
    },
    icon: <GitIcon />,
  },
  trello: {
    style: {
      background: '#2478b7',
      color: '#fff',
    },
    icon: <TrelloIcon />,
  },
  intellij: {
    style: {
      background: '#175589',
      color: '#fff',
    },
    icon: <IntellijIcon />,
  },
  webstorm: {
    style: {
      background: '#3bc9d0',
      color: '#fff',
    },
    icon: <WebstormIcon />,
  },
  jenkins: {
    style: {
      background: '#c62634',
      color: '#fff',
    },
    icon: <FaJenkins />,
  },
};

export default techTheme;
