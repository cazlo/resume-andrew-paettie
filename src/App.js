import React, { Component } from 'react';
import  { Route } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import HeaderNav from "./containers/header";
import Intro from "./components/intro";
import ProjectsBlock from "./components/ProjectsBlock/ProjectsBlock";
import Resume from "./components/resume";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <HeaderNav />

        <Container>
          <Row>
            <Route exact path='/' component={Intro} />
            <Route path='/projects' component={ProjectsBlock} />
            <Route path='/resume' component={Resume} />
          </Row>
        </Container>

        <br />
        <div className='pull-down'>
          <p className='muted' align='center'>&copy; 2013 - {new Date().getFullYear()}, Andrew Paettie</p>
        </div>
      </div>
    );
  }
}

export default App;
