import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      term: ''
    }

    this.handleTermChange = this.handleTermChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleTermChange(event) {
    this.setState({term: event.target.value});
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  render() {
    return(
      <div className="SearchBar">
        <div className="SearchBar-fields">
          <input placeholder="Enter term"  onChange={this.handleTermChange} />
          <input placeholder="What brand?" />
          <button className="SearchButton" onClick={this.search}>SEARCH</button>
        </div>
        
      </div>
    )
  }
}

export default SearchBar;