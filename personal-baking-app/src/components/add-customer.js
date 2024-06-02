import React, { Component } from 'react';
import axios from 'axios';

export default class AddCustomer extends Component {
    // initializes data fields to add a customer
    state = {
        first_name: '',
        last_name: '',
        customerAdded: false
    }

    // updates the value of each field with the user's input 
    onChangeFirstName = (e) => { this.setState({ first_name: e.target.value }); }
    onChangeLastName = (e) => { this.setState({ last_name: e.target.value }); }

    onSubmit = (e) => {
        e.preventDefault();

        const name = `${this.state.first_name} ${this.state.last_name}`;
        const customer = { name: name };

        axios.post('http://localhost:5000/customers/add', customer)
        .then(res => {
            console.log(res.data);
            this.setState({ customerAdded : true })
        });

        this.setState({
            first_name: '',
            last_name: ''
        })
    }


    render = () => (
        <div>
            {this.state.customerAdded ? 
                <div>
                <h4>Customer Added!</h4> 
                <h6>You can now create your custom baking order.</h6>
                </div>
                :
                <div>
                <h5>Add a New Customer</h5>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>First Name: </label>
                            <input
                                type="text"
                                required
                                className="form-control"
                                value={this.state.first_name}
                                onChange={this.onChangeFirstName}
                            />
                    </div>

                    <div className="form-group">
                        <label>Last Name: </label>
                            <input
                                type="text"
                                required
                                className="form-control"
                                value={this.state.last_name}
                                onChange={this.onChangeLastName}
                            />
                    </div>

                    <div className="form-group">
                    <input type="submit" 
                        value="Add Customer" 
                        className="btn btn-primary" />
                    </div>
                </form>
                </div>
            }
        </div>
    );
}