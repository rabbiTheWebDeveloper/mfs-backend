import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendApiResponse } from "../../utlis/responseHandler";
import catchAsync from "../../shared/catchAsync";
import jwt from "jsonwebtoken";
import { AdminService } from "./admin.service";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IUser } from "../User/user.interface";
import { IAgent } from "../Agent/agent.interface";
import { ITransaction } from "../Transaction/transaction.interface";
import { comparePassword, hashPassword } from "../../middleware/authController";
const registration: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const reqBody = req.body;
    if (reqBody.pin) {
      reqBody.pin = await hashPassword(reqBody.pin);
    }
    const product = await AdminService.registrationFromDB(reqBody);
    sendApiResponse(res, 200, true, product);
  }
);
const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody = req.body;
    const data: any = await AdminService.loginFromDB(reqBody);
    const { pin, _id, activeSessionToken, ...userData } = data._doc;
    if (activeSessionToken) {
      data.activeSessionToken = null;
      await data.save();
    }
    const compared = await comparePassword(reqBody.pin, pin);
    if (compared && data) {
      let Payload = {
        exp: Math.floor(Date.now() / 1000) + 50 * 24 * 60 * 60,
        data: _id,
      };

      let token = jwt.sign(Payload, "SecretKey123456789");
      data.activeSessionToken = token;
      await data.save();
      res.status(200).json({ status: "success", token: token, data: userData });
    } else {
      res.status(401).json({ status: "unauthorized" });
    }
    // }
  }
);

const userUpdateOnDB = catchAsync(async (req: Request, res: Response) => {
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

const agentApprovedUpdateOnDB = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await AdminService.agentApprovedUpdateOnDB(id, updatedData);
    sendReponse<IAgent>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Agent Approved successfully !",
      data: result,
    });
  }
);

const cashOutUserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;
  console.log(payload);
  const result = await AdminService.cashOutUserIntoDB(
    payload.userId,
    payload.receiverId,
    payload.amount
  );
  sendReponse<ITransaction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash Out Admin successfully!",
    data: result,
  });
});

const userListInDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.headers.id;
  const result = await AdminService.userListInDB(user);
  sendReponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User List  successfully!",
    data: result,
  });
});

const agentListInDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.headers.id;
  const result = await AdminService.agentListInDB(user);
  sendReponse<IAgent[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent List  successfully!",
    data: result,
  });
});

const cashinAdminToAgentInsertIntoDB = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    console.log(payload);
    const result = await AdminService.cashinAdminToAgentInsertIntoDB(
      payload.userId,
      payload.receiverId,
      payload.amount
    );
    sendReponse<ITransaction>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cash Out Admin To Agent successfully!",
      data: result,
    });
  }
);
const cashinAdminToUserInsertIntoDB = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    console.log(payload);
    const result = await AdminService.cashinAdminToUserInsertIntoDB(
      payload.userId,
      payload.receiverId,
      payload.amount
    );
    sendReponse<ITransaction>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cash Out Admin To User successfully!",
      data: result,
    });
  }
);
export const adminController = {
  registration,
  login,
  userUpdateOnDB,
  agentApprovedUpdateOnDB,
  cashOutUserIntoDB,
  userListInDB,
  agentListInDB,
  cashinAdminToAgentInsertIntoDB,
  cashinAdminToUserInsertIntoDB,
};
