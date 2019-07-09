import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { UserAgentApplication } from 'msal';
import { getUserDetails } from './service/GraphService';
import config from './config/Config';

// Components
import NavBar from './components/layout/Navbar';
import Welcome from './components/pages/Home';
import About from './components/pages/About';
import ErrorMessage from './components/pages/ErrorMessage';

// CSS
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: config.appId,
        redirectUri: 'http://localhost:3000'
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true
      }
    });

    var user = this.userAgentApplication.getAccount();

    this.state = {
      isAuthenticated: null,
      user: {},
      error: null
    };

    if (user) {
      // Enhance user object with data from Graph
      this.getUserProfile();
    }
  }

  render() {
    let error = null;
    if (this.state.error) {
      error = (
        <ErrorMessage
          message={this.state.error.message}
          debug={this.state.error.debug}
        />
      );
    }

    return (
      <Router>
        <div>
          <NavBar
            isAuthenticated={this.state.isAuthenticated}
            authButtonMethod={
              this.state.isAuthenticated
                ? this.logout.bind(this)
                : this.login.bind(this)
            }
            user={this.state.user}
          />
          <Container>
            {error}
            <Route
              exact
              path='/'
              render={props => (
                <Welcome
                  {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  user={this.state.user}
                  authButtonMethod={this.login.bind(this)}
                />
              )}
            />
            <Route exact path='/about' Component={About} />
          </Container>
        </div>
      </Router>
    );
  }

  setErrorMessage(message, debug) {
    this.setState({
      error: { message: message, debug: debug }
    });
  }

  async login() {
    try {
      await this.userAgentApplication.loginPopup({
        scopes: config.scopes,
        prompt: 'select_account'
      });
      await this.getUserProfile();
    } catch (err) {
      var errParts = err.split('|');
      this.setState({
        isAuthenticated: false,
        user: {},
        error: { message: errParts[1], debug: errParts[0] }
      });
    }
  }

  logout() {
    this.userAgentApplication.logout();
  }

  async getUserProfile() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will juste return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      var accessToken = await this.userAgentApplication.acquireTokenSilent({
        scopes: config.scopes
      });

      if (accessToken) {
        // Get the user's profile from Graph
        var user = await getUserDetails(accessToken);
        this.setState({
          isAuthenticated: true,
          user: {
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName
          },
          error: null
        });
      }
    } catch (err) {
      // let error = {};
      // if (typeof err === 'string') {
      //   const errParts = err.split('|');
      //   error =
      //     errParts.length > 1
      //       ? { message: errParts[1], debug: errParts[0] }
      //       : { message: null, debug: null };
      // }
    }
  }
}

export default App;
