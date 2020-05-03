import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import { Provider as AlertProvider} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import Header from './layout/Header';
import SearchBar from './claims/SearchBar'
import Alert from './layout/Alert';
import Dashboard from './claims/Dashboard';
import Login from './accounts/Login';
import Register from './accounts/Register';
import PrivateRoute from './common/PrivateRoute';

import { Provider } from 'react-redux';
import store from '../store';
import { loadUser } from '../actions/auth';

// Alert Options
const alertOption = {
  timeout: 3000, //3sec
  position: 'top center'
}

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  constructor(props) {
    super(props);
 
    this.state = {
      searchResults: []
    }

    this.search = this.search.bind(this);
  }

  search(term) {}

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOption}>
          <Router>
            <Fragment>
              <Header />
              <Alert />
              <div className="App">
                <Switch>
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));