import React from 'react';
import { Card, Button, ButtonGroup, CardImg, CardTitle, CardText, CardDeck,
    CardSubtitle, CardBody, CardHeader, Media } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
// import Iframe from "react-iframe";
// import Intro from "./intro";

const placeholderImgUrl = "https://placeholdit.imgix.net/~text?txtsize=33&txt=Image%20Coming%20Soon&w=256&h=180";

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

const Projects = (props) => {
    return (
      <div>
        <CardDeck>
          <ProjectCard
            githubUrl='https://github.com/cazlo/apaettie_backup'
            siteUrl='http://andrewpaettie.com'
            title='This Website'
            subtitle='August 2017'
            text={(
              <div>A simple portfolio site to show some projects I have done. Implemented with <a href='https://preactjs.com/'>Preact</a>,
                <a href='https://reactstrap.github.io/'> reactstrap</a>, and <a href='https://circleci.com'>CircleCI</a>.
              </div>)}
            imageUrl='/img/this-site.png'
          />
          <ProjectCard
            githubUrl='https://github.com/cazlo/heli-madness'
            title='Helicopter Side-scroller'
            subtitle='May 2013'
            text='A simple side scroller implemented with Java Swing. Game engine built from scratch.'
            imageUrl='/img/heli-game.png'
            />
          <ProjectCard
            githubUrl='https://github.com/cazlo/ctf/tree/master/ctf'
            title='CTF AI: Agent007'
            subtitle='April 2015'
            text='An AI agent implemented in Java used to compete against other agents in a simple capture the flag game written in Java.  The Agent007 bot ended up placing 6th in a competition against 44 others.'
            imageUrl='/img/ctf.png'
            />
        </CardDeck>
        <br className='hidden-sm-down' />
        <CardDeck>
          <ProjectCard
            githubUrl='https://github.com/cazlo/MOOPS-Moo-on-MIPS'
            title='MOOPS'
            subtitle='December 2013'
            text='An implementation of the game moo in the MIPS assembly lanuage.  Also includes an algorithm for solving the puzzle within 16 moves.'
            imageUrl='/img/Mars-moo.png'
            />
          <ProjectCard
            githubUrl='https://github.com/cazlo/academic-stuff'
            title='Various School Projects'
            subtitle='2012-2014'
            text="Just some random things I've made for school. Pictured is a loan amortization calculator featuring from scratch graphs and tables built using the swing UI framework for Java."
            imageUrl='/img/loan-amortization.png'
          />
          <ProjectCard
            githubUrl='https://github.com/cazlo/exploring-AI'
            title='Artificial Intelligence'
            subtitle='March 2015'
            text='Some homework for an AI class I took, implementing search and constraint solving algorithms in python.'
            imageUrl='/img/ai-brain.jpg'
          />

        </CardDeck>
        <br className='hidden-sm-down' />
        <CardDeck>
          <ProjectCard
            githubUrl='https://github.com/cazlo/exploring-machine-learning'
            title='Machine Learning'
            subtitle='October 2014'
            text='Some homework for a machine learning class I took, aimed towards implementing and using various prediction engines to classify data.'
            imageUrl='/img/ml-stats.png'
            />
          <ProjectCard
            githubUrl='https://github.com/cazlo/WhizCalc'
            title='WhizCalc'
            subtitle='January 2014'
            text='A simple calculator app for android used to experiment with creating android apps.'
            imageUrl={placeholderImgUrl}
          />
        </CardDeck>
      </div>
    );
};

export default Projects;