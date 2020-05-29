const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ReceiptScheme = new schema({
  img: {
    type: String,
    required: true
  },
  refer_to: {
    type: mongoose.Types.ObjectId,
    required: true
  }
});

const Receipt = mongoose.model("receipt", ReceiptScheme);
module.exports = Receipt;
