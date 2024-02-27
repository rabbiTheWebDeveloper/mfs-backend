import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IAgent } from "../Agent/agent.interface";
import { AgentsModel } from "../Agent/agent.model";
import { ITransaction } from "../Transaction/transaction.interface";
import { IUser } from "../User/user.interface";
import { UsersModel } from "../User/user.model";
import { IAdmin } from "./admin.interface";
import { AdminModel } from "./admin.model";
import { Transaction } from "../Transaction/transaction.model";
import { generateTransactionID } from "../../utlis/transactionID";

const registrationFromDB = async (data: IAdmin): Promise<IAdmin> => {
  try {
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
    const user = new AdminModel(data);
    await user.save();

    if (!user) {
      throw new ApiError(400, "Failed to create");
    }
    return user;
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern.email === 1) {
      throw new ApiError(400, "Email already exists");
    } else {
      throw error;
    }
  }
};

const loginFromDB = async (credentials: IAgent): Promise<any> => {
  try {
    const { mobileNumber } = credentials;
    const user = await AdminModel.findOne(
      { mobileNumber },
      {
        _id: 1,
        email: 1,
        name: 1,
        mobileNumber: 1,
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


const userUpdateOnDB = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const result = await UsersModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const agentApprovedUpdateOnDB = async (
  id: any,
  payload: Partial<IAgent>
): Promise<IAgent | null> => {
  const result = await AgentsModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const sentMoneyInsertIntoDB = async (
  senderId: string,
  receiverId: string,
  amount: number
): Promise<ITransaction> => {
  const sender = await UsersModel.findOne({ mobileNumber: senderId });
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

const cashOutUserIntoDB = async (
  senderId: any,
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
    transactionType: "cashOut From admin",
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

const userListInDB = async (adminID: any): Promise<IUser[]> => {
  const admin = await AdminModel.findOne({ _id: adminID });
  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin not found");
  }
  const user = await UsersModel.find();
  return user;
};

const agentListInDB = async (adminID: any): Promise<IAgent[]> => {
  const admin = await AdminModel.findOne({ _id: adminID });
  if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin not found");
  }
  const agent = await AgentsModel.find();
  return agent;
};

const cashinAdminToAgentInsertIntoDB = async (
  senderId: string,
  receiverId: string,
  amount: number
): Promise<ITransaction> => {
  const sender = await AdminModel.findOne({ _id: senderId });
  const receiver = await AgentsModel.findOne({ mobileNumber: receiverId });

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
    transactionType: "cash In Admin TO Agent",
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

const cashinAdminToUserInsertIntoDB = async (
  senderId: string,
  receiverId: string,
  amount: number
): Promise<ITransaction> => {
  const sender = await AdminModel.findOne({ _id: senderId });
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
    transactionType: "cash In Admin TO User",
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

export const AdminService = {
  registrationFromDB,
  loginFromDB,
  userUpdateOnDB,
  agentApprovedUpdateOnDB,
  cashOutUserIntoDB,
  userListInDB,
  agentListInDB,
  cashinAdminToAgentInsertIntoDB,
  cashinAdminToUserInsertIntoDB,
};
