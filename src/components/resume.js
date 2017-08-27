import { h } from 'preact';
import FontAwesome from 'react-fontawesome';
// eslint-disable-next-line
import { Container, Row, Col, Button, Navbar, Nav, NavItem, NavLink , Jumbotron} from 'reactstrap';

const Experience = () => (
  <div>
    <h2> <FontAwesome name='pie-chart' /> Professional Experience</h2>
    <br />
    <h4>Software Engineer at <a href='http://www.coxautoinc.com/'>Cox Automotive</a></h4>
    <h5>April 2017 - Present</h5>
    <h6>Data Solutions</h6>
    <ul>
      <li>Created single point of ingestion and viewing for vehicle catalog data</li>
      <li>Participated in API design </li>
      <li>Automated integration testing using localstack</li>
    </ul>
    <h5>May 2015 - April 2017</h5>
    <h6>Dealer.com Inventory</h6>
    <ul>
      <li>Acted as technical lead driving technology and architectural decisions</li>
      <li>Created system to migrate image hosting to the cloud via S3</li>
      <li>Member of scrum team which develops and maintains microservice applications which aggregate and serve vehicle data in a scalable way</li>
      <li>Set up and maintain system to migrate the source of truth for incentive data to a more performant and reliable technology stack</li>
      <li>Integrated with automated deployment tools to support continuous deployment and integration</li>
      <li>Installed monitoring and alerting to get increased visibility into key performance indicators of the overall system</li>
      <li>Created internal applications to ease troubleshooting issues and testing</li>
      <li>Reacted to production issues through an on call system</li>
    </ul>
    <br />
    <h4>Dev/OPS intern at <a href='http://www.capitalsoft.com/'>CaptialSoft</a></h4>
    <h5>March 2014 - May 2015</h5>
    <ul>
      <li>Generally participated in frontend and backend development</li>
      <li>Designed javascript interface for GIS leveraging <a href='http://openlayers.org/'>OpenLayers</a></li>
      <li>Designed/updated interface for document management system</li>
      <li>Implemented new ant build process which greatly reduced build time and otherwise increased productivity</li>
      <li>Wrote technical documentation for the code base and end-user help system</li>
      <li>Setup and administered servers for SVN, Bugzilla, Oracle Database and Weblogic</li>
    </ul>
    <br />
    <h4>Various Retail</h4>
    <ul>
      <li>Employed steadily in various retail positions since high school</li>
      <li>Never less than 1 year in a position</li>
      <li>Full employment list available upon request</li>
    </ul>
  </div>
);

const Skills = () => (
  <Row>
    <Col>
      <h5>Backend Programming languages</h5>
      <ul>
        <li>Java (J2EE, EJB, JSP, Swing, Android, Spring, Spring boot)</li>
        <li>Javascript (node, ES8)</li>
        <li>Python</li>
        <li>C# (.Net)</li>
        <li>Groovy (Grails)</li>
        <li>C/C++</li>
      </ul>
      <h5>Frontend Technologies</h5>
      <ul>
        <li>Javascript (ES5 - ES8)</li>
        <li>HTTP 5</li>
        <li>React/Preact</li>
        <li>Angular 1</li>
        <li>Basic CSS</li>
      </ul>
      <h5>Scripting languages</h5>
      <ul>
        <li>BASH</li>
        <li>VBScript</li>
      </ul>
    </Col>
    <Col>
      <h5>Version control</h5>
      <ul>
        <li>Git</li>
        <li>SVN</li>
      </ul>
      <h5>Databases/Document stores</h5>
      <ul>
        <li>Elasticsearch</li>
        <li>H2</li>
        <li>MongoDb</li>
        <li>MySql</li>
        <li>Oracle</li>
        <li>Postgres</li>
      </ul>
    </Col>
    <Col>
      <h5>Misc. Tools</h5>
      <ul>
        <li>NewRelic</li>
        <li>SumoLogic</li>
        <li>Graphite</li>
        <li>Unix command line tools</li>
        <li>PagerDuty</li>
        <li>Puppet</li>
        <li>Docker</li>
        <li>AWS</li>
        <li>Maven/Ant</li>
        <li>Npm/Yarn</li>
        <li>RabbitMQ</li>
      </ul>
    </Col>
  </Row>
);

const Summary = () => (
  <Container>
    <Row>
      <Col xs='6' sm='10'>
        <ul className='lead'>
          <li>
                  I love creating software and have experience in all facets of development.
            </li><li>
                  I am knowledgeable and proficient with data structures, algorithms, UI and UX development, etc.
            </li><li>
                  I focus on results and pay close attention to details.
            </li>
        </ul>
      </Col>
      <Col xs='6' sm='2' >
        <div class='thumbnail pull-right'>
          <a href='/resume/resume-Andrew-Paettie.pdf'>
            <img src='/img/pdf.png' alt='The resume of Andrew Paettie' />
          </a>
        </div>
      </Col>
    </Row>
    <Row>
      <Col>
        <p class='lead'>
          I am currently working at Cox Automotive as a Software Engineer on the Data Solutions team.
          I am always on the lookout for interesting opportunities to experiment with the latest technologies.
        </p>
      </Col>
    </Row>
  </Container>
);

const Education = () => (
  <Row>
    <Col>
      <h4>B.S. Computer Science <br /><a href='http://www.utdallas.edu/'>University of Texas at Dallas</a></h4>
      <h5>August 2009 - December 2015</h5>
      <br />
      <ul>
        <li>GPA: 3.174</li>
        <li>Major GPA: 3.876</li>
      </ul>
    </Col>
    <Col>
      <h5>Interesting elective projects</h5>
      <ul>
        <li><a href='https://github.com/cazlo/exploring-machine-learning'>Machine learning</a></li>
        <li><a href='https://github.com/cazlo/ctf/tree/master/ctf'>Artificial Intelligence</a></li>
        <li><a href='https://github.com/cazlo/academic-stuff/tree/master/java/network-stack-sim'>Advanced Networking</a></li>
        <li><a href='https://github.com/cazlo/heli-madness'>Software Engineering</a></li>
      </ul>
    </Col>
  </Row>
);

const Resume = (props) => (
  <Container>
    <h3>About Me</h3>
    <Row>
      <Summary />
    </Row>
    <hr />
    <h2> <FontAwesome name='graduation-cap' /> Education</h2>
    <br />
    <Education />
    <hr />
    <Row>
      <Col>
        <Experience />
      </Col>
    </Row>
    <hr />
    <h2> <FontAwesome name='cogs' /> Skills</h2>
    <br />
    <Skills />

  </Container>
);

export default Resume;