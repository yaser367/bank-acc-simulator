const mongoose = require('mongoose')

const bankSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    dob: {
      type: String,
      required: true,
    },
    
    email: {
        type:String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    initialBalance: {
      type: Number,
      default: 0,
    },
    adharNo: {
      type: Number,
    },
    panNo: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    
  },

  { timestamps: true })

  module.exports = mongoose.model('User', bankSchema)