/* eslint-disable react/no-danger */
import React from 'react';

import { ReactComponent as ReactIcon } from 'devicon/icons/react/react-original.svg';
import { ReactComponent as JavascriptIcon } from 'devicon/icons/javascript/javascript-plain.svg';
import { ReactComponent as NodeJsIcon } from 'devicon/icons/nodejs/nodejs-original.svg';
import { ReactComponent as JavaIcon } from 'devicon/icons/java/java-original.svg';
import { ReactComponent as AwsIcon } from 'devicon/icons/amazonwebservices/amazonwebservices-original.svg';
import { ReactComponent as DockerIcon } from 'devicon/icons/docker/docker-original.svg';
import { ReactComponent as GithubIcon } from 'devicon/icons/github/github-original.svg';
import { ReactComponent as PostgresIcon } from 'devicon/icons/postgresql/postgresql-original.svg';
import { ReactComponent as PythonIcon } from 'devicon/icons/python/python-original.svg';
import { ReactComponent as AndroidIcon } from 'devicon/icons/android/android-plain.svg';
import { ReactComponent as AngularIcon } from 'devicon/icons/angularjs/angularjs-plain.svg';
import { ReactComponent as SlackIcon } from 'devicon/icons/slack/slack-original.svg';
import { ReactComponent as LinuxIcon } from 'devicon/icons/linux/linux-original.svg';
import { ReactComponent as UbuntuIcon } from 'devicon/icons/ubuntu/ubuntu-plain.svg';
import { ReactComponent as NpmIcon } from 'devicon/icons/npm/npm-original-wordmark.svg';
import { ReactComponent as DebianIcon } from 'devicon/icons/debian/debian-plain.svg';
import { ReactComponent as CplusplusIcon } from 'devicon/icons/cplusplus/cplusplus-original.svg';
import { ReactComponent as CIcon } from 'devicon/icons/c/c-original.svg';
import { ReactComponent as IntellijIcon } from 'devicon/icons/intellij/intellij-original.svg';
import { ReactComponent as WebstormIcon } from 'devicon/icons/webstorm/webstorm-original.svg';
import { ReactComponent as TrelloIcon } from 'devicon/icons/trello/trello-plain.svg';
import { ReactComponent as GitIcon } from 'devicon/icons/git/git-original.svg';
import { ReactComponent as Bash } from 'devicon/icons/bash/bash-original.svg';
import { ReactComponent as Gradle } from 'devicon/icons/gradle/gradle-plain.svg';
import { ReactComponent as Groovy } from 'devicon/icons/groovy/groovy-original.svg';
import { ReactComponent as Nginx } from 'devicon/icons/nginx/nginx-original.svg';
import { ReactComponent as Oracle } from 'devicon/icons/oracle/oracle-original.svg';
import { ReactComponent as Redux } from 'devicon/icons/redux/redux-original.svg';
import { ReactComponent as Cucumber } from 'devicon/icons/cucumber/cucumber-plain.svg';
import { ReactComponent as Tomcat } from 'devicon/icons/tomcat/tomcat-original.svg';
import { ReactComponent as Typescript } from 'devicon/icons/typescript/typescript-original.svg';
import { ReactComponent as CSharp } from 'devicon/icons/csharp/csharp-original.svg';
import { ReactComponent as DotNet } from 'devicon/icons/dot-net/dot-net-original.svg';
/* todo
import {
  ReactComponent as Make,
  ReactComponent as Splunk,
  ReactComponent as Datadog,
} from 'devicon/icons/';
*/

import { FaEllipsisH } from 'react-icons/fa';
import { ReactComponent as CircleciSvg } from 'devicon/icons/circleci/circleci-plain.svg';
import { ReactComponent as SpringSvg } from 'devicon/icons/spring/spring-original.svg';
import { ReactComponent as Jenkins } from 'devicon/icons/jenkins/jenkins-original.svg';
import { ReactComponent as Twitter } from 'devicon/icons/twitter/twitter-original.svg';
import { MdSecurity } from 'react-icons/md';
import { GrMysql } from 'react-icons/gr';
import { SiJquery } from 'react-icons/si';
import { FcCollaboration } from 'react-icons/fc';
import { ReactComponent as JestSvg } from '../data/jest.svg';
import { ReactComponent as RabbitmqSvg } from '../data/rabbitmq.svg';
import { ReactComponent as QuarkusSvg } from '../data/quarkus.svg';
import { ReactComponent as MicronautSvg } from '../data/micronaut.svg';
import { ReactComponent as Lambda } from '../data/aws/Arch_AWS-Lambda_64.svg';
import { ReactComponent as ApiGateway } from '../data/aws/Arch_Amazon-API-Gateway_64.svg';
import { ReactComponent as Route53 } from '../data/aws/Arch_Amazon-Route-53_64.svg';
import { ReactComponent as Cloudfront } from '../data/aws/Arch_Amazon-CloudFront_64.svg';
import { ReactComponent as S3 } from '../data/aws/Arch_Amazon-Simple-Storage-Service_64.svg';
import { ReactComponent as EC2 } from '../data/aws/Arch_Amazon-EC2_64.svg';
import Terraform from '../data/terraform-logo.png';
import Consul from '../data/consul.png';
import { ReactComponent as Nomad } from '../data/nomad.svg';

