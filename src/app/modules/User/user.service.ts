import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { AdminModel } from "../Admin/admin.model";
import { IUser } from "./user.interface";
import { UsersModel } from "./user.model";
import { generateTransactionID } from "../../utlis/transactionID";
import { Transaction } from "../Transaction/transaction.model";
import { AgentsModel } from "../Agent/agent.model";

export const registrationFromDB = async (data: any): Promise<IUser> => {
  try {
    const admin = await AdminModel.findOne();
    if (!admin || admin.balance < 40) {
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
    const user = new UsersModel(data);
    await user.save();

    if (!user) {
      throw new ApiError(400, "Failed to create");
    }
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
    if (error.code === 11000 && error.keyPattern.email === 1) {
      throw new ApiError(400, "Email already exists");
    } else {
      throw error;
    }
  }
};

export const loginFromDB = async (credentials: IUser): Promise<any> => {
  try {
    const { mobileNumber } = credentials;
    const user = await UsersModel.findOne(
      { mobileNumber },
      {
        _id: 1,
        email: 1,
        name: 1,
        mobileNumber: 1,
        accountType: 1,
        active: 1,
        pin: 1,
      }
    );
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
    }
    return user;
  } catch (error) {
    console.error("Error in loginFromDB:", error);
    throw new Error(
      "An error occurred while fetching user data from the database"
    );
  }
};
