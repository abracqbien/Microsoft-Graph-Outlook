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
      event: {}
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

  onClick = async () => {
    console.log('test');
    try {
      var accessToken = await window.msal.acquireTokenSilent({
        scopes: config.scopes
      });

      const event = {
        subject: 'Plan summer company picnic',
        body: {
          contentType: 'HTML',
          content: "Let's kick-start this event planning!"
        },
        start: {
          dateTime: '2019-08-01T13:00:00',
          timeZone: 'Pacific Standard Time'
        },
        end: {
          dateTime: '2019-08-01T14:00:00',
          timeZone: 'Pacific Standard Time'
        },
        attendees: [
          {
            emailAddress: {
              address: 'rgrandin@pocketresult.com',
              name: 'Raphael Grandin'
            },
            type: 'Required'
          }
        ],
        location: {
          displayName: 'Conf Room 3; Fourth Coffee; Home Office',
          locationType: 'Default'
        },
        locations: [
          {
            displayName: 'Conf Room 3'
          },
          {
            displayName: 'Fourth Coffee',
            address: {
              street: '4567 Main St',
              city: 'Redmond',
              state: 'WA',
              countryOrRegion: 'US',
              postalCode: '32008'
            },
            coordinates: {
              latitude: 47.672,
              longitude: -102.103
            }
          },
          {
            displayName: 'Home Office'
          }
        ]
      };

      this.setState({ event: event });
      console.log('My POST event', this.state.event);
      await createEvents(accessToken, event);
    } catch (err) {
      // this.props.showError('ERROR', JSON.stringify(err));
    }
  };

  render() {
    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <h1>Calendar</h1>
          <Button color='primary' onClick={this.onClick}>
            Create event
          </Button>
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
