import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Alert extends Component {

  static propTypes = {
    error: PropTypes.object.isRequired,
  }

  componentDidUpdate(prevProps) { //when we get new prop e.g. error, this function runs
    const { error, alert } = this.props;
    if (error !== prevProps.error) {
      alert.error('There is an error');
    }
  }

  render() {
    return <Fragment />
  }
}

const mapStateToProps = (state) => ({
  error: state.ErrorReducer //any errors in the state of the Error Reducer are now props
});

export default connect(mapStateToProps)(withAlert()(Alert));
