import { h, Component } from 'preact';
import  { Route } from 'react-router-dom';
import { Link } from 'react-router';
import { Container, Row, Col, Nav, NavItem, NavLink } from 'reactstrap';
import HeaderNav from "./containers/header";
import Intro from "./components/intro";
import Projects from "./components/projects";
import Resume from "./components/resume";

class App extends Component {
  render() {
    return (
      <div className='App'>
        <HeaderNav />

        <Container>
          <Row>
            <Route exact path='/' component={Intro} />
            <Route path='/projects' component={Projects} />
            <Route path='/resume' component={Resume} />
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
