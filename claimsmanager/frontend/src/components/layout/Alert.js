import React, { Component, Fragment } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Alert extends Component {

  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired
  }
  
  componentDidUpdate(prevProps) { //when we get new prop e.g. error, this function runs
    const { error, alert, message } = this.props;
    if (error !== prevProps.error) {
      if (error.msg.name) alert.error(`Owner: ${error.msg.owner.join()}`);
      if (error.msg.message) alert.error(`Claim: ${error.msg.message.join()}`);
      if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
      if (error.msg.username) alert.error(error.msg.username.join());
    }

    if (message !== prevProps.message) {
      if (message.deleteClaim) alert.success(message.deleteClaim);
      if (message.addClaim) alert.success(message.addClaim);
      if (message.passwordsNoMatch) alert.error(message.passwordsNoMatch);
    }

  }

  render() {
    return <Fragment />
  }
}

const mapStateToProps = (state) => ({
  error: state.ErrorsReducer, //any errors in the state of the Errors Reducer are now props
  message: state.MessagesReducer
});

export default connect(mapStateToProps)(withAlert()(Alert));
