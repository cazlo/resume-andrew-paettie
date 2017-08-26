import { h } from 'preact';
import { Card, Button, ButtonGroup, CardImg, CardTitle, CardText,
    CardSubtitle, CardBlock, CardColumns, CardHeader } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import Iframe from 'react-iframe';


const placeholderImgUrl = "https://placeholdit.imgix.net/~text?txtsize=33&txt=Image%20Coming%20Soon&w=256&h=180";

const ProjectCard = (props) => (
  <Card>

    {props.imageUrl? (<CardImg top width='100%' src={props.imageUrl} alt='Card image cap' />) : null}
    {props.projectComponent ? (<CardHeader>{props.projectComponent}</CardHeader>) : null}
    <CardBlock className='text-center'>
      <CardTitle>{props.title}</CardTitle>
      <CardSubtitle>{props.subtitle}</CardSubtitle>
      <CardText>{props.text}</CardText>
      <ButtonGroup>
        {props.githubUrl? (<Button tag='a' className='btn btn-outline-info'><FontAwesome name='github' /><a role='button' href={props.githubUrl}> Github</a></Button>) : null}
        {props.siteUrl? (<Button tag='a' className='btn btn-outline-info'><FontAwesome name='hashtag' /><a role='button' href={props.siteUrl}> Site</a></Button>) : null}
      </ButtonGroup>
    </CardBlock>
  </Card>
);

const Projects = (props) => {
    return (
      <CardColumns>
        <ProjectCard
          githubUrl='https://github.com/cazlo/apaettie_backup'
          siteUrl='http://andrewpaettie.com'
          title='This Website'
          subtitle='August 2017'
          text='A simple portfolio site to show some projects I have done.'
          projectComponent={
            <Iframe url='http://localhost:3000/projects' // TODO: point to prod
              display='initial'
              position='relative'
              width='400px'
              height='300px'
                // styles={{height: "25px"}}
            />}
          />
        <ProjectCard
          githubUrl='https://github.com/cazlo/heli-madness'
          title='Helicopter Side-scroller'
          subtitle='May 2013'
          text='A simple side scroller implemented with Java Swing'
          imageUrl='/img/heli-game.png'
        />
        <ProjectCard
          githubUrl='https://github.com/cazlo/MOOPS-Moo-on-MIPS'
          title='MOOPS'
          subtitle='December 2013'
          text='An implementation of the game moo in the MIPS assembly lanuage.  Also includes an algorithm for solving the puzzle within 16 moves'
          imageUrl='/img/Mars-moo.png'
          />
        <ProjectCard
          githubUrl='https://github.com/cazlo/ctf/tree/master/ctf'
          title='CTF AI: Agent007'
          subtitle='April 2015'
          text='An AI agent implemented in Java used to compete against other agents in a simple capture the flag game written in Java.  The Agent007 bot ended up placing 6th in a competition against 44 others.'
          imageUrl='/img/ctf.png'
          />
        <ProjectCard
          githubUrl='https://github.com/cazlo/exploring-AI'
          title='Artificial Intelligence'
          subtitle='March 2015'
          text='Some homework for an AI class I took, implementing search and constraint solving algorithms in python.'
          imageUrl='/img/ai-brain.jpg'
          />
        <ProjectCard
          githubUrl='https://github.com/cazlo/exploring-machine-learning'
          title='Machine Learning'
          subtitle='October 2014'
          text='Some homework for a machine learning class I took, aimed towards implementing and using various prediction engines to classify data.'
          imageUrl={placeholderImgUrl}
          />
        <ProjectCard
          githubUrl='https://github.com/cazlo/WhizCalc'
          title='WhizCalc'
          subtitle='January 2014'
          text='A simple calculator app for android used to experiment with creating android apps.'
          imageUrl={placeholderImgUrl}
          />
        <ProjectCard
          githubUrl='https://github.com/cazlo/academic-stuff'
          title='Various School Projects'
          subtitle='2012-2014'
          text="Just some random things I've made for school."
          imageUrl='/img/loan-amortization.png'
        />
      </CardColumns>
    );
};

export default Projects;