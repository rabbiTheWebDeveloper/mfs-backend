import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { AdminModel } from "../Admin/admin.model";
import { IAgent } from "./agent.interface";
import { AgentsModel } from "./agent.model";
import { Transaction } from "../Transaction/transaction.model";
import { generateTransactionID } from "../../utlis/transactionID";
import { ITransaction } from "../Transaction/transaction.interface";
import { UsersModel } from "../User/user.model";

export const registrationFromDB = async (data: IAgent): Promise<IAgent> => {
  try {
    const admin = await AdminModel.findOne();
    if (!admin || admin.balance < 100000) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Please contact the administrator"
      );
    }

    const userFind = await UsersModel.find({
      $or: [
        { mobileNumber: data.mobileNumber },
        { email: data.email },
        { nid: data.nid },
      ],
    });
    if (userFind.length > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
    }
    const agentFind = await AgentsModel.find({
      $or: [
        { mobileNumber: data.mobileNumber },
        { email: data.email },
        { nid: data.nid },
      ],
    });
    if (agentFind.length > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
    }
    const adminFind = await AgentsModel.find({
      $or: [
        { mobileNumber: data.mobileNumber },
        { email: data.email },
        { nid: data.nid },
      ],
    });
    if (adminFind.length > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
    }
    const user = new AgentsModel(data);
    await user.save();
    admin.balance -= user.balance;
    await Promise.all([
      admin.save(),
      new Transaction({
        sender: admin._id,
        receiver: user._id,
        amount: user.balance,
        transactionType: "gift",
        transactionFee: 0,
        transactionID: generateTransactionID(),
        timestamp: new Date(),
      }).save(),
    ]);
    return user;
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern?.email === 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists");
    } else {
      throw error;
    }
  }
};
const sentMoneyInsertIntoDB = async (
  senderId: string,
  receiverId: string,
  amount: number
): Promise<ITransaction> => {
  const sender = await AdminModel.findOne({ mobileNumber: senderId });
  const receiver = await UsersModel.findOne({ mobileNumber: receiverId });

  if (!sender || !receiver) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Sender or receiver not found");
  }
  if (sender.balance < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }
  const transactionFee = amount > 100 ? 5 : 0;
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
  const [sender, adminReceiver] = await Promise.all([
    UsersModel.findOne({ _id: senderId }),
    AdminModel.findOne({ mobileNumber: receiverId }),
  ]);

  if (!sender || !adminReceiver)
    throw new ApiError(httpStatus.BAD_REQUEST, "Sender or receiver not found");

  const fee = amount * 0.005;

  if (sender.balance < amount + fee)
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");

  sender.balance -= amount + fee;
  adminReceiver.balance += amount + fee;
  const transaction = new Transaction({
    sender: sender._id,
    receiver: adminReceiver._id,
    amount,
    transactionType: "cashOut",
    transactionFee: fee,
    transactionID: generateTransactionID(),
    timestamp: new Date(),
  });

  await Promise.all([
    sender.save(),
    adminReceiver.save(),

    transaction.save(),
    sender.updateOne({ $push: { transactions: transaction._id } }),
    adminReceiver.updateOne({ $push: { transactions: transaction._id } }),
  ]);

  return transaction;
};

const cashinAgentInsertIntoDB = async (
  senderId: string,
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

export const loginFromDB = async (credentials: IAgent): Promise<any> => {
  try {
    const { mobileNumber } = credentials;
    const user = await AgentsModel.findOne(
      { mobileNumber },
      {
        _id: 1,
        email: 1,
        name: 1,
        mobileNumber: 1,
        approvalStatus: 1,
        accountType: 1,
        pin: 1,
      }
    );
    return user;
  } catch (error) {
    console.error("Error in loginFromDB:", error);
    throw new Error(
      "An error occurred while fetching user data from the database"
    );
  }
};
