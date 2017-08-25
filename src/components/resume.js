import { h, Component } from 'preact';

const Resume = (props) => (
  <div className='container'>
    <div class='thumbnail pull-right'>
      <a href='/resume/resume-Andrew-Paettie.pdf'>
        <img src='/img/pdf.png' />
      </a>
    </div>

    <div id='content' class='resume'>
      <h2>Summary</h2>
      <p class='lead'>
            I love creating software and have experience in all facets of development.
            I am knowledgeable and proficient with data structures, algorithms, UI and UX
            development, etc.  I focus on results and pay close attention to details.
        </p>

      <p class='lead'>
            I am currently working at DealerTrack as a Software Engineer, but am always on the lookout for interesting opportunities to experiment with the latest technologies.
        </p>

      <p class='lead'>
            E-mail:
            <a href='mailto:paettiea@gmail.com'>paettiea@gmail.com</a>
      </p>
      <h2><span class='glyphicon glyphicon-education' /> Education</h2>
      <h4>B.S. Computer Science at <a href='http://www.utdallas.edu/'>University of Texas at Dallas</a></h4>

      <h5>August 2009 - December 2015</h5>
      <ul>
        <li>GPA: 3.174</li>
        <li>Major GPA: 3.876</li>
      </ul>
      <p />
      <h2><span class='glyphicon glyphicon-briefcase' /> Skills</h2>
      <h5>Programming languages</h5>
      <ul>
        <li>JAVA (J2EE, EJB, JSP, Swing, Android, Spring, Spring boot)</li>
        <li>C# (.Net)</li>
        <li>Grooovy (Grails)</li>
        <li>C/C++</li>
        <li>MIPS</li>
      </ul>
      <h5>Scripting languages</h5>
      <ul>
        <li>Python</li>
        <li>BASH</li>
        <li>VBScript</li>
        <li>Javascript (AngularJS, JQuery)</li>
      </ul>
      <h5>Version control</h5>
      <ul>
        <li>Git</li>
        <li>SVN</li>
      </ul>
      <h5>Web specific</h5>
      <ul>
        <li>HTML</li>
        <li>CSS</li>
      </ul>
      <h5>Databases/Document stores</h5>
      <ul>
        <li>Oracle</li>
        <li>MySql</li>
        <li>MongoDb</li>
        <li>Elasticsearch</li>
        <li>H2</li>
      </ul>
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
        <li>RabbitMQ</li>
      </ul>
      <h2><span class='glyphicon glyphicon-piggy-bank' /> Professional Experience</h2>

      <h4>Software Engineer at <a href='http://us.dealertrack.com/'>DealerTrack</a></h4>
      <h5>May 2015 - Present</h5>
      <ul>
        <li>Member of scrum team which develops and maintains microservice applications which aggregate and serve vehicle data in a scalable way</li>
        <li>Set up and maintain system to migrate the source of truth for incentive data to a more performant and reliable technology stack</li>
        <li>Integrated with automated deployment tools to support continuous deployment and integration</li>
        <li>Installed monitoring and alerting to get increased visibility into key performance indicators of the overall system</li>
        <li>Created internal applications to ease troubleshooting issues and testing</li>
        <li>Reacted to production issues through an on call system</li>
      </ul>

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

      <h4>Various Retail</h4>
      <ul>
        <li>Employed steadily in various retail positions since high school</li>
        <li>Never less than 1 year in a position</li>
        <li>Full employment list available upon request</li>
      </ul>
    </div>
    <hr />
  </div>
);

export default Resume;