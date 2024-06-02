const router = require('express').Router();
let BakingOrder = require('../models/baking-order.model');
const mongoose = require('mongoose');

// returns the list of baking orders from MongoDB in JSON format
router.route('/').get((req, res) => {
  BakingOrder.find()
    .then(orders => res.json(orders))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route for filtering baking orders
router.route('/filter').post((req, res) => {
  const { name } = req.body;
  let query = {};
  if (name) {
      query.name = name;
  }

  BakingOrder.find(query)
      .then(orders => res.json(orders))
      .catch(err => res.status(400).json('Error: ' + err));
});

// adds an order to the baking orders list in MongoDB
router.route('/add').post(async(req, res) => {
  const name = req.body.name;
  const baked_good = req.body.baked_good;
  const flavor = req.body.flavor;
  const quantity = Number(req.body.quantity);
  const event_date = Date.parse(req.body.event_date);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();


    const newBakingOrder = new BakingOrder({
      name,
      baked_good,
      flavor,
      quantity,
      event_date,
    });


    await newBakingOrder.save({ session });
    await session.commitTransaction();
    res.json('Order added!');
   
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json('Error: ' + err);

  } finally {
    session.endSession();
  }
});

// retrieves information about a specific baking order (as a JSON)
router.route('/:id').get((req, res) => {
  BakingOrder.findById(req.params.id)
    .then(bakingOrder => res.json(bakingOrder))
    .catch(err => res.status(400).json('Error: ' + err));
});

// deletes specific baking order from MongoDB
router.route('/:id').delete((req, res) => {
  BakingOrder.findByIdAndDelete(req.params.id)
    .then(() => res.json('Baking Order deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// updates specific baking order on MongoDB
router.route('/update/:id').post((req, res) => {
  BakingOrder.findById(req.params.id)
    .then(bakingOrder => {
      bakingOrder.name = req.body.name;
      bakingOrder.baked_good = req.body.baked_good;
      bakingOrder.flavor = req.body.flavor;
      bakingOrder.quantity = Number(req.body.quantity);
      bakingOrder.event_date = Date.parse(req.body.event_date);

      bakingOrder.save()
        .then(() => res.json('Baking Order updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;