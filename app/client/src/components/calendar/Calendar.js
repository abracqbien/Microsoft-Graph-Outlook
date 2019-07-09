import React, { Component } from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';

// Config
import config from '../../config/Config';

// Service
import { getEvents } from '../../service/GraphService';

function formatDateTime(dateTime) {
  return moment
    .utc(dateTime)
    .local()
    .format('M/D/YY h:mm A');
}

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  async componentDidMount() {
    try {
      // Get the user's access token
      var accessToken = await window.msal.acuireTokenSilent({
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
        <h1>Calendar</h1>
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
                  <td>{event.organize.emailAdress.name}</td>
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
