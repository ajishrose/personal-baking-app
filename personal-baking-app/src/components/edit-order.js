import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class CreateOrder extends Component {
    // initializes all data fields on the edit form
    state = {
        name: '',
        baked_good: '',
        flavor: '',
        quantity: 0,
        date: new Date(),
        customers: [],
        orderEdited: false
    }

    // retrieves the baking order information that the user wants to edit from the DB 
    componentDidMount() {
        this.prepopulateBakingOrder()
    }

    prepopulateBakingOrder() {
        // extracts the mongoDB id from url
        const urlParts = window.location.pathname.split('/');
        const id_db = urlParts[urlParts.length - 1];
        if (!id_db) {
            console.error('Baking Order ID is missing from the URL');
            return;
        }

        axios.get(`http://localhost:5000/baking-orders/${id_db}`)
          .then(response => {
            this.setState({ 
                name: response.data.name,
                baked_good: response.data.baked_good,
                flavor: response.data.flavor,
                quantity: response.data.quantity,
                event_date: new Date(response.data.event_date)
            })  
        })
        .catch(function (error) {
            console.log(error);
        })

        axios.get('http://localhost:5000/customers/')
        .then(response => {
            if (response.data.length > 0) {
                this.setState({
                customers: response.data.map(customer => customer.name)
                })
            }
        })
        .catch((error) => {
        console.log(error);
        })
    }

    // updates the value of each field with the user's input 
    onChangeName = (e) => { this.setState({ name: e.target.value }); }
    onChangeBakedGood = (e) => { this.setState({ baked_good: e.target.value }); }
    onChangeFlavor = (e) => { this.setState({ flavor: e.target.value }); }
    onChangeQuantity = (e) => { this.setState({ quantity: e.target.value }); }
    onChangeDate = (event_date) => { this.setState({ event_date: event_date }); }

    // sends the updated information to the DB, which updates the entry in the baking orders table
    onSubmit = (e) => {
        e.preventDefault();

        const urlParts = window.location.pathname.split('/');
        const id_db = urlParts[urlParts.length - 1];

        const bakingOrder = {
            name: this.state.name,
            baked_good: this.state.baked_good,
            flavor: this.state.flavor,
            quantity: this.state.quantity,
            event_date: this.state.event_date
        }

        axios.post(`http://localhost:5000/baking-orders/update/${id_db}`, bakingOrder)
        .then(res => {
            console.log(res.data)
            this.setState({ orderEdited: true })
        });

    }

    render = () => (
        <div>
            {this.state.orderEdited ? 
                <div>
                <h4>Order Edited!</h4> 
                <h6>Visit All Orders to view your changes.</h6>
                </div>
                :
                <div>
                <h3>Edit your Baking Order!</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                    <label>Name: </label>
                    <select ref="userInput"
                        required
                        className="form-control"
                        value={this.state.name}
                        onChange={this.onChangeName}>
                        {
                            this.state.customers.map(function(customer) {
                            return <option
                                key={customer}
                                value={customer}>{customer}
                                </option>;
                            })
                        }
                    </select>
                    </div>
                    <div className="form-group">
                    <label>Baked Good: </label>
                    <input  type="text"
                        required
                        className="form-control"
                        value={this.state.baked_good}
                        onChange={this.onChangeBakedGood}
                        />
                    </div>
                    <div className="form-group">
                    <label>Flavor: </label>
                    <input  type="text"
                        required
                        className="form-control"
                        value={this.state.flavor}
                        onChange={this.onChangeFlavor}
                        />
                    </div>
                    <div className="form-group">
                    <label>Quantity (number of people): </label>
                    <input
                        type="text"
                        className="form-control"
                        value={this.state.quantity}
                        onChange={this.onChangeQuantity}
                        />
                    </div>
                    <div className="form-group">
                    <label>Event Date: </label>
                    <div>
                        <DatePicker
                        selected={this.state.event_date}
                        onChange={this.onChangeDate}
                        />
                    </div>
                    </div>
        
                    <div className="form-group">
                    <input type="submit" value="Edit Baking Order" className="btn btn-primary" />
                    </div>
                </form>
                </div>
            }
        </div>
    )
}