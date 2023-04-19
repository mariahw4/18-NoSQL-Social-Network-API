const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          totalUsers: await totalUsers(),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
              user,
              grade: await thought(req.params.userId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // update single user by  Id

  updateSingleUser({params, body}, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, { runValidators: true })
    .then((user) => {
      if(!user) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json (user);
    })
    .catch(err => res.status(500).json(err));  
  },

  // Delete a user and remove them from the thought
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thought.deleteMany(
              { username: user.username },
            )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: 'User deleted, but no thoughts found',
            })
          : res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
//add a Friend by Id
  //use path /api/users/userId/friends/friendId
  addFriend(req, res) {

    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId }},
      { new: true, runValidators: true }
    ) 
    .then(user => {
      if(!user) {
        res.status(404).json({ message: "No user found with this Id" })
        return;
      }
      res.json(user);
    })
    .catch(err => res.status(500).json(err));
  },

  //delete a friend by Id
  //use route /api/users/userId/friends/friendId
  deleteFriend({ params}, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId }},
      { new: true, runValidators: true }
      )
      .then(user => {
        if(!user) {
          res.status(404).json({ message: "No user found with this Id" });
        return;
      }
      res.json(user);
    })
      .catch(err => res.status(500).json(err))
    },
};
 

// Aggregate function to get the number of users overall
const totalUsers = async () =>
  User.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers);