import { h } from 'preact';
import { Link } from 'react-router-dom';
// eslint-disable-next-line
import { Container, Row, Col, Button, Navbar, Nav, NavItem, NavLink } from 'reactstrap';

const LinkWrapper = (props) => (
  <NavItem>
    <NavLink tag={Link} to={props.to} activeClassName='active'>
      {props.name}
    </NavLink>
  </NavItem>
    );

const HeaderNav = (props) => (
  <Navbar className='navbar navbar-expand-md navbar-dark bg-dark fixed-top'>
    <Nav className='navbar-nav mr-auto'>
      <LinkWrapper to='/' name='About Me' />
      <LinkWrapper to='/projects' name='Projects' />
      <LinkWrapper to='/resume' name='Resume' />
    </Nav>
  </Navbar>
);


export default HeaderNav;