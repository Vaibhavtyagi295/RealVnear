const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost/gojo")
  .then(function () {
    console.log("Connected to the database");
  });

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  contactNumber: String,
  password:String,
  role: {
    type: String,
    enum: ["admin","user"],
    default: "user"
  }
});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
