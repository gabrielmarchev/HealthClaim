import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SearchBar from './claims/SearchBar'

import Header from './layout/Header';

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
      <div>
        <Header />
        <div className="App">
          <SearchBar onSearch={this.search} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));