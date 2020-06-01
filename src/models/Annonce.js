const mongoose = require("mongoose");
const schema = mongoose.Schema;

const AnnonceScheme = new schema({
  handled_by: {
    type: mongoose.Types.ObjectId,
    required: false,
    default: null,
  },
  handled_at: {
    type: Date,
    default: new Date(),
  },
  courses: {
    type: Array,
    required: true,
  },
  info_annexes: {
    type: String,
    required: true,
  },
  max_price: {
    type: Number,
    required: true,
  },
  status: {
    required: true,
    type: String,
    enum: [
      "active",
      "handled",
      "in_store",
      "rcpt_sent",
      "received_to_home",
      "completed",
    ],
    default: "active"
  },
  created_by: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  payment_method: {
    required: true,
    type: String,
    enum: ["Carte de crédit", "Espèce"],
  },
});

const Annonce = mongoose.model("annonce", AnnonceScheme);
module.exports = Annonce;
