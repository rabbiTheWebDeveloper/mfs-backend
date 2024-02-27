import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { generateTransactionID } from "../../utlis/transactionID";
import { UsersModel } from "../User/user.model";
import { AgentsModel } from "../Agent/agent.model";
import { AdminModel } from "../Admin/admin.model";
import { isToken } from "../../utlis/loginCheck";

const insertIntoDB = async (data: any): Promise<ITransaction> => {
  const user = new Transaction(data);
  await user.save();
  return user;
};
const balanceIntoDB = async (user: any, token: any): Promise<object | null> => {
  await isToken(token);
  const sender = await AgentsModel.findOne({ _id: user });
  const admin = await AdminModel.findOne({ _id: user });
  if (sender) {
    return { balance: sender.balance };
  } else if (admin) {
    return { balance: admin.balance };
  } else {
    const receiver = await UsersModel.findOne({ _id: user });
    return receiver ? { balance: receiver.balance } : null;
  }
};

const transactionIntoDB = async (userId: any): Promise<ITransaction[]> => {
  try {
    const transactionList = await Transaction.find({ sender: userId })
      .populate("sender")
      .populate("receiver");
    return transactionList;
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Error fetching transactions: ${error.message}`
    );
  }
};
const sentMoneyInsertIntoDB = async (
  senderId: any,
  receiverId: string,
  amount: number
): Promise<ITransaction> => {
  const sender = await UsersModel.findOne({ _id: senderId });
  const receiver = await UsersModel.findOne({ mobileNumber: receiverId });
  const admin = await AdminModel.findOne();

  if (!sender || !receiver) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Sender or receiver not found");
  }
  if (sender.balance < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }
  const transactionFee = amount > 100 ? 5 : 0;

  if (admin) {
    admin.balance += transactionFee;
    await admin.save();
  } else {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Admin not found");
  }

  sender.balance -= amount + transactionFee;
  receiver.balance += amount;
  const transaction = new Transaction({
    sender: sender._id,
    receiver: receiver._id,
    amount,
    transactionType: "sendMoney",
    transactionFee,
    transactionID: generateTransactionID(),
    timestamp: new Date(),
  });

  await Promise.all([sender.save(), receiver.save(), transaction.save()]);

  await Promise.all([
    sender.updateOne({ $push: { transactions: transaction._id } }),
    receiver.updateOne({ $push: { transactions: transaction._id } }),
  ]);

  return transaction;
};

const cashOutIntoDB = async (
  senderId: string,
  receiverId: string,
  amount: number
): Promise<ITransaction> => {
  const [sender, agentReceiver, admin] = await Promise.all([
    UsersModel.findOne({ _id: senderId }),
    AgentsModel.findOne({ mobileNumber: receiverId }),
    AdminModel.findOne(),
  ]);

  if (!sender || !agentReceiver || !admin)
    throw new ApiError(httpStatus.BAD_REQUEST, "Sender or receiver not found");

  const cashOutFee = amount * 0.015;
  const adminFee = amount * 0.005;
  const agentFee = amount * 0.01;

  if (sender.balance < amount + cashOutFee)
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");

  sender.balance -= amount + cashOutFee;
  agentReceiver.balance += amount + agentFee;
  if (admin.balance !== undefined) admin.balance += adminFee;

  const transaction = new Transaction({
    sender: sender._id,
    receiver: agentReceiver._id,
    amount,
    transactionType: "cashOut",
    transactionFee: cashOutFee,
    transactionID: generateTransactionID(),
    timestamp: new Date(),
  });

  await Promise.all([
    sender.save(),
    agentReceiver.save(),
    admin.save(),
    transaction.save(),
    sender.updateOne({ $push: { transactions: transaction._id } }),
    agentReceiver.updateOne({ $push: { transactions: transaction._id } }),
  ]);

  return transaction;
};

const cashinAgentInsertIntoDB = async (
  senderId: any,
  receiverId: string,
  amount: number
): Promise<ITransaction> => {
  const sender = await AgentsModel.findOne({ _id: senderId });
  const receiver = await UsersModel.findOne({ mobileNumber: receiverId });

  if (!sender || !receiver) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Sender or receiver not found");
  }
  if (sender.balance < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }
  sender.balance -= amount;
  receiver.balance += amount;
  const transaction = new Transaction({
    sender: sender._id,
    receiver: receiver._id,
    amount,
    transactionType: "cashInAgent",
    transactionFee: 0,
    transactionID: generateTransactionID(),
    timestamp: new Date(),
  });

  await Promise.all([sender.save(), receiver.save(), transaction.save()]);

  await Promise.all([
    sender.updateOne({ $push: { transactions: transaction._id } }),
    receiver.updateOne({ $push: { transactions: transaction._id } }),
  ]);

  return transaction;
};

export const Transactionservice = {
  insertIntoDB,
  sentMoneyInsertIntoDB,
  cashOutIntoDB,
  cashinAgentInsertIntoDB,
  balanceIntoDB,
  transactionIntoDB,
};
