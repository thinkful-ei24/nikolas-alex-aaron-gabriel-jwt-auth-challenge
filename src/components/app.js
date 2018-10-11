import React from 'react';
import { connect } from 'react-redux';
import { Route, withRouter } from 'react-router-dom';

import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import { refreshAuthToken } from '../actions/auth';

import { clearAuth } from '../actions/auth';
import { clearAuthToken } from '../local-storage';

export class App extends React.Component {
  constructor(props) {
    super(props);

    (this.countdown = null), (this.alertCounter = null);

    this.resetIdleTimer = this.resetIdleTimer.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.loggedIn && this.props.loggedIn) {
      // When we are logged in, refresh the auth token periodically
      this.startPeriodicRefresh();
    } else if (prevProps.loggedIn && !this.props.loggedIn) {
      // Stop refreshing when we log out
      this.stopPeriodicRefresh();
    }
  }

  componentWillUnmount() {
    this.stopPeriodicRefresh();
  }

  componentDidMount() {}

  startPeriodicRefresh() {
    this.refreshInterval = setInterval(
      () => this.props.dispatch(refreshAuthToken()),
      36000 // Fifteen minutes
    );
  }

  stopPeriodicRefresh() {
    if (!this.refreshInterval) {
      return;
    }

    clearInterval(this.refreshInterval);
  }

  logOut() {
    this.props.dispatch(clearAuth());
    clearAuthToken();
  }

  idleLogoutTimer() {
    clearTimeout(this.countdown);
    clearTimeout(this.alertCounter);
    console.log('timer started');

    this.countdown = setTimeout(() => this.logOut(), 18000000);

    this.alertCounter = setTimeout(() => {
      const stayOnPage = window.confirm('Session is about to expire');
      console.log('hurp', stayOnPage);

      if (!stayOnPage) {
        console.log('clearing timeout');
        clearTimeout(this.countdown);
        clearTimeout(this.alertCounter);
        this.resetIdleTimer();
      }
    }, 14400000);
  }

  resetIdleTimer() {
    clearTimeout(this.countdown);
    console.log('resetting idle timer');
    this.idleLogoutTimer();
  }

  render() {
    return (
      <div
        className="app"
        onLoad={this.idleLogoutTimer()}
        onClick={() => {
          console.log('clicked');
          this.resetIdleTimer();
        }}
      >
        <HeaderBar />
        <Route exact path="/" component={LandingPage} />
        <Route
          exact
          path="/dashboard"
          component={Dashboard}
          stayLoggedIn={this.resetIdleTimer}
        />
        <Route exact path="/register" component={RegistrationPage} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUser !== null
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
