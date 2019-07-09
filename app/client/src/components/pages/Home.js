import React, { Component } from 'react';
import { Button, Jumbotron } from 'reactstrap';

function WelcomeContent(props) {
  // If authenticated, greet thr use
  if (props.isAuthenticated) {
    return (
      <div>
        <h4>Welcome {props.user.displayName} !</h4>
        <p>Use the navigation bar at the top of the page to get started.</p>
      </div>
    );
  }

  // Not authenticated, present a sign in button
  return (
    <Button color='primary' onClick={props.authButtonMethod}>
      Click here to sign in
    </Button>
  );
}

export default class Welcome extends Component {
  render() {
    return (
      <Jumbotron>
        <h1>Microsoft Graph | Outlook Calendar</h1>
        <p className='lead'>
          This sample app shows how to use the Microsoft Graph API
        </p>
        <WelcomeContent
          isAuthenticated={this.props.isAuthenticated}
          user={this.props.user}
          authButtonMethod={this.props.authButtonMethod}
        />
      </Jumbotron>
    );
  }
}
