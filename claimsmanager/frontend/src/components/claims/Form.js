import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addClaim, getTweets } from '../../actions/claims'


export class Form extends Component {
  state = {
    owner: '',
    message: ''
  };

  static propTypes = {
    addClaim: PropTypes.func.isRequired,
    getTweets: PropTypes.func.isRequired
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { owner, message } = this.state;
    const claim = { owner, message };
    this.props.addClaim(claim);
    this.props.getTweets(claim); //hashtag search by claim
    this.setState({
      owner: '',
      message: '',
    });
  };
  
  render() {
    const { owner, message } = this.state;
    return (
      <div className="card card-body mt-4 mb-4">
        <h2>Search Health Claim</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Brand/Owner</label>
            <input
              className="form-control"
              type="text"
              name="owner"
              onChange={this.onChange}
              value={owner}
            />
          </div>
          <div className="form-group">
            <label>Health Claim</label>
            <input
              className="form-control"
              type="text"
              name="message"
              onChange={this.onChange}
              value={message}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-info">
              Analyse
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default connect(null, { addClaim, getTweets })(Form);
