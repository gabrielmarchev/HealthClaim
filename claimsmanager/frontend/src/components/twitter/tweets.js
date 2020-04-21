import React, { Component, Fragment } from "react";
import Chart from 'react-apexcharts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTweets } from '../../actions/claims';

export class Tweets extends Component {

  static propTypes = {
    tweets: PropTypes.array.isRequired,
    getTweets: PropTypes.func.isRequired
  }

  componentDidUpdate() {
    //var positive = 0;
    //var negative = 0;
    //this.props.getTweets();
  }


  render() {
    return (
      <Fragment>
        <h1>Tweets List</h1>
        {console.log(this.props.tweets)}
        {this.props.tweets.map( (tweet, i) => {
          return (
            <div key={i} className="tweets">
              <p>{tweet}</p>
            </div>
          );
        })}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tweets: state.TweetsReducer.tweets
});

export default connect(mapStateToProps, { getTweets })(Tweets);