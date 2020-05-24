import React, { Component, Fragment } from "react";
import Chart from 'react-apexcharts';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTweets } from '../../actions/claims';

export class Tweets extends Component {

  static propTypes = {
    //sentiment: PropTypes.object.isRequired,
    analysis: PropTypes.object.isRequired,
    getTweets: PropTypes.func.isRequired,
    //firstKeyword: PropTypes.string,
    //firstTweets: PropTypes.array,
    //secondKeyword: PropTypes.string,
    //secondTweets: PropTypes.array
  }
/*
  comoponentDidMount() {
    this.props.firstKeyword = null
    this.props.firstTweets = null

    this.props.secondKeyword = null
    this.props.secondTweets = null
  }

  componentDidUpdate() {
    this.props.firstKeyword = this.props.analysis.tweets.first.keyword
    this.props.firstTweets = this.props.analysis.tweets.first.tweets

    this.props.secondKeyword = this.props.analysis.tweets.second.keyword
    this.props.secondTweets = this.props.analysis.tweets.second.tweets
  }
*/
  render() {
    const options = {
      colors: ['#F7464A', '#46BFBD', '#FDB45C'],
      labels: ['Negative', 'Positive', 'Neutral'],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true
            }
          }
        }
      }
    }

    const { isSearched, isLoading, results, tweets } = this.props.analysis;

    const series = [results.negative, results.positive, results.neutral]

    var firstKeyword = ''
    var firstTweets = []
    var secondKeyword = ''
    var secondTweets = []

    const header = <h2>Analysis Results</h2>
    const loading = <h3>Loading...</h3>;

    if (isSearched == true) {
      firstKeyword = this.props.analysis.tweets.first.keyword
      firstTweets = this.props.analysis.tweets.first.tweets
      secondKeyword = this.props.analysis.tweets.second.keyword
      secondTweets = this.props.analysis.tweets.second.tweets
    }

    const showFirstTweets = firstTweets.map( (tweet, i) => {
      return (
          <div key={i} className="card border-info mb-3">
            <div className="card-body">
              <p className="card-text">{tweet.text}</p>
            </div>
            <div className="card-header">Prediction = {tweet.label}</div>
          </div>
      );
    })

    const showSecondTweets = secondTweets.map( (tweet, i) => {
      return (
          <div key={i} className="card border-info mb-3">
            <div className="card-body">
              <p className="card-text">{tweet.text}</p>
            </div>
            <div className="card-header">Prediction = {tweet.label}</div>
          </div>
      );
    })

    const showTweets = () => {
      return (
        <div>
          <h3>{firstKeyword}</h3>
          <br />
          {showFirstTweets}
          <br />
          <h3>{secondKeyword}</h3>
          <br />
          {showSecondTweets}
        </div>
      )
    }

    const pieChart = (options, series) => {
      return (
        <div className="col-sm-4">
          <Chart options={options} series={series} type="donut" width="420" />
        </div>
      )
    }

    return (
      <div className="container">
        {isLoading ? loading : null}
        {isSearched ? header : <br />}
        {isSearched ? pieChart(options, series) : <br />}
        {isSearched ? showTweets() : <br />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  analysis: state.TweetsReducer
});

export default connect(mapStateToProps, { getTweets })(Tweets);