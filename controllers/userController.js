const { Thought} = require('../models');
const User = require('../models/User');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find({})
    // .populate({path: 'thoughts', select: '-__v'})
    // // populate user friends
    // .populate({path: 'friends', select: '-__v'})
    // .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser({params}, res) {
    User.findOne({ _id: params.userId })
    // .populate({path: 'thoughts', select: '-__v'})
    // .populate({path: 'friends', select: '-__v'})
    //   .select('-__v')
      .then(dbUserData => {
        if( !dbUserData) {
          res.status(404).json({ message: 'No user with that ID' });
          return;
        }
          res.json(dbUserData);
  })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

  // update single user by  Id

  updateSingleUser({params, body}, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, { runValidators: true, new: true })
    .then((dbUserData) => {
      if(!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json (dbUserData);
    })
    .catch(err => res.status(500).json(err));  
  },

  // Delete a user and remove them from the thought
  deleteUser({params}, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: 'No such user exists' });
          return;
        }
        User.updateMany({ _id: { $in: dbUserData.friends }},
          { $pull: { friends: params.userId}}
          )
          .then(() => {
            Thought.deleteMany({ username: dbUserData.username })
          .then(() => {
            res.json({ message: "Deleted User, associated friend(s). and associated thought(s)"});
          })
          .catch(err => res.status(500).json(err));
          })
          .catch(err => res.status(500).json(err));
          })
          .catch(err => res.status(500).json(err));
    },
//add a Friend by Id
  //use path /api/users/userId/friends/friendId
  addFriend({params}, res) {

    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId }},
      { new: true, runValidators: true })
    // .populate({path: 'friends', select: ('-__v')})
    // .select('-__v')
    .then(dbUserData => {
      if(!dbUserData) {
        res.status(404).json({ message: "No user found with this Id" })
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(500).json(err));
  },

  //delete a friend by Id
  //use route /api/users/userId/friends/friendId
  deleteFriend({ params}, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId }},
      { new: true, runValidators: true })
      // .populate({path: 'friends', select: '-__v'})
      // .select('-__v')
      .then(dbUserData => {
        if(!dbUserData) {
          res.status(404).json({ message: "No user found with this Id" });
        return;
      }
      res.json(dbUserData);
    })
      .catch(err => res.status(500).json(err))
    },
};
 