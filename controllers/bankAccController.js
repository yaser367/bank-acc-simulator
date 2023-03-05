const userData = require("../models/bankModel");
const transactionData = require("../models/transactionModel");
const mongoose = require('mongoose')

const createAccount = async (req, res) => {
  const { name, gender, dob, email, mobile, address, panNo } = req.body;

  try {
    if (!name || !gender || !dob || !email || !mobile || !address || !panNo) {
      return res.status(200).json("Fields cannot be empty");
    }
    const regx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(regx)) {
      return res.status(200).json("Enter a valid Email");
    }

    if (mobile.toString().length !== 10 || isNaN(mobile)) {
      return res.status(200).json("Enter a valid Mobile Number");
    }
    const exist = await userData.findOne({ mobile: mobile });
    if (!exist) {
      const newUser = new userData({
        name,
        gender,
        dob,
        email,
        mobile,
        address,
        panNo,
      });
      await newUser.save();
      res.status(200).json("Account successfully created.");
    } else {
      res.status(200).json("Account already exist with the Mobile number.");
    }
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const updateAccount = async (req, res) => {
  const { name, dob, email, mobile, panNo, adharNo } = req.body;
  const { id } = req.params;
  try {
    if (!name || !dob || !email || !mobile || !panNo || !adharNo) {
      return res.status(200).json("Fields cannot be empty");
    }
    const regx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(regx)) {
      return res.status(200).json("Enter a valid Email");
    }

    if (mobile.toString().length !== 10 || isNaN(mobile)) {
      return res.status(200).json("Enter a valid Mobile Number");
    }
    await userData.findByIdAndUpdate(id, {
      name,
      dob,
      email,
      mobile,
      panNo,
      adharNo,
      isVerified: true,
    });
    res.status(200).json("Account details updated successfully.");
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const amountDeposit = async (req, res) => {
  const { amount } = req.body;
  const { id } = req.params;
  try {
    const user = await userData.findById(id);
    if (user?.isVerified) {
      const balance = user.initialBalance + amount;
      await userData.findByIdAndUpdate(id, {
        initialBalance: balance,
      });
      res
        .status(200)
        .json(`Balance successfully updated. Balance is ${balance}`);
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const amountWithdraw = async (req, res) => {
  const { amount } = req.body;
  const { id } = req.params;
  try {
    const user = await userData.findById(id);
    if (user?.isVerified) {
      if (user.initialBalance === 0 || user.initialBalance < amount) {
        return res.status(400).json("insufficient funds");
      }
      const balance = user.initialBalance - amount;
      const updatedBalance = await userData.findByIdAndUpdate(id, {
        initialBalance: balance,
      });
      res.status(200).json(`Successfully updated. Balance is ${balance}`);
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
};

const transferMoney = async (req, res) => {
  const { senderId, recieverId } = req.params;
  const { amount } = req.body;
  const sender = await userData.findById(senderId);
  const reciever = await userData.findById(recieverId);
  try {
    if (reciever?.isVerified && sender?.isVerified) {
      if (sender.initialBalance >= amount) {
        const recieverBalance = reciever.initialBalance + amount;
        const balance = sender.initialBalance - amount;
        await userData.findByIdAndUpdate(senderId, { initialBalance: balance });
        await userData.findByIdAndUpdate(recieverId, {
          initialBalance: recieverBalance,
        });
        const transaction = new transactionData({
          senderId,
          recieverId,
          amount,
        });
        await transaction.save();
        res.status(200).json(`succesfully transferd to ${reciever.name}`);
      } else {
        res.status(400).json("insufficient balance");
      }
    } else {
      res.status(404).json("user not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};

const printStatement = async (req, res) => {
  let { id } = req.params;  
  id = new mongoose.Types.ObjectId(id); 

  try {
    const statement = await transactionData.aggregate([
      {
        $match: { senderId: id },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recieverId",
          foreignField: "_id",
          as: "recieverDetails",
        },
      },
    ]);
    res.status(200).json(statement);
  } catch (err) {
    
    res.status(500).json("Internal Server Error");
  }
};

const closeAccount = async(req, res) => {
  const {id} = req.params
  try {
    await transactionData.deleteMany({senderId:id})
    await transactionData.deleteMany({recieverId:id})
    await userData.findByIdAndDelete(id)
    res.status(200).json('Account successfully removed')
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
}

module.exports = {
  createAccount,
  updateAccount,
  amountDeposit,
  amountWithdraw,
  transferMoney,
  printStatement,
  closeAccount
}