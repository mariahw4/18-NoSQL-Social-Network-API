const { Schema, Types } = require('mongoose');

// this is supposed to be a subdocument field in the Thought Model.
// Schema to create a thought model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: Boolean,
      default: true,
    },
    username: {
      type: Date,
      default: Date.now(),
    },
    createdAt: {
      type: Date,
      // Sets a default value of 12 weeks from now
      default: () => new Date(+new Date() + 84 * 24 * 60 * 60 * 1000),
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);


module.exports = reactionSchema;
