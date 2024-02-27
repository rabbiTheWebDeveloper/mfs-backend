import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendApiResponse } from "../../utlis/responseHandler";
import { loginFromDB, registrationFromDB } from "./agent.service";
import catchAsync from "../../shared/catchAsync";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../../middleware/authController";
export const registration: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const reqBody = req.body;
    if (reqBody.pin) {
      reqBody.pin = await hashPassword(reqBody.pin);
    }
    const product = await registrationFromDB(reqBody);
    sendApiResponse(res, 200, true, product);
  }
);
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody = req.body;
    const data: any = await loginFromDB(reqBody);
    const { pin , approvalStatus , _id ,activeSessionToken,...userData } = data._doc; 
    if (activeSessionToken) {
      data.activeSessionToken = null;
      await data.save();
    }
    const compared = await comparePassword(reqBody.pin,pin);
    if ( compared &&approvalStatus === "Approved" && data) {
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
