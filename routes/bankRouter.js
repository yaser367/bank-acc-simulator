const express = require("express");
const bankController = require("../controllers/bankAccController");
const router = express.Router();

router.post("/newAccount", bankController.createAccount);
router.patch("/updateAccount/:id", bankController.updateAccount);
router.patch("/depositeAmount/:id", bankController.amountDeposit);
router.patch("/withdrawAmount/:id", bankController.amountWithdraw);
router.patch("/transferMoney/:senderId/:recieverId", bankController.transferMoney);
router.get("/printStatements/:id", bankController.printStatement );
router.delete('/closeAccount/:id', bankController.printStatement)

module.exports = router;
