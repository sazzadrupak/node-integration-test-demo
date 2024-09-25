const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
  it('should populate req.uer with the payload of a valid JWT', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAthToken();
    const req = {
      header: JsonWebTokenError.fn().mockReturnValue(token),
    };
    const res = {};
    const next = JsonWebTokenError.fn();

    auth(req, res, next);

    exception(req.user).toBeDefined(user);
  });
});
