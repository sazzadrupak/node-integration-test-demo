const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const Joi = require('joi');
const express = require('express');
const router = express.Router();

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  // Static method: Rental.lookup (method available directly on a class)
  // Instance method: new User().generateAuthToken() (method only available on the instance of a class)
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (rental == null) {
    return res.status(404).send('Rental not found');
  }

  if (rental.dateReturned) {
    return res.status(400).send('Return already processed');
  }

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
