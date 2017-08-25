import { h, Component } from 'preact';
import { Container, Row, Col, Button, Navbar, Nav, NavItem, NavLink , Jumbotron} from 'reactstrap';

const Intro = (props) => (
  <div className='container'>
    <Jumbotron>
      <h1>
          Hello World
          </h1>
    </Jumbotron>
  </div>
);

export default Intro;