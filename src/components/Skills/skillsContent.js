import techTheme from '../../common/techTheme';

const skills = {
  technical: {
    languages: [
      {
        name: 'Java',
        techTheme: techTheme.java,
        experience: '6',
        frameworks: [
          {
            name: 'JUnit',
            experience: '6',
            techTheme: techTheme.java,
            isTestAutomation: true,
          },
          {
            name: 'Spring (boot)',
            experience: '3',
            techTheme: techTheme.spring,
          },
          {
            name: 'Micronaut',
            experience: '2',
            techTheme: techTheme.micronaut,
          },
          {
            name: 'Tomcat',
            experience: '2',
            techTheme: techTheme.tomcat,
          },
          {
            name: 'J2EE',
            experience: '1',
            techTheme: techTheme.others,
            isFrontend: true,
          },
        ],
      },
      {
        name: 'Javascript',
        techTheme: techTheme.javascript,
        experience: '6',
        frameworks: [
          {
            name: 'Node',
            experience: '4',
            techTheme: techTheme.nodeJs,
          },
          {
            name: 'Jest TDD',
            experience: '4',
            techTheme: techTheme.jest,
            isTestAutomation: true,
          },
          {
            name: 'React',
            experience: '3',
            techTheme: techTheme.react,
            isFrontend: true,
          },
          {
            name: 'Redux',
            experience: '2',
            techTheme: techTheme.redux,
            isFrontend: true,
          },
          {
            name: 'Cucumber BDD',
            experience: '2',
            techTheme: techTheme.cucumber,
            isTestAutomation: true,
          },
          {
            name: 'Angular',
            experience: '1',
            techTheme: techTheme.angular,
            isFrontend: true,
          },
        ],
      },
      {
        name: 'Python',
        techTheme: techTheme.python,
        experience: '2',
        frameworks: [
          {
            name: 'Locust.io',
            experience: '2',
            techTheme: techTheme.python,
            isTestAutomation: true,
          },
          {
            name: 'scikit-learn',
            experience: '1',
            techTheme: techTheme.python,
            isAiML: true,
          },
          {
            name: 'pytest',
            experience: '0.5',
            techTheme: techTheme.python,
            isTestAutomation: true,
          },
          {
            name: 'opencv',
            experience: '0.5',
            techTheme: techTheme.python,
            isAiML: true,
          },
        ],
      },
      {
        name: 'C#',
        techTheme: techTheme.csharp,
        experience: '1',
        frameworks: [
          {
            name: '.Net',
            experience: '1',
            techTheme: techTheme.dotNet,
          },
        ],
      },
      {
        name: 'C/C++',
        techTheme: techTheme.cplusplus,
        experience: '1',
        frameworks: [],
      },
    ],
    persistence: [
      {
        name: 'SQL',
        techTheme: techTheme.others, // todo some nice sql icon
        experience: '5',
        frameworks: [
          {
            name: 'postgres',
            experience: '4',
            techTheme: techTheme.postgres,
          },
          {
            name: 'mysql',
            experience: '2',
            techTheme: techTheme.mysql,
          },
          {
            name: 'oracle',
            experience: '1',
            techTheme: techTheme.oracle,
          },
        ],
      },
      {
        name: 'NoSQL',
        techTheme: techTheme.others, // todo some nice no-sql icon
        experience: '3',
        frameworks: [
          {
            name: 'DynamoDB',
            experience: '2',
            techTheme: techTheme.dynamoDb,
          },
          {
            name: 'Reddis',
            experience: '2',
            techTheme: techTheme.others, // todo reddis
          },
          {
            name: 'Monogodb',
            experience: '0.5',
            techTheme: techTheme.others, // todo mongodb
          },
        ],
      },
      {
        name: 'Search',
        techTheme: techTheme.others, // todo some nice search icon
        experience: '3',
        frameworks: [
          {
            name: 'Elasticsearch',
            experience: '3',
            techTheme: techTheme.others, // todo elasticsearch
          },
          {
            name: 'Lucene',
            experience: '0.5',
            techTheme: techTheme.others, // todo apache icon
          },
        ],
      },
      {
        name: 'Messaging',
        techTheme: techTheme.others, // todo some nice messaging icon
        experience: '4',
        frameworks: [
          {
            name: 'SQS',
            experience: '3',
            techTheme: techTheme.aws, // todo sqs icon
          },
          {
            name: 'RabbitMq',
            experience: '2',
            techTheme: techTheme.rabbitmq,
          },
          {
            name: 'Kinesis',
            experience: '1',
            techTheme: techTheme.aws, // todo kinesis icon
          },
        ],
      },
    ],
    containerization: [
      {
        name: 'Docker',
        techTheme: techTheme.docker,
        experience: '4',
        frameworks: [],
      },
      {
        name: 'Container Orchestration',
        techTheme: techTheme.docker,
        experience: '3',
        frameworks: [
          {
            name: 'docker-compose',
            experience: '3',
            techTheme: techTheme.docker,
          },
          {
            name: 'Nomad',
            techTheme: techTheme.nomad,
            experience: '2',
            frameworks: [],
          },
          {
            name: 'AWS ECS',
            techTheme: techTheme.aws, // todo ecs icon
            experience: '1',
            frameworks: [],
          },
          {
            name: 'Kubernetes',
            techTheme: techTheme.kubernetes,
            experience: '0.5',
            frameworks: [],
          },
        ],
      },
    ],
    cloud: [
      {
        name: 'AWS',
        techTheme: techTheme.aws,
        experience: '4',
        frameworks: [
          {
            name: 'S3',
            experience: '4',
            techTheme: techTheme.s3,
          },
          {
            name: 'EC2',
            experience: '3',
            techTheme: techTheme.ec2,
          },
          {
            name: 'Lambda',
            experience: '2',
            techTheme: techTheme.lambda,
          },
          {
            name: 'ApiGateway',
            experience: '2',
            techTheme: techTheme.apiGateway,
          },
          {
            name: 'Cloudfront',
            experience: '2',
            techTheme: techTheme.cloudfront,
          },
          {
            name: 'Route53',
            experience: '2',
            techTheme: techTheme.route53,
          },
          {
            name: 'Rds',
            experience: '2',
            techTheme: techTheme.rds,
          },
        ],
      },
    ],
    operational: [
      {
        name: 'Infrastructure as Code',
        techTheme: techTheme.others, // todo IAC icon
        experience: '4',
        frameworks: [
          {
            name: 'Terraform',
            experience: '3',
            techTheme: techTheme.terraform,
          },
          {
            name: 'Cloudformation',
            experience: '2',
            techTheme: techTheme.aws, // tood cloudformation icon
          },
        ],
      },
      {
        name: 'Security Testing',
        techTheme: techTheme.security,
        experience: '4',
        frameworks: [],
      },
      {
        name: 'Monitoring',
        techTheme: techTheme.others, // todo monitoring icon
        experience: '4',
        frameworks: [
          {
            name: 'Datadog',
            experience: '2',
            techTheme: techTheme.others, // todo datadog icon
          },
          {
            name: 'Sumologic',
            experience: '1',
            techTheme: techTheme.others, // todo sumologic icon
          },
          {
            name: 'Newrelic',
            experience: '2',
            techTheme: techTheme.others, // todo newrelic icon
          },
          {
            name: 'Cloudwatch',
            experience: '2',
            techTheme: techTheme.aws, // tood cloudwatch icon
          },
          {
            name: 'Splunk',
            experience: '2',
            techTheme: techTheme.others, // tood splunk icon
          },
        ],
      },
      {
        name: 'CI/CD',
        techTheme: techTheme.others, // todo ci/cd icon
        experience: '6',
        frameworks: [
          {
            name: 'Jenkins',
            experience: '5',
            techTheme: techTheme.jenkins,
          },
          {
            name: 'CircleCI',
            experience: '2',
            techTheme: techTheme.circleci,
          },
        ],
      },
      {
        name: 'No-downtime deployment',
        techTheme: techTheme.others, // todo 0 downtime deployment icon
        experience: '4',
        frameworks: [
          {
            name: 'SAM canaried deployment',
            experience: '2',
            techTheme: techTheme.aws, // todo SAM icon
          },
          {
            name: 'Code review',
            experience: '6',
            techTheme: techTheme.others, // todo code review icon
          },
        ],
      },
    ],
  },
  professional: {
    projectManagement: [
      {
        name: 'Agile',
        techTheme: techTheme.others, // todo agile icon
        experience: '6',
        frameworks: [
          {
            name: 'Scrum',
            experience: '5',
            techTheme: techTheme.others, // todo scrum icon
          },
          {
            name: 'Kanban',
            experience: '1',
            techTheme: techTheme.others, // todo kanban icon
          },
        ],
      },
      {
        name: 'Team coordination',
        techTheme: techTheme.others, // todo comms icon
        experience: '7',
        frameworks: [
          {
            name: 'Trello',
            experience: '5',
            techTheme: techTheme.trello,
          },
          {
            name: 'Slack (including bot development)',
            experience: '4',
            techTheme: techTheme.slack,
          },
          {
            name: 'C4 diagrams',
            experience: '2',
            techTheme: techTheme.others, // todo c4 diagram icon
          },
          {
            name: 'Archiecture Decision Records',
            experience: '3',
            techTheme: techTheme.others, // todo adr icon
          },
        ],
      },
    ],
    softSkills: [
      {
        name: 'Customer Service',
        techTheme: techTheme.others,
        experience: '11',
        frameworks: [],
      },
      {
        name: 'Time management',
        techTheme: techTheme.others,
        experience: '10',
        frameworks: [],
      },
      {
        name: 'Growth mindset',
        techTheme: techTheme.others,
        experience: '10',
        frameworks: [],
      },
      {
        name: 'Engineering leadership',
        techTheme: techTheme.others,
        experience: '3',
        frameworks: [],
      },
    ],
  },
};

export default skills;
