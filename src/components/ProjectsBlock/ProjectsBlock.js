import React from 'react';
import { Card, Button, ButtonGroup, CardImg, CardTitle, CardText,
    CardSubtitle, CardBody, CardHeader, Media } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
// import Iframe from "react-iframe";
// import Intro from "./intro";

const ProjectCard = (props) => (
  <Card color='dark'>

    {props.imageUrl? (<Media><CardImg top src={props.imageUrl} alt='No Image Available' /></Media>) : null}
    {props.projectComponent ? (<CardHeader>{props.projectComponent}</CardHeader>) : null}
    <CardBody className='text-center'>
      <CardTitle>{props.title}</CardTitle>
      <CardSubtitle>{props.subtitle}</CardSubtitle>
      <CardText><p>{props.text}</p></CardText>
      <ButtonGroup>
        {props.githubUrl? (<a href={props.githubUrl}><Button tag='a' className='btn btn-outline-info'><FontAwesome name='github' className='text-dark' /> Github</Button></a>) : null}
        {props.siteUrl? (<a href={props.siteUrl}><Button tag='a' className='btn btn-outline-info'><FontAwesome name='hashtag'className='text-dark' /> Site</Button></a>) : null}
      </ButtonGroup>
    </CardBody>
  </Card>
);

const ProjectsBlock = (props) => {
    return (
      <div>
        <VerticalTimeline>
          {/*<VerticalTimelineElement*/}
            {/*className='vertical-timeline-element--work'*/}
            {/*date='2017 - present'*/}
            {/*iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}*/}
            {/*icon=''*/}
            {/*>*/}
            {/*<h3 className='vertical-timeline-element-title'>TODO: current title</h3>*/}
            {/*<h4 className='vertical-timeline-element-subtitle'>TODO: location</h4>*/}
            {/*<p>*/}
                    {/*TODO: buzzwords like:*/}
                    {/*Creative Direction, User Experience, Visual Design, SEO, Online Marketing*/}
            {/*</p>*/}
          {/*</VerticalTimelineElement>*/}
          <VerticalTimelineElement
            className='vertical-timeline-element--work'
            date='August 2017'
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            icon=''
              >
            <h3 className='vertical-timeline-element-title'><a>AndrewPaettie.com</a></h3>
            {/*<h4 className='vertical-timeline-element-subtitle'>Miami, FL</h4>*/}
            <p>
                A simple portfolio site to show some projects I have done. Implemented with <a href='https://reactjs.com/'>react</a>,
              <a href='https://reactstrap.github.io/'> reactstrap</a>, and <a href='https://circleci.com'>CircleCI</a>.
            </p>
            <ProjectCard
              githubUrl='https://github.com/cazlo/apaettie_backup'
              siteUrl='http://andrewpaettie.com'
              title=''
              subtitle=''
              text=''
              imageUrl='/img/this-site.png'
              />
          </VerticalTimelineElement>

          {/*<VerticalTimelineElement*/}
            {/*className='vertical-timeline-element--work'*/}
            {/*date='2015 - 2017'*/}
            {/*iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}*/}
            {/*icon=''*/}
              {/*>*/}
            {/*<h3 className='vertical-timeline-element-title'>TODO DDC title</h3>*/}
            {/*<h4 className='vertical-timeline-element-subtitle'>TODO DDC description</h4>*/}
            {/*<p>*/}
                {/*TODO Buzzwords about the incentive/inventory re-architectures*/}
            {/*</p>*/}
          {/*</VerticalTimelineElement>*/}
          <VerticalTimelineElement
            className='vertical-timeline-element--education'
            date='2009 - 2015'
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            icon=''
            >
            <h3 className='vertical-timeline-element-title'>Bachelor of Science in Computer Science</h3>
            <h4 className='vertical-timeline-element-subtitle'>Bachelor Degree</h4>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className='vertical-timeline-element--work'
            date='April 2015'
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            icon=''
              >
            <h3 className='vertical-timeline-element-title'>CTF AI: Agent007</h3>
            <p>
                 An AI agent implemented in Java used to compete against other agents in a simple capture the flag game written in Java.  The Agent007 bot ended up placing 6th in a competition against 44 others.
            </p>
            <ProjectCard
              githubUrl='https://github.com/cazlo/ctf/tree/master/ctf'
              title=''
              subtitle=''
              text=''
              imageUrl='/img/ctf.png'
              />
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className='vertical-timeline-element--education'
            date='March 2015'
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            icon=''
              >
            <h3 className='vertical-timeline-element-title'>Artificial Intelligence</h3>
            <h4 className='vertical-timeline-element-subtitle'>University Course</h4>
            <p>
                Some homework for an AI class I took, implementing search and constraint solving algorithms in python.
            </p>
            <ProjectCard
              githubUrl='https://github.com/cazlo/exploring-AI'
              title=''
              subtitle=''
              text=''
              imageUrl='/img/ai-brain.jpg'
              />

          </VerticalTimelineElement>
          <VerticalTimelineElement
            className='vertical-timeline-element--education'
            date='October 2014'
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            icon=''
              >
            <h3 className='vertical-timeline-element-title'>Machine Learning</h3>
            <h4 className='vertical-timeline-element-subtitle'>University Course</h4>
            <p>
                Some homework for a machine learning class I took, aimed towards implementing and using various prediction engines to classify data.
            </p>
            <ProjectCard
              githubUrl='https://github.com/cazlo/exploring-machine-learning'
              title='Machine Learning'
              subtitle='October 2014'
              text=''
              imageUrl='/img/ml-stats.png'
              />
          </VerticalTimelineElement>
          {/*<VerticalTimelineElement*/}
            {/*className='vertical-timeline-element--education'*/}
            {/*date='2014 - 2015'*/}
            {/*iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}*/}
            {/*icon=''*/}
              {/*>*/}
            {/*<h3 className='vertical-timeline-element-title'>TODO Capitalsoft stuff</h3>*/}
            {/*<h4 className='vertical-timeline-element-subtitle'>TODO Capitalsoft stuff</h4>*/}
            {/*<p>TODO Capitalsoft stuff</p>*/}
          {/*</VerticalTimelineElement>*/}
          <VerticalTimelineElement
            className='vertical-timeline-element--education'
            date='2012-2014'
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            icon=''
            >
            <ProjectCard
              githubUrl='https://github.com/cazlo/academic-stuff'
              title='Various School Projects'
              subtitle='2012-2014'
              text="Just some random things I've made for school. Pictured is a loan amortization calculator featuring from scratch graphs and tables built using the swing UI framework for Java."
              imageUrl='/img/loan-amortization.png'
                />
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className='vertical-timeline-element--education'
            date='December 2013'
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            icon=''
            >
            <ProjectCard
              githubUrl='https://github.com/cazlo/MOOPS-Moo-on-MIPS'
              title='MOOPS'
              subtitle='December 2013'
              text='An implementation of the game moo in the MIPS assembly lanuage.  Also includes an algorithm for solving the puzzle within 16 moves.'
              imageUrl='/img/Mars-moo.png'
                />
          </VerticalTimelineElement>
            
          <VerticalTimelineElement
            className='vertical-timeline-element--education'
            date='May 2013'
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            icon=''
            >
            <ProjectCard
              githubUrl='https://github.com/cazlo/heli-madness'
              title='Helicopter Side-scroller'
              subtitle='May 2013'
              text='A simple side scroller implemented with Java Swing. Game engine built from scratch.'
              imageUrl='/img/heli-game.png'
                />
          </VerticalTimelineElement>


        </VerticalTimeline>

        {/*<ProjectCard*/}
        {/*githubUrl='https://github.com/cazlo/WhizCalc'*/}
        {/*title='WhizCalc'*/}
        {/*subtitle='January 2014'*/}
        {/*text='A simple calculator app for android used to experiment with creating android apps.'*/}
        {/*imageUrl={placeholderImgUrl}*/}
        {/*/>*/}
      </div>
    );
};

export default ProjectsBlock;