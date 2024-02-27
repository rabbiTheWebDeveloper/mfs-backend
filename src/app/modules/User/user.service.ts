import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { AdminModel } from "../Admin/admin.model";
import { IUser } from "./user.interface";
import { UsersModel } from "./user.model";
import { generateTransactionID } from "../../utlis/transactionID";
import { Transaction } from "../Transaction/transaction.model";

export const registrationFromDB = async (data: IUser): Promise<IUser> => {
  try {
    const admin = await AdminModel.findOne();
    if (!admin || admin.balance < 40) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Please contact the administrator"
      );
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

export const loginFromDB = async (reqBody: IUser): Promise<void> => {
  const user: any = await UsersModel.aggregate([
    { $match: reqBody },
    { $project: { _id: 1, email: 1, name: 1, mobileNumber: 1, active: 1  , accountType: 1} },
  ]);
  return user;
};

export const userUpdateInDB = async (
  userId: any,
  updateData: Partial<IUser>
): Promise<any | null> => {
  try {
    const result: any = await UsersModel.updateOne(
      { _id: userId },
      { $set: updateData }
    );

    return result;
  } catch (error) {
    // Handle any errors that occur during the update process.

    throw error; // Rethrow the error or handle it as needed.
  }
};
