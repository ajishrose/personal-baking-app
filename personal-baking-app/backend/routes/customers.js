const router = require('express').Router();
let Customer = require('../models/customer.model');
const mongoose = require('mongoose');

// returns the list of customers from MongoDB in JSON format
router.route('/').get((req, res) => {
  Customer.find()
    .then(customers => res.json(customers))
    .catch(err => res.status(400).json('Error: ' + err));
});

// adds a customer to the list in MongoDB
router.route('/add').post(async(req, res) => {
  const name = req.body.name;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const newCustomer = new Customer({name});
    await newCustomer.save({ session });
    await session.commitTransaction();
    res.json('Customer added!');

  } catch (err) {
    await session.abortTransaction();
    res.status(400).json('Error: ' + err);

  } finally {
    session.endSession();
  }
});

module.exports = router;