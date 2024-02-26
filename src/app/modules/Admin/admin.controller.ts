import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendApiResponse } from "../../utlis/responseHandler";

import catchAsync from "../../shared/catchAsync";
import jwt from "jsonwebtoken";
import { AdminService } from "./admin.service";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IUser } from "../User/user.interface";
import { IAgent } from "../Agent/agent.interface";
 const registration: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const reqBody = req.body;
    const product = await AdminService.registrationFromDB(reqBody);
    sendApiResponse(res, 200, true, product);
  }
);
 const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody = req.body;
    const data: any = await AdminService.loginFromDB(reqBody);
    if (data?.length > 0) {
      let Payload = {
        exp: Math.floor(Date.now() / 1000) + 50 * 24 * 60 * 60,
        data: data[0]["_id"],
      };

      let token = jwt.sign(Payload, "SecretKey123456789");
      res.status(200).json({ status: "success", token: token, data: data[0] });
    } else {
      res.status(401).json({ status: "unauthorized" });
    }
    // }
  }
);

const userUpdateOnDB =catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await AdminService.userUpdateOnDB(id, updatedData);
  sendReponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully !",
    data: result,
  });
});

const agentApprovedUpdateOnDB =catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await AdminService.agentApprovedUpdateOnDB(id, updatedData);
  sendReponse<IAgent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent Approved successfully !",
    data: result,
  });
});
export const adminController = {
  registration,
  login,
  userUpdateOnDB,
  agentApprovedUpdateOnDB
};
