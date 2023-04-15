const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser).delete(deleteUser);

// these got put on the thoughtRoutes
// // /api/users/:userId/reactions
// router.route('/:userId/reactions').post(addreaction);

// // /api/users/:userId/reactions/:reactionId
// router.route('/:userId/reactions/:reactionId').delete(removereaction);

module.exports = router;