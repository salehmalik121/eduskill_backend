const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  FirstName: { type: String, required: true},
  LastName: { type: String, required: true},
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  subscription: {
    plan: { type: String, default: 'Trail' },
    expiresAt: { type: Date, default: null },
  },
  MessagesLeft: {type: Number , default : 20},
  Vocal: {type : Boolean , default : false},
  interest: [String],
  WrittenChat: {type : Array},
  SpeakingChat: {type : Array},
  ListeningChat: {type : Array}
});


const User = mongoose.model('User', userSchema);

module.exports = User;