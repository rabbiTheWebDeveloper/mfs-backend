// import { SortOrder } from "mongoose";
// import { paginationHelpers } from "../../helpers/paginationHelper";
// import { IPaginationOptions } from "../../interfaces/pagination";
// import { TransactionSearchableFields } from "./transaction.constants";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
// import { IGenericResponse } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { generateTransactionID } from "../../utlis/transactionID";
import { UsersModel } from "../User/user.model";

const insertIntoDB = async (data: any): Promise<ITransaction> => {
  const user = new Transaction(data);
  await user.save();
  return user;
};
const sentMoneyInsertIntoDB = async (senderId :any, receiverId :any, amount: any): Promise<any> => {
    const sender = await UsersModel.findOne({mobileNumber:senderId});
    const receiver = await UsersModel.findOne({mobileNumber:receiverId});
    console.log(sender, receiver)
    if (!sender || !receiver) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Sender or receiver not found');
    }
    if (sender.balance < amount) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }
    const transactionFee = (amount > 100) ? 5 : 0;
    sender.balance -= (amount + transactionFee);
    receiver.balance += amount;
    await sender.save();
    await receiver.save();
    const transaction = new Transaction({
        sender: sender._id,
        receiver: receiver._id,
        amount,
        transactionType: 'sendMoney',
        transactionFee,
        transactionID: generateTransactionID(), 
        timestamp: new Date()
    });
    console.log(transaction)
    await transaction.save();
    sender.transactions.push(transaction._id);
    receiver.transactions.push(transaction._id);
    await sender.save();
    await receiver.save();
    return transaction;
};

export const Transactionservice = {
  insertIntoDB,
  sentMoneyInsertIntoDB,
 
};
