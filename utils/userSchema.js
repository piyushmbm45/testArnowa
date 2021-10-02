const mongoose = require("mongoose");
const { Schema } = mongoose;

const uri = process.env.DB_URL;
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("Database Connected Successfully");
    } else {
      console.log(err);
    }
  }
);

const userSchema = new Schema(
  {
    name: String,
    username: { 
      type: String, 
      unique: true,
      lowercase: true
    },
    password: String,
    barData : {
      india : Number,
      Oman : Number,
      US : Number,
      growth : Number
    },
    pieData : {
      first : Number,
      second : Number,
      third : Number,
      loss : Number
    }
  })

const User = new mongoose.model("User", userSchema);

module.exports = User;
