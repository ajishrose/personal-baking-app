import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';

import Navbar from './components/navbar';
import BakingOrdersList from './components/baking-orders-list';
import EditOrder from './components/edit-order';
import CreateOrder from './components/create-order';
import AddCustomer from './components/add-customer';

function App() {
  return (
  <Router>
    <div className="app-style">
    {/* <div className = "container"> */}
      {/* <div> this is the home page </div> */}
    <Navbar />
      
      <Routes>
        <Route path = "/" element = {<BakingOrdersList/>} />
        <Route path = "/edit/:id" element = {<EditOrder/>} /> 
        <Route path="/create" element={<CreateOrder/>} />
        <Route path="/customer" element={<AddCustomer/>} /> 
      </Routes>  
      </div>
    {/* </div> */}
  </Router>
  );
}

export default App;