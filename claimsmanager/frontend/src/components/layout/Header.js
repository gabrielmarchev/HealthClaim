import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; 
import { logout } from '../../actions/auth';

export class Header extends Component {
  
  static propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
        <span className="navbar-text mr-3">
          <strong>
            { user ? `Welcome ${user.username}` : ""}
          </strong>
        </span>
        <li className="nav-item">
          <button onClick={this.props.logout} className="nav-link btn btn-secondary btn-sm text-light">Logout</button>
        </li>
      </ul>
    );

    const pageLinks = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
        </li>
        <li className="nav-item">
          <Link to="/claims" className="nav-link">History</Link>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">About</a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
        <li className="nav-item">
          <Link to="/register" className="nav-link">Register</Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">Login</Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Health Claims Manager</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          { isAuthenticated ? pageLinks: null}
          { isAuthenticated ? authLinks : guestLinks}
        </div>
      </nav>
    )
  }
}


const mapsStateToProps = state => ({
  auth: state.AuthReducer
});

export default connect(mapsStateToProps, { logout })(Header);
