import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SearchBar from './claims/SearchBar'
import Claims from './claims/claims'
import Form from './claims/Form'

import Header from './layout/Header';

import { Provider } from 'react-redux';
import store from '../store';

class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      searchResults: []
    }

    this.search = this.search.bind(this);
  }

  search(term) {
    
  }

  render() {
    return (
      <Provider store={store}>
        <div>
          <Header />
          <div className="App">
            <Claims />
            <Form />
          </div>
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));