/**
 * A centralized place to organize the style + icons of various technologies
 * */
const techTheme = {
  rabbitmq: {
    style: {
      background: '#e8772d',
      color: '#fff',
    },
    icon: <RabbitmqSvg />,
  },
  spring: {
    style: {
      background: '#70bd4d',
      color: '#fff',
    },
    // iconStyle: {
    //   background: '#303233',
    // },
    icon: <SpringSvg className="SpringIcon" />,
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
  c: {
    style: {
      background: '#3b4aa4',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: <CIcon />,
  },
  circleci: {
    style: {
      background: '#163947',
      color: '#fff',
    },
    // iconStyle: {
    //   background: '#303233',
    // },
    icon: <CircleciSvg />,
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
    icon: <JestSvg className="JestIcon" />,
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
    iconStyle: {
      background: '#303233',
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
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--aws',
    icon: <AwsIcon />,
  },
  lambda: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--aws',
    icon: <Lambda />,
  },
  apiGateway: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--aws',
    icon: <ApiGateway />,
  },
  s3: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--aws',
    icon: <S3 />,
  },
  cloudfront: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--aws',
    icon: <Cloudfront />,
  },
  route53: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--aws',
    icon: <Route53 />,
  },
  ec2: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--aws',
    icon: <EC2 />,
  },
  github: {
    style: {
      background: '#2f78b9',
      color: '#fff',
    },
    className: 'vertical-timeline-element--github',
    icon: <GithubIcon class="devicon-github" />,
  },
  postgres: {
    style: {
      background: '#3a6990',
      color: '#fff',
    },
    className: 'vertical-timeline-element--postgres',
    icon: <PostgresIcon />,
  },
  mysql: {
    style: {
      background: '#3f7699',
      color: '#df8324',
    },
    className: 'vertical-timeline-element--postgres',
    icon: <GrMysql />,
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
      background: '#4b5255',
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
    icon: <Jenkins />,
  },
  micronaut: {
    style: {
      background: '#1c4882',
      color: '#fff',
    },
    icon: <MicronautSvg className="MicronautIcon" />,
  },
  quarkus: {
    style: {
      background: '#f7004a',
      color: '#fff',
    },
    icon: <QuarkusSvg className="QuarkusIcon" />,
  },
  security: {
    style: {
      background: '#610a0e',
      color: '#fff',
    },
    icon: <MdSecurity />,
  },
  twitter: {
    style: {
      background: '#610a0e',
      color: '#fff',
    },
    icon: <Twitter />,
  },
  bash: {
    style: {
      background: '#282f34',
      color: '#fff',
    },
    icon: <Bash />,
  },
  gradle: {
    style: {
      background: '#003037',
      color: '#fff',
    },
    icon: <Gradle />,
  },
  groovy: {
    style: {
      background: '#5b97b3',
      color: '#fff',
    },
    icon: <Groovy />,
  },
  nginx: {
    style: {
      background: '#00913e',
      color: '#fff',
    },
    icon: <Nginx />,
  },
  oracle: {
    style: {
      background: '#ca0329',
      color: '#fff',
    },
    icon: <Oracle />,
  },
  redux: {
    style: {
      background: '#7149b1',
      color: '#fff',
    },
    icon: <Redux />,
  },
  cucumber: {
    style: {
      background: '#00a32b',
      color: '#fff',
    },
    icon: <Cucumber />,
  },
  tomcat: {
    style: {
      background: '#c99c30',
      color: '#fff',
    },
    icon: <Tomcat />,
  },
  typescript: {
    style: {
      background: '#2c76bc',
      color: '#fff',
    },
    icon: <Typescript />,
  },
  jquery: {
    style: {
      background: '#0066a2',
      color: '#fff',
    },
    icon: <SiJquery />,
  },
  csharp: {
    style: {
      background: '#0066a2',
      color: '#fff',
    },
    icon: <CSharp />,
  },
  dotNet: {
    style: {
      background: '#0066a2',
      color: '#fff',
    },
    icon: <DotNet />,
  },
  terraform: {
    style: {
      background: '#0066a2',
      color: '#fff',
    },
    icon: <img src={Terraform} alt="Terraform" style={{ 'max-width': '100%', 'max-height': '100%' }} />,
  },
  consul: {
    style: {
      background: '#0066a2',
      color: '#fff',
    },
    icon: <img src={Consul} alt="Consul" style={{ 'max-width': '100%', 'max-height': '100%' }} />,
  },
  nomad: {
    style: {
      background: '#0066a2',
      color: '#fff',
    },
    icon: <Nomad />,
  },
  agile: {
    style: {
      background: '#3f586d',
      color: '#179bb2',
    },
    icon: <FcCollaboration />,
  },
};

export default techTheme;
