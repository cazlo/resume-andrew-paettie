/* eslint-disable react/no-danger */
import React from 'react';

// https://devicon.dev/
import { ReactComponent as ReactIcon } from 'devicon/icons/react/react-original.svg';
import { ReactComponent as JavascriptIcon } from 'devicon/icons/javascript/javascript-plain.svg';
import { ReactComponent as NodeJsIcon } from 'devicon/icons/nodejs/nodejs-original-wordmark.svg';
import { ReactComponent as JavaIcon } from 'devicon/icons/java/java-original.svg';
import { ReactComponent as AwsIcon } from 'devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg';
import { ReactComponent as DockerIcon } from 'devicon/icons/docker/docker-original.svg';
import { ReactComponent as GithubIcon } from 'devicon/icons/github/github-original.svg';
import { ReactComponent as PostgresIcon } from 'devicon/icons/postgresql/postgresql-original.svg';
import { ReactComponent as PythonIcon } from 'devicon/icons/python/python-original.svg';
import { ReactComponent as FastAPIIcon } from 'devicon/icons/fastapi/fastapi-original.svg';
import { ReactComponent as PytestIcon } from 'devicon/icons/pytest/pytest-original.svg';
import { ReactComponent as SqlalchemyIcon } from 'devicon/icons/sqlalchemy/sqlalchemy-original.svg';
import { ReactComponent as AndroidIcon } from 'devicon/icons/android/android-plain.svg';
import { ReactComponent as AngularIcon } from 'devicon/icons/angularjs/angularjs-plain.svg';
import { ReactComponent as SlackIcon } from 'devicon/icons/slack/slack-original.svg';
import { ReactComponent as LinuxIcon } from 'devicon/icons/linux/linux-original.svg';
import { ReactComponent as WindowsIcon } from 'devicon/icons/windows8/windows8-original.svg';
import { ReactComponent as UbuntuIcon } from 'devicon/icons/ubuntu/ubuntu-original.svg';
import { ReactComponent as NpmIcon } from 'devicon/icons/npm/npm-original-wordmark.svg';
import { ReactComponent as DebianIcon } from 'devicon/icons/debian/debian-plain.svg';
import { ReactComponent as CplusplusIcon } from 'devicon/icons/cplusplus/cplusplus-original.svg';
import { ReactComponent as CIcon } from 'devicon/icons/c/c-original.svg';
import { ReactComponent as IntellijIcon } from 'devicon/icons/intellij/intellij-original.svg';
import { ReactComponent as WebstormIcon } from 'devicon/icons/webstorm/webstorm-original.svg';
import { ReactComponent as TrelloIcon } from 'devicon/icons/trello/trello-plain.svg';
import { ReactComponent as GitIcon } from 'devicon/icons/git/git-original.svg';
import { ReactComponent as Bash } from 'devicon/icons/bash/bash-original.svg';
import { ReactComponent as Zsh } from 'devicon/icons/ohmyzsh/ohmyzsh-original.svg';
import { ReactComponent as Gradle } from 'devicon/icons/gradle/gradle-original.svg';
import { ReactComponent as Groovy } from 'devicon/icons/groovy/groovy-original.svg';
import { ReactComponent as Nginx } from 'devicon/icons/nginx/nginx-original.svg';
import { ReactComponent as Oracle } from 'devicon/icons/oracle/oracle-original.svg';
import { ReactComponent as Redux } from 'devicon/icons/redux/redux-original.svg';
import { ReactComponent as Cucumber } from 'devicon/icons/cucumber/cucumber-plain.svg';
import { ReactComponent as Tomcat } from 'devicon/icons/tomcat/tomcat-original.svg';
import { ReactComponent as Typescript } from 'devicon/icons/typescript/typescript-original.svg';
import { ReactComponent as CSharp } from 'devicon/icons/csharp/csharp-original.svg';
import { ReactComponent as DotNet } from 'devicon/icons/dot-net/dot-net-original.svg';
import { ReactComponent as K8s } from 'devicon/icons/kubernetes/kubernetes-plain.svg';
import { ReactComponent as PodmanIcon } from 'devicon/icons/podman/podman-original.svg';
import { ReactComponent as CircleciSvg } from 'devicon/icons/circleci/circleci-plain.svg';
import { ReactComponent as SpringSvg } from 'devicon/icons/spring/spring-original.svg';
import { ReactComponent as Jenkins } from 'devicon/icons/jenkins/jenkins-original.svg';
import { ReactComponent as Twitter } from 'devicon/icons/twitter/twitter-original.svg';
import { ReactComponent as Ansible } from 'devicon/icons/ansible/ansible-original.svg';
import { ReactComponent as Gitlab } from 'devicon/icons/gitlab/gitlab-original.svg';
import { ReactComponent as RedisIcon } from 'devicon/icons/redis/redis-original.svg';
import { ReactComponent as AzureIcon } from 'devicon/icons/azure/azure-original.svg';
import { ReactComponent as JiraIcon } from 'devicon/icons/jira/jira-original.svg';
import { ReactComponent as FedoraIcon } from 'devicon/icons/fedora/fedora-original.svg';
import { ReactComponent as RedHatIcon } from 'devicon/icons/redhat/redhat-original.svg';
import { ReactComponent as RockyIcon } from 'devicon/icons/rockylinux/rockylinux-original.svg';
import { ReactComponent as PoetryIcon } from 'devicon/icons/poetry/poetry-original.svg';
// https://react-icons.github.io/react-icons/search/?q=clear
import { FaEllipsisH } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { GrMysql } from 'react-icons/gr';
import { SiApachemaven, SiJquery, SiKalilinux, SiBurpsuite, SiWindows95 } from 'react-icons/si';
import { FcCollaboration } from 'react-icons/fc';
import Avatar from '@mui/material/Avatar';
import { ReactComponent as JestSvg } from '../data/jest.svg';
import { ReactComponent as RabbitmqSvg } from '../data/rabbitmq.svg';
import { ReactComponent as QuarkusSvg } from '../data/quarkus.svg';
import { ReactComponent as MicronautSvg } from '../data/micronaut.svg';
import { ReactComponent as Nomad } from '../data/nomad.svg';
import { ReactComponent as Lambda } from '../data/aws/Arch_AWS-Lambda_64.svg';
import { ReactComponent as ApiGateway } from '../data/aws/Arch_Amazon-API-Gateway_64.svg';
import { ReactComponent as Route53 } from '../data/aws/Arch_Amazon-Route-53_64.svg';
import { ReactComponent as Cloudfront } from '../data/aws/Arch_Amazon-CloudFront_64.svg';
import { ReactComponent as S3 } from '../data/aws/Arch_Amazon-Simple-Storage-Service_64.svg';
import { ReactComponent as SQS } from '../data/aws/Arch_Amazon-Simple-Queue-Service_64.svg';
import { ReactComponent as Kinesis } from '../data/aws/Arch_Amazon-Kinesis_64.svg';
import { ReactComponent as EC2 } from '../data/aws/Arch_Amazon-EC2_64.svg';
import { ReactComponent as Dynamodb } from '../data/aws/Arch_Amazon-DynamoDB_64.svg';
import { ReactComponent as Rds } from '../data/aws/Arch_Amazon-RDS_64.svg';
import { ReactComponent as IAM } from '../data/aws/Arch_AWS-Identity-and-Access-Management_64.svg';
import { ReactComponent as Glue } from '../data/aws/Arch_AWS-Glue_64.svg';
import { ReactComponent as EcsIcon } from '../data/aws/Arch_Amazon-Elastic-Container-Service_64.svg';
import { ReactComponent as EksIcon } from '../data/aws/Arch_Amazon-EKS-Cloud_64.svg';
import JamaIcon from '../data/jama.png';
import Terraform from '../data/terraform-logo.png';
import Consul from '../data/consul.png';
// jfrog logo by https://jfrog.com/knowledge-base/artifactory-cleanup-methods-how-do-i-delete-old-artifacts/
import JFrog from '../data/jfrog.png';

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
  podman: {
    style: {
      background: '#2f9ec4',
      color: '#fff',
    },
    className: 'vertical-timeline-element--docker',
    icon: <PodmanIcon />,
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
    avatar: (
      <Avatar style={{ background: '#fff' }}>
        <NodeJsIcon />
      </Avatar>
    ),
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
  ansible: {
    style: {
      background: '#af0930',
      color: '#fff',
    },
    iconStyle: {
      background: '#eeeeee',
    },
    icon: <Ansible />,
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
    icon: (
      <Avatar>
        <Lambda />
      </Avatar>
    ),
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
    icon: (
      <Avatar>
        <ApiGateway />
      </Avatar>
    ),
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
    icon: (
      <Avatar>
        <S3 />
      </Avatar>
    ),
  },
  sqs: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: (
      <Avatar>
        <SQS />
      </Avatar>
    ),
  },
  iam: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: (
      <Avatar>
        <IAM />
      </Avatar>
    ),
  },
  kinesis: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: (
      <Avatar>
        <Kinesis />
      </Avatar>
    ),
  },
  glue: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: (
      <Avatar>
        <Glue />
      </Avatar>
    ),
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
    icon: (
      <Avatar>
        <Cloudfront />
      </Avatar>
    ),
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
    icon: (
      <Avatar>
        <Route53 />
      </Avatar>
    ),
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
    icon: (
      <Avatar>
        <EC2 />
      </Avatar>
    ),
  },
  dynamoDb: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: (
      <Avatar>
        <Dynamodb />
      </Avatar>
    ),
  },
  redis: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    icon: <RedisIcon />,
  },
  rds: {
    style: {
      background: '#f48e3d',
      color: '#fff',
    },
    iconStyle: {
      background: '#303233',
    },
    className: 'vertical-timeline-element--aws',
    icon: (
      <Avatar>
        <Rds />
      </Avatar>
    ),
  },
  github: {
    style: {
      background: '#2f78b9',
      color: '#fff',
    },
    className: 'vertical-timeline-element--github',
    icon: <GithubIcon />,
    whiteIcon: (
      <Avatar style={{ backgroundColor: '#fff' }}>
        <GithubIcon />
      </Avatar>
    ),
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
  fastAPI: {
    style: {
      background: '#059285pm ',
      color: '#fff',
    },
    iconStyle: {
      background: '#059285',
    },
    icon: <FastAPIIcon />,
  },
  pytest: {
    style: {
      background: '#059285pm ',
      color: '#fff',
    },
    iconStyle: {
      background: '#059285',
    },
    icon: <PytestIcon />,
  },
  sqlalchemy: {
    style: {
      background: '#059285pm ',
      color: '#fff',
    },
    iconStyle: {
      background: '#059285',
    },
    icon: (
      <Avatar>
        <SqlalchemyIcon />
      </Avatar>
    ),
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
  gitlab: {
    style: {
      background: '#e24329',
      color: '#fb6b26',
    },
    icon: <Gitlab />,
  },
  artifactory: {
    style: {
      background: '#e24329',
      color: '#fb6b26',
    },
    icon: <img src={JFrog} alt="JFrog" style={{ maxWidth: '100%', maxHeight: '100%' }} />,
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
  zsh: {
    icon: <Zsh />,
  },
  gradle: {
    style: {
      background: '#003037',
      color: '#fff',
    },
    icon: <Gradle />,
  },
  maven: {
    style: {
      background: '#003037',
      color: '#fff',
    },
    icon: <SiApachemaven />,
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
    icon: (
      <Avatar style={{ background: '#fff' }}>
        <Oracle />
      </Avatar>
    ),
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
    icon: <img src={Terraform} alt="Terraform" style={{ maxWidth: '100%', maxHeight: '100%' }} />,
  },
  consul: {
    style: {
      background: '#0066a2',
      color: '#fff',
    },
    icon: <img src={Consul} alt="Consul" style={{ maxWidth: '100%', maxHeight: '100%' }} />,
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
  kubernetes: {
    style: {
      background: '#3f586d',
      color: '#179bb2',
    },
    icon: <K8s />,
  },
  ecs: {
    style: {
      background: '#3f586d',
      color: '#179bb2',
    },
    icon: <EcsIcon />,
  },
  azure: {
    icon: <AzureIcon />,
  },
  jira: {
    icon: <JiraIcon />,
  },
  jama: {
    icon: <img src={JamaIcon} alt="JAMA" style={{ maxWidth: '100%', maxHeight: '100%' }} />,
  },
  kali: {
    icon: <SiKalilinux />,
  },
  burpsuite: {
    icon: <SiBurpsuite />,
  },
  eks: {
    icon: <EksIcon />,
  },
  fedora: {
    icon: <FedoraIcon />,
  },
  rhel: {
    icon: <RedHatIcon />,
  },
  mandriva: {
    style: {
      background: '#4b5255',
      color: '#fff',
    },
    icon: <LinuxIcon />,
  },
  windows: {
    icon: <WindowsIcon />,
  },
  windowsServer: {
    icon: <SiWindows95 />,
  },
  rockylinux: {
    icon: <RockyIcon />,
  },
  poetry: {
    icon: <PoetryIcon />,
  },
};

export default techTheme;
