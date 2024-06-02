import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default class Navbar extends Component {

render() {
  return (
    <nav className="navbar navbar-expand-lg">
    <Link to="/" className="navbar-brand">Baking Orders</Link>
    <div className="collpase navbar-collapse">
        <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
                <Link to="/" className="nav-link">All Orders</Link>
            </li>
            <li className="navbar-item">
                <Link to="/create" className="nav-link">Create A Custom Order</Link>
            </li>
            <li className="navbar-item">
                <Link to="/customer" className="nav-link">Add Customer</Link>
            </li>
        </ul>
    </div>
    </nav>
    );
    }
}
