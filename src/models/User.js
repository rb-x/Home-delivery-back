const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UserScheme = new schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  c_address: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  zipcode: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  annonces: {
    type: [mongoose.Types.ObjectId],
    required: true,
  },
  acc_type: {
    type: String,
    required: true,
    enum: ["helper", "client"],
  },
  birth_date: {
    type: String,
    required: true,
  },
  acc_active: {
    type: Boolean,
    required: true,
    default: false
  },
  confirm_code: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: false,
  },
  longitude: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("user", UserScheme);
module.exports = User;

//diplome scané delivré en base64
