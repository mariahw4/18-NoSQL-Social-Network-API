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
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);


module.exports = reactionSchema;
