const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    recieverId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Transaction", transactionSchema);;