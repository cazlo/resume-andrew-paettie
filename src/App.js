import { h, Component } from 'preact';
import  { Route, Switch } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
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
            <Switch>
              <Route exact path='/' component={Intro} />
              <Route exact path='/projects' component={Projects} />
              <Route exact path='/resume' component={Resume} />
            </Switch>
          </Row>
        </Container>

        <br />
        <div class='pull-down'>
          <p class='muted' align='center'>&copy; 2013 - {new Date().getFullYear()}, Andrew Paettie</p>
        </div>
      </div>
    );
  }
}

export default App;
