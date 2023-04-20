const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      // .populate({path: 'reactions', select: '-__v'})
      // .select('-__v')
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought({params}, res) {
    Thought.findOne({ _id: params.thoughtId })
      // .populate({path: 'reactions',select: '-__v'})
      // .select('-__v')
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought({params, body}, res) {
    Thought.create(body)
      .then(({_id}) => {
        return User.findOneAndUpdate(
          {_id: params.userId},
          {$push: {thoughts:_id}},
          { new: true}
        )
      .then(dbThoughtData => {
        if(!dbThoughtData) {
          res.status(404).json({ message: 'No thought with that ID' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      })
    })
      .catch(err => res.status(500).json(err));
  },


  // Update a thought
  updateThought({params, body}, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      body,
      { runValidators: true, new: true })
      // .populate({path: 'reactions', select: '-__v'})
      // .select('-__v')
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },

    // Delete a thought
    deleteThought({params}, res) {
      Thought.findOneAndDelete({ _id: params.thoughtId })
        .then((dbThoughtData) => {
          if (!dbThoughtData) { 
            res.status(404).json({ message: 'No thought with that ID' })
            return;
          }
          res.json(dbThoughtData);
        })
        .catch((err) => res.status(500).json(err));
    },

  // Add an reaction to a thought
  // /api/thoughts/thoughtId/reactions with body of reactionBody and username
  addReaction({params, body}, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { runValidators: true, new: true })
      // .populate({path: 'reactions', select: '-__v'})
      // .select('-__v')
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove reaction from a thought
  removeReaction({params}, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reaction: { reactionId: params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  }, 
};
