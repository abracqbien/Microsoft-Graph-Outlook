import React, { Component } from 'react';

export default class About extends Component {
  render() {
    return (
      <div>
        <h1>About This App</h1>
        <p className='my-1'>
          This is React app for Microsoft Graph | Outlook calendar
        </p>
        <p className='bg-dark p' style={{ padding: '5px', color: '#FFF' }}>
          <strong>Version: </strong> 1.0.0
        </p>
      </div>
    );
  }
}
