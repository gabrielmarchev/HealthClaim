import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getClaims, deleteClaim } from '../../actions/claims';

export class Claims extends Component {
  static propTypes = {
    claims: PropTypes.array.isRequired,
    getClaims: PropTypes.func.isRequired,
    deleteClaim: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.getClaims();
  }

  render() {
    return (
      <Fragment>
        <h2>Your Claims List</h2>
        <br />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Owner</th>
              <th>Health Claim</th>
              <th>Results</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.claims.map(claim => (
              <tr key={claim.id}>
                <td>{claim.id}</td>
                <td>{claim.owner}</td>
                <td>{claim.message}</td>
                <td>{claim.result}</td>
                <td><button onClick={this.props.deleteClaim.bind(this, claim.id)} className="btn btn-danger btn-sm">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }

}

const mapStateToProps = state => ({
  claims: state.ClaimReducer.claims,
});

export default connect(mapStateToProps, { getClaims, deleteClaim })(Claims);