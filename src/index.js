import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import store from './store';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// Automatically log the user out after five minutes of inactivity.

// Show a dialog box one minute before the user is automatically logged out, allowing them to click a button to indicate that the are still using the application.

/*
- when app minutes
- Click listener for the whole page
- wait five minutes without a click
- perform logout logic
*/
