const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      max_length: 50,
    },
    email: {
      type: String,
      required: true,
      max_length: 50,
    },
    thoughts: [thoughtSchema],
    friends: [userSchema]
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
  }
);

const User = model('user', userSchema);

module.exports = User;
