import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

import { Provider as AlertProvider} from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

import Header from './layout/Header';
import Claims from './claims/claims'
import Form from './claims/Form'
import SearchBar from './claims/SearchBar'
import Alert from './layout/Alert';
import Tweets from './twitter/tweets'

import { Provider } from 'react-redux';
import store from '../store';

// Alert Options
const alertOption = {
  timeout: 3000, //3sec
  position: 'top center'
}

class App extends Component {
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
          <Fragment>
            <Header />
            <Alert />
            <div className="App">
              <Claims />
              <Form />
              <Tweets />
            </div>
          </Fragment>
        </AlertProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));