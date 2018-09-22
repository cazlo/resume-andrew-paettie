import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaEllipsisV} from 'react-icons/lib/fa';
// eslint-disable-next-line
import { Collapse, Navbar, Nav, NavItem, NavLink, NavbarToggler, NavbarBrand, Container, Row, Col } from 'reactstrap';
import "../css/nav.css";

const LinkWrapper = (props) => (
  <NavItem>
    <NavLink tag={Link} to={props.to} activeClassName='active'>
      {props.name}
    </NavLink>
  </NavItem>
    );

export default class HeaderNav extends Component {
    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: false
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
          <Navbar toggleable className='navbar navbar-expand-lg navbar-expand-xl fixed-top bg-dark navbar-toggleable-md'>
            <NavbarToggler className='navbar-toggler-icon navbar-toggler' onClick={this.toggleNavbar} >
              <FaEllipsisV className='text-white' />
            </NavbarToggler>
            {/*<NavbarBrand className="text-white"><h1>Andrew Paettie</h1></NavbarBrand>*/}
            <Collapse className='navbar-toggleable-xs' isOpen={!this.state.collapsed}>
              <Nav >
                <LinkWrapper to='/' name='About Me' />
                <LinkWrapper to='/projects' name='Projects' />
                <LinkWrapper to='/resume' name='Résumé' />
              </Nav>
            </Collapse>
          </Navbar>
        );
    }
}