const mongoose = require("mongoose");
const jwt =  require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String,unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    profilePic: { type: String, defaut: "" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.methods.generateJwtToken = function () {
  return jwt.sign({ user: this._id.toString() }, "streamingapp");
};

module.exports = mongoose.model("User", UserSchema);
