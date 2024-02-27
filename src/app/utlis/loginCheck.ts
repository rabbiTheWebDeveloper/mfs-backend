import httpStatus from "http-status";
import ApiError from "../errors/ApiError";
import { UsersModel } from "../modules/User/user.model";
import { AgentsModel } from "../modules/Agent/agent.model";
import { AdminModel } from "../modules/Admin/admin.model";

export const isToken = async (token: string) => {
  if (token) {
    const user = await UsersModel.findOne({ activeSessionToken: token });
    const agent = await AgentsModel.findOne({ activeSessionToken: token });
    const admin = await AdminModel.findOne({ activeSessionToken: token });
    console.log(`Agent ${agent} User ${user} Admin ${admin}`);
    if (user  || agent  || admin ) {
      return;
     
    }else{
      throw new ApiError(httpStatus.BAD_REQUEST, "Please login again");
    }
  }
};
