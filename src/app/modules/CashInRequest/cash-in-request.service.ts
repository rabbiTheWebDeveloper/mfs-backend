import { ICaseInRequest } from "./cash-in-request.interface";
import { CaseInRequestModel } from "./cash-in-request.model";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { generateTransactionID } from "../../utlis/transactionID";
import { AgentsModel } from "../Agent/agent.model";
import { AdminModel } from "../Admin/admin.model";
import { Transaction } from "../Transaction/transaction.model";

const insertIntoDB = async (data: any): Promise<ICaseInRequest> => {
  const user = new CaseInRequestModel(data);
  await user.save();
  return user;
};
const getAllIntoDB = async (adminId :any): Promise<ICaseInRequest[]> => {
  const admin = await AdminModel.findOne({ _id: adminId });
  if (!admin) {
    throw new Error("Admin not found");
  }
  const list = await CaseInRequestModel.find();
  return list;
};

const getAllWithUserIntoDB = async (agentId:any ): Promise<ICaseInRequest[] > => {
  const agent = await AgentsModel.findOne({ _id: agentId });
  console.log(agent)
  if (!agent) {
    throw new Error("Agent not found");
  }
  const list = await CaseInRequestModel.find({userId : agentId});
  return list;
};
const updateIntoDB = async (
  id: any,
  adminId: any,
  payload: any
): Promise<ICaseInRequest | null> => {
  try {
    const admin = await AdminModel.findOne({ _id: adminId });
    if (!admin) {
      throw new Error("Admin not found");
    }

    const result = await CaseInRequestModel.findOneAndUpdate(
      { _id: id },
      payload,
      { new: true }
    );
    if (!result) {
      throw new Error("withdraw not found");
    }

    // Check if recharge is paid
    if (result.status === "paid") {
      const agent = await AgentsModel.findOne({ _id: result.userId });
      if (!agent) {
        throw new Error("Agent not found");
      }

      // Update balances and create transaction
      admin.balance -= result.amount;
      agent.balance += result.amount;

      await Promise.all([
        admin.save(),
        agent.save(),
        new Transaction({
          sender:agent._id,
          receiver:admin._id ,
          amount: result.amount,
          transactionType: "Cash In Request",
          transactionFee: 0,
          transactionID: generateTransactionID(),
          timestamp: new Date(),
        }).save(),
      ]);
    }

    return result;
  } catch (error) {
    // Handle errors
    console.error("Error in updateIntoDB:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Internal Server Error"
    );
  }
};

export const CaseInRequestService = {
  insertIntoDB,
  updateIntoDB,
  getAllWithUserIntoDB,
  getAllIntoDB,
};
