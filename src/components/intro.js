import { h } from 'preact';
// eslint-disable-next-line
import { Container, Row, Col, Button, Navbar, Nav, NavItem, NavLink , Jumbotron} from 'reactstrap';
import { Link } from 'react-router-dom';

const Intro = (props) => (
  <div className='container'>
    <Jumbotron>
      <h1 className='display-3'>Hello, world!</h1>
      <p className='lead'>My name is Andrew Paettie. I am an experienced and capable full stack software engineer.</p>
      <hr className='my-2' />
        <p>If you are interested in hiring a full stack software engineer, check out my <Link to="/resume">résumé</Link> and <Link to="/projects">projects</Link></p>
    </Jumbotron>
  </div>
);

export default Intro;