import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

function UserAvatar(props) {
  // If a user avatar is available, return an img tag with the pic
  if (props.user.avatar) {
    return (
      <img
        src={props.user.avater}
        alt='user'
        className='rounded-circle align-self-center mr-2'
        style={{ width: '32px' }}
      />
    );
  }

  // No avatar available, return a default icon
  return (
    <i className='far fa-user-circle fa-lg rounded-circle align-self-center mr-2' />
  );
}

function AuthNavItem(props) {
  // If authenticated, return a dropdown with the user's info and a sign out button
  if (props.isAuthenticated) {
    return (
      <UncontrolledDropdown>
        <DropdownToggle nav caret>
          <UserAvatar user={props.user} />
        </DropdownToggle>
        <DropdownMenu right>
          <h5 className='dropdown-item-text mb-0'>{props.user.displayname}</h5>
          <p className='dropdown-item-text text-muted mb-0'>
            {props.user.email}
          </p>
          <DropdownItem divider />
          <DropdownItem onClick={props.authButtonMethod}>Sign Out</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }

  // Not authenticated, return a sign in Link
  return (
    <NavItem>
      <NavLink onClick={props.authButtonMethod}>Sign In</NavLink>
    </NavItem>
  );
}

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    // Only show calendar nav item if logged in
    let calendarLink = null;
    if (this.props.isAuthenticated) {
      calendarLink = (
        <NavItem>
          <RouterNavLink to='/calendar' className='nav-link' exact>
            Calendar
          </RouterNavLink>
        </NavItem>
      );
    }

    return (
      <div>
        <Navbar color='dark' dark expand='md' fixed='top'>
          <Container>
            <NavbarBrand href='/'>
              Microsoft Graph | Outlook Calendar
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className='mr-auto' navbar>
                <NavItem>
                  <RouterNavLink to='/' className='nav-link' exact>
                    Home
                  </RouterNavLink>
                </NavItem>
                {calendarLink}
              </Nav>
              <Nav className='justify-content-end' navbar>
                <NavItem>
                  <NavLink
                    href='https://docs.microsoft.com/fr-fr/graph/api/overview?view=graph-rest-1.0'
                    target='blank'
                  >
                    <i className='fas fa-external-link-alt mr-1' />
                    Docs
                  </NavLink>
                </NavItem>
                <AuthNavItem
                  isAuthenticated={this.props.isAuthenticated}
                  authButtonMethod={this.props.authButtonMethod}
                  user={this.props.user}
                />
                <RouterNavLink to='/about' className='nav-link' exact>
                  About
                </RouterNavLink>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}
