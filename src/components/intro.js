import { h } from 'preact';
// eslint-disable-next-line
import { Container, Row, Col, Button, Navbar, Nav, NavItem, NavLink , Jumbotron, Media} from 'reactstrap';
import { Link } from 'react-router-dom';

const Intro = (props) => (
  <div className='container'>
    <Jumbotron >
      <Media>
        <Row className='justify-content-center'>

          <Col xs='12' sm='6' lg='8' className='justify-content-center'>
            <Media body >
              <Media heading>
                <h2>About Me</h2>
              </Media>
              <p className='lead'>
          I am an experienced and capable full stack software engineer.
          If you are interested in hiring a full stack software engineer,
          check out my <Link to='/resume'>résumé</Link> and <Link to='/projects'>projects</Link>
          and feel free to contact me via one of the listed methods.
              </p>
            </Media>
          </Col>
          <Col xs='12' sm='6' md='6' lg='4'>
            <img src='/img/andrew-paettie-having-fun.jpg' alt='Andrew Paettie' className='img-thumbnail' />
          </Col>
        </Row>
      </Media>
      <p className='lead' />
    </Jumbotron>
  </div>
);

export default Intro;