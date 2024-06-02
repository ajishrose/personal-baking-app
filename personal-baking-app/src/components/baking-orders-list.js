import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BakingOrder = props => (
    <tr>
      <td>{props.order.name}</td>
      <td>{props.order.baked_good}</td>
      <td>{props.order.flavor}</td>
      <td>{props.order.quantity}</td>
      <td>{props.order.event_date.substring(0,10)}</td>
      <td>
        <Link to={"/edit/"+props.order._id}>edit</Link> | <a href="#" onClick={() => { props.deleteBakingOrder(props.order._id) }}>delete</a>
      </td>
    </tr>
  )

export default class BakingOrdersList extends Component {

  constructor(props) {
    super(props);
    this.filterByName = this.filterByName.bind(this);
    this.generateReport = this.generateReport.bind(this);
  }

    // initializes all fields on the list form
    state = {
      bakingOrders: [],
      currentImagesIndex: 0,
      filteredOrders: [],
      report: null,
      totalSets: 3}
    
    // retrieves all baking orders from the DB 
    componentDidMount() {
        this.getAllOrders();
    }

    getAllOrders() {
        axios.get("http://localhost:5000/baking-orders/")
            .then(response => {
                this.setState({ bakingOrders: response.data, filteredOrders: response.data })
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
            
    }

    // prepopulates the baking orders from the DB into the orders table 
    BakingOrdersList() {
        return this.state.filteredOrders.map(currentOrder => {
            return <BakingOrder order={currentOrder} deleteBakingOrder={this.deleteBakingOrder} key={currentOrder._id}/>;
        })
    }
    
    // deletes a baking order that the user specifies
    deleteBakingOrder = (id) => {
        axios.delete('http://localhost:5000/baking-orders/'+id)
          .then(res => console.log(res.data));

        this.setState({
          bakingOrders: this.state.bakingOrders.filter(el => el._id !== id),
          filteredOrders: this.state.filteredOrders.filter(el => el._id !== id)
        })
    }

    // filters orders by name and calls filter api to display proper orders
    filterByName(event) {
      const selectedName = event.target.value;
      if (selectedName) {
        axios.post('http://localhost:5000/baking-orders/filter', { name: selectedName })
          .then(response => {
          this.setState({ filteredOrders: response.data });
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
        
      } else {
        this.setState({ filteredOrders: this.state.bakingOrders });
      }
    }

    // generate report, which includes total number of orders and orders by customer
    generateReport() {
      const ords = this.state.filteredOrders.length > 0 ? this.state.filteredOrders : this.state.bakingOrders;
      const numOrds = ords.length;
  
      const bakingOrders = {};
      ords.forEach(ord => {
          if (!bakingOrders[ord.name]) {
              bakingOrders[ord.name] = {
                  numOrds: 0,
              };
          }
          bakingOrders[ord.name].numOrds++;
      });
  
  
      const orderInfo = Object.entries(bakingOrders).map(([name, info]) => ({
          name,
          numOrds: info.numOrds,
      }));

      this.setState({
        report: {
          numOrds, orderInfo
        }
      })
    }
  
    // handles right and left arrows to go through the image gallery 
    handleNextImages = () => {
        this.setState(prevState => ({
          currentImagesIndex: (prevState.currentImagesIndex + 1) % prevState.totalSets 
        }));
      };

    handlePreviousImages = () => {
        this.setState(prevState => ({
          currentImagesIndex: prevState.currentImagesIndex === 0 ? prevState.totalSets - 1 : prevState.currentImagesIndex - 1
        }));
    };

    render() {
        const { currentImagesIndex } = this.state;
        const imagesSets = [
            ['scones.jpg', 'strawberry.jpg', 'donuts.jpg'],
            ['coffeewalnut.jpg', 'cheesecake.jpg', 'linzercookies.jpg'],
            ['scotcharoo.jpg', 'snickerdoodles.jpg', 'cocomango.jpg']
        ];

        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className='fas fa-chevron-left' onClick={this.handlePreviousImages} style={{ fontSize: '40px', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aed7', marginRight: '29px'}}></button>
                {imagesSets[currentImagesIndex].map((image, index) => (
                    <img key={index} src={image} alt='' style={{ width: '25%', marginRight: '30px' }} />
                ))}
                <button className='fas fa-chevron-right' onClick={this.handleNextImages} style={{ fontSize: '40px', background: 'none', border: 'none', cursor: 'pointer', color: '#a0aed7'}}></button>
            </div>
            <h3>All Orders</h3>
            <button className="report-button" onClick={this.generateReport}>Generate Report</button>
            <table className="table">
            <thead className="thead-light">
                <tr>
                <th>Name
                  <select onChange={this.filterByName}>
                    <option value="">All</option>
                    {[...new Set(this.state.bakingOrders.map(order => order.name))].map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </th>
                <th>Baked Good</th>
                <th>Flavor</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
               { this.BakingOrdersList() }
            </tbody> 
            </table> 

        {this.state.report && (
          <div>
              <h3>Report</h3>
              <h6>Total Orders: {this.state.report.numOrds}</h6>
              <h4>Orders per customer:</h4>
              <h6>
                  {this.state.report.orderInfo.map(ord => (
                      <li key={ord.name}>
                          {ord.name}: {ord.numOrds}
                      </li>
                  ))}
              </h6>
              
          </div>
      )}
      </div>
    )
  }
}