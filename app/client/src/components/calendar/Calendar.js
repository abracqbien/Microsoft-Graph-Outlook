import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Button } from 'reactstrap';
import moment from 'moment';

// Config
import config from '../../config/Config';

// Service
import { getEvents, createEvents } from '../../service/GraphService';

function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .local()
    .format('D/M/YY h:mm A');
}

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      event: []
    };
  }

  async componentDidMount() {
    try {
      // Get the user's access token
      var accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });
      // Get the user's events
      var events = await getEvents(accessToken);
      // Update the array of events in state
      this.setState({ events: events.value });
    } catch (err) {
      this.props.showError('ERROR', JSON.stringify(err));
    }
  }

  render() {
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h1>Calendar</h1>
          <Button color='primary'>Create event</Button>
        </div>
        <Table>
          <thead>
            <tr>
              <th scope='col'>Organize</th>
              <th scope='col'>Subject</th>
              <th scope='col'>Start</th>
              <th scope='col'>End</th>
            </tr>
          </thead>
          <tbody>
            {this.state.events.map(function(event) {
              return (
                <tr key={event.id}>
                  <td>{event.organizer.emailAddress.name}</td>
                  <td>{event.subject}</td>
                  <td>{formatDateTime(event.start.dateTime)}</td>
                  <td>{formatDateTime(event.end.dateTime)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